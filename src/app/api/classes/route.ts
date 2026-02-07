import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Class from '@/models/Class';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import Section from '@/models/Section';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name } = await req.json(); // Sirf name le rahay hain

    const existingClass = await Class.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingClass) {
      return NextResponse.json({ error: "This Class already exists!" }, { status: 400 });
    }

    const newClass = await Class.create({ name });
    return NextResponse.json({ message: "Class Created Successfully!", data: newClass }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET method same rahega jo pehle diya tha...
export async function GET() {
  try {
    await connectDB();
    const classes = await Class.find({}).lean();
    const enrichedClasses = await Promise.all(classes.map(async (cls: any) => {
      const studentCount = await Student.countDocuments({ classJoining: cls.name });
      const teacherCount = await Teacher.countDocuments({ assignedClass: cls.name });
      const sectionCount = await Section.countDocuments({ className: cls.name });
      return { ...cls, students: studentCount, teachers: teacherCount, sections: sectionCount };
    }));
    return NextResponse.json({ data: enrichedClasses }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}

// DELETE method same rahega...
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "Class ID required" }, { status: 400 });
    await Class.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Class Deleted Successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}