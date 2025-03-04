# Idea Validator API

A robust TypeScript-based REST API for validating startup ideas using AI. This service provides idea validation, market analysis, and sentiment analysis using the Cohere AI platform.

## 🚀 Features

- User Authentication (Register/Login)
- Startup Idea Validation
- Market Analysis
- Sentiment Analysis
- AI-powered Insights
- MongoDB Integration
- TypeScript Support
- Secure API with JWT

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **AI Integration**: Cohere AI
- **Authentication**: JWT
- **Deployment**: Render

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cohere AI API Key
- npm or yarn

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=10000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
COHERE_API_KEY=your_cohere_api_key
```

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/idea-validator.git
   cd idea-validator
   ```

2. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout user

### Idea Validation Endpoints

- `POST /api/v1/ideas` - Create new idea
- `GET /api/v1/ideas` - Get all ideas
- `GET /api/v1/ideas/:id` - Get single idea
- `PUT /api/v1/ideas/:id` - Update idea
- `DELETE /api/v1/ideas/:id` - Delete idea
- `POST /api/v1/ideas/:id/validate` - Validate idea using AI

## 🌐 Deployment

The application is deployed on Render and uses a specialized deployment configuration:

1. **Production URL**: https://idea-validator-api.onrender.com

2. **Deployment Files**:
   - `render-start.js` - Simplified server for Render deployment
   - `render.yaml` - Render configuration file
   - `render-start.sh` - Deployment script

3. **Environment Setup on Render**:
   - Set `PORT` to 10000
   - Set `NODE_ENV` to production
   - Configure all required environment variables

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── types/         # TypeScript types
│   ├── utils/         # Utility functions
│   └── index.ts       # App entry point
├── render-start.js    # Render deployment server
├── render.yaml        # Render configuration
└── package.json
```

## 🔒 Security

- JWT Authentication
- Request Rate Limiting
- Helmet Security Headers
- CORS Configuration
- Input Validation
- Error Handling

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Cohere AI for providing the AI capabilities
- MongoDB Atlas for database hosting
- Render for application hosting 