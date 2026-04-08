import { Queue, Worker, Job } from 'bullmq';
import { AIService } from '../ai/openai.service';
import { prisma } from '../../lib/prisma';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import { Priority, Sentiment } from '@prisma/client';

dotenv.config();

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

connection.on('error', (err) => {
  console.error('Redis connection error:', err);
});

connection.on('connect', () => {
  console.log('Redis connected successfully');
});

export const emailQueue = new Queue('EmailProcessor', { 
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

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

  } catch (error) {
    console.error(`Error processing job ${job.id}:`, error);
    throw error;
  }
}, { 
  connection,
  concurrency: 5,
});

emailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});

emailWorker.on('error', (err) => {
  console.error('Worker error:', err);
});
