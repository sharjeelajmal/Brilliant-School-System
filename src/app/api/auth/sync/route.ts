import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        await connectDB();

        // 1. Delete existing default accounts to avoid unique constraint issues
        await User.deleteMany({ 
            username: { $in: ['admin', 'teacher', 'admin@gmail.com', 'teacher@gmail.com'] } 
        });

        // 2. Hash New Passwords
        const adminHash = await bcrypt.hash('mehboob@dmin326', 10);
        const teacherHash = await bcrypt.hash('$teacher@786', 10);

        // 3. Create New Admin
        await User.create({
            username: 'admin@gmail.com',
            password: adminHash,
            role: 'admin',
            name: 'Ray Mehboob',
            profileImage: 'https://ui-avatars.com/api/?name=Ray+Mehboob&background=B70003&color=fff',
            themeColor: '#B70003'
        });

        // 4. Create New Teacher
        await User.create({
            username: 'teacher@gmail.com',
            password: teacherHash,
            role: 'teacher',
            name: 'Demo Teacher',
            profileImage: 'https://ui-avatars.com/api/?name=Demo+Teacher&background=0D8ABC&color=fff',
            themeColor: '#0D8ABC'
        });

        return NextResponse.json({ 
            success: true, 
            message: "Database Synchronized Successfully! You can now login with new credentials." 
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
