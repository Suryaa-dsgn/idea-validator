import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

async function testOpenAI() {
    try {
        console.log('Testing OpenAI connection...');
        console.log('API Key (first 8 chars):', process.env.OPENAI_API_KEY?.substring(0, 8) + '...');
        console.log('Model:', process.env.OPENAI_MODEL);
        
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        
        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'Say "test successful"' }],
        });
        
        console.log('✅ OpenAI Connection: SUCCESS');
        console.log('Response:', response.choices[0]?.message?.content);
    } catch (error: any) {
        console.error('❌ OpenAI Connection: FAILED');
        console.error('Error details:', error.message);
        if (error.code === 'model_not_found') {
            console.error('Suggestion: Check if you have access to the specified model');
        }
    }
}

testOpenAI().catch(console.error); 