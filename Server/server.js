import express from 'express';
import dotenv from 'dotenv'
import connectDB from './Config/db.js';
import redis from './Config/redis.js';
import connectPostgres from './Config/postgres.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const databaseConn = async () => {
    try{
        await connectDB();
        await connectPostgres();
        await redis.connect();
    } catch (error) {
        console.error('Error connecting to databases:', error);
    }
}

app.listen(PORT, () => {
    console.log(`The server is started running on port : ${PORT}`);
})