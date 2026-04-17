import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  // New Field
  rollNo: number;

  // ... (Baaki purani fields same rahengi)
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  studentCnic: string;
  religion: string;
  nationality: string;
  previousSchool: string;
  lastClass: string;
  leavingReason: string;
  studentRemarks: string;
  photoUrl: string;

  parentFirstName: string;
  parentLastName: string;
  parentCnic: string;
  mobileNo: string;
  emergencyContact: string;
  whatsappNo: string;
  address: string;
  relation: string;
  occupation: string;
  monthlyIncome: string;
  reference: string;
  parentRemarks: string;

  joiningDate: string;
  classJoining: string;
  section: string;

  monthlyFee: number;
  feeDate: string;
  transportFee: number;
  admissionFee: number;
  academyFee: number;
  nazraFee: number;
  uniformBooksCharges: number;
  stationaryCharges: number;
  otherCharges: number;
  lateFeeFine: number;

  discount: number;
  totalPayable: number;
  amountPaying: number;
  remainingAmount: number;
}

const StudentSchema = new Schema<IStudent>({
  // New Field Added
  rollNo: { type: Number },

  // ... (Baaki Schema same rahega)
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String },
  dob: { type: String },
  studentCnic: { type: String },
  religion: { type: String },
  nationality: { type: String, default: 'Pakistani' },
  previousSchool: { type: String },
  lastClass: { type: String },
  leavingReason: { type: String },
  studentRemarks: { type: String },
  photoUrl: { type: String },

  parentFirstName: { type: String },
  parentLastName: { type: String },
  parentCnic: { type: String },
  mobileNo: { type: String },
  emergencyContact: { type: String },
  whatsappNo: { type: String },
  address: { type: String },
  relation: { type: String },
  occupation: { type: String },
  monthlyIncome: { type: String },
  reference: { type: String },
  parentRemarks: { type: String },

  joiningDate: { type: String },
  classJoining: { type: String },
  section: { type: String },

  monthlyFee: { type: Number, default: 0 },
  feeDate: { type: String },
  transportFee: { type: Number, default: 0 },
  admissionFee: { type: Number, default: 0 },
  academyFee: { type: Number, default: 0 },
  nazraFee: { type: Number, default: 0 },
  uniformBooksCharges: { type: Number, default: 0 },
  stationaryCharges: { type: Number, default: 0 },
  otherCharges: { type: Number, default: 0 },
  lateFeeFine: { type: Number, default: 0 },

  discount: { type: Number, default: 0 },
  totalPayable: { type: Number, default: 0 },
  amountPaying: { type: Number, default: 0 },
  remainingAmount: { type: Number, default: 0 },

}, { timestamps: true });

// Roll number is unique globally across the entire school.
StudentSchema.index({ rollNo: 1 }, { unique: true });

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
