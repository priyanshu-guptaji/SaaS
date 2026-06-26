import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class IntegrationController {
  static async list(req: Request, res: Response) {
    const tenantId = req.tenantId as string;
    if (!tenantId) {
      return res.status(403).json({ error: 'Tenant ID required' });
    }

    try {
      const integrations = await prisma.integration.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
      });
      res.json(integrations);
    } catch (error) {
      console.error('Error listing integrations:', error);
      res.status(500).json({ error: 'Failed to list integrations' });
    }
  }

  static async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const tenantId = req.tenantId as string;

    if (!tenantId) {
      return res.status(403).json({ error: 'Tenant ID required' });
    }

    try {
      const existing = await prisma.integration.findFirst({
        where: { id, tenantId },
      });

      if (!existing) {
        return res.status(404).json({ error: 'Integration not found' });
      }

      await prisma.integration.delete({
        where: { id },
      });

      res.json({ message: 'Integration disconnected successfully' });
    } catch (error) {
      console.error('Error deleting integration:', error);
      res.status(500).json({ error: 'Failed to disconnect integration' });
    }
  }
}
