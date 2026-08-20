import { Request, Response } from 'express';
import { firebaseAuth, firebaseFirestore } from '../config/firebase';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, department } = req.body;

    // Firebase Auth user create කරන්න
    const userRecord = await firebaseAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // Set custom claims (role)
    await firebaseAuth.setCustomUserClaims(userRecord.uid, {
      role: role || 'EMPLOYEE',
    });

    // Firestore එකේ user save කරන්න
    await firebaseFirestore.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      name,
      role: role || 'EMPLOYEE',
      department: department || 'General',
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    // Custom token generate කරන්න
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
  } catch (error: any) {
    throw new AppError(error.message, 400);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    // Note: Password verify කරන්නේ Frontend Firebase SDK එකෙන්

    const userRecord = await firebaseAuth.getUserByEmail(email);

    if (!userRecord) {
      throw new AppError('User not found', 404);
    }

    // Firestore එකෙන් user data ගන්න
    const userDoc = await firebaseFirestore
      .collection('users')
      .doc(userRecord.uid)
      .get();

    const userData = userDoc.data();

    // Last login update කරන්න
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
  } catch (error: any) {
    throw new AppError(error.message, 400);
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

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
  } catch (error: any) {
    throw new AppError(error.message, 400);
  }
};