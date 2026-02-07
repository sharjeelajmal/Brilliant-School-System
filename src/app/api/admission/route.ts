import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Student from '@/models/Student';
import Section from '@/models/Section'; // Section Model Import Karein

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

    // Auto Roll No Logic...
    const lastStudent = await Student.findOne({}, { rollNo: 1 }).sort({ rollNo: -1 });
    const newRollNo = (lastStudent && lastStudent.rollNo) ? lastStudent.rollNo + 1 : 1;
    body.rollNo = newRollNo;

    const newStudent = await Student.create(body);

    return NextResponse.json({ 
      success: true, 
      message: 'Student Registered Successfully!', 
      data: newStudent 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Student Save Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: 'Registration Failed', 
      error: error.message 
    }, { status: 500 });
  }
}