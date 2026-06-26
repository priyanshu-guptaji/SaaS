import { Router } from 'express';
import { EmailController } from '../controllers/email.controller';
import { AnalyticsController } from '../controllers/analytics.controller';
import { AuthController } from '../controllers/auth.controller';
import { WorkflowController } from '../controllers/workflow.controller';
import { IntegrationController } from '../controllers/integration.controller';
import { TeamController } from '../controllers/team.controller';
import { SettingsController } from '../controllers/settings.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { 
  authLimiter, 
  apiLimiter, 
  validateRequest, 
  signInSchema, 
  refreshTokenSchema, 
  emailReplySchema, 
  assignEmailSchema, 
  paginationSchema,
  emailAnalysisSchema
} from '../middleware/validation';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.post('/auth/signin', authLimiter, validateRequest(signInSchema), AuthController.signin);
router.post('/auth/refresh', authLimiter, validateRequest(refreshTokenSchema), AuthController.refreshToken);
router.get('/auth/google/url', authMiddleware, AuthController.getGoogleAuthUrl);
router.get('/auth/google/callback', AuthController.googleCallback);

// Protected routes
router.use(authMiddleware);
router.use(apiLimiter);

// Email routes
router.get('/emails', validateRequest(paginationSchema), EmailController.list);
router.post('/emails/sync', EmailController.triggerSync);
router.get('/emails/:id', EmailController.get);
router.post('/emails/:id/analyze', EmailController.triggerAnalysis);
router.patch('/emails/:id/intelligence', validateRequest(emailAnalysisSchema), EmailController.updateIntelligence);
router.post('/emails/:id/reply', validateRequest(emailReplySchema), EmailController.sendReply);
router.patch('/emails/:id/assign', validateRequest(assignEmailSchema), EmailController.assignEmail);

// Analytics routes
router.get('/analytics/summary', validateRequest(paginationSchema), AnalyticsController.getSummary);
router.get('/analytics/intents', AnalyticsController.getIntentDistribution);
router.get('/analytics/volume', validateRequest(paginationSchema), AnalyticsController.getEmailVolume);

// Workflow CRUD routes
router.get('/workflows', WorkflowController.list);
router.post('/workflows', WorkflowController.create);
router.patch('/workflows/:id', WorkflowController.update);
router.delete('/workflows/:id', WorkflowController.delete);

// Integration CRUD routes
router.get('/integrations', IntegrationController.list);
router.delete('/integrations/:id', IntegrationController.delete);

// Team CRUD routes
router.get('/team', TeamController.list);
router.post('/team', TeamController.create);
router.patch('/team/:id', TeamController.update);
router.delete('/team/:id', TeamController.delete);

// Settings & Billing routes
router.get('/settings', SettingsController.get);
router.patch('/settings', SettingsController.updateTenant);
router.patch('/settings/profile', SettingsController.updateProfile);
router.post('/settings/billing/upgrade', SettingsController.upgradeBilling);

export default router;
