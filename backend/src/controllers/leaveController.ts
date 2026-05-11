import { Request, Response } from 'express';
import LeaveRequest from '../models/LeaveRequest.js';
import Employee from '../models/Employee.js';
import { BlockchainService } from '../services/blockchainService.js';
import { AIService } from '../services/aiService.js';

export const requestLeave = async (req: Request, res: Response) => {
    try {
        const { employeeId, leaveType, startDate, endDate, reason } = req.body;

        const employee = await Employee.findById(employeeId).populate('userId');
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        // Generate AI Summary
        const aiSummary = await AIService.generateLeaveSummary(
            (employee.userId as any).name,
            leaveType,
            new Date(startDate),
            new Date(endDate),
            reason
        );

        const leaveRequest = new LeaveRequest({
            employeeId,
            leaveType,
            startDate,
            endDate,
            reason,
            aiSummary,
            status: 'pending'
        });

        await leaveRequest.save();
        res.status(201).json(leaveRequest);
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
        const hash = await BlockchainService.verifyAction('APPROVE_LEAVE', 'LeaveRequest', leaveRequest._id as string, { status: 'approved' });
        leaveRequest.blockchainHash = hash;

        await leaveRequest.save();
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
