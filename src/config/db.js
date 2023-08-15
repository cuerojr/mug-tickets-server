import mongoose from 'mongoose';
class Database {
  constructor(){}

  async connectDB() {
    try {
      await mongoose.connect(process.env.DB_CNN, {
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