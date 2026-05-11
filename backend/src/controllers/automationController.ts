import { Request, Response } from 'express';
import AIWorkflow from '../models/AIWorkflow.js';
import Approval from '../models/Approval.js';
import { WorkflowRouter } from '../services/workflowRouter.js';
import { WorkflowEngine } from '../services/workflowEngine.js';
import { RealtimeNotificationService } from '../services/realtimeNotificationService.js';

export const executeCopilotAutomation = async (req: Request, res: Response) => {
    try {
        const { command, context = {} } = req.body;
        if (!command) return res.status(400).json({ message: 'Command is required' });

        const result = await WorkflowRouter.route(command, context);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const runPayrollAutomation = async (req: Request, res: Response) => {
    try {
        const result = await WorkflowEngine.runPayrollAutomation(req.body?.userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const startOnboardingAutomation = async (req: Request, res: Response) => {
    try {
        const { employeeId, userId } = req.body;
        if (!employeeId) return res.status(400).json({ message: 'employeeId is required' });

        const result = await WorkflowEngine.runOnboardingWorkflow(employeeId, userId);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getWorkflows = async (_req: Request, res: Response) => {
    try {
        const workflows = await AIWorkflow.find().sort({ createdAt: -1 }).limit(50);
        res.status(200).json(workflows);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getApprovals = async (_req: Request, res: Response) => {
    try {
        const approvals = await Approval.find().sort({ createdAt: -1 }).limit(50);
        res.status(200).json(approvals);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const handleMakeWebhook = async (req: Request, res: Response) => {
    try {
        const event = req.body;
        await RealtimeNotificationService.publishWorkflowEvent({
            workflowId: event.workflowId || 'external',
            type: event.type || event.event || 'make_webhook',
            status: event.status || 'received',
            message: event.message || 'Make.com workflow callback received',
            payload: event
        });

        res.status(202).json({ received: true });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
