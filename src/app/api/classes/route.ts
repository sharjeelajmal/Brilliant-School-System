import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Class from '@/models/Class';
import Section from '@/models/Section';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher'; // Teacher Model import kiya

// 🔴 IMP: Disable Caching
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    
    // 1. Sab classes fetch karein
    const classes = await Class.find({}).sort({ createdAt: -1 });

    // 2. Har class ke liye counts calculate karein
    const classesWithStats = await Promise.all(classes.map(async (cls) => {
        // Sections Count
        const sectionCount = await Section.countDocuments({ className: cls.name });
        
        // Students Count (Assuming 'classJoining' field holds class name)
        const studentCount = await Student.countDocuments({ classJoining: cls.name });
        
        // Teachers Count (Assuming 'assignedClass' field holds class name)
        const teacherCount = await Teacher.countDocuments({ assignedClass: cls.name });

        return {
            ...cls.toObject(),
            sections: sectionCount,
            students: studentCount,
            teachers: teacherCount
        };
    }));

    return NextResponse.json({ success: true, data: classesWithStats });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch classes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newClass = await Class.create(body);
    return NextResponse.json({ success: true, data: newClass }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create class" }, { status: 500 });
  }
}

// --- UPDATE SUBJECTS ---
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { id, subjects } = await req.json();

    if (!id) return NextResponse.json({ error: "Class ID required" }, { status: 400 });

    const updatedClass = await Class.findByIdAndUpdate(
        id, 
        { subjects: subjects || [] }, 
        { new: true }
    );

    if (!updatedClass) return NextResponse.json({ error: "Class not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Subjects Saved Successfully!", data: updatedClass });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
    try {
      await connectDB();
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
      await Class.findByIdAndDelete(id);
      return NextResponse.json({ success: true, message: "Deleted" });
    } catch (error) {
      return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}