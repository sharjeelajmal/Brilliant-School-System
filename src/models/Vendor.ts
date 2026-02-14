import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
    name: string;
    contactPerson: string;
    type: string;
    contactNo: string;
    outstandingAmount: number;
    address: string;
    status: string;
    // New Fields
    emergencyContact?: string;
    mobileNo?: string;
    itemsSupply?: string;
    bankName?: string;
    accountNo?: string;
    accountTitle?: string;
}

const VendorSchema = new Schema<IVendor>({
    name: { type: String, required: true },
    contactPerson: { type: String },
    type: { type: String, default: 'Other' }, // Stationary, Furniture, etc.
    contactNo: { type: String },
    outstandingAmount: { type: Number, default: 0 },
    address: { type: String },
    status: { type: String, default: 'Active', enum: ['Active', 'Inactive'] },
    // New Fields
    emergencyContact: { type: String },
    mobileNo: { type: String },
    itemsSupply: { type: String },
    bankName: { type: String },
    accountNo: { type: String },
    accountTitle: { type: String },
}, { timestamps: true });

export default mongoose.models.Vendor || mongoose.model<IVendor>('Vendor', VendorSchema);
