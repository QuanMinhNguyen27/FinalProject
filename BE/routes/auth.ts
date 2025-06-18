import express from 'express';
import { PrismaClient } from '@prisma/client';
import { getMe } from '../controllers/auth';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

// Get all users route
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        // Excluding password for security
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Test route
router.get('/test', async (req, res) => {
  res.json({ message: 'Auth route is working!' });
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = await prisma.user.create({
      data: {
        email,
        password, // Note: In production, you should hash this password
        name
      }
    });
    res.json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create user' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Note: In production, you should compare hashed passwords
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Issue a JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
});

router.get('/me', getMe);

export default router; 