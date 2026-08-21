const mongoose = require('mongoose');


// MongoDB Connection
const connectDB = async () => {
    try {
        // MongoDB connection string - use environment variable for security
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
         
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process with failure
    }
};

// Connect to MongoDB
connectDB();