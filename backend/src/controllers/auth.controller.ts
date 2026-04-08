import { Request, Response } from 'express';
import { GmailService } from '../services/emails/gmail.service';
import { prisma } from '../lib/prisma';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const gmailService = new GmailService();

function requireEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export class AuthController {
  static async signin(req: Request, res: Response) {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = await prisma.user.findUnique({
      where: { email },
      include: { tenant: true }
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, tenantId: user.tenantId, role: user.role },
      requireEnvVar('JWT_SECRET'),
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: user.id, type: 'refresh' },
      requireEnvVar('JWT_SECRET'),
      { expiresIn: '7d' }
    );

    res.json({ 
      token, 
      refreshToken,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        role: user.role, 
        tenantId: user.tenantId,
        tier: user.tenant.tier
      } 
    });
  }

  static async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    try {
      const decoded = jwt.verify(refreshToken, requireEnvVar('JWT_SECRET')) as { id: string; type: string };
      
      if (decoded.type !== 'refresh') {
        return res.status(401).json({ error: 'Invalid token type' });
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        include: { tenant: true }
      });

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const token = jwt.sign(
        { id: user.id, tenantId: user.tenantId, role: user.role },
        requireEnvVar('JWT_SECRET'),
        { expiresIn: '1h' }
      );

      res.json({ token });
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
  }

  static async getGoogleAuthUrl(req: Request, res: Response) {
    const tenantId = req.headers['x-tenant-id'] as string;
    
    if (!tenantId) {
      return res.status(403).json({ error: 'Tenant ID required' });
    }
    
    const url = gmailService.getAuthUrl(tenantId);
    res.json({ url });
  }

  static async googleCallback(req: Request, res: Response) {
    const { code, state: tenantId } = req.query;
    
    const oauth2Client = new google.auth.OAuth2(
      requireEnvVar('GMAIL_CLIENT_ID'),
      requireEnvVar('GMAIL_CLIENT_SECRET'),
      requireEnvVar('GMAIL_REDIRECT_URI')
    );

    const { tokens } = await oauth2Client.getToken(code as string);
    const userInfo = await oauth2Client.getTokenInfo(tokens.access_token!);

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
