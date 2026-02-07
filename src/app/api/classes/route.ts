import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Class from '@/models/Class';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import Section from '@/models/Section';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, maxCapacity } = await req.json();

    // Case-Insensitive Check
    const existingClass = await Class.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingClass) {
      return NextResponse.json({ error: "This Class already exists!" }, { status: 400 });
    }

    const newClass = await Class.create({ name, maxCapacity });
    return NextResponse.json({ message: "Class Created Successfully!", data: newClass }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE: GET Method ab ginti (counts) ke sath data dega
export async function GET() {
  try {
    await connectDB();
    
    // 1. Sab Classes laao
    const classes = await Class.find({}).lean();

    // 2. Har class ke liye students, teachers, sections count karo
    const enrichedClasses = await Promise.all(classes.map(async (cls: any) => {
      const studentCount = await Student.countDocuments({ classJoining: cls.name });
      const teacherCount = await Teacher.countDocuments({ assignedClass: cls.name });
      const sectionCount = await Section.countDocuments({ className: cls.name });

      return {
        ...cls,
        students: studentCount, // Total Students in this class
        teachers: teacherCount, // Total Teachers in this class
        sections: sectionCount  // Total Sections in this class
      };
    }));

    return NextResponse.json({ data: enrichedClasses }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}