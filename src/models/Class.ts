import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  name: string;
  maxCapacity: number;
}

const ClassSchema = new Schema<IClass>({
  name: { type: String, required: true, unique: true, trim: true },
  maxCapacity: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Class || mongoose.model<IClass>('Class', ClassSchema);