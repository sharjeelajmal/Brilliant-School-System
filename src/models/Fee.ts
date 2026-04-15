import mongoose from 'mongoose';

const FeeSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    studentName: { type: String, required: true },
    parentCnic: { type: String, required: true },
    feeType: {
        type: String,
        enum: ['Monthly Fee', 'Admission Fee', 'Exam Fee', 'Transport Fee', 'Other'],
        default: 'Monthly Fee',
    },
    amount: { type: Number, required: true },
    month: { type: String }, // e.g., "October"
    year: { type: Number },
    status: {
        type: String,
        enum: ['Paid', 'Pending', 'Late'],
        default: 'Paid',
    },
    date: { type: Date, default: Date.now },
    lateFine: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Fee || mongoose.model('Fee', FeeSchema);
