import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

export class TeamController {
  static async list(req: Request, res: Response) {
    const tenantId = req.tenantId as string;
    if (!tenantId) {
      return res.status(403).json({ error: 'Tenant ID required' });
    }

    try {
      const team = await prisma.user.findMany({
        where: { tenantId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      res.json(team);
    } catch (error) {
      console.error('Error listing team:', error);
      res.status(500).json({ error: 'Failed to list team members' });
    }
  }

  static async create(req: Request, res: Response) {
    const tenantId = req.tenantId as string;
    const { email, name, role } = req.body;

    if (!tenantId) {
      return res.status(403).json({ error: 'Tenant ID required' });
    }

    if (!email || !name || !role) {
      return res.status(400).json({ error: 'Email, name, and role are required' });
    }

    try {
      // Check if user already exists
      const existing = await prisma.user.findUnique({
        where: { email },
      });

      if (existing) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      // Hash a default password for the new member
      const hashedPassword = await bcrypt.hash('member123', 10);

      const user = await prisma.user.create({
        data: {
          email,
          name,
          role: role as Role,
          password: hashedPassword,
          tenantId,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        }
      });

      res.status(201).json(user);
    } catch (error) {
      console.error('Error inviting team member:', error);
      res.status(500).json({ error: 'Failed to invite team member' });
    }
  }

  static async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const tenantId = req.tenantId as string;
    const { role } = req.body;

    if (!tenantId) {
      return res.status(403).json({ error: 'Tenant ID required' });
    }

    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }

    try {
      const existing = await prisma.user.findFirst({
        where: { id, tenantId },
      });

      if (!existing) {
        return res.status(404).json({ error: 'Team member not found' });
      }

      // Don't allow changing the last admin's role if they are the only admin
      if (existing.role === 'ADMIN' && role !== 'ADMIN') {
        const adminCount = await prisma.user.count({
          where: { tenantId, role: 'ADMIN' },
        });
        if (adminCount <= 1) {
          return res.status(400).json({ error: 'Cannot change the role of the only Administrator' });
        }
      }

      const updated = await prisma.user.update({
        where: { id },
        data: { role: role as Role },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        }
      });

      res.json(updated);
    } catch (error) {
      console.error('Error updating team member role:', error);
      res.status(500).json({ error: 'Failed to update team member' });
    }
  }

  static async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const tenantId = req.tenantId as string;
    const currentUserId = req.user?.id;

    if (!tenantId) {
      return res.status(403).json({ error: 'Tenant ID required' });
    }

    if (id === currentUserId) {
      return res.status(400).json({ error: 'You cannot remove yourself from the workspace' });
    }

    try {
      const existing = await prisma.user.findFirst({
        where: { id, tenantId },
      });

      if (!existing) {
        return res.status(404).json({ error: 'Team member not found' });
      }

      if (existing.role === 'ADMIN') {
        const adminCount = await prisma.user.count({
          where: { tenantId, role: 'ADMIN' },
        });
        if (adminCount <= 1) {
          return res.status(400).json({ error: 'Cannot remove the only Administrator' });
        }
      }

      // Check if user has assigned emails and nullify or reassign them
      await prisma.email.updateMany({
        where: { assignedTo: id },
        data: { assignedTo: null }
      });

      await prisma.user.delete({
        where: { id },
      });

      res.json({ message: 'Team member removed successfully' });
    } catch (error) {
      console.error('Error deleting team member:', error);
      res.status(500).json({ error: 'Failed to remove team member' });
    }
  }
}
