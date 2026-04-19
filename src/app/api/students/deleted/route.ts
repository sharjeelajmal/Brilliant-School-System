import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import DeletedStudent from '@/models/DeletedStudent';

// GET: Fetch all deleted students
export async function GET() {
  try {
    await connectDB();
    const deletedStudents = await DeletedStudent.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: deletedStudents }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Permanently remove a deleted student record (frees their Sr No)
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Student ID is required' }, { status: 400 });
    }

    const deleted = await DeletedStudent.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Student record permanently deleted. Sr No ${deleted.srNo} is now free.`,
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import Student from '@/models/Student';

// PATCH: Update srNo of a deleted student with global duplicate check
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { _id, srNo } = body;

    if (!_id || srNo === undefined) {
      return NextResponse.json({ success: false, error: '_id and srNo are required' }, { status: 400 });
    }

    const num = Number(srNo);

    // Check if srNo is already used by another deleted student
    const conflictDeleted = await DeletedStudent.findOne({
      srNo: num,
      _id: { $ne: _id }
    }).select('firstName lastName');

    // Also check active students
    const conflictActive = await Student.findOne({ rollNo: num }).select('firstName lastName');

    const conflict = conflictDeleted || conflictActive;

    if (conflict) {
      return NextResponse.json({
        success: false,
        conflict: true,
        studentName: `${conflict.firstName} ${conflict.lastName}`.trim(),
        error: `Sr No ${srNo} is already assigned to ${conflict.firstName} ${conflict.lastName} ${conflictDeleted ? '' : '(Active)'}`
      }, { status: 409 });
    }

    const updated = await DeletedStudent.findByIdAndUpdate(
      _id,
      { $set: { srNo: Number(srNo) } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated, message: 'Sr No updated successfully' }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
