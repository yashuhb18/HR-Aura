import mongoose, { Schema, Document } from 'mongoose';

export interface IPayrollRecord extends Document {
    workflowId: mongoose.Types.ObjectId;
    employeeId: mongoose.Types.ObjectId;
    periodStart: Date;
    periodEnd: Date;
    grossSalary: number;
    attendanceDays: number;
    paidLeaveDays: number;
    unpaidLeaveDays: number;
    deductions: {
        tax: number;
        benefits: number;
        unpaidLeave: number;
    };
    netSalary: number;
    aiSummary: string;
    status: 'calculated' | 'approval_pending' | 'approved' | 'paid';
    blockchainHash?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PayrollRecordSchema: Schema = new Schema({
    workflowId: { type: Schema.Types.ObjectId, ref: 'AIWorkflow', required: true },
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    grossSalary: { type: Number, required: true },
    attendanceDays: { type: Number, default: 0 },
    paidLeaveDays: { type: Number, default: 0 },
    unpaidLeaveDays: { type: Number, default: 0 },
    deductions: {
        tax: { type: Number, default: 0 },
        benefits: { type: Number, default: 0 },
        unpaidLeave: { type: Number, default: 0 }
    },
    netSalary: { type: Number, required: true },
    aiSummary: { type: String, required: true },
    status: { type: String, enum: ['calculated', 'approval_pending', 'approved', 'paid'], default: 'approval_pending' },
    blockchainHash: { type: String }
}, { timestamps: true });

export default mongoose.model<IPayrollRecord>('PayrollRecord', PayrollRecordSchema);
