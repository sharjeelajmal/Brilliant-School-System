import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { username, password } = await req.json();

        // 1. Auto-Seed Logic: If no users, create default admin
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            const hashedPassword = await bcrypt.hash('mehboob@dmin326', 10);
            await User.create({
                username: 'admin@gmail.com',
                password: hashedPassword,
                role: 'admin',
                name: 'Ray Mehboob',
                profileImage: 'https://ui-avatars.com/api/?name=Ray+Mehboob&background=B70003&color=fff'
            });
            console.log("Default Admin Seeded");
        }

        // 2. Find User
        const user = await User.findOne({ username });

        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }

        // 3. Return Success with User Data (Frontend handles cookies/redirection)
        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                name: user.name,
                profileImage: user.profileImage,
                themeColor: user.themeColor
            }
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
