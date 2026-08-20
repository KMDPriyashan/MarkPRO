import { Request, Response } from 'express';
import { firebaseFirestore } from '../config/firebase';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

// Office coordinates
const OFFICE_LAT = parseFloat(process.env.GEO_FENCE_LAT || '7.8731');
const OFFICE_LNG = parseFloat(process.env.GEO_FENCE_LNG || '80.7718');
const GEO_FENCE_RADIUS = parseFloat(process.env.GEO_FENCE_RADIUS || '100');

// Distance calculate කරන්න
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Geo-fence ඇතුලේද කියලා check කරන්න
const isInsideGeoFence = (lat: number, lng: number) => {
  const distance = calculateDistance(lat, lng, OFFICE_LAT, OFFICE_LNG);
  return distance <= GEO_FENCE_RADIUS;
};

// Check-in time අනුව status එක determine කරන්න
const determineStatus = (checkInTime: Date): 'PRESENT' | 'LATE' => {
  const hour = checkInTime.getHours();
  if (hour > 9) return 'LATE';
  return 'PRESENT';
};

export const checkIn = async (req: AuthRequest, res: Response) => {
  try {
    const { latitude, longitude, photoURL, note } = req.body;
    const userId = req.user!.uid;
    const userName = req.user!.name;

    // Geo-fence validation
    if (!isInsideGeoFence(latitude, longitude)) {
      throw new AppError('You are outside the office geo-fence', 400);
    }

    const today = new Date().toISOString().split('T')[0];
    const checkInTime = new Date();
    const status = determineStatus(checkInTime);

    // Today's attendance check කරන්න
    const todayDoc = await firebaseFirestore
      .collection('attendance')
      .where('userId', '==', userId)
      .where('date', '==', today)
      .get();

    if (!todayDoc.empty) {
      throw new AppError('Already checked in today', 400);
    }

    // Attendance save කරන්න
    const attendanceData = {
      userId,
      userName,
      type: 'CHECK_IN',
      date: today,
      checkInTime: checkInTime.toISOString(),
      latitude,
      longitude,
      status,
      photoURL: photoURL || '',
      note: note || '',
      createdAt: new Date().toISOString(),
    };

    const docRef = await firebaseFirestore
      .collection('attendance')
      .add(attendanceData);

    // Real-time update send කරන්න (WebSocket)
    const io = req.app.get('io');
    io.emit('attendance-update', {
      userId,
      userName,
      type: 'CHECK_IN',
      status,
      timestamp: checkInTime.toISOString(),
    });

    res.json({
      success: true,
      data: { id: docRef.id, ...attendanceData },
      message: 'Check-in successful',
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message, 500);
  }
};

export const checkOut = async (req: AuthRequest, res: Response) => {
  try {
    const { latitude, longitude, note } = req.body;
    const userId = req.user!.uid;
    const userName = req.user!.name;

    // Geo-fence validation
    if (!isInsideGeoFence(latitude, longitude)) {
      throw new AppError('You are outside the office geo-fence', 400);
    }

    const today = new Date().toISOString().split('T')[0];

    // Today's check-in එක හොයන්න
    const todayDoc = await firebaseFirestore
      .collection('attendance')
      .where('userId', '==', userId)
      .where('date', '==', today)
      .where('type', '==', 'CHECK_IN')
      .limit(1)
      .get();

    if (todayDoc.empty) {
      throw new AppError('No check-in found for today', 400);
    }

    const doc = todayDoc.docs[0];
    const data = doc.data();

    if (data.checkOutTime) {
      throw new AppError('Already checked out', 400);
    }

    const checkOutTime = new Date();

    // Update attendance
    await firebaseFirestore.collection('attendance').doc(doc.id).update({
      checkOutTime: checkOutTime.toISOString(),
      checkOutLatitude: latitude,
      checkOutLongitude: longitude,
      note: note || '',
      updatedAt: new Date().toISOString(),
    });

    // Real-time update send කරන්න
    const io = req.app.get('io');
    io.emit('attendance-update', {
      userId,
      userName,
      type: 'CHECK_OUT',
      timestamp: checkOutTime.toISOString(),
    });

    res.json({
      success: true,
      message: 'Check-out successful',
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message, 500);
  }
};

export const getTodayAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.uid;
    const today = new Date().toISOString().split('T')[0];

    const todayDoc = await firebaseFirestore
      .collection('attendance')
      .where('userId', '==', userId)
      .where('date', '==', today)
      .get();

    const items = todayDoc.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: items[0] || null,
    });
  } catch (error: any) {
    throw new AppError(error.message, 500);
  }
};

export const getAttendanceHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.uid;
    const { limit = 10, page = 1 } = req.query;

    const snapshot = await firebaseFirestore
      .collection('attendance')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(Number(limit))
      .get();

    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: {
        items,
        total: items.length,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error: any) {
    throw new AppError(error.message, 500);
  }
};