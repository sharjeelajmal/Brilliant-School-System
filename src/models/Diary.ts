import mongoose, { Schema, Document } from 'mongoose';

export interface IDiaryEntry {
    subjectName: string;
    homework: string;
    classwork: string;
    notes: string;
}

export interface IDiary extends Document {
    date: string;
    className: string;
    section: string;
    teacherName: string;
    teacherId: string;
    entries: IDiaryEntry[];
}

const DiaryEntrySchema = new Schema<IDiaryEntry>({
    subjectName: { type: String, required: true },
    homework: { type: String, default: '' },
    classwork: { type: String, default: '' },
    notes: { type: String, default: '' },
}, { _id: false });

const DiarySchema = new Schema<IDiary>({
    date: { type: String, required: true },
    className: { type: String, required: true },
    section: { type: String, required: true },
    teacherName: { type: String, default: '' },
    teacherId: { type: String, default: '' },
    entries: { type: [DiaryEntrySchema], default: [] },
}, { timestamps: true });

// Ek date pe ek class-section ki sirf ek diary honi chahiye
DiarySchema.index({ date: 1, className: 1, section: 1 }, { unique: true });

export default mongoose.models.Diary || mongoose.model<IDiary>('Diary', DiarySchema);
