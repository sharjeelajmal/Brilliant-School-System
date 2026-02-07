import mongoose, { Schema, Document } from 'mongoose';

export interface ISection extends Document {
  name: string;
  className: string; // Linked Class Name
  teacherId: string; // Linked Teacher
}

const SectionSchema = new Schema<ISection>({
  name: { type: String, required: true },
  className: { type: String, required: true },
  teacherId: { type: String, required: false }, // Teacher baad ma assign ho sakta ha
}, { timestamps: true });

export default mongoose.models.Section || mongoose.model<ISection>('Section', SectionSchema);