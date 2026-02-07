import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Student from '@/models/Student';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const className = searchParams.get('class');
    const sectionName = searchParams.get('section');
    const id = searchParams.get('id'); // NEW: ID Support

    // 1. Fetch Single Student by ID
    if (id) {
        const student = await Student.findById(id);
        if (!student) {
            return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: student }, { status: 200 });
    }

    // 2. Fetch List (Filter by Class/Section)
    let query: any = {};
    if (className) query.classJoining = className;
    if (sectionName) query.section = sectionName;

    const students = await Student.find(query);
    return NextResponse.json({ success: true, data: students }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}