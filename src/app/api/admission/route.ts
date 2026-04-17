import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Student from '@/models/Student';
import DeletedStudent from '@/models/DeletedStudent';
import Section from '@/models/Section';
import SrNoCounter from '@/models/SrNoCounter';

async function findNextAvailableSrNo() {
  let counter = await SrNoCounter.findOneAndUpdate(
    { _id: 'studentSrNo' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  
  let currentSrNo = counter.seq;
  let isAvailable = false;

  while (!isAvailable) {
    const existsActive = await Student.findOne({ rollNo: currentSrNo });
    const existsDeleted = await DeletedStudent.findOne({ srNo: currentSrNo });

    if (!existsActive && !existsDeleted) {
      isAvailable = true;
    } else {
      // If taken, increment counter and try again
      counter = await SrNoCounter.findOneAndUpdate(
        { _id: 'studentSrNo' },
        { $inc: { seq: 1 } },
        { new: true }
      );
      currentSrNo = counter.seq;
    }
  }
  return currentSrNo;
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // --- CHECK CAPACITY LOGIC START ---
    if (body.classJoining && body.section) {
      // 1. Section ki details dhoondo
      const sectionDoc = await Section.findOne({
        className: body.classJoining,
        name: body.section
      });

      if (sectionDoc) {
        // 2. Abhi kitnay bachay hain count karo
        const currentCount = await Student.countDocuments({
          classJoining: body.classJoining,
          section: body.section
        });

        // 3. Agar full hai to error do
        if (currentCount >= sectionDoc.maxCapacity) {
          return NextResponse.json({
            success: false,
            message: `Admission Failed! Section ${body.section} is Full. (Capacity: ${sectionDoc.maxCapacity})`
          }, { status: 400 });
        }
      }
    }
    // --- CHECK CAPACITY LOGIC END ---

    // ... Baki code same rahega ...
    const numericFields = [
      'monthlyFee', 'transportFee', 'admissionFee', 'academyFee',
      'nazraFee', 'uniformBooksCharges', 'stationaryCharges',
      'otherCharges', 'lateFeeFine', 'monthlyIncome',
      'discount', 'totalPayable', 'amountPaying', 'remainingAmount'
    ];

    numericFields.forEach((field) => {
      if (body[field] === '' || body[field] === undefined) {
        body[field] = 0;
      }
    });

    // Normalize classJoining and section
    body.classJoining = String(body.classJoining || '').trim();
    body.section = String(body.section || '').trim();

    // Generate globally unique Sr No with collision handling
    const globalSrNo = await findNextAvailableSrNo();

    const newStudent = await Student.create({
      ...body,
      rollNo: globalSrNo,
    });

    if (!newStudent) {
      throw new Error('Unable to create student');
    }

    return NextResponse.json({
      success: true,
      message: 'Student Registered Successfully!',
      data: newStudent
    }, { status: 201 });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Student Save Error:", error);
    return NextResponse.json({
      success: false,
      message: 'Registration Failed',
      error: errorMessage
    }, { status: 500 });
  }
}
