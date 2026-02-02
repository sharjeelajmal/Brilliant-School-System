import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Student from '@/models/Student';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newStudent = await Student.create(body);

    return NextResponse.json({ 
      success: true, 
      message: 'Student Registered Successfully!', 
      data: newStudent 
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: 'Registration Failed', 
      error: error.message 
    }, { status: 500 });
  }
}