import { Request, Response } from 'express';
import { WorkflowRouter } from '../services/workflowRouter.js';

export const handleCopilotCommand = async (req: Request, res: Response) => {
    try {
        const { command, context = {} } = req.body;
        if (!command) return res.status(400).json({ message: 'Command is required' });

        const result = await WorkflowRouter.route(command, context);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
