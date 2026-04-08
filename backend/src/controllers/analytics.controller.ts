import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { subDays } from 'date-fns';

export class AnalyticsController {
  static async getSummary(req: Request, res: Response) {
    const tenantId = req.tenantId as string;
    const days = parseInt(req.query.days as string || '7');

    if (!tenantId) {
      return res.status(403).json({ error: 'Tenant ID required' });
    }

    const reports = await prisma.analyticsReport.findMany({
      where: { 
        tenantId,
        date: { gte: subDays(new Date(), days) }
      },
      orderBy: { date: 'asc' }
    });

    const totalProcessed = reports.reduce((acc: number, r: any) => acc + (r.emailsProcessed || 0), 0);
    const totalReplies = reports.reduce((acc: number, r: any) => acc + (r.aiRepliesSent || 0), 0);
    const totalHoursSaved = reports.reduce((acc: number, r: any) => acc + (r.hoursSaved || 0), 0);
    const avgResponseTime = reports.length > 0
      ? reports.reduce((acc: number, r: any) => acc + (r.avgResponseTime || 0), 0) / reports.length
      : 0;

    res.json({
      summary: {
        totalProcessed,
        totalReplies,
        totalHoursSaved,
        avgResponseTime,
      },
      history: reports
    });
  }

  static async getIntentDistribution(req: Request, res: Response) {
    const tenantId = req.tenantId as string;

    if (!tenantId) {
      return res.status(403).json({ error: 'Tenant ID required' });
    }

    const aggregation = await prisma.emailIntelligence.groupBy({
      by: ['intent'],
      where: {
        email: { tenantId }
      },
      _count: true
    });

    res.json(aggregation);
  }

  static async getEmailVolume(req: Request, res: Response) {
    const tenantId = req.tenantId as string;
    const days = parseInt(req.query.days as string || '7');

    if (!tenantId) {
      return res.status(403).json({ error: 'Tenant ID required' });
    }

    const emails = await prisma.email.findMany({
      where: {
        tenantId,
        receivedAt: { gte: subDays(new Date(), days) }
      },
      select: {
        receivedAt: true,
        status: true,
        intelligence: {
          select: {
            intent: true,
            priority: true,
          }
        }
      },
      orderBy: { receivedAt: 'asc' }
    });

    res.json(emails);
  }
}
