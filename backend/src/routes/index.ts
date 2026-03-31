import { Router } from 'express';
import { EmailController } from '../controllers/email.controller';
import { AnalyticsController } from '../controllers/analytics.controller';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { authLimiter, apiLimiter, validateRequest, signInSchema, refreshTokenSchema, emailReplySchema, assignEmailSchema, paginationSchema } from '../middleware/validation';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.post('/auth/signin', authLimiter, validateRequest(signInSchema), AuthController.signin);
router.post('/auth/refresh', authLimiter, validateRequest(refreshTokenSchema), AuthController.refreshToken);
router.get('/auth/google/url', authMiddleware, AuthController.getGoogleAuthUrl);
router.get('/auth/google/callback', AuthController.googleCallback);

router.use(authMiddleware);
router.use(apiLimiter);

router.get('/emails', validateRequest(paginationSchema), EmailController.list);
router.get('/emails/:id', EmailController.get);
router.post('/emails/:id/analyze', EmailController.triggerAnalysis);
router.patch('/emails/:id/intelligence', EmailController.updateIntelligence);
router.post('/emails/:id/reply', validateRequest(emailReplySchema), EmailController.sendReply);
router.patch('/emails/:id/assign', validateRequest(assignEmailSchema), EmailController.assignEmail);

router.get('/analytics/summary', validateRequest(paginationSchema), AnalyticsController.getSummary);
router.get('/analytics/intents', AnalyticsController.getIntentDistribution);
router.get('/analytics/volume', validateRequest(paginationSchema), AnalyticsController.getEmailVolume);

export default router;
