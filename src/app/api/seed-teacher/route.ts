import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        await connectDB();

        // Check if teacher exists
        let user = await User.findOne({ username: 'teacher@gmail.com' });

        if (user) {
            // Update password to be sure
            user.password = await bcrypt.hash('$teacher@786', 10);
            await user.save();
            return NextResponse.json({ success: true, message: "Teacher user exists. Password reset to requested secure password.", user });
        }

        // Create if not exists
        const hashedPassword = await bcrypt.hash('$teacher@786', 10);
        user = await User.create({
            username: 'teacher@gmail.com',
            password: hashedPassword,
            role: 'teacher',
            name: 'Demo Teacher',
            profileImage: 'https://ui-avatars.com/api/?name=Demo+Teacher&background=0D8ABC&color=fff',
            themeColor: '#0D8ABC'
        });

        return NextResponse.json({ success: true, message: "Teacher User Created Successfully", user });

    } catch (error: any) {
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
