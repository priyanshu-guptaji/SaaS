import { Router } from 'express';
import { EmailController } from '../controllers/email.controller';
import { AnalyticsController } from '../controllers/analytics.controller';

const router = Router();

// Email Endpoints
router.get('/emails', EmailController.list);
router.get('/emails/:id', EmailController.get);
router.post('/emails/:id/analyze', EmailController.triggerAnalysis);
router.patch('/emails/:id/intelligence', EmailController.updateIntelligence);

// Analytics Endpoints
router.get('/analytics/summary', AnalyticsController.getSummary);
router.get('/analytics/intents', AnalyticsController.getIntentDistribution);

// Workflow Endpoints (Add as needed)
// Integration Endpoints (Add as needed)

export default router;
