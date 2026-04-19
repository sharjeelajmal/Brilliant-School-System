import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Student from '@/models/Student';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const students = await Student.find({}).sort({ createdAt: -1 });

    const parentsMap = new Map();

    students.forEach((student: any) => {
        // Group by CNIC first; if missing use WhatsApp/mobile so siblings still group together
        const parentId = student.parentCnic || student.whatsappNo || student.mobileNo || `unknown-${student._id}`;
        
        if (!parentsMap.has(parentId)) {
            parentsMap.set(parentId, {
                _id: parentId, 
                fatherName: student.parentFirstName + ' ' + student.parentLastName,
                parentFirstName: student.parentFirstName,
                parentLastName: student.parentLastName,
                mobileNo: student.mobileNo,
                whatsappNo: student.whatsappNo,  // Added for phone-based matching
                cnic: student.parentCnic,
                occupation: student.parentOccupation,
                address: student.address,
                email: student.email,
                children: [],
                status: 'Active'
            });
        }
        
        parentsMap.get(parentId).children.push({
            studentId: student._id,
            name: `${student.firstName} ${student.lastName}`,
            rollNo: student.rollNo,
            class: student.classJoining,
            photo: student.photoUrl,
            gender: student.gender,
            monthlyFee: student.monthlyFee || 0,
            transportFee: student.transportFee || 0,
            academyFee: student.academyFee || 0,
            admissionFee: student.admissionFee || 0,
            examFee: student.uniformBooksCharges || 0,
        });
    });

    const parents = Array.from(parentsMap.values());
    return NextResponse.json({ success: true, data: parents });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch parents" }, { status: 500 });
  }
}

// --- PUT METHOD (EDIT PARENT) ---
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { originalCnic, updatedData } = await req.json();

    if (!originalCnic) return NextResponse.json({ error: "Original CNIC required" }, { status: 400 });

    // Parent ka data update karne ka matlab hai unke sab bachon ke records update karna
    await Student.updateMany(
        { parentCnic: originalCnic },
        { 
            $set: {
                parentFirstName: updatedData.parentFirstName,
                parentLastName: updatedData.parentLastName,
                parentCnic: updatedData.cnic,
                parentOccupation: updatedData.occupation,
                mobileNo: updatedData.mobileNo,
                address: updatedData.address
            }
        }
    );

    return NextResponse.json({ success: true, message: "Parent Profile Updated!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}