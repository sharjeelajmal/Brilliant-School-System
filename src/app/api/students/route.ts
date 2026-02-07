import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Student from '@/models/Student';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const className = searchParams.get('class');
    const sectionName = searchParams.get('section');
    const id = searchParams.get('id');

    // 1. Single Student Fetch (Profile ke liye)
    if (id) {
        const student = await Student.findById(id);
        if (!student) return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 });
        return NextResponse.json({ success: true, data: student }, { status: 200 });
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

    return NextResponse.json({ success: true, data: students }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE method same rahega...
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await Student.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}