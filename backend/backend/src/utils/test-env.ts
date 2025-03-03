import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Try to load .env file
const envPath = path.resolve(__dirname, '../../.env');
console.log('Looking for .env file at:', envPath);

// First, read the raw file
console.log('\nRaw .env file contents:');
const rawEnv = fs.readFileSync(envPath, 'utf8');
console.log(rawEnv);

// Now load with dotenv
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('Error loading .env file:', result.error);
} else {
    console.log('\n.env file loaded successfully');
}

// Print all environment variables (be careful with sensitive data)
console.log('\nEnvironment Variables:');
console.log('COHERE_API_KEY:', process.env.COHERE_API_KEY ? '✅ Present' : '❌ Missing');
console.log('COHERE_MODEL:', process.env.COHERE_MODEL || '❌ Missing');
console.log('NODE_ENV:', process.env.NODE_ENV || '❌ Missing'); 