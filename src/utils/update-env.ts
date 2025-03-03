import fs from 'fs';
import path from 'path';

const envPath = path.resolve(__dirname, '../../.env');

// Read the current .env file
const currentEnv = fs.readFileSync(envPath, 'utf8');

// Split into lines and update the Cohere API key
const lines = currentEnv.split('\n').map(line => {
    if (line.startsWith('COHERE_API_KEY=')) {
        return 'COHERE_API_KEY=MryySXXSzuU98jhmwVNbFlWMcNNGFpVFheDxQXq0';
    }
    return line;
});

// Write back to the file
fs.writeFileSync(envPath, lines.join('\n'), 'utf8');

console.log('Updated .env file with new Cohere API key'); 