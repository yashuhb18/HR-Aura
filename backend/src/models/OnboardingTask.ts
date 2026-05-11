import mongoose, { Schema, Document } from 'mongoose';

export interface IOnboardingTask extends Document {
    employeeId: mongoose.Types.ObjectId;
    taskName: string;
    description: string;
    status: 'pending' | 'completed';
    dueDate: Date;
}

const OnboardingTaskSchema: Schema = new Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    taskName: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    dueDate: { type: Date }
});

export default mongoose.model<IOnboardingTask>('OnboardingTask', OnboardingTaskSchema);
