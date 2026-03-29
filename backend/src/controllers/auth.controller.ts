import { Request, Response } from 'express';
import { GmailService } from '../services/emails/gmail.service';
import { prisma } from '../index';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';

const gmailService = new GmailService();

export class AuthController {
  static async signin(req: Request, res: Response) {
    const { email, password } = req.body;
    
    // Simple User-Tenant mapping (MVP)
    const user = await prisma.user.findUnique({
      where: { email },
      include: { tenant: true }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = jwt.sign(
      { id: user.id, tenantId: user.tenantId, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, role: user.role, tenantId: user.tenantId } });
  }

  static async getGoogleAuthUrl(req: Request, res: Response) {
    const tenantId = req.query.tenantId as string;
    const url = gmailService.getAuthUrl(tenantId);
    res.json({ url });
  }

  static async googleCallback(req: Request, res: Response) {
    const { code, state: tenantId } = req.query;
    
    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code as string);
    const userInfo = await oauth2Client.getTokenInfo(tokens.access_token!);

    // Save Integration
    await prisma.integration.upsert({
      where: {
        tenantId_provider_emailAddress: {
          tenantId: tenantId as string,
          provider: 'gmail',
          emailAddress: userInfo.email!
        }
      },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        status: 'active'
      },
      create: {
        tenantId: tenantId as string,
        provider: 'gmail',
        emailAddress: userInfo.email!,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        status: 'active'
      }
    });

    res.send('Integration Successful! You can close this window now.');
  }
}
