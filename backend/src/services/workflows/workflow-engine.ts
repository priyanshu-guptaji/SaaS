import { prisma } from '../../lib/prisma';
import axios from 'axios';
import { GmailService } from '../emails/gmail.service';

export class WorkflowEngine {
  static async execute(emailId: string, tenantId: string, analysis: any) {
    const activeWorkflows = await prisma.workflow.findMany({
      where: { 
        tenantId, 
        isActive: true 
      }
    });

    console.log(`Checking ${activeWorkflows.length} workflows for tenant: ${tenantId}...`);

    for (const workflow of activeWorkflows) {
      const trigger = workflow.trigger as any;
      const actions = (workflow.action as any).then || [];

      if (this.evaluateTrigger(trigger, analysis)) {
        console.log(`Executing Workflow: ${workflow.name} for Email: ${emailId}...`);
        
        for (const action of actions) {
          try {
            await this.performAction(action, emailId, tenantId, analysis);
          } catch (err) {
            console.error(`Workflow Action Failed (${workflow.name}):`, err);
          }
        }
      }
    }
  }

  private static evaluateTrigger(trigger: any, analysis: any) : boolean {
    const conditions = trigger.if || {};
    
    if (conditions.intent && conditions.intent !== analysis.intent) return false;
    if (conditions.sentiment && conditions.sentiment !== analysis.sentiment) return false;
    if (conditions.priority && conditions.priority !== analysis.priority) return false;

    return true;
  }

  private static async performAction(action: any, emailId: string, tenantId: string, analysis: any) {
    switch (action.type) {
      case 'WEBHOOK':
        await axios.post(action.url, { emailId, tenantId, analysis });
        break;

      case 'SLACK_NOTIFY':
        console.log(`Slack Notification: [${analysis.priority}] ${analysis.intent} - ${emailId}`);
        // We print the Slack notification details for verification
        break;

      case 'AUTO_REPLY':
        if (analysis.confidence > 0.9 && analysis.suggestedReply) {
          console.log(`Auto-reply trigger active for email ${emailId}...`);
          
          const integration = await prisma.integration.findFirst({
            where: { tenantId, provider: 'gmail', status: 'active' },
          });

          if (!integration || !integration.refreshToken) {
            console.warn(`Auto-reply skipped: No active Gmail integration found for tenant ${tenantId}`);
            break;
          }

          const email = await prisma.email.findUnique({
            where: { id: emailId }
          });

          if (!email) {
            console.warn(`Auto-reply skipped: Email not found in database: ${emailId}`);
            break;
          }

          try {
            const gmailService = new GmailService();
            await gmailService.setTokens(integration.refreshToken);
            
            await gmailService.sendReply(
              email.threadId || email.externalId, 
              email.from, 
              email.subject || 'Re: No Subject', 
              analysis.suggestedReply
            );

            await prisma.email.update({
              where: { id: emailId },
              data: { status: 'responded' },
            });

            console.log(`Successfully auto-replied and updated email ${emailId} status`);
          } catch (error) {
            console.error(`Failed to send auto-reply for email ${emailId}:`, error);
          }
        }
        break;

      case 'ASSIGN_USER':
        await prisma.email.update({
          where: { id: emailId },
          data: { assignedTo: action.userId }
        });
        break;

      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }
}
