import { Router } from 'express';
import { EmailController } from '../controllers/email.controller';
import { AnalyticsController } from '../controllers/analytics.controller';

import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Auth Endpoints
router.post('/auth/signin', AuthController.signin);
router.get('/auth/google/url', AuthController.getGoogleAuthUrl);
router.get('/auth/google/callback', AuthController.googleCallback);

// Email Endpoints (Secured)
router.get('/emails', authMiddleware, EmailController.list);
router.get('/emails/:id', authMiddleware, EmailController.get);
router.post('/emails/:id/analyze', authMiddleware, EmailController.triggerAnalysis);
router.patch('/emails/:id/intelligence', authMiddleware, EmailController.updateIntelligence);

// Analytics Endpoints (Secured)
router.get('/analytics/summary', authMiddleware, AnalyticsController.getSummary);
router.get('/analytics/intents', authMiddleware, AnalyticsController.getIntentDistribution);

// Workflow Endpoints (Add as needed)
// Integration Endpoints (Add as needed)

export default router;
