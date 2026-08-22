import { Request, Response, NextFunction } from 'express';
import { firebaseAuth, isFirebaseInitialized } from '../config/firebase';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email: string;
    name?: string;
    role?: string;
  };
}

// Simple token decoder for development mode
const decodeTokenDev = (token: string): any => {
  try {
    // First try to decode as JWT
    try {
      const decoded = jwt.decode(token, { complete: true });
      if (decoded) {
        return decoded.payload;
      }
    } catch (e) {
      // If JWT decode fails, try base64 decode
    }
    
    // Try base64 decode
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    return decoded;
  } catch (error) {
    throw new Error('Failed to decode token');
  }
};

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    if (isFirebaseInitialized) {
      // Production mode - verify with Firebase
      try {
        const decodedToken = await firebaseAuth.verifyIdToken(token);
        const userRecord = await firebaseAuth.getUser(decodedToken.uid);

        req.user = {
          uid: userRecord.uid,
          email: userRecord.email || '',
          name: userRecord.displayName || '',
          role: (userRecord.customClaims?.role as string) || 'EMPLOYEE',
        };

        next();
      } catch (error) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired token',
        });
      }
    } else {
      // Development mode - decode token without Firebase
      try {
        const decoded = decodeTokenDev(token);

        req.user = {
          uid: decoded.uid || decoded.sub || 'dev-user',
          email: decoded.email || 'dev@example.com',
          name: decoded.name || decoded.display_name || 'Dev User',
          role: decoded.role || 'EMPLOYEE',
        };

        next();
      } catch (error) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token',
        });
      }
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    if (!roles.includes(req.user.role || 'EMPLOYEE')) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden - Insufficient permissions',
      });
    }

    next();
  };
};