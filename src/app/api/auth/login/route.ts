import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { username, password } = await req.json();

        // 1. Auto-Seed Logic: If no users, create default admin
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            await User.create({
                username: 'admin',
                password: '12345', // In production, hash this!
                role: 'admin',
                name: 'Super Admin',
                profileImage: 'https://ui-avatars.com/api/?name=Super+Admin&background=B70003&color=fff'
            });
            console.log("Default Admin Seeded");
        }

        // 2. Find User
        const user = await User.findOne({ username });

        if (!user || user.password !== password) {
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
