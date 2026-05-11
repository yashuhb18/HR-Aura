import { Router } from 'express';
import { checkIn, checkOut, getAttendanceStats } from '../controllers/attendanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/check-in', protect, checkIn);
router.post('/check-out', protect, checkOut);
router.get('/stats', protect, getAttendanceStats);

export default router;
