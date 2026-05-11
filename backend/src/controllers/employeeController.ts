import { Request, Response } from 'express';
import Employee from '../models/Employee.js';
import User from '../models/User.js';
import { BlockchainService } from '../services/blockchainService.js';
import { AIService } from '../services/aiService.js';

export const getEmployees = async (req: Request, res: Response) => {
    try {
        const employees = await Employee.find().populate('userId', 'name email');
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getEmployeeById = async (req: Request, res: Response) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('userId', 'name email');
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        
        // Enrich with AI insights for the demo
        const insights = await AIService.getEmployeeInsights(employee._id as string);
        
        res.status(200).json({ ...employee.toObject(), insights });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createEmployee = async (req: Request, res: Response) => {
    try {
        const { name, email, department, designation, joiningDate } = req.body;

        // Create a user first
        const user = new User({
            name,
            email,
            password: 'password123', // Default for demo
            role: 'employee'
        });
        await user.save();

        const employee = new Employee({
            userId: user._id,
            employeeId: `HRA-${Math.floor(Math.random() * 9000) + 1000}`,
            department,
            designation,
            joiningDate: new Date(joiningDate),
            status: 'onboarding'
        });

        // Verify creation on blockchain
        const hash = await BlockchainService.verifyAction('CREATE_EMPLOYEE', 'Employee', employee._id as string, { name, email, department });
        employee.blockchainStatus = hash;

        await employee.save();
        res.status(201).json(employee);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};
