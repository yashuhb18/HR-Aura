import { Request, Response } from 'express';
import { AIService } from '../services/aiService.js';

export const handleCopilotCommand = async (req: Request, res: Response) => {
    try {
        const { command } = req.body;
        if (!command) return res.status(400).json({ message: 'Command is required' });

        const result = await AIService.processCopilotCommand(command);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
