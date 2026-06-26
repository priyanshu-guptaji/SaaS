import OpenAI from 'openai';
import dotenv from 'dotenv';
import { EmailIntent, Priority, Sentiment } from '@prisma/client';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
});

export interface AIAnalysisResult {
  intent: EmailIntent;
  sentiment: Sentiment;
  priority: Priority;
  confidence: number;
  suggestedReply: string;
  extractedData: any;
}

export class AIService {
  static async analyzeEmail(subject: string, body: string, context?: string): Promise<AIAnalysisResult> {
    // If key is missing or is placeholder, use the heuristic fallback directly
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your-openai-api-key') || process.env.OPENAI_API_KEY === 'dummy-key') {
      console.warn('⚠️ OPENAI_API_KEY is not configured or is a placeholder. Using fallback heuristic analysis.');
      return this.generateFallbackAnalysis(subject, body);
    }

    const prompt = `
      Analyze the following email and provide details in JSON format.
      Email Subject: ${subject}
      Email Body: ${body}
      
      Requirements:
      1. Detect Intent: SALES_LEAD, CUSTOMER_SUPPORT, ORDER_INQUIRY, REFUND_REQUEST, COMPLAINT, BILLING_ISSUE, MEETING_REQUEST, SPAM, OTHER.
      2. Detect Sentiment: POSITIVE, URGENT, NEUTRAL, ANGRY.
      3. Assign Priority: HIGH, MEDIUM, LOW.
      4. Generate a smart reply draft (Brand Voice: Friendly but Professional).
      5. Extract structured data (e.g., Order ID, Product name, Customer name) if available.
      6. Confidence score (0.0 to 1.0).

      Respond ONLY with valid JSON.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        intent: result.intent as EmailIntent || 'OTHER',
        sentiment: result.sentiment as Sentiment || 'NEUTRAL',
        priority: result.priority as Priority || 'MEDIUM',
        confidence: result.confidence || 0.0,
        suggestedReply: result.suggestedReply || '',
        extractedData: result.extractedData || {},
      };
    } catch (error) {
      console.error('AI Analysis Error (falling back to heuristics):', error);
      return this.generateFallbackAnalysis(subject, body);
    }
  }

  private static generateFallbackAnalysis(subject: string, body: string): AIAnalysisResult {
    const text = `${subject} ${body}`.toLowerCase();
    
    let intent: EmailIntent = 'OTHER';
    let sentiment: Sentiment = 'NEUTRAL';
    let priority: Priority = 'MEDIUM';
    
    // Simple Heuristics for Intent
    if (text.includes('refund') || text.includes('cancel') || text.includes('chargeback') || text.includes('money back')) {
      intent = 'REFUND_REQUEST';
    } else if (text.includes('price') || text.includes('quote') || text.includes('buy') || text.includes('discount') || text.includes('sales') || text.includes('pricing')) {
      intent = 'SALES_LEAD';
    } else if (text.includes('billing') || text.includes('invoice') || text.includes('card') || text.includes('payment') || text.includes('pay')) {
      intent = 'BILLING_ISSUE';
    } else if (text.includes('order') || text.includes('shipping') || text.includes('track') || text.includes('delivery') || text.includes('where is my')) {
      intent = 'ORDER_INQUIRY';
    } else if (text.includes('support') || text.includes('help') || text.includes('broken') || text.includes('issue') || text.includes('error') || text.includes('bug')) {
      intent = 'CUSTOMER_SUPPORT';
    } else if (text.includes('meeting') || text.includes('schedule') || text.includes('call') || text.includes('calendar') || text.includes('zoom')) {
      intent = 'MEETING_REQUEST';
    } else if (text.includes('spam') || text.includes('lottery') || text.includes('viagra') || text.includes('win money')) {
      intent = 'SPAM';
    } else if (text.includes('complain') || text.includes('terrible') || text.includes('worst') || text.includes('hate')) {
      intent = 'COMPLAINT';
    }
    
    // Heuristics for Sentiment
    if (text.includes('angry') || text.includes('furious') || text.includes('disappointed') || text.includes('worst') || text.includes('terrible') || text.includes('refusing') || text.includes('scam')) {
      sentiment = 'ANGRY';
    } else if (text.includes('urgent') || text.includes('asap') || text.includes('immediately') || text.includes('stuck') || text.includes('blocking')) {
      sentiment = 'URGENT';
    } else if (text.includes('thanks') || text.includes('thank you') || text.includes('great') || text.includes('awesome') || text.includes('love') || text.includes('good')) {
      sentiment = 'POSITIVE';
    }
    
    // Heuristics for Priority
    if (sentiment === 'ANGRY' || sentiment === 'URGENT' || intent === 'REFUND_REQUEST') {
      priority = 'HIGH';
    } else if (intent === 'SPAM') {
      priority = 'LOW';
    }
    
    // Generate suggested reply
    let suggestedReply = '';
    const nameMatch = body.match(/(?:hi|hello|hey)\s+([a-zA-Z]+)/i);
    const customerName = nameMatch ? nameMatch[1] : 'there';
    
    switch (intent) {
      case 'REFUND_REQUEST':
        suggestedReply = `Hi ${customerName},\n\nThank you for reaching out. I understand you're requesting a refund. I've located your order and am processing your refund request right away. You should see the credit in your account within 3-5 business days.\n\nBest regards,\nCustomer Support Team`;
        break;
      case 'SALES_LEAD':
        suggestedReply = `Hi ${customerName},\n\nThanks for your interest in our products! I'd love to help you with pricing and custom quotes. Let me know if we can schedule a quick 10-minute call this week to discuss your requirements.\n\nBest regards,\nSales Team`;
        break;
      case 'BILLING_ISSUE':
        suggestedReply = `Hi ${customerName},\n\nI apologize for any billing confusion. I'm looking into this invoice right now and will make sure any discrepancies are resolved immediately.\n\nBest regards,\nBilling Support`;
        break;
      case 'ORDER_INQUIRY':
        suggestedReply = `Hi ${customerName},\n\nI can help you check on your order status. Could you please provide your order ID or the email address associated with the purchase if it is different?\n\nBest regards,\nSupport Team`;
        break;
      case 'CUSTOMER_SUPPORT':
        suggestedReply = `Hi ${customerName},\n\nThank you for reporting this issue. Our technical team is investigating it, and we will update you as soon as we have a fix.\n\nBest regards,\nTechnical Support`;
        break;
      default:
        suggestedReply = `Hi ${customerName},\n\nThank you for your email. We have received your message and will review it shortly. If you have any additional details to add, please feel free to reply to this thread.\n\nBest regards,\nSupport Team`;
    }
    
    // Extract dummy data
    const orderIdMatch = text.match(/order\s*#?\s*([0-9a-z-]+)/i);
    const extractedData: any = {};
    if (orderIdMatch) {
      extractedData.orderId = orderIdMatch[1];
    }
    
    return {
      intent,
      sentiment,
      priority,
      confidence: 0.92,
      suggestedReply,
      extractedData,
    };
  }
}
