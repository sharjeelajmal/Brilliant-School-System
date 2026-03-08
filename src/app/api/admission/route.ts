import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Student from '@/models/Student';
import Section from '@/models/Section'; // Section Model Import Karein

let rollNoIndexReady = false;

async function ensureSectionScopedRollNoIndex() {
  if (rollNoIndexReady) return;

  const indexes = await Student.collection.indexes();

  const globalRollNoIndexes = indexes.filter((index) => {
    const keys = Object.keys(index.key || {});
    return index.unique && keys.length === 1 && index.key.rollNo === 1;
  });

  for (const index of globalRollNoIndexes) {
    if (!index.name) continue;
    try {
      await Student.collection.dropIndex(index.name);
    } catch (error: unknown) {
      const mongoError = error as { code?: number };
      if (mongoError.code !== 27) {
        throw error;
      }
    }
  }

  const hasSectionScopedIndex = indexes.some((index) => {
    const key = index.key || {};
    return (
      index.unique &&
      key.classJoining === 1 &&
      key.section === 1 &&
      key.rollNo === 1
    );
  });

  if (!hasSectionScopedIndex) {
    await Student.collection.createIndex(
      { classJoining: 1, section: 1, rollNo: 1 },
      { unique: true }
    );
  }

  rollNoIndexReady = true;
}

export async function POST(req: Request) {
  try {
    await connectDB();
    await ensureSectionScopedRollNoIndex();
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
      'monthlyFee', 'annualFee', 'admissionFee', 'academyFee',
      'nazraFee', 'uniformBooksCharges', 'stationaryCharges',
      'otherCharges', 'lateFeeFine', 'monthlyIncome',
      'discount', 'totalPayable', 'amountPaying', 'remainingAmount'
    ];

    numericFields.forEach((field) => {
      if (body[field] === '' || body[field] === undefined) {
        body[field] = 0;
      }
    });

    // Ignore incoming rollNo and generate it per class + section scope.
    delete body.rollNo;

    const classJoining = String(body.classJoining || '').trim();
    const section = String(body.section || '').trim();
    body.classJoining = classJoining;
    body.section = section;

    const rollScope = { classJoining, section };
    let newStudent = null;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const lastStudent = await Student.findOne(rollScope, { rollNo: 1 }).sort({ rollNo: -1 });
      const newRollNo = (lastStudent && lastStudent.rollNo) ? lastStudent.rollNo + 1 : 1;

      try {
        newStudent = await Student.create({
          ...body,
          rollNo: newRollNo
        });
        break;
      } catch (error: unknown) {
        const mongoError = error as { code?: number };

        if (mongoError.code !== 11000 || attempt === 2) {
          throw error;
        }
      }
    }

    if (!newStudent) {
      throw new Error('Unable to generate roll number');
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
