import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Section from '@/models/Section';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { sourceSectionId, targetSectionId } = await req.json();

    if(sourceSectionId === targetSectionId) {
        return NextResponse.json({ error: "Cannot merge same section" }, { status: 400 });
    }

    // 1. Get Sections
    const sourceSection = await Section.findById(sourceSectionId);
    const targetSection = await Section.findById(targetSectionId);

    if (!sourceSection || !targetSection) {
        return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    // 2. Move Students
    await Student.updateMany(
        { classJoining: sourceSection.className, section: sourceSection.name },
        { $set: { section: targetSection.name } }
    );

    // 3. Free Source Teacher
    if (sourceSection.teacherId) {
        await Teacher.findByIdAndUpdate(sourceSection.teacherId, {
            assignedClass: "",
            assignedSection: ""
        });
    }

    // 4. Delete Source Section
    await Section.findByIdAndDelete(sourceSectionId);

    return NextResponse.json({ success: true, message: "Sections Merged Successfully" }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}