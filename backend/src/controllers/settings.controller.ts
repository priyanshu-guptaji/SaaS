import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { SubscriptionTier } from '@prisma/client';

export class SettingsController {
  static async get(req: Request, res: Response) {
    const tenantId = req.tenantId as string;
    const userId = req.user?.id;

    if (!tenantId || !userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
      const [tenant, user] = await Promise.all([
        prisma.tenant.findUnique({
          where: { id: tenantId },
        }),
        prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        }),
      ]);

      if (!tenant || !user) {
        return res.status(404).json({ error: 'Tenant or User not found' });
      }

      res.json({ tenant, user });
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  }

  static async updateTenant(req: Request, res: Response) {
    const tenantId = req.tenantId as string;
    const { name, domain, industry } = req.body;

    if (!tenantId) {
      return res.status(403).json({ error: 'Tenant ID required' });
    }

    try {
      const tenant = await prisma.tenant.update({
        where: { id: tenantId },
        data: {
          ...(name !== undefined && { name }),
          ...(domain !== undefined && { domain }),
          ...(industry !== undefined && { industry }),
        },
      });

      res.json(tenant);
    } catch (error) {
      console.error('Error updating tenant settings:', error);
      res.status(500).json({ error: 'Failed to update organization settings' });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    const userId = req.user?.id;
    const { name } = req.body;

    if (!userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { name },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      res.json(user);
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Failed to update profile settings' });
    }
  }

  static async upgradeBilling(req: Request, res: Response) {
    const tenantId = req.tenantId as string;
    const { tier } = req.body;

    if (!tenantId) {
      return res.status(403).json({ error: 'Tenant ID required' });
    }

    if (!tier) {
      return res.status(400).json({ error: 'Subscription tier is required' });
    }

    try {
      const updatedTenant = await prisma.tenant.update({
        where: { id: tenantId },
        data: { tier: tier as SubscriptionTier },
      });

      res.json({
        success: true,
        message: `Successfully upgraded to ${tier} tier`,
        tenant: updatedTenant,
      });
    } catch (error) {
      console.error('Error updating billing tier:', error);
      res.status(500).json({ error: 'Failed to upgrade billing tier' });
    }
  }
}
