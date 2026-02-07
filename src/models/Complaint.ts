import mongoose, { Schema, Document } from 'mongoose';

export interface IComplaint extends Document {
  studentId: string;
  studentName: string;
  rollNo: string;
  className: string;
  section: string;
  date: string;
  title: string;
  description: string;
  teacherName?: string;
  status: string; // 'Pending', 'Resolved'
  createdAt: Date;
}

const ComplaintSchema = new Schema<IComplaint>({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  rollNo: { type: String, default: '-' },
  className: { type: String, required: true },
  section: { type: String, required: true },
  date: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  teacherName: { type: String },
  status: { type: String, default: 'Pending' },
}, { timestamps: true });

export default mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema);