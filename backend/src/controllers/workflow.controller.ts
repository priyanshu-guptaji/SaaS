import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class WorkflowController {
  static async list(req: Request, res: Response) {
    const tenantId = req.tenantId as string;
    if (!tenantId) {
      return res.status(403).json({ error: 'Tenant ID required' });
    }

    try {
      const workflows = await prisma.workflow.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
      });
      res.json(workflows);
    } catch (error) {
      console.error('Error listing workflows:', error);
      res.status(500).json({ error: 'Failed to list workflows' });
    }
  }

  static async create(req: Request, res: Response) {
    const tenantId = req.tenantId as string;
    const { name, trigger, action } = req.body;

    if (!tenantId) {
      return res.status(403).json({ error: 'Tenant ID required' });
    }

    if (!name || !trigger || !action) {
      return res.status(400).json({ error: 'Name, trigger, and action are required' });
    }

    try {
      const workflow = await prisma.workflow.create({
        data: {
          tenantId,
          name,
          trigger,
          action,
          isActive: true,
        },
      });
      res.status(201).json(workflow);
    } catch (error) {
      console.error('Error creating workflow:', error);
      res.status(500).json({ error: 'Failed to create workflow' });
    }
  }

  static async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const tenantId = req.tenantId as string;
    const { name, trigger, action, isActive } = req.body;

    if (!tenantId) {
      return res.status(403).json({ error: 'Tenant ID required' });
    }

    try {
      const existing = await prisma.workflow.findFirst({
        where: { id, tenantId },
      });

      if (!existing) {
        return res.status(404).json({ error: 'Workflow not found' });
      }

      const workflow = await prisma.workflow.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(trigger !== undefined && { trigger }),
          ...(action !== undefined && { action }),
          ...(isActive !== undefined && { isActive }),
        },
      });

      res.json(workflow);
    } catch (error) {
      console.error('Error updating workflow:', error);
      res.status(500).json({ error: 'Failed to update workflow' });
    }
  }

  static async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const tenantId = req.tenantId as string;

    if (!tenantId) {
      return res.status(403).json({ error: 'Tenant ID required' });
    }

    try {
      const existing = await prisma.workflow.findFirst({
        where: { id, tenantId },
      });

      if (!existing) {
        return res.status(404).json({ error: 'Workflow not found' });
      }

      await prisma.workflow.delete({
        where: { id },
      });

      res.json({ message: 'Workflow deleted successfully' });
    } catch (error) {
      console.error('Error deleting workflow:', error);
      res.status(500).json({ error: 'Failed to delete workflow' });
    }
  }
}
