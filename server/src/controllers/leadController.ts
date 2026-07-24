import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createLead = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, status, assignedTo } = req.body;
    const userId = (req as any).userId;
    
    const lead = await prisma.lead.create({
      data: { 
        name, 
        email, 
        phone, 
        status: status || 'new',
        userId: userId,
        assignedTo: assignedTo || null
      },
      include: {
        user: { select: { name: true, email: true } },
        assignedUser: { select: { name: true, email: true } }
      }
    });
    
    await prisma.activity.create({
      data: {
        action: 'created',
        details: `Lead "${name}" created`,
        leadId: lead.id
      }
    });
    
    res.status(201).json(lead);
  } catch (error: any) {
    console.error('Create lead error:', error);
    res.status(400).json({ error: error.message || 'Failed to create lead' });
  }
};

export const getLeads = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const userRole = (req as any).userRole || 'member';
    const { 
      page = 1, 
      limit = 10, 
      status, 
      search, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    
    const where: any = {};
    
    if (userRole === 'member') {
      where.OR = [
        { userId: userId },
        { assignedTo: userId }
      ];
    }
    
    if (status) {
      where.status = status as string;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { email: { contains: search as string } },
        { phone: { contains: search as string } }
      ];
    }
    
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy as string]: sortOrder },
        include: {
          user: { select: { name: true, email: true } },
          assignedUser: { select: { name: true, email: true } },
          notes: { 
            orderBy: { createdAt: 'desc' }, 
            take: 3,
            include: { user: { select: { name: true } } }
          },
          activities: { 
            orderBy: { createdAt: 'desc' }, 
            take: 5 
          }
        }
      }),
      prisma.lead.count({ where })
    ]);
    
    res.json({
      data: leads,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch leads' });
  }
};

export const updateLead = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, email, phone, status, assignedTo } = req.body;
    const userId = (req as any).userId;
    const userRole = (req as any).userRole || 'member';
    
    const existingLead = await prisma.lead.findUnique({
      where: { id }
    });
    
    if (!existingLead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    if (userRole === 'member' && existingLead.userId !== userId && existingLead.assignedTo !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const lead = await prisma.lead.update({
      where: { id },
      data: { 
        name, 
        email, 
        phone, 
        status,
        assignedTo: assignedTo || existingLead.assignedTo
      },
      include: {
        user: { select: { name: true, email: true } },
        assignedUser: { select: { name: true, email: true } }
      }
    });
    
    await prisma.activity.create({
      data: {
        action: 'updated',
        details: `Lead "${lead.name}" updated`,
        leadId: lead.id
      }
    });
    
    res.json(lead);
  } catch (error: any) {
    console.error('Update lead error:', error);
    res.status(400).json({ error: error.message || 'Failed to update lead' });
  }
};

export const deleteLead = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = (req as any).userId;
    const userRole = (req as any).userRole || 'member';
    
    const existingLead = await prisma.lead.findUnique({
      where: { id }
    });
    
    if (!existingLead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    if (userRole === 'member' && existingLead.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await prisma.lead.delete({
      where: { id }
    });
    
    res.json({ message: 'Lead deleted successfully' });
  } catch (error: any) {
    console.error('Delete lead error:', error);
    res.status(400).json({ error: error.message || 'Failed to delete lead' });
  }
};

export const addNote = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { content } = req.body;
    const userId = (req as any).userId;
    
    const lead = await prisma.lead.findUnique({
      where: { id }
    });
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    const note = await prisma.note.create({
      data: {
        content,
        leadId: id,
        userId
      },
      include: {
        user: { select: { name: true } }
      }
    });
    
    await prisma.activity.create({
      data: {
        action: 'note_added',
        details: `Note added: ${content.substring(0, 50)}...`,
        leadId: id
      }
    });
    
    res.status(201).json(note);
  } catch (error: any) {
    console.error('Add note error:', error);
    res.status(400).json({ error: error.message || 'Failed to add note' });
  }
};

export const getNotes = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    const notes = await prisma.note.findMany({
      where: { leadId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } }
      }
    });
    
    res.json(notes);
  } catch (error: any) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch notes' });
  }
};