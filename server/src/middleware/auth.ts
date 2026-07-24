import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
    
    // Fetch user from database to get role
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    (req as any).userId = user.id;
    (req as any).userRole = user.role;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};