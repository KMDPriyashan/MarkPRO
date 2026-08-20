import { Request, Response, NextFunction } from 'express';
import { firebaseAuth } from '../config/firebase';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email: string;
    name?: string;
    role?: string;
  };
}

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

    // Firebase token verify කරන්න
    const decodedToken = await firebaseAuth.verifyIdToken(token);

    // User data ගන්න
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
        error: 'Insufficient permissions',
      });
    }

    next();
  };
};