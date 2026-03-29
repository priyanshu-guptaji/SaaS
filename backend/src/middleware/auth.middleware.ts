import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

// Extend Request type
declare global {
  namespace Express {
    interface Request {
      user?: any;
      tenantId?: string;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    req.user = decoded;
    req.tenantId = decoded.tenantId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const tenantMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // For MVP, we might allow passing tenantId in headers if not using standard Auth
    const tenantId = req.headers['x-tenant-id'] as string || req.tenantId;
    
    if (!tenantId) {
        return res.status(403).json({ error: 'Tenant ID required' });
    }
    
    req.tenantId = tenantId;
    next();
};
