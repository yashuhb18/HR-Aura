import { Request, Response } from 'express';
import OnboardingTask from '../models/OnboardingTask.js';
import Employee from '../models/Employee.js';
import { AIService } from '../services/aiService.js';
import { BlockchainService } from '../services/blockchainService.js';
import { WorkflowEngine } from '../services/workflowEngine.js';

export const initiateOnboarding = async (req: Request, res: Response) => {
    try {
        const { employeeId, userId } = req.body;
        const result = await WorkflowEngine.runOnboardingWorkflow(employeeId, userId);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
    try {
        const { taskId, status } = req.body;
        const task = await OnboardingTask.findByIdAndUpdate(taskId, { status }, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (status === 'completed') {
            await BlockchainService.verifyAction('COMPLETE_ONBOARDING_TASK', 'OnboardingTask', taskId, { taskName: task.taskName });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getEmployeeOnboarding = async (req: Request, res: Response) => {
    try {
        const tasks = await OnboardingTask.find({ employeeId: req.params.employeeId });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
