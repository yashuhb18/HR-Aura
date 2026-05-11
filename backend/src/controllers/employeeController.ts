import { Request, Response } from 'express';
import Employee from '../models/Employee.js';
import User from '../models/User.js';
import { BlockchainService } from '../services/blockchainService.js';
import { AIService } from '../services/aiService.js';
import { AutomationService } from '../services/automationService.js';
import { WorkflowEngine } from '../services/workflowEngine.js';

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
        
        const insights = await AIService.getEmployeeInsights(employee._id.toString());
        
        res.status(200).json({ ...employee.toObject(), insights });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createEmployee = async (req: Request, res: Response) => {
    try {
        const { name, email, department, designation, joiningDate, monthlySalary, bankAccount, taxId } = req.body;
        if (!monthlySalary || monthlySalary <= 0) {
            return res.status(400).json({ message: 'monthlySalary is required for payroll automation' });
        }

        const user = new User({
            name,
            email,
            password: 'password123',
            role: 'employee'
        });
        await user.save();

        const employeeCount = await Employee.countDocuments();
        const employee = new Employee({
            userId: user._id,
            employeeId: `HRA-${String(employeeCount + 1001).padStart(4, '0')}`,
            department,
            designation,
            joiningDate: new Date(joiningDate),
            status: 'onboarding',
            monthlySalary,
            bankAccount,
            taxId
        });

        const hash = await BlockchainService.verifyAction('CREATE_EMPLOYEE', 'Employee', employee._id.toString(), { name, email, department });
        employee.blockchainStatus = hash;

        await employee.save();

        // Trigger External Automation (Make.com)
        await AutomationService.triggerEvent('NEW_EMPLOYEE_ONBOARDED', {
            id: employee._id,
            employeeId: employee.employeeId,
            name,
            email,
            dept: department,
            role: designation
        });

        let onboardingAutomation = null;
        try {
            onboardingAutomation = await WorkflowEngine.runOnboardingWorkflow(employee._id.toString());
        } catch (automationError) {
            console.warn('Employee created, but onboarding automation failed:', (automationError as Error).message);
        }

        res.status(201).json({ employee, onboardingAutomation });
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};
