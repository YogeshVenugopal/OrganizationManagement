import express from 'express';
import dotenv from 'dotenv'
import connectDB from './Config/db.js';
import connectPostgres from './Config/postgres.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;


connectDB();
connectPostgres();

app.listen(PORT, () => {
    console.log(`The server is started running on port : ${PORT}`);
})