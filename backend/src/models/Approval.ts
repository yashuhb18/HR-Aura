import mongoose, { Schema, Document } from 'mongoose';

export interface IApproval extends Document {
    workflowId?: mongoose.Types.ObjectId;
    entityType: 'leave_request' | 'onboarding' | 'payroll';
    entityId: mongoose.Types.ObjectId | string;
    requestedBy?: mongoose.Types.ObjectId;
    approverRole: 'manager' | 'hr' | 'admin';
    status: 'pending' | 'approved' | 'rejected';
    aiSummary?: string;
    makeScenarioId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ApprovalSchema: Schema = new Schema({
    workflowId: { type: Schema.Types.ObjectId, ref: 'AIWorkflow' },
    entityType: { type: String, enum: ['leave_request', 'onboarding', 'payroll'], required: true },
    entityId: { type: Schema.Types.Mixed, required: true },
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approverRole: { type: String, enum: ['manager', 'hr', 'admin'], default: 'manager' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    aiSummary: { type: String },
    makeScenarioId: { type: String }
}, { timestamps: true });

export default mongoose.model<IApproval>('Approval', ApprovalSchema);
