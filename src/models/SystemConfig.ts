import mongoose from 'mongoose';

const SystemConfigSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'software_status'
  },
  isSoftwareActive: {
    type: Boolean,
    required: true,
    default: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.SystemConfig || mongoose.model('SystemConfig', SystemConfigSchema);
