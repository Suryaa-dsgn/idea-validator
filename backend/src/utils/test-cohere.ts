import dotenv from 'dotenv';
import { CohereClient } from 'cohere-ai';

dotenv.config();

async function testCohere() {
    try {
        console.log('🔄 Testing Cohere AI connection...\n');
        
        const cohere = new CohereClient({
            token: process.env.COHERE_API_KEY || '',
        });

        console.log('Attempting to generate text...');
        const response = await cohere.generate({
            prompt: 'Write a short test message.',
            maxTokens: 20,
            temperature: 0.7,
            model: 'command',
        });

        console.log('✅ Cohere AI Connection: SUCCESS');
        console.log('Response:', response.generations[0].text);
        
    } catch (error: any) {
        console.error('❌ Cohere AI Connection: FAILED');
        console.error('Error details:', error.message);
    }
}

console.log('Cohere AI Test Script');
console.log('===================\n');
testCohere().catch(console.error); 