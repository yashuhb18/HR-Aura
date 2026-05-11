import { Request, Response } from 'express';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import LeaveRequest from '../models/LeaveRequest.js';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const totalEmployees = await Employee.countDocuments();
        const activeLeaves = await LeaveRequest.countDocuments({ status: 'approved', endDate: { $gte: new Date() } });
        
        const attendance = await Attendance.find();
        const avgProductivity = attendance.length > 0 
            ? attendance.reduce((acc, curr) => acc + curr.productivityScore, 0) / attendance.length 
            : 0;

        const workforceStats = {
            totalEmployees,
            activeLeaves,
            avgAttendance: '96.2%', // Mocked for hackathon
            avgProductivity: `${avgProductivity.toFixed(1)}%`,
            departments: [
                { name: 'Engineering', count: 45 },
                { name: 'Design', count: 12 },
                { name: 'Growth', count: 8 }
            ]
        };

        res.status(200).json(workforceStats);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
