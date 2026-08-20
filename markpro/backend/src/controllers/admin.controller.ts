import { Request, Response } from 'express';
import { firebaseFirestore, firebaseAuth } from '../config/firebase';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const snapshot = await firebaseFirestore.collection('users').get();

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    throw new AppError(error.message, 500);
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { uid, role } = req.body;

    // Update Firebase custom claims
    await firebaseAuth.setCustomUserClaims(uid, { role });

    // Update Firestore
    await firebaseFirestore.collection('users').doc(uid).update({
      role,
      updatedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: 'User role updated successfully',
    });
  } catch (error: any) {
    throw new AppError(error.message, 500);
  }
};

export const getAttendanceStats = async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const snapshot = await firebaseFirestore
      .collection('attendance')
      .where('date', '==', today)
      .get();

    const stats = {
      total: snapshot.size,
      present: 0,
      late: 0,
      absent: 0,
    };

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status === 'PRESENT') stats.present++;
      else if (data.status === 'LATE') stats.late++;
    });

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    throw new AppError(error.message, 500);
  }
};