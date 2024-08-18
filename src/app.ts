import express, { Application } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/AuthRoutes';
import { DbConfig } from './config/DbConfig';

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Database Connection
DbConfig.connectDB();

export default app;
