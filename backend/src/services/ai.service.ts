import dotenv from 'dotenv';
import path from 'path';
const { CohereClient } = require('cohere-ai');

// Load .env from the correct location
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const COHERE_API_KEY = process.env.COHERE_API_KEY;
console.log('Initializing Cohere with API key (first 4 chars):', COHERE_API_KEY?.substring(0, 4) + '...');

if (!COHERE_API_KEY) {
    throw new Error('COHERE_API_KEY is not set in environment variables');
}

const cohere = new CohereClient({
    token: COHERE_API_KEY,
});

class AIService {
    private cohere: any;

    constructor() {
        this.cohere = cohere;
    }

    /**
     * Generate text based on a prompt
     */
    async generateText(prompt: string): Promise<string> {
        try {
            const response = await this.cohere.generate({
                model: process.env.COHERE_MODEL || 'command',
                prompt,
                max_tokens: 300,
                temperature: 0.7,
            });
            return response.generations[0].text;
        } catch (error: any) {
            console.error('Text generation error:', error.name);
            console.error('Status code:', error.status);
            console.error('Body:', JSON.stringify(error.response?.data, null, 2));
            throw new Error('Failed to generate text');
        }
    }

    /**
     * Analyze sentiment of text
     */
    async analyzeSentiment(text: string): Promise<string> {
        try {
            const response = await this.cohere.generate({
                model: process.env.COHERE_MODEL || 'command',
                prompt: `Analyze the sentiment of this text and respond with exactly one word - either 'positive', 'negative', or 'neutral': "${text}"`,
                max_tokens: 10,
                temperature: 0.3,
            });
            return response.generations[0].text.trim().toLowerCase();
        } catch (error: any) {
            console.error('Sentiment analysis error:', error.message);
            throw new Error('Failed to analyze sentiment');
        }
    }

    /**
     * Validate startup idea
     */
    async validateStartupIdea(idea: string): Promise<string> {
        try {
            const response = await this.cohere.generate({
                model: process.env.COHERE_MODEL || 'command',
                prompt: `Analyze this startup idea and provide constructive feedback: ${idea}`,
                max_tokens: 500,
                temperature: 0.7,
            });
            return response.generations[0].text;
        } catch (error: any) {
            console.error('Idea validation error:', error.message);
            throw new Error('Failed to validate startup idea');
        }
    }

    /**
     * Generate market research insights
     */
    async generateMarketInsights(industry: string): Promise<string> {
        try {
            const response = await this.cohere.generate({
                model: process.env.COHERE_MODEL || 'command',
                prompt: `Provide market insights and trends for the ${industry} industry`,
                max_tokens: 500,
                temperature: 0.7,
            });
            return response.generations[0].text;
        } catch (error: any) {
            console.error('Market insights error:', error.message);
            throw new Error('Failed to generate market insights');
        }
    }
}

export const aiService = new AIService(); 