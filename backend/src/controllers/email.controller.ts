import { Request, Response } from 'express';
import { prisma } from '../index';
import { emailQueue } from '../services/queue/email-processor';

export class EmailController {
  static async list(req: Request, res: Response) {
    const tenantId = req.query.tenantId as string;
    
    const emails = await prisma.email.findMany({
      where: { tenantId },
      include: { intelligence: true },
      orderBy: { receivedAt: 'desc' },
    });

    res.json(emails);
  }

  static async get(req: Request, res: Response) {
    const { id } = req.params;
    
    const email = await prisma.email.findUnique({
      where: { id },
      include: { intelligence: true, assignedUser: true },
    });

    if (!email) return res.status(404).json({ error: 'Email not found' });
    
    res.json(email);
  }

  static async triggerAnalysis(req: Request, res: Response) {
    const { id } = req.params;
    const email = await prisma.email.findUnique({ where: { id } });

    if (!email) return res.status(404).json({ error: 'Email not found' });

    await emailQueue.add(`Analyze-${id}`, {
      emailId: id,
      subject: email.subject,
      body: email.body,
      tenantId: email.tenantId
    });

    res.json({ status: 'queued' });
  }

  static async updateIntelligence(req: Request, res: Response) {
    const { id } = req.params;
    const { intent, priority, sentiment, suggestedReply } = req.body;

    await prisma.emailIntelligence.update({
      where: { emailId: id },
      data: { intent, priority, sentiment, suggestedReply },
    });

    res.json({ status: 'updated' });
  }
}
