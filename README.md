# Idea Validator Backend

Backend service for the Idea Validator application, built with Node.js, Express, and MongoDB.

## Features

- User Authentication & Authorization
- AI-powered Idea Validation using Cohere AI
- Market Research Analysis
- Sentiment Analysis
- Email Notifications
- Rate Limiting & Security Features

## Tech Stack

- Node.js & Express
- TypeScript
- MongoDB with Mongoose
- Cohere AI for Natural Language Processing
- JWT Authentication
- Nodemailer for Email Services
- Winston for Logging

## Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env`
3. Update the environment variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   COHERE_API_KEY=your_cohere_api_key
   EMAIL_USERNAME=your_gmail_address
   EMAIL_PASSWORD=your_gmail_app_password
   ```

## Installation

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Run in production
npm start
```

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/ideas/validate` - Validate startup idea
- `GET /api/ideas/market-research` - Get market research
- More endpoints documented in the API documentation

## Deployment

This application is configured for deployment on Render.com:

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Use the following settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add your environment variables in Render's dashboard

## Development

```bash
# Run tests
npm test

# Build for production
npm run build
```

## Security

- Environment variables are used for sensitive data
- Rate limiting is implemented
- JWT authentication
- Helmet for security headers
- CORS configured
- Input validation using Zod

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 