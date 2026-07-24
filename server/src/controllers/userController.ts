import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch profile' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const userRole = (req as any).userRole || 'member';
    
    if (userRole !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    res.json(users);
  } catch (error: any) {
    console.error('Get users error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch users' });
  }
};