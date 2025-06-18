import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import authRouter from './routes/auth';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRouter);

// Serve the login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the registration page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Serve the dashboard page
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Access the login page at: http://localhost:${port}`);
  console.log(`Access the registration page at: http://localhost:${port}/register`);
  console.log(`Access the dashboard at: http://localhost:${port}/dashboard`);
}).on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
}); 