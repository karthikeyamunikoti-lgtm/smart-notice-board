const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');

let mongod = null;

const connectDB = async () => {
  try {
    const dbPath = path.join(__dirname, '..', 'local_db');
    if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath);

    console.log('Starting Embedded MongoDB Engine...');
    mongod = await MongoMemoryServer.create({
      instance: {
        dbPath: dbPath,
      }
    });
    
    const mongoUri = mongod.getUri();
    process.env.MONGO_URI = mongoUri; // Set it globally just in case

    const conn = await mongoose.connect(mongoUri);
    console.log(`Embedded MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database persisting to: ${dbPath}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Server continuing without database... functionality will be limited.');
  }
};

module.exports = connectDB;
