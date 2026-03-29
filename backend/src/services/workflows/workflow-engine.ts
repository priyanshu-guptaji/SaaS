import { prisma } from '../../index';
import axios from 'axios';
import { EmailIntent, Priority, Sentiment } from '@prisma/client';

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
        // Implementation for Slack
        console.log(`Slack Notification: [${analysis.priority}] ${analysis.intent} - ${emailId}`);
        // await SlackService.send(action.channel, message);
        break;

      case 'AUTO_REPLY':
        if (analysis.confidence > 0.9) {
          console.log(`Auto-replying for ${emailId}...`);
          // Implementation for GmailService.sendReply
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
