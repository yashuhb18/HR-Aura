import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hraura');
        
        // Clear existing data
        await User.deleteMany({});
        await Employee.deleteMany({});
        await Attendance.deleteMany({});

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
            { name: 'Alex Rivera', email: 'alex@hraura.ai', dept: 'Design', role: 'Sr. Product Designer' },
            { name: 'Sarah Chen', email: 'sarah@hraura.ai', dept: 'Engineering', role: 'Full Stack Engineer' },
            { name: 'Marcus Wright', email: 'marcus@hraura.ai', dept: 'Operations', role: 'HR Specialist' }
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
                employeeId: `HRA-${Math.floor(Math.random() * 9000) + 1000}`,
                department: data.dept,
                designation: data.role,
                joiningDate: new Date(),
                status: 'active',
                performanceScore: Math.floor(Math.random() * 20) + 80,
                burnoutRisk: Math.floor(Math.random() * 40)
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
                    productivityScore: Math.floor(Math.random() * 30) + 70
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
