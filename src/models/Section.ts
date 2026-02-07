import mongoose, { Schema, Document } from 'mongoose';

export interface ISection extends Document {
  name: string;
  className: string;
  teacherId?: string;
  maxCapacity: number; // ADDED THIS
}

const SectionSchema = new Schema<ISection>({
  name: { type: String, required: true },
  className: { type: String, required: true },
  teacherId: { type: String },
  maxCapacity: { type: Number, default: 40, required: true } // ADDED THIS
}, { timestamps: true });

export default mongoose.models.Section || mongoose.model<ISection>('Section', SectionSchema);