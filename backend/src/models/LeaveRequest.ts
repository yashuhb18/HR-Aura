import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaveRequest extends Document {
    employeeId: mongoose.Types.ObjectId;
    leaveType: string;
    startDate: Date;
    endDate: Date;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    aiSummary?: string;
    blockchainHash?: string;
    createdAt: Date;
}

const LeaveRequestSchema: Schema = new Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    leaveType: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    aiSummary: { type: String },
    blockchainHash: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ILeaveRequest>('LeaveRequest', LeaveRequestSchema);
