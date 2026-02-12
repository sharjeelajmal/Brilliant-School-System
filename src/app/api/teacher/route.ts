import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Teacher from '@/models/Teacher';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    ['monthlySalary', 'allowance', 'leavingFine', 'lateFine', 'absentFine', 'securityDeposit', 'salaryIncrement', 'salary'].forEach(f => {
      if (!body[f]) body[f] = 0;
    });

    const existing = await Teacher.findOne({ cnic: body.cnic });
    if (existing) return NextResponse.json({ error: "Teacher with this CNIC exists." }, { status: 400 });

    const newTeacher = await Teacher.create(body);
    return NextResponse.json({ message: "Hired Successfully!", data: newTeacher }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const className = searchParams.get('class');
    const sectionName = searchParams.get('section');

    if (id) {
      const teacher = await Teacher.findById(id);
      if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
      return NextResponse.json({ success: true, data: teacher }, { status: 200 });
    }

    let query: any = {};
    if (className) query.assignedClass = className;
    if (sectionName) query.assignedSection = sectionName;

    const teachers = await Teacher.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: teachers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch." }, { status: 500 });
  }
}


// --- NEW: PUT Method for Updating Teacher ---
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) return NextResponse.json({ error: "Teacher ID required" }, { status: 400 });

    const updatedTeacher = await Teacher.findByIdAndUpdate(_id, updateData, { new: true });

    if (!updatedTeacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Profile Updated Successfully!", data: updatedTeacher }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- DELETE: Remove Teacher ---
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "Teacher ID required" }, { status: 400 });

    const teacher = await Teacher.findByIdAndDelete(id);
    if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Teacher removed successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}