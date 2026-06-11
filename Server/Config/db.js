import mongoose from "mongoose";

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`Database connected: ${conn.connection.host}`)
    } catch (error) {
        console.warn("Something went wrong in the database", error);
        process.exit(1);
    }
}

export default connectDB;