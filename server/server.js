import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import procedureRoutes from './routes/procedureRoutes.js';
import stepRoutes from './routes/stepRoutes.js';
import dependencyRoutes from './routes/dependencyRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import sourceRoutes from './routes/sourceRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CivicPath API Server',
    database: 'MongoDB Atlas',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/procedures', procedureRoutes);
app.use('/api/steps', stepRoutes);
app.use('/api/dependencies', dependencyRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/sources', sourceRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/ai', aiRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 CivicPath Backend API Server running on port ${PORT}`);
      console.log(`📡 Base API URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Server startup failed due to database connection error:', error.message);
    process.exit(1);
  }
};

startServer();
