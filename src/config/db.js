const mongoose = require('mongoose');
const config = require('./config');

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

module.exports = Database;