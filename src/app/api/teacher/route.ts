import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Teacher from '@/models/Teacher';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    const numericFields = [
      'monthlySalary', 'allowance', 'leavingFine', 'lateFine', 
      'absentFine', 'securityDeposit', 'salaryIncrement', 'salary'
    ];

    numericFields.forEach((field) => {
      if (body[field] === '' || body[field] === undefined) {
        body[field] = 0;
      }
    });

    const existing = await Teacher.findOne({ cnic: body.cnic });
    if (existing) {
      return NextResponse.json({ error: "Teacher with this CNIC already exists." }, { status: 400 });
    }

    const newTeacher = await Teacher.create(body);
    return NextResponse.json({ message: "Teacher Hired Successfully!", data: newTeacher }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save teacher." }, { status: 500 });
  }
}

// UPDATE: GET Method Supports Section Filter
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const className = searchParams.get('class');
    const sectionName = searchParams.get('section');

    let query: any = {};
    if (className) query.assignedClass = className;
    if (sectionName) query.assignedSection = sectionName;

    const teachers = await Teacher.find(query, 'firstName lastName _id assignedClass assignedSection');
    return NextResponse.json({ success: true, data: teachers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch teachers." }, { status: 500 });
  }
}