const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('📍 URI:', process.env.MONGODB_URI);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🔢 Port: ${conn.connection.port}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
    console.log('================================');
    
    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('📴 MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('❌ Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ MongoDB Connection Failed!');
    console.error('================================');
    console.error('Error message:', error.message);
    console.error('');
    console.error('💡 Troubleshooting:');
    console.error('1. Make sure MongoDB is running:');
    console.error('   mongod --port 27019 --dbpath "C:\\data\\db"');
    console.error('2. Check if port 27019 is available');
    console.error('3. Verify MONGODB_URI in .env file');
    console.error('================================');
    process.exit(1);
  }
};

module.exports = connectDB;