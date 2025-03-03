import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Define the user schema interface
export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
}

// Define the user schema type
interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  isModified(path: string): boolean;
  comparePassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
}

// Create the user schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password in queries
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt before saving
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function (this: UserDocument) {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET || 'default_secret',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.comparePassword = async function (this: UserDocument, enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema); 