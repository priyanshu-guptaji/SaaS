import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many authentication attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please slow down' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const emailSendLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Too many emails sent, please slow down' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const validateRequest = <T extends z.ZodSchema>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = ['GET', 'DELETE'].includes(req.method) ? req.query : req.body;
      const parsed = schema.parse(dataToValidate);
      
      // If it's a GET/DELETE request, merge the parsed values back (handling type coercion)
      if (['GET', 'DELETE'].includes(req.method) && typeof parsed === 'object' && parsed !== null) {
        req.query = { ...req.query, ...parsed } as any;
      }
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
};

export const signInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const emailAnalysisSchema = z.object({
  intent: z.enum(['SALES_LEAD', 'CUSTOMER_SUPPORT', 'ORDER_INQUIRY', 'REFUND_REQUEST', 'COMPLAINT', 'BILLING_ISSUE', 'MEETING_REQUEST', 'SPAM', 'OTHER']).optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
  sentiment: z.enum(['POSITIVE', 'URGENT', 'NEUTRAL', 'ANGRY']).optional(),
  suggestedReply: z.string().optional(),
});

export const emailReplySchema = z.object({
  body: z.string().min(1, 'Reply body is required').max(10000, 'Reply too long'),
});

export const assignEmailSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  status: z.string().optional(),
  priority: z.string().optional(),
  intent: z.string().optional(),
  days: z.coerce.number().min(1).max(90).default(7),
});
