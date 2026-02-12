import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  name: string;
  fees: number;
  subjects: string[];
}

const ClassSchema = new Schema<IClass>({
  name: { type: String, required: true },
  fees: { type: Number, required: true },
  // Ensure this field exists
  subjects: { 
    type: [String], 
    default: [] 
  } 
}, { timestamps: true });

// Check if model exists, otherwise create new
const Class = mongoose.models.Class || mongoose.model<IClass>('Class', ClassSchema);

export default Class;