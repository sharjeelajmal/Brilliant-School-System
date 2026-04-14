import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    password?: string; // Stored as bcrypt hash
    role: string;
    name: string;
    profileImage: string;
    themeColor: string;
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    name: { type: String, default: 'Admin User' },
    profileImage: { type: String, default: '' },
    themeColor: { type: String, default: '#B70003' },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
