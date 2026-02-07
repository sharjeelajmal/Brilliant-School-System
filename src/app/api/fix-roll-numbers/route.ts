import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Student from '@/models/Student';

export async function GET() {
  try {
    await connectDB();
    
    // 1. Un students ko dhoondo jin ka rollNo nahi hai
    const studentsWithoutRoll = await Student.find({ 
      $or: [{ rollNo: { $exists: false } }, { rollNo: null }] 
    }).sort({ createdAt: 1 }); // Puranay pehle ayen

    // 2. Last used Roll No nikalo (agar koi hai)
    const lastStudent = await Student.findOne({ rollNo: { $exists: true } }).sort({ rollNo: -1 });
    let currentRoll = lastStudent ? lastStudent.rollNo : 0;

    // 3. Sab ko Roll No assign karo
    let updatedCount = 0;
    for (const student of studentsWithoutRoll) {
      currentRoll++;
      student.rollNo = currentRoll;
      await student.save();
      updatedCount++;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Fixed! Assigned Roll Numbers to ${updatedCount} students.`,
      lastRollNo: currentRoll
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}