import mongoose from "mongoose";

// Function to connect to the mongodb database
export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database Connected Successfully'));
        mongoose.connection.on('error', (err) => console.error('MongoDB Connection Error:', err));

        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`, {
            serverSelectionTimeoutMS: 5000,
        });
    } catch (error) {
        console.error("Database connection failed!");
        if (error.message.includes("MongooseServerSelectionError")) {
            console.error("TIP: This is often caused by your IP address not being whitelisted in MongoDB Atlas.");
            console.error("YOUR CURRENT IP: 128.185.168.216");
        }
        console.error(error);
    }
}