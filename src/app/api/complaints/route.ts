import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Complaint from '@/models/Complaint';
import Student from '@/models/Student';

// GET & POST (Purana same rahega) ...
export async function GET(req: Request) {
    // ... (Purana code same rakhein)
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search');
        const classFilter = searchParams.get('class');
        const sectionFilter = searchParams.get('section');
        const dateFilter = searchParams.get('date');
    
        let query: any = {};
    
        if (search) {
          query.$or = [
            { studentName: { $regex: search, $options: 'i' } },
            { title: { $regex: search, $options: 'i' } },
            { rollNo: { $regex: search, $options: 'i' } }
          ];
        }
    
        if (classFilter) query.className = classFilter;
        if (sectionFilter) query.section = sectionFilter;
        if (dateFilter) query.date = dateFilter;
    
        const complaints = await Complaint.find(query).sort({ createdAt: -1 }).lean();
    
        const populatedComplaints = await Promise.all(complaints.map(async (comp: any) => {
            const student = await Student.findById(comp.studentId, 'mobileNo whatsappNo');
            return {
                ...comp,
                parentMobile: student ? (student.whatsappNo || student.mobileNo) : '' 
            };
        }));
    
        return NextResponse.json({ success: true, data: populatedComplaints }, { status: 200 });
    
      } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
}

export async function POST(req: Request) {
    // ... (Purana code same rakhein)
    try {
        await connectDB();
        const body = await req.json();
    
        let student = null;
        if (body.studentId) {
            student = await Student.findById(body.studentId);
        } else {
            // Find by exact first name & last name instead of just first word
            // or try to match if old payload is sent
            student = await Student.findOne({ 
                firstName: body.studentName.split(' ')[0], 
                classJoining: body.className,
                section: body.section
            });
        }
    
        if (!student) {
            return NextResponse.json({ success: false, error: "Student not found!" }, { status: 404 });
        }
    
        const newComplaint = await Complaint.create({
            ...body,
            studentId: student._id,
            rollNo: student.rollNo || 'N/A' 
        });
    
        return NextResponse.json({ success: true, message: 'Saved!', data: newComplaint }, { status: 201 });
      } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
}

// --- NEW: DELETE METHOD ---
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await Complaint.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Complaint Deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}