// index.js - Express Server with MongoDB Connection

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Add this import
const userRoutes = require('./src/routes/user.routes.js')
const customerRoutes = require('./src/routes/customer.routes.js')

const inventoryStockRoutes= require('./src/routes/inventorystock.routes.js')
const sellRoutes = require('./src/routes/sellInvoice.routes.js')
const purchaseRoutes = require('./src/routes/purchaseInvoice.routes.js')
const dailyCashRoutes = require('./src/routes/dailyCash.routes.js')

const aiContent = require('./src/routes/aiContent.routes.js')

 require('./src/script/user.script.js')


require('dotenv').config(); // Environment variables ke liye



const app = express();

// CORS Configuration - Add this before other middleware
const corsOptions = {
    origin: "*", // Allow your frontend origins
    // methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allowed HTTP methods
    // allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Allowed headers
    // // credentials: true, // Allow cookies if needed
    // // optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware
app.use(express.json()); // JSON data parse karne ke liye
app.use(express.urlencoded({ extended: true })); // URL encoded data parse karne ke liye

// MongoDB Connection
const connectDB = async () => {
    try {
        // MongoDB connection string - use environment variable for security
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
          require('./src/script/faker.script.js')
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process with failure
    }
};

// Connect to MongoDB
connectDB();



// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Server is running successfully!' });
});

// API routes yahan define karein
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/sell', sellRoutes);
app.use('/api/inventorystock', inventoryStockRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/dailycash', dailyCashRoutes);
app.use('/api/aicontent', aiContent);


// app.use('/api/products', productRoutes);




// Server configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
    if(err) {
console.log(`Serverissss  not running on port: ${err}`);
    }else{
 console.log(`Server issss running on port ${PORT}`);
    }
   
});