import OpenAI from 'openai';
import dotenv from 'dotenv';
import { EmailIntent, Priority, Sentiment } from '@prisma/client';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
      console.error('AI Analysis Error:', error);
      throw error;
    }
  }
}
