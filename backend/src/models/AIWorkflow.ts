import mongoose, { Schema, Document } from 'mongoose';

export interface IAIWorkflow extends Document {
    type: 'leave' | 'onboarding' | 'payroll';
    status: 'initiated' | 'processing' | 'completed' | 'failed';
    steps: Array<{
        name: string;
        status: string;
        result?: any;
    }>;
    initiatedBy: mongoose.Types.ObjectId;
    createdAt: Date;
}

const AIWorkflowSchema: Schema = new Schema({
    type: { type: String, enum: ['leave', 'onboarding', 'payroll'], required: true },
    status: { type: String, enum: ['initiated', 'processing', 'completed', 'failed'], default: 'initiated' },
    steps: [{
        name: { type: String, required: true },
        status: { type: String, required: true },
        result: { type: Schema.Types.Mixed }
    }],
    initiatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAIWorkflow>('AIWorkflow', AIWorkflowSchema);
