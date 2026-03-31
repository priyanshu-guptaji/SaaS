import { PrismaClient, EmailIntent, Priority, Sentiment, Role, SubscriptionTier } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const tenant = await prisma.tenant.upsert({
    where: { id: 'cl_tenant_123' },
    update: {},
    create: {
      id: 'cl_tenant_123',
      name: 'E-Comm Flow Store',
      tier: SubscriptionTier.PRO,
      industry: 'E-commerce',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@ecommflow.com' },
    update: {},
    create: {
      email: 'admin@ecommflow.com',
      name: 'John Doe',
      password: hashedPassword,
      role: Role.ADMIN,
      tenantId: tenant.id,
    },
  });

  // 3. Create Sample Emails with Intelligence
  const emails = [
    {
      subject: 'Urgent: My Order #4521 is Delaying',
      from: 'sarah@example.com',
      intent: EmailIntent.REFUND_REQUEST,
      sentiment: Sentiment.ANGRY,
      priority: Priority.HIGH,
      body: "I'm very disappointed. My order #4521 has been stuck in transit for 2 weeks. I've already messaged you twice. I want a full refund if I don't get it by tomorrow.",
    },
    {
      subject: 'Bulk Quote for 500 Custom Units',
      from: 'david@corp.com',
      intent: EmailIntent.SALES_LEAD,
      sentiment: Sentiment.POSITIVE,
      priority: Priority.HIGH,
      body: "Hi! We're planning a massive marketing event and need 500 units of your custom series. Could you provide a bulk discount quote?",
    },
    {
        subject: 'Changing payment method',
        from: 'lisa.w@gmail.com',
        intent: EmailIntent.BILLING_ISSUE,
        sentiment: Sentiment.NEUTRAL,
        priority: Priority.LOW,
        body: "Hey there! I'd like to update my credit card info for my monthly subscription. Where can I find the setting?",
    }
  ];

  for (const e of emails) {
    const email = await prisma.email.create({
      data: {
        tenantId: tenant.id,
        externalId: `msg_${Math.random().toString(36).substr(2, 9)}`,
        subject: e.subject,
        from: e.from,
        to: 'support@ecommflow.com',
        body: e.body,
        status: 'processed',
        intelligence: {
          create: {
            intent: e.intent,
            sentiment: e.sentiment,
            priority: e.priority,
            confidence: 0.95,
            suggestedReply: `Hi ${e.from.split('@')[0]}! This is an AI-suggested draft for you to review regarding your ${e.intent.toLowerCase().replace('_', ' ')}.`,
          }
        }
      }
    });
  }

  // 4. Create Analytics Data
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    await prisma.analyticsReport.create({
      data: {
        tenantId: tenant.id,
        date: date,
        emailsProcessed: 15 + Math.floor(Math.random() * 20),
        aiRepliesSent: 10 + Math.floor(Math.random() * 10),
        hoursSaved: 2.5 + Math.random() * 5,
        avgResponseTime: 12 + Math.random() * 20,
      }
    });
  }

  console.log('✅ Seed successful!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
