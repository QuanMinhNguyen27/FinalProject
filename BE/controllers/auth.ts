import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const getMe = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const newToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ data: user, token: newToken });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};