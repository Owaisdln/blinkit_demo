const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState === 1) {
        isConnected = true;
        return;
    }

    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is not defined");
        }
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        if (!process.env.VERCEL) {
            process.exit(1);
        }
        throw error;
    }
};

module.exports = connectDB;