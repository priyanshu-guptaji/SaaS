import { Request, Response } from 'express';
import { prisma } from '../index';
import { emailQueue } from '../services/queue/email-processor';

interface PaginationParams {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  intent?: string;
}

function getPaginationParams(query: Request['query']): PaginationParams {
  return {
    page: query.page ? parseInt(query.page as string) : 1,
    limit: query.limit ? Math.min(parseInt(query.limit as string), 100) : 50,
    status: query.status as string,
    priority: query.priority as string,
    intent: query.intent as string,
  };
}

export class EmailController {
  static async list(req: Request, res: Response) {
    const tenantId = req.tenantId;
    const { page, limit, status, priority, intent } = getPaginationParams(req.query);
    
    if (!tenantId) {
      return res.status(403).json({ error: 'Tenant ID required' });
    }

    const where: any = { tenantId };
    if (status) where.status = status;
    if (priority) {
      where.intelligence = { priority };
    }
    if (intent) {
      where.intelligence = { ...where.intelligence, intent };
    }

    const skip = (page - 1) * limit;

    const [emails, total] = await Promise.all([
      prisma.email.findMany({
        where,
        include: { intelligence: true, assignedUser: true },
        orderBy: { receivedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.email.count({ where }),
    ]);

    res.json({
      data: emails,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  }

  static async get(req: Request, res: Response) {
    const { id } = req.params;
    const tenantId = req.tenantId;
    
    if (!tenantId) {
      return res.status(403).json({ error: 'Tenant ID required' });
    }

    const email = await prisma.email.findFirst({
      where: { id, tenantId },
      include: { intelligence: true, assignedUser: true },
    });

    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }
    
    res.json(email);
  }

  static async triggerAnalysis(req: Request, res: Response) {
    const { id } = req.params;
    const tenantId = req.tenantId;
    
    if (!tenantId) {
      return res.status(403).json({ error: 'Tenant ID required' });
    }

    const email = await prisma.email.findFirst({
      where: { id, tenantId },
    });

    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    await emailQueue.add(`Analyze-${id}`, {
      emailId: id,
      subject: email.subject,
      body: email.body,
      tenantId: email.tenantId
    });

    res.json({ status: 'queued', message: 'Email queued for AI analysis' });
  }

  static async updateIntelligence(req: Request, res: Response) {
    const { id } = req.params;
    const tenantId = req.tenantId;
    const { intent, priority, sentiment, suggestedReply } = req.body;
    
    if (!tenantId) {
      return res.status(403).json({ error: 'Tenant ID required' });
    }

    const email = await prisma.email.findFirst({
      where: { id, tenantId },
    });

    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    const updated = await prisma.emailIntelligence.update({
      where: { emailId: id },
      data: { intent, priority, sentiment, suggestedReply },
    });

    res.json({ status: 'updated', data: updated });
  }

  static async sendReply(req: Request, res: Response) {
    const { id } = req.params;
    const tenantId = req.tenantId;
    const { body: replyBody } = req.body;
    
    if (!tenantId) {
      return res.status(403).json({ error: 'Tenant ID required' });
    }

    const email = await prisma.email.findFirst({
      where: { id, tenantId },
    });

    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // TODO: Integrate with GmailService to send actual reply
    // For now, just update the status
    await prisma.email.update({
      where: { id },
      data: { status: 'responded' },
    });

    res.json({ status: 'sent', message: 'Reply sent successfully' });
  }

  static async assignEmail(req: Request, res: Response) {
    const { id } = req.params;
    const tenantId = req.tenantId;
    const { userId } = req.body;
    
    if (!tenantId) {
      return res.status(403).json({ error: 'Tenant ID required' });
    }

    const email = await prisma.email.findFirst({
      where: { id, tenantId },
    });

    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    const updated = await prisma.email.update({
      where: { id },
      data: { assignedTo: userId },
      include: { assignedUser: true },
    });

    res.json({ status: 'assigned', data: updated });
  }
}
