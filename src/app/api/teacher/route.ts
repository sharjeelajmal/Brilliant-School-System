import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Teacher from '@/models/Teacher';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Check duplication via CNIC
    const existing = await Teacher.findOne({ cnic: body.cnic });
    if (existing) {
      return NextResponse.json({ error: "Teacher with this CNIC already exists." }, { status: 400 });
    }

    const newTeacher = await Teacher.create(body);
    return NextResponse.json({ message: "Teacher Hired Successfully!", data: newTeacher }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Failed to save teacher." }, { status: 500 });
  }
}