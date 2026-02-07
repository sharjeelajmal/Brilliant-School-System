import mongoose, { Schema, Document } from 'mongoose';

export interface ITestReport extends Document {
  studentId: string;
  date: string;
  testType: string;
  subject: string;
  totalMarks: number;
  passingMarks: number;
  obtainedMarks: number;
  class: string;
  section: string;
}

const TestReportSchema = new Schema<ITestReport>({
  studentId: { type: String, required: true },
  date: { type: String, required: true },
  testType: { type: String, required: true },
  subject: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  passingMarks: { type: Number, required: true },
  obtainedMarks: { type: Number, default: 0 },
  class: { type: String },
  section: { type: String }
}, { timestamps: true });

// Ek student ka same subject aur same date ka test duplicate na ho
TestReportSchema.index({ studentId: 1, date: 1, subject: 1 }, { unique: true });

export default mongoose.models.TestReport || mongoose.model<ITestReport>('TestReport', TestReportSchema);