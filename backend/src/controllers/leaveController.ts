import { Request, Response } from 'express';
import LeaveRequest from '../models/LeaveRequest.js';
import { BlockchainService } from '../services/blockchainService.js';
import { WorkflowEngine } from '../services/workflowEngine.js';
import { AutomationService } from '../services/automationService.js';

export const requestLeave = async (req: Request, res: Response) => {
    try {
        const { employeeId, leaveType, startDate, endDate, reason, userId } = req.body;

        const result = await WorkflowEngine.runLeaveAutomation({
            intent: 'apply_leave',
            confidence: 1,
            entities: { employeeId, leaveType, startDate, endDate, reason }
        }, userId);

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const approveLeave = async (req: Request, res: Response) => {
    try {
        const leaveRequest = await LeaveRequest.findById(req.params.id);
        if (!leaveRequest) return res.status(404).json({ message: 'Leave request not found' });

        leaveRequest.status = 'approved';

        // Log to blockchain
        const hash = await BlockchainService.verifyAction('APPROVE_LEAVE', 'LeaveRequest', leaveRequest._id.toString(), { status: 'approved' });
        leaveRequest.blockchainHash = hash;

        await leaveRequest.save();

        // Trigger Automation
        await AutomationService.triggerEvent('LEAVE_APPROVED', {
            id: leaveRequest._id,
            employee: leaveRequest.employeeId,
            type: leaveRequest.leaveType,
            dates: `${leaveRequest.startDate} to ${leaveRequest.endDate}`
        });

        res.status(200).json(leaveRequest);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const getLeaveRequests = async (req: Request, res: Response) => {
    try {
        const requests = await LeaveRequest.find().populate({
            path: 'employeeId',
            populate: { path: 'userId', select: 'name email' }
        });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
