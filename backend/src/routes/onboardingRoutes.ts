import { Router } from 'express';
import { initiateOnboarding, updateTaskStatus, getEmployeeOnboarding } from '../controllers/onboardingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/initiate', protect, authorize('admin', 'hr'), initiateOnboarding);
router.put('/task', protect, updateTaskStatus);
router.get('/:employeeId', protect, getEmployeeOnboarding);

export default router;
