const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chamcong_db';

  // Fix Windows Node.js querySrv ECONNREFUSED issues with mongodb+srv by setting reliable Google/Cloudflare DNS servers
  if (uri.startsWith('mongodb+srv://')) {
    try {
      dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
    } catch (e) {
      console.warn('Could not set custom DNS servers:', e.message);
    }
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    
    // Fallback to local MongoDB if MongoDB Atlas connection fails
    if (uri !== 'mongodb://127.0.0.1:27017/chamcong_db') {
      console.log('Attempting fallback connection to Local MongoDB (mongodb://127.0.0.1:27017/chamcong_db)...');
      try {
        const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/chamcong_db');
        console.log(`Connected to Local MongoDB Fallback: ${localConn.connection.host}`);
        return;
      } catch (localError) {
        console.error(`Local MongoDB Fallback Error: ${localError.message}`);
      }
    }
    process.exit(1);
  }
};

module.exports = connectDB;
