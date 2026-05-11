import { Router } from 'express';
import { handleCopilotCommand } from '../controllers/aiController.js';

const router = Router();

router.post('/command', handleCopilotCommand);

export default router;
