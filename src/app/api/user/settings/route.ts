import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const username = searchParams.get('username');

        if (!username) return NextResponse.json({ success: false, message: 'Username required' }, { status: 400 });

        const user = await User.findOne({ username }).select('-password');
        if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

        return NextResponse.json({ success: true, data: user });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { username, ...updates } = body;

        if (!username) return NextResponse.json({ success: false, message: 'Username required' }, { status: 400 });

        const user = await User.findOneAndUpdate(
            { username },
            { $set: updates },
            { new: true }
        ).select('-password');

        return NextResponse.json({ success: true, message: 'Settings updated successfully', data: user });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
