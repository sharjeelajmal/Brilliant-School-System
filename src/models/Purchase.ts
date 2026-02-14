import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchase extends Document {
    vendorId: mongoose.Schema.Types.ObjectId;
    items: {
        description: string;
        quantity: number;
        rate: number;
        total: number;
    }[];
    totalAmount: number;
    paidAmount: number;
    balance: number;
    date: string;
    notes?: string;
}

const PurchaseSchema = new Schema<IPurchase>({
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    items: [{
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        rate: { type: Number, required: true },
        total: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    date: { type: String, required: true }, // Storing as String (YYYY-MM-DD or readable format) for simplicity, or Date
    notes: { type: String }
}, { timestamps: true });

export default mongoose.models.Purchase || mongoose.model<IPurchase>('Purchase', PurchaseSchema);
