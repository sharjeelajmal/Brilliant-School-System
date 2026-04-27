import mongoose, { Schema, Document } from 'mongoose';

export interface ISyllabus extends Document {
  className: string;
  subject: string;
  round: '1st Round' | '2nd Round' | 'Final Round';
  months: string[];
  topics: string[];
}

const SyllabusSchema = new Schema<ISyllabus>({
  className: { type: String, required: true },
  subject: { type: String, required: true },
  round: { 
    type: String, 
    enum: ['1st Round', '2nd Round', 'Final Round'], 
    required: true 
  },
  months: { type: [String], default: [] },
  topics: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.models.Syllabus || mongoose.model<ISyllabus>('Syllabus', SyllabusSchema);
