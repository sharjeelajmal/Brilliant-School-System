import mongoose, { Schema, Document } from 'mongoose';

export interface ISrNoCounter extends Document {
  _id: any;
  seq: number;
}

const SrNoCounterSchema = new Schema<ISrNoCounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export default mongoose.models.SrNoCounter ||
  mongoose.model<ISrNoCounter>('SrNoCounter', SrNoCounterSchema);
