import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  studentId: string;
  date: string; // YYYY-MM-DD
  status: string; // 'present', 'absent', 'leave'
  class: string;
  section: string;
}

const AttendanceSchema = new Schema<IAttendance>({
  studentId: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, required: true },
  class: { type: String },
  section: { type: String }
}, { timestamps: true });

// Ek student ki ek din ki attendance duplicate na ho
AttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

export default mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);