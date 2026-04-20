import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Student from '@/models/Student';
import DeletedStudent from '@/models/DeletedStudent';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const className = searchParams.get('class');
    const sectionName = searchParams.get('section');
    const id = searchParams.get('id');
    const checkRollNo = searchParams.get('checkRollNo');
    const excludeId = searchParams.get('excludeId');

    // 0. Check if a rollNo is already taken by another student (in either collection)
    if (checkRollNo) {
      const num = Number(checkRollNo);
      const queryActive: any = { rollNo: num };
      if (excludeId) queryActive._id = { $ne: excludeId };
      const existingActive = await Student.findOne(queryActive).select('firstName lastName');
      
      const existingDeleted = await DeletedStudent.findOne({ srNo: num }).select('firstName lastName');

      if (existingActive) {
        return NextResponse.json({
          success: true, conflict: true, source: 'active',
          studentName: `${existingActive.firstName} ${existingActive.lastName}`.trim()
        }, { status: 200 });
      }
      if (existingDeleted) {
        return NextResponse.json({
          success: true, conflict: true, source: 'deleted',
          studentName: `${existingDeleted.firstName} ${existingDeleted.lastName}`.trim()
        }, { status: 200 });
      }
      return NextResponse.json({ success: true, conflict: false }, { status: 200 });
    }

    // 1. Single Student Fetch (Profile ke liye)
    if (id) {
      const student = await Student.findById(id);
      if (!student) return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 });
      
      const classRollNo = await Student.countDocuments({
        classJoining: student.classJoining,
        section: student.section,
        rollNo: { $lte: student.rollNo }
      });
      const data = student.toObject();
      data.classRollNo = classRollNo;
      
      return NextResponse.json({ success: true, data }, { status: 200 });
    }

    // 2. Build Match Query
    let matchStage: any = {};
    if (className) matchStage.classJoining = className;
    if (sectionName) matchStage.section = sectionName;

    // 3. Aggregation Pipeline (Real-Time Stats Calculation)
    const students = await Student.aggregate([
      { $match: matchStage },
      // Convert _id to string to match with other collections
      { $addFields: { studentIdStr: { $toString: "$_id" } } },

      // --- Lookup Attendance ---
      {
        $lookup: {
          from: "attendances",
          localField: "studentIdStr",
          foreignField: "studentId",
          as: "attendanceData"
        }
      },

      // --- Lookup Test Reports ---
      {
        $lookup: {
          from: "testreports",
          localField: "studentIdStr",
          foreignField: "studentId",
          as: "testData"
        }
      },

      // --- Calculate Stats ---
      {
        $addFields: {
          // Attendance Stats
          totalDays: { $size: "$attendanceData" },
          presentDays: {
            $size: {
              $filter: {
                input: "$attendanceData",
                as: "att",
                cond: { $eq: ["$$att.status", "present"] }
              }
            }
          },
          // Performance Stats (Average Obtained Marks)
          avgMarks: {
            $avg: "$testData.obtainedMarks"
          }
        }
      },

      // --- Final Projection ---
      {
        $project: {
          firstName: 1, lastName: 1, rollNo: 1, gender: 1,
          classJoining: 1, section: 1, photoUrl: 1,
          parentFirstName: 1, mobileNo: 1, whatsappNo: 1, // Contact ke liye
          attendanceStats: {
            present: "$presentDays",
            total: "$totalDays"
          },
          avgPerformance: { $ifNull: ["$avgMarks", 0] }
        }
      },
      { $sort: { rollNo: 1 } } // Sort by Roll No
    ]);

    // Calculate dynamic Class Roll No
    const counters: Record<string, number> = {};
    students.forEach(student => {
        const key = `${student.classJoining}-${student.section}`;
        counters[key] = (counters[key] || 0) + 1;
        student.classRollNo = counters[key];
    });

    return NextResponse.json({ success: true, data: students }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — Archive student to DeletedStudent collection first, then remove
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    // Parse reason from request body
    let reason = 'No reason provided';
    try {
      const body = await req.json();
      if (body?.reason) reason = body.reason;
    } catch { /* body may be empty */ }

    // Fetch full student record before deleting
    const student = await Student.findById(id);
    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    // Archive into DeletedStudent collection
    await DeletedStudent.create({
      srNo: student.rollNo || 0,
      firstName: student.firstName,
      lastName: student.lastName,
      fatherName: `${student.parentFirstName || ''} ${student.parentLastName || ''}`.trim(),
      dob: student.dob || '',
      gender: student.gender || '',
      admissionDate: student.joiningDate || '',
      endingDate: new Date().toISOString().split('T')[0],
      admissionClass: student.classJoining || '',
      endingClass: student.classJoining || '',  // same unless manually edited
      reason,
      mobileNo: student.mobileNo || '',
      address: student.address || '',
      section: student.section || '',
      studentCnic: student.studentCnic || '',
    });

    // Now permanently delete from Student collection
    await Student.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Student archived and deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ success: false, error: "Student ID (_id) is required" }, { status: 400 });
    }

    // If rollNo is being updated, check for global uniqueness across ALL collections
    if (updateData.rollNo !== undefined) {
      const num = Number(updateData.rollNo);
      const conflictActive = await Student.findOne({
        rollNo: num,
        _id: { $ne: _id }
      }).select('firstName lastName');

      const conflictDeleted = await DeletedStudent.findOne({ srNo: num }).select('firstName lastName');

      const conflict = conflictActive || conflictDeleted;

      if (conflict) {
        return NextResponse.json({
          success: false,
          conflict: true,
          studentName: `${conflict.firstName} ${conflict.lastName}`.trim(),
          error: `Sr No ${num} is already assigned to ${conflict.firstName} ${conflict.lastName} ${conflictActive ? '' : '(Deleted)'}`
        }, { status: 409 });
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedStudent, message: "Profile Updated Successfully" }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}