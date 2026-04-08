import { prisma } from '../../lib/prisma';
import { GmailService } from './gmail.service';
import { emailQueue } from '../queue/email-processor';

const SYNC_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

export class SyncEngine {
  private static interval: NodeJS.Timeout | null = null;
  private static gmailService = new GmailService();

  static async start() {
    if (this.interval) return;
    
    console.log('📬 Starting Email Sync Engine...');
    
    // Initial sync
    this.syncAllTenants();
    
    this.interval = setInterval(() => {
      this.syncAllTenants();
    }, SYNC_INTERVAL_MS);
  }

  static stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private static async syncAllTenants() {
    console.log('🔄 Syncing emails for all active integrations...');
    
    try {
      const integrations = await prisma.integration.findMany({
        where: { provider: 'gmail', status: 'active' },
      });

      for (const integration of integrations) {
        await this.syncIntegration(integration);
      }
    } catch (error) {
      console.error('Error syncing all tenants:', error);
    }
  }

  private static async syncIntegration(integration: any) {
    const { tenantId, refreshToken, emailAddress } = integration;
    
    try {
      console.log(`Syncing integration: ${emailAddress} for tenant ${tenantId}`);
      
      await this.gmailService.setTokens(refreshToken);
      
      // Get the last sync time for this tenant or default to 1 hour ago
      const lastEmail = await prisma.email.findFirst({
        where: { tenantId },
        orderBy: { receivedAt: 'desc' },
      });
      
      const lastSyncTime = lastEmail?.receivedAt || new Date(Date.now() - 3600000);
      
      const newEmails = await this.gmailService.fetchNewEmails('me', lastSyncTime);
      
      console.log(`Found ${newEmails.length} new emails for ${emailAddress}`);

      for (const emailData of newEmails) {
        // Check if email already exists
        const exists = await prisma.email.findFirst({
          where: { externalId: emailData.externalId, tenantId },
        });

        if (exists) continue;

        // Create email record
        const email = await prisma.email.create({
          data: {
            tenantId,
            externalId: emailData.externalId,
            threadId: emailData.threadId,
            subject: emailData.subject,
            from: emailData.from,
            to: emailData.to,
            body: emailData.body,
            receivedAt: emailData.receivedAt,
            status: 'pending',
          },
        });

        // Trigger AI analysis
        await emailQueue.add(`Analyze-${email.id}`, {
          emailId: email.id,
          subject: email.subject,
          body: email.body,
          tenantId: email.tenantId
        });
      }
    } catch (error) {
      console.error(`Error syncing integration ${emailAddress}:`, error);
    }
  }
}
