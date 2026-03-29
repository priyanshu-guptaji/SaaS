import { Queue, Worker, Job } from 'bullmq';
import { AIService } from '../ai/openai.service';
import { prisma } from '../../index';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import { Priority, Sentiment } from '@prisma/client';

dotenv.config();

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const emailQueue = new Queue('EmailProcessor', { connection });

export const emailWorker = new Worker('EmailProcessor', async (job: Job) => {
  const { emailId, subject, body, tenantId } = job.data;
  
  console.log(`Processing email: ${emailId} for tenant: ${tenantId}...`);

  try {
    const analysis = await AIService.analyzeEmail(subject, body);

    await prisma.emailIntelligence.upsert({
      where: { emailId },
      update: {
        intent: analysis.intent,
        sentiment: analysis.sentiment,
        priority: analysis.priority,
        confidence: analysis.confidence,
        suggestedReply: analysis.suggestedReply,
        extractedData: analysis.extractedData,
        processedAt: new Date(),
      },
      create: {
        emailId,
        intent: analysis.intent,
        sentiment: analysis.sentiment,
        priority: analysis.priority,
        confidence: analysis.confidence,
        suggestedReply: analysis.suggestedReply,
        extractedData: analysis.extractedData,
      },
    });

    await prisma.email.update({
      where: { id: emailId },
      data: { status: 'processed' },
    });

    console.log(`Successfully analyzed email: ${emailId}`);

    // Trigger Workflow Rules here...
    // TODO: WorkflowEngine.run(emailId, tenantId, analysis);
    
  } catch (error) {
    console.error(`Error processing job ${job.id}:`, error);
    throw error;
  }
}, { connection });
