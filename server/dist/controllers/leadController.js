"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotes = exports.addNote = exports.deleteLead = exports.updateLead = exports.getLeads = exports.createLead = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createLead = async (req, res) => {
    try {
        const { name, email, phone, status, assignedTo } = req.body;
        const userId = req.userId;
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
    }
    catch (error) {
        console.error('Create lead error:', error);
        res.status(400).json({ error: error.message || 'Failed to create lead' });
    }
};
exports.createLead = createLead;
const getLeads = async (req, res) => {
    try {
        const userId = req.userId;
        const userRole = req.userRole || 'member';
        const { page = 1, limit = 10, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        const where = {};
        if (userRole === 'member') {
            where.OR = [
                { userId: userId },
                { assignedTo: userId }
            ];
        }
        if (status) {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { email: { contains: search } },
                { phone: { contains: search } }
            ];
        }
        const [leads, total] = await Promise.all([
            prisma.lead.findMany({
                where,
                skip,
                take,
                orderBy: { [sortBy]: sortOrder },
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
    }
    catch (error) {
        console.error('Get leads error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch leads' });
    }
};
exports.getLeads = getLeads;
const updateLead = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, phone, status, assignedTo } = req.body;
        const userId = req.userId;
        const userRole = req.userRole || 'member';
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
    }
    catch (error) {
        console.error('Update lead error:', error);
        res.status(400).json({ error: error.message || 'Failed to update lead' });
    }
};
exports.updateLead = updateLead;
const deleteLead = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.userId;
        const userRole = req.userRole || 'member';
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
    }
    catch (error) {
        console.error('Delete lead error:', error);
        res.status(400).json({ error: error.message || 'Failed to delete lead' });
    }
};
exports.deleteLead = deleteLead;
const addNote = async (req, res) => {
    try {
        const id = req.params.id;
        const { content } = req.body;
        const userId = req.userId;
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
    }
    catch (error) {
        console.error('Add note error:', error);
        res.status(400).json({ error: error.message || 'Failed to add note' });
    }
};
exports.addNote = addNote;
const getNotes = async (req, res) => {
    try {
        const id = req.params.id;
        const notes = await prisma.note.findMany({
            where: { leadId: id },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true } }
            }
        });
        res.json(notes);
    }
    catch (error) {
        console.error('Get notes error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch notes' });
    }
};
exports.getNotes = getNotes;
