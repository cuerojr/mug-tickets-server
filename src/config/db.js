import mongoose from 'mongoose';
import config from './config.js';
class Database {
  constructor(){}

  async connectDB() {
    try {
      await mongoose.connect(config.HOST, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('MongoDB connected');
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  };
}

export {
  Database
};