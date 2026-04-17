import mongoose, { Schema, Document } from 'mongoose';

export interface IDeletedStudent extends Document {
  srNo: number;
  firstName: string;
  lastName: string;
  fatherName: string;
  dob: string;
  gender: string;
  admissionDate: string;
  endingDate: string;
  admissionClass: string;
  endingClass: string;
  reason: string;
  // Extra preserved fields
  mobileNo: string;
  address: string;
  section: string;
  studentCnic: string;
}

const DeletedStudentSchema = new Schema<IDeletedStudent>({
  srNo: { type: Number },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fatherName: { type: String },
  dob: { type: String },
  gender: { type: String },
  admissionDate: { type: String },   // joiningDate from Student
  endingDate: { type: String },      // Date when deleted
  admissionClass: { type: String },  // classJoining from Student
  endingClass: { type: String },     // classJoining at time of deletion (same unless edited)
  reason: { type: String, required: true },
  mobileNo: { type: String },
}, { timestamps: true });

DeletedStudentSchema.index({ srNo: 1 }, { unique: true });

export default mongoose.models.DeletedStudent ||
  mongoose.model<IDeletedStudent>('DeletedStudent', DeletedStudentSchema);
