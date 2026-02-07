import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Section from '@/models/Section';
import Teacher from '@/models/Teacher'; // Teacher model import kiya

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const className = searchParams.get('class');

    let query = {};
    if (className) {
        query = { className: className };
    }

    const sections = await Section.find(query);
    return NextResponse.json({ success: true, data: sections }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sections" }, { status: 500 });
  }
}

// NEW: POST Method to Save Section
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, className, teacherId, maxCapacity } = body;

    // 1. Check duplicate section in same class
    const existing = await Section.findOne({ name, className });
    if (existing) {
      return NextResponse.json({ error: "Section already exists in this class!" }, { status: 400 });
    }

    // 2. Create Section
    const newSection = await Section.create({
      name,
      className,
      teacherId,
      // maxCapacity (agar model ma add krna ha to schema update krna parega, filhal ignore krte han)
    });

    // 3. Update Teacher Profile (Link Class/Section to Teacher)
    if (teacherId) {
      await Teacher.findByIdAndUpdate(teacherId, {
        assignedClass: className,
        assignedSection: name
      });
    }

    return NextResponse.json({ success: true, message: "Section Created & Teacher Assigned!", data: newSection }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create section" }, { status: 500 });
  }
}