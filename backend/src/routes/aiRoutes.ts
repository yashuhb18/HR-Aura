import { Router } from 'express';
import { handleCopilotCommand } from '../controllers/aiController.js';
import {
    executeCopilotAutomation,
    getApprovals,
    getWorkflows,
    handleMakeWebhook,
    runPayrollAutomation,
    startOnboardingAutomation
} from '../controllers/automationController.js';

const router = Router();

router.post('/command', handleCopilotCommand);
router.post('/automations/execute', executeCopilotAutomation);
router.post('/automations/payroll/run', runPayrollAutomation);
router.post('/automations/onboarding/start', startOnboardingAutomation);
router.post('/webhooks/make', handleMakeWebhook);
router.get('/workflows', getWorkflows);
router.get('/approvals', getApprovals);

export default router;
