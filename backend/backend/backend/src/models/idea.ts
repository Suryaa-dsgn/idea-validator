import mongoose from 'mongoose';

// Define interfaces for validation metrics
export interface ValidationMetric {
  score: number;
  feedback: string;
}

export interface IdeaValidation {
  marketViability: ValidationMetric;
  technicalFeasibility: ValidationMetric;
  competitiveLandscape: ValidationMetric;
  userDemand: ValidationMetric;
  overallScore: number;
  recommendations: string[];
  strengthsAndWeaknesses: {
    strengths: string[];
    weaknesses: string[];
  };
  validatedAt: Date;
}

// Define the idea schema interface
export interface IIdea extends mongoose.Document {
  title: string;
  description: string;
  category: string;
  targetAudience: string[];
  user: mongoose.Types.ObjectId | string;
  validation?: IdeaValidation;
  status: 'draft' | 'pending' | 'validated' | 'archived';
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for idea document with methods
interface IdeaDocument extends mongoose.Document {
  title: string;
  description: string;
  category: string;
  targetAudience: string[];
  user: mongoose.Types.ObjectId | string;
  validation?: IdeaValidation;
  status: 'draft' | 'pending' | 'validated' | 'archived';
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Create the idea schema
const IdeaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title for your idea'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description for your idea'],
      trim: true,
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category for your idea'],
      enum: [
        'Technology',
        'Health',
        'Education',
        'Finance',
        'E-commerce',
        'Food',
        'Travel',
        'Entertainment',
        'Social',
        'Other',
      ],
    },
    targetAudience: {
      type: [String],
      required: [true, 'Please specify target audience'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    validation: {
      marketViability: {
        score: {
          type: Number,
          min: 0,
          max: 100,
        },
        feedback: String,
      },
      technicalFeasibility: {
        score: {
          type: Number,
          min: 0,
          max: 100,
        },
        feedback: String,
      },
      competitiveLandscape: {
        score: {
          type: Number,
          min: 0,
          max: 100,
        },
        feedback: String,
      },
      userDemand: {
        score: {
          type: Number,
          min: 0,
          max: 100,
        },
        feedback: String,
      },
      overallScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      recommendations: [String],
      strengthsAndWeaknesses: {
        strengths: [String],
        weaknesses: [String],
      },
      validatedAt: {
        type: Date,
        default: Date.now,
      },
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'validated', 'archived'],
      default: 'draft',
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for better search performance
IdeaSchema.index({ title: 'text', description: 'text' });

// Add virtual field for simplified validation status
IdeaSchema.virtual('isValidated').get(function(this: IdeaDocument) {
  return this.status === 'validated' && this.validation && this.validation.overallScore > 0;
});

// Set JSON transformation
IdeaSchema.set('toJSON', {
  virtuals: true,
  transform: function (_doc: mongoose.Document, ret: Record<string, any>) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model<IIdea>('Idea', IdeaSchema); 