import mongoose, { Schema, Document } from 'mongoose';

export interface IPayroll extends Document {
    teacherId: string;
    teacherName: string;
    className: string;
    section: string;
    month: string;
    year: number;
    baseSalary: number;
    allowance: number;
    lateFine: number;
    absentFine: number;
    leavingFine: number;
    otherDeduction: number;
    totalSalary: number;
    totalDeductions: number;
    netSalary: number;
    givenAmount: number;
    status: 'Paid' | 'Unpaid' | 'Partial Paid';
    paymentDate: string;
    notes: string;
}

const PayrollSchema = new Schema<IPayroll>({
    teacherId: { type: String, required: true },
    teacherName: { type: String, required: true },
    className: { type: String, default: '' },
    section: { type: String, default: '' },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    baseSalary: { type: Number, default: 0 },
    allowance: { type: Number, default: 0 },
    lateFine: { type: Number, default: 0 },
    absentFine: { type: Number, default: 0 },
    leavingFine: { type: Number, default: 0 },
    otherDeduction: { type: Number, default: 0 },
    totalSalary: { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 },
    netSalary: { type: Number, default: 0 },
    givenAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['Paid', 'Unpaid', 'Partial Paid'], default: 'Unpaid' },
    paymentDate: { type: String, default: '' },
    notes: { type: String, default: '' },
}, { timestamps: true });

// Ek teacher ka ek month mein sirf ek payroll
PayrollSchema.index({ teacherId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.models.Payroll || mongoose.model<IPayroll>('Payroll', PayrollSchema);
