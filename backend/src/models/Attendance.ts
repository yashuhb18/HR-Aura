import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
    employeeId: mongoose.Types.ObjectId;
    date: Date;
    checkIn: Date;
    checkOut?: Date;
    status: 'present' | 'absent' | 'late' | 'half-day';
    productivityScore: number;
}

const AttendanceSchema: Schema = new Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: Date, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date },
    status: { type: String, enum: ['present', 'absent', 'late', 'half-day'], default: 'present' },
    productivityScore: { type: Number, default: 0 }
});

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
