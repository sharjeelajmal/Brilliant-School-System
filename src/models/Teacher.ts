import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacher extends Document {
  // Step 1: Personal
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  photoUrl: string;
  cnic: string;
  mobileNo: string;
  emergencyContact: string;
  address: string;
  maritalStatus: string;
  remarks: string;

  // Future Steps placeholders
  qualification: string;
  experience: string;
  joiningDate: string;
  salary: number;
}

const TeacherSchema = new Schema<ITeacher>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String },
  dob: { type: String },
  photoUrl: { type: String },
  cnic: { type: String },
  mobileNo: { type: String },
  emergencyContact: { type: String },
  address: { type: String },
  maritalStatus: { type: String },
  remarks: { type: String },
  
  // Placeholders
  qualification: { type: String },
  experience: { type: String },
  joiningDate: { type: String },
  salary: { type: Number },
}, { timestamps: true });

export default mongoose.models.Teacher || mongoose.model<ITeacher>('Teacher', TeacherSchema);