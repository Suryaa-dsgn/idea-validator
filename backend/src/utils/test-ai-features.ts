import { aiService } from '../services/ai.service';
import dotenv from 'dotenv';

dotenv.config();

async function testAIFeatures() {
    try {
        console.log('🔄 Testing AI Features\n');
        
        // Log configuration
        console.log('API Key (first 4 chars):', process.env.COHERE_API_KEY?.substring(0, 4) + '...');
        console.log('Model:', process.env.COHERE_MODEL);
        console.log('\n-------------------\n');

        // 1. Test basic text generation
        console.log('Testing text generation...');
        const generatedText = await aiService.generateText('Write a short marketing tagline for a tech startup.');
        console.log('Generated Text:', generatedText);
        console.log('\n-------------------\n');

        // 2. Test sentiment analysis
        console.log('Testing sentiment analysis...');
        const sentiment = await aiService.analyzeSentiment('This product is amazing and revolutionary!');
        console.log('Sentiment:', sentiment);
        console.log('\n-------------------\n');

        // 3. Test startup idea validation
        console.log('Testing startup idea validation...');
        const validation = await aiService.validateStartupIdea(
            'A platform that uses AI to help entrepreneurs validate their startup ideas and find co-founders.'
        );
        console.log('Validation Results:', validation);
        console.log('\n-------------------\n');

        // 4. Test market insights
        console.log('Testing market insights generation...');
        const insights = await aiService.generateMarketInsights('AI-powered startup tools');
        console.log('Market Insights:', insights);
        console.log('\n-------------------\n');

        console.log('✅ All tests completed successfully!\n');
    } catch (error: any) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Error details:', {
                status: error.response.status,
                data: error.response.data
            });
        }
    }
}

console.log('AI Features Test Script');
console.log('=====================\n');
testAIFeatures().catch(console.error); 