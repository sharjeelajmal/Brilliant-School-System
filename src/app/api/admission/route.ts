import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Student from '@/models/Student';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

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

    // --- AUTO ROLL NO LOGIC ---
    // Sab se aakhri student dhoondo (Roll No ke hisab se sort kar ke)
    const lastStudent = await Student.findOne({}, { rollNo: 1 }).sort({ rollNo: -1 });
    
    // Agar koi student hai to uske roll no ma +1 karo, warna 1 se shuru karo
    const newRollNo = (lastStudent && lastStudent.rollNo) ? lastStudent.rollNo + 1 : 1;
    
    // Body ma roll no add kar do
    body.rollNo = newRollNo;

    const newStudent = await Student.create(body);

    return NextResponse.json({ 
      success: true, 
      message: 'Student Registered Successfully!', 
      data: newStudent // Ye wapis jayega frontend ke paas
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