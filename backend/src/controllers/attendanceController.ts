import { Request, Response } from 'express';
import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';
import { BlockchainService } from '../services/blockchainService.js';
import { AutomationService } from '../services/automationService.js';

export const checkIn = async (req: Request, res: Response) => {
    try {
        const { employeeId } = req.body;
        const employee = await Employee.findById(employeeId);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existing = await Attendance.findOne({ employeeId, date: today });
        if (existing) return res.status(400).json({ message: 'Already checked in today' });

        const attendance = new Attendance({
            employeeId,
            date: today,
            checkIn: new Date(),
            status: 'present'
        });

        const hash = await BlockchainService.verifyAction('CHECK_IN', 'Attendance', attendance._id.toString(), { employeeId, time: attendance.checkIn });
        
        await attendance.save();

        // Trigger Automation
        await AutomationService.triggerEvent('CHECK_IN', {
            id: attendance._id,
            employeeId: employee.employeeId,
            name: employee.userId, // This will be the ID, populate if needed but for demo this is fine
            time: attendance.checkIn
        });

        res.status(201).json({ attendance, hash });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const checkOut = async (req: Request, res: Response) => {
    try {
        const { attendanceId } = req.body;
        const attendance = await Attendance.findById(attendanceId);
        if (!attendance) return res.status(404).json({ message: 'Attendance record not found' });

        attendance.checkOut = new Date();
        
        const durationHours = (attendance.checkOut.getTime() - attendance.checkIn.getTime()) / (1000 * 60 * 60);
        attendance.productivityScore = Math.min(Math.floor(durationHours * 10), 100);

        await attendance.save();
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getAttendanceStats = async (req: Request, res: Response) => {
    try {
        const stats = await Attendance.find().populate({
            path: 'employeeId',
            populate: { path: 'userId', select: 'name' }
        });
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
