import { Router } from 'express';
import {
  checkIn,
  checkOut,
  getTodayAttendance,
  getAttendanceHistory,
} from '../controllers/attendance.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/check-in', authenticate, checkIn);
router.post('/check-out', authenticate, checkOut);
router.get('/today', authenticate, getTodayAttendance);
router.get('/history', authenticate, getAttendanceHistory);

export default router;