import mongoose from 'mongoose';
import "dotenv/config";

const connectDB = async() => {
    await mongoose.connect(process.env.MONOG_URI)
    mongoose.connection.on('connected', () => console.log("Database connected"));
}

export default connectDB;