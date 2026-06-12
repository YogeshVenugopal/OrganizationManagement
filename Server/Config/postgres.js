import knex from 'knex'
import config from './knexfile.js'
import dotenv from 'dotenv'

dotenv.config();

const environment = process.env.NODE_ENV;

const db = knex(config[environment]);

const connectPostgres = async() => {
    try {
        await db.raw("SELECT 1");
        console.log("Second DB is connected");
    } catch (error) {
        console.warn("Error in second DB connection", error);
    }
}

export default connectPostgres;