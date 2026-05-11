import { Router } from 'express';
import { requestLeave, approveLeave, getLeaveRequests } from '../controllers/leaveController.js';

const router = Router();

router.post('/request', requestLeave);
router.put('/approve/:id', approveLeave);
router.get('/', getLeaveRequests);

export default router;
