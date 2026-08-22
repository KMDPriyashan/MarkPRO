import { Request, Response } from 'express';
import { firebaseAuth, firebaseFirestore, isFirebaseInitialized } from '../config/firebase';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

// In-memory user store for development mode
const devUsers: Record<string, any> = {};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, department } = req.body;

    if (!email || !password || !name) {
      throw new AppError('Email, password, and name are required', 400);
    }

    if (isFirebaseInitialized) {
      // Firebase mode - create user in Firebase
      const userRecord = await firebaseAuth.createUser({
        email,
        password,
        displayName: name,
      });

      await firebaseAuth.setCustomUserClaims(userRecord.uid, {
        role: role || 'EMPLOYEE',
      });

      await firebaseFirestore.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email,
        name,
        role: role || 'EMPLOYEE',
        department: department || 'General',
        isActive: true,
        createdAt: new Date().toISOString(),
      });

      const customToken = await firebaseAuth.createCustomToken(userRecord.uid);

      res.status(201).json({
        success: true,
        data: {
          user: {
            uid: userRecord.uid,
            email: userRecord.email,
            name: userRecord.displayName,
            role: role || 'EMPLOYEE',
          },
          token: customToken,
        },
      });
    } else {
      // Development mode - store in memory
      const uid = `dev-${Date.now()}`;
      devUsers[email] = {
        uid,
        email,
        password,
        name,
        role: role || 'EMPLOYEE',
        department: department || 'General',
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      res.status(201).json({
        success: true,
        data: {
          user: {
            uid,
            email,
            name,
            role: role || 'EMPLOYEE',
          },
          message: '✓ User registered in development mode',
        },
      });
    }
  } catch (error: any) {
    throw new AppError(error.message || 'Registration failed', 400);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    if (isFirebaseInitialized) {
      // Firebase mode
      const userRecord = await firebaseAuth.getUserByEmail(email);

      if (!userRecord) {
        throw new AppError('User not found', 404);
      }

      const userDoc = await firebaseFirestore
        .collection('users')
        .doc(userRecord.uid)
        .get();

      const userData = userDoc.data();

      await firebaseFirestore
        .collection('users')
        .doc(userRecord.uid)
        .update({
          lastLogin: new Date().toISOString(),
        });

      res.json({
        success: true,
        data: {
          user: {
            uid: userRecord.uid,
            email: userRecord.email,
            name: userRecord.displayName || userData?.name,
            role: userData?.role || 'EMPLOYEE',
          },
        },
      });
    } else {
      // Development mode - check in-memory store
      const user = devUsers[email];

      if (!user || user.password !== password) {
        throw new AppError('Invalid email or password', 401);
      }

      res.json({
        success: true,
        data: {
          user: {
            uid: user.uid,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          message: '✓ Logged in (development mode)',
        },
      });
    }
  } catch (error: any) {
    throw new AppError(error.message || 'Login failed', 400);
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (isFirebaseInitialized) {
      // Firebase mode
      const userDoc = await firebaseFirestore
        .collection('users')
        .doc(req.user.uid)
        .get();

      const userData = userDoc.data();

      res.json({
        success: true,
        data: {
          uid: req.user.uid,
          email: req.user.email,
          name: req.user.name,
          role: req.user.role,
          ...userData,
        },
      });
    } else {
      // Development mode - return user from token
      res.json({
        success: true,
        data: {
          uid: req.user.uid,
          email: req.user.email,
          name: req.user.name,
          role: req.user.role,
          mode: 'development',
        },
      });
    }
  } catch (error: any) {
    throw new AppError(error.message || 'Failed to get user', 400);
  }
};