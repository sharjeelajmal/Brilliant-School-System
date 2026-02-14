import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacher extends Document {
  // Personal
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  cnic: string;
  mobileNo: string;
  emergencyContact: string;
  address: string;
  maritalStatus: string;
  remarks: string;
  photoUrl: string;

  // Qualification
  degree: string;
  majorSubject: string;
  institute: string;
  completionYear: string;
  cgpa: string;
  totalExperience: string;
  lastInstitute: string;
  lastDesignation: string;
  subjectsTaught: string;
  classLevels: string;
  jobStartDate: string;
  jobEndDate: string;
  reasonLeaving: string;

  // Enrollment
  joiningDate: string;
  designation: string;
  assignedClass: string;
  assignedSection: string;
  schoolInTime: string;
  schoolOutTime: string;

  // Payroll
  monthlySalary: number;
  salaryDate: string;
  allowance: number;
  leavingFine: number;
  lateFine: number;
  absentFine: number;
  securityDeposit: number;
  salaryIncrement: number; // RENAMED FROM 'increment'
  paymentMethod: string;

  // Bank
  bankName: string;
  accountTitle: string;
  accountNo: string;

  // Status
  status: string;
}

const TeacherSchema = new Schema<ITeacher>({
  // Personal
  firstName: { type: String },
  lastName: { type: String },
  gender: { type: String },
  dob: { type: String },
  cnic: { type: String },
  mobileNo: { type: String },
  emergencyContact: { type: String },
  address: { type: String },
  maritalStatus: { type: String },
  remarks: { type: String },
  photoUrl: { type: String },

  // Qualification
  degree: { type: String },
  majorSubject: { type: String },
  institute: { type: String },
  completionYear: { type: String },
  cgpa: { type: String },
  totalExperience: { type: String },
  lastInstitute: { type: String },
  lastDesignation: { type: String },
  subjectsTaught: { type: String },
  classLevels: { type: String },
  jobStartDate: { type: String },
  jobEndDate: { type: String },
  reasonLeaving: { type: String },

  // Enrollment
  joiningDate: { type: String },
  designation: { type: String },
  assignedClass: { type: String },
  assignedSection: { type: String },
  schoolInTime: { type: String },
  schoolOutTime: { type: String },

  // Payroll
  monthlySalary: { type: Number, default: 0 },
  salaryDate: { type: String },
  allowance: { type: Number, default: 0 },
  leavingFine: { type: Number, default: 0 },
  lateFine: { type: Number, default: 0 },
  absentFine: { type: Number, default: 0 },
  securityDeposit: { type: Number, default: 0 },
  salaryIncrement: { type: Number, default: 0 }, // RENAMED
  paymentMethod: { type: String },

  // Bank
  bankName: { type: String },
  accountTitle: { type: String },
  accountNo: { type: String },

  // Status (Active, Left, Fired)
  status: { type: String, default: 'Active' },

}, { timestamps: true });

export default mongoose.models.Teacher || mongoose.model<ITeacher>('Teacher', TeacherSchema);