import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
    userId: mongoose.Types.ObjectId;
    employeeId: string;
    department: string;
    designation: string;
    joiningDate: Date;
    status: 'active' | 'onboarding' | 'terminated';
    performanceScore: number;
    burnoutRisk: number; // 0 to 100
    blockchainStatus: string; // Hash of verification
    profileImage?: string;
    monthlySalary: number;
    bankAccount?: string;
    taxId?: string;
}

const EmployeeSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    employeeId: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    joiningDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'onboarding', 'terminated'], default: 'onboarding' },
    performanceScore: { type: Number, default: 0 },
    burnoutRisk: { type: Number, default: 0 },
    blockchainStatus: { type: String },
    profileImage: { type: String },
    monthlySalary: { type: Number, default: 0 },
    bankAccount: { type: String },
    taxId: { type: String }
});

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);
