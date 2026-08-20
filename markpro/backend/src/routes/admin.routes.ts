import { Router } from 'express';
import { getAllUsers, updateUserRole, getAttendanceStats } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/users', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), getAllUsers);
router.put('/users/role', authenticate, authorize('SUPER_ADMIN'), updateUserRole);
router.get('/stats', authenticate, authorize('ADMIN', 'MANAGER'), getAttendanceStats);

export default router;