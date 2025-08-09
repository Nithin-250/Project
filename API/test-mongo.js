import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
    try {
        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        console.log('✅ MongoDB connected successfully!');
        
        const db = client.db(process.env.MONGO_DB_NAME);
        const collections = await db.listCollections().toArray();
        console.log('📁 Available collections:', collections.map(c => c.name));
        
        await client.close();
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
    }
}

testConnection();