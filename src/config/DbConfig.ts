import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export class DbConfig {
  public static async connectDB(): Promise<void> {
    try {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/login-microservice');
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection failed:', error);
      process.exit(1);
    }
  }
}
