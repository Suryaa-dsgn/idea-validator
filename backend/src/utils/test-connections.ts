import mongoose from 'mongoose';
import { OpenAI } from 'openai';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

async function testMongoDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('✅ MongoDB Connection: SUCCESS');
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ MongoDB Connection: FAILED');
        console.error(error);
    }
}

async function testOpenAI() {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        
        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4',
            messages: [{ role: 'user', content: 'Say "test successful"' }],
        });
        
        console.log('✅ OpenAI Connection: SUCCESS');
        console.log('Response:', response.choices[0]?.message?.content);
    } catch (error) {
        console.error('❌ OpenAI Connection: FAILED');
        console.error(error);
    }
}

function testJWT() {
    try {
        const testPayload = { id: 'test-user', email: 'test@example.com' };
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET is not defined');
        
        // Simple JWT test without explicit types
        const token = jwt.sign(testPayload, secret);
        const decoded = jwt.verify(token, secret);
        console.log('✅ JWT Authentication: SUCCESS');
        console.log('Decoded token:', decoded);
    } catch (error) {
        console.error('❌ JWT Authentication: FAILED');
        console.error(error);
    }
}

async function runTests() {
    console.log('🔄 Starting connection tests...\n');
    
    await testMongoDB();
    console.log('\n-------------------\n');
    
    await testOpenAI();
    console.log('\n-------------------\n');
    
    testJWT();
    console.log('\n-------------------\n');
}

runTests().catch(console.error); 