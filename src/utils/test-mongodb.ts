import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testMongoDB() {
    try {
        console.log('🔄 Starting MongoDB connection test...\n');
        
        // Log connection details (hiding sensitive info)
        const connectionString = process.env.MONGODB_URI || '';
        const maskedString = connectionString.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
        console.log('Connection String:', maskedString);
        
        // Attempt connection
        console.log('\nAttempting to connect...');
        await mongoose.connect(connectionString);
        console.log('✅ MongoDB Connection: SUCCESS');
        
        // Test database operations
        console.log('\nTesting database operations...');
        if (!mongoose.connection.db) {
            throw new Error('Database connection not established');
        }
        
        const db = mongoose.connection.db;
        await db.createCollection('test_collection');
        console.log('✅ Created test collection');
        
        const collections = await db.listCollections().toArray();
        console.log('📁 Available collections:', collections.map(c => c.name).join(', '));
        
        // Cleanup
        await db.dropCollection('test_collection');
        console.log('🧹 Cleaned up test collection');
        
        await mongoose.connection.close();
        console.log('\n✨ All MongoDB tests passed successfully!');
    } catch (error: any) {
        console.error('\n❌ MongoDB Connection: FAILED');
        console.error('Error Type:', error.name);
        console.error('Error Message:', error.message);
        
        if (error.name === 'MongoServerSelectionError') {
            console.error('\nPossible reasons:');
            console.error('1. Network connectivity issues');
            console.error('2. Database server is down');
            console.error('3. Authentication failed');
        }
        
        if (error.name === 'MongoParseError') {
            console.error('\nPossible reasons:');
            console.error('1. Invalid connection string format');
            console.error('2. Missing required connection string components');
        }
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
    }
}

console.log('MongoDB Test Script');
console.log('==================\n');
testMongoDB().catch(console.error); 