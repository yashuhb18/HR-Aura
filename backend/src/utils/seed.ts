import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import LeaveRequest from '../models/LeaveRequest.js';
import OnboardingTask from '../models/OnboardingTask.js';
import AIWorkflow from '../models/AIWorkflow.js';
import Approval from '../models/Approval.js';
import PayrollRecord from '../models/PayrollRecord.js';
import BlockchainLog from '../models/BlockchainLog.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hraura');
        
        // Clear existing data
        await User.deleteMany({});
        await Employee.deleteMany({});
        await Attendance.deleteMany({});
        await LeaveRequest.deleteMany({});
        await OnboardingTask.deleteMany({});
        await AIWorkflow.deleteMany({});
        await Approval.deleteMany({});
        await PayrollRecord.deleteMany({});
        await BlockchainLog.deleteMany({});

        console.log('Seeding data...');

        // Create Admin
        const adminUser = new User({
            name: 'HR Admin',
            email: 'admin@hraura.ai',
            password: 'password123',
            role: 'admin'
        });
        await adminUser.save();

        // Create Employees
        const employeeData = [
            { id: 'HRA-1001', name: 'Alex Rivera', email: 'alex@hraura.ai', dept: 'Design', role: 'Sr. Product Designer', salary: 185000, score: 91, risk: 18 },
            { id: 'HRA-1002', name: 'Sarah Chen', email: 'sarah@hraura.ai', dept: 'Engineering', role: 'Full Stack Engineer', salary: 225000, score: 94, risk: 12 },
            { id: 'HRA-1003', name: 'Marcus Wright', email: 'marcus@hraura.ai', dept: 'Operations', role: 'HR Specialist', salary: 145000, score: 86, risk: 24 }
        ];

        for (const data of employeeData) {
            const user = new User({
                name: data.name,
                email: data.email,
                password: 'password123',
                role: 'employee'
            });
            await user.save();

            const employee = new Employee({
                userId: user._id,
                employeeId: data.id,
                department: data.dept,
                designation: data.role,
                joiningDate: new Date(),
                status: 'active',
                performanceScore: data.score,
                burnoutRisk: data.risk,
                monthlySalary: data.salary,
                bankAccount: `HRABANK${data.id.replace('HRA-', '')}`,
                taxId: `TAX-${data.id}`
            });
            await employee.save();

            // Create some attendance logs
            for (let i = 0; i < 5; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const attendance = new Attendance({
                    employeeId: employee._id,
                    date: date,
                    checkIn: new Date(date.setHours(9, 0, 0)),
                    checkOut: new Date(date.setHours(18, 0, 0)),
                    status: 'present',
                    productivityScore: data.score
                });
                await attendance.save();
            }
        }

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
