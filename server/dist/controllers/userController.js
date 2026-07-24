"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.getProfile = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProfile = async (req, res) => {
    try {
        const userId = req.userId;
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
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch profile' });
    }
};
exports.getProfile = getProfile;
const getUsers = async (req, res) => {
    try {
        const userRole = req.userRole || 'member';
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
    }
    catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch users' });
    }
};
exports.getUsers = getUsers;
