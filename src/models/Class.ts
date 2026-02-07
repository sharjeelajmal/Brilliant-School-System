import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  name: string;
  // maxCapacity yahan se hata diya gaya hai
}

const ClassSchema = new Schema<IClass>({
  name: { 
    type: String, 
    required: [true, "Class name is required"], 
    unique: true,
    trim: true
  }
  // Yahan maxCapacity ki koi line nahi honi chahiye
}, { timestamps: true });

// Ye line check karein, ye purana model cache use hone se rokne ke liye zaroori hai
export default mongoose.models.Class || mongoose.model<IClass>('Class', ClassSchema);