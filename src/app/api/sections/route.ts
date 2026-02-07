import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Section from '@/models/Section';
import Teacher from '@/models/Teacher';

export async function POST(req: Request) {
  try {
    await connectDB();
    // Yahan hum maxCapacity receive kar rahay hain
    const { name, className, teacherId, maxCapacity } = await req.json();

    const existingSection = await Section.findOne({ name, className });
    if (existingSection) {
      return NextResponse.json({ error: "Section already exists in this class" }, { status: 400 });
    }

    const newSection = await Section.create({ 
        name, 
        className, 
        teacherId: teacherId || null,
        // Yahan save ho rahi hai (Agar user ne khali chora to 40 default)
        maxCapacity: maxCapacity || 40 
    });

    if (teacherId) {
        await Teacher.findByIdAndUpdate(teacherId, {
            assignedClass: className,
            assignedSection: name
        });
    }

    return NextResponse.json({ success: true, data: newSection }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// GET method (Same as before)
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const className = searchParams.get('class');
    let query = {};
    if (className) query = { className };
    const sections = await Section.find(query);
    return NextResponse.json({ success: true, data: sections }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sections" }, { status: 500 });
  }
}

// --- NEW: DELETE SECTION ---
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "Section ID required" }, { status: 400 });

    // 1. Find Section to get Teacher ID
    const section = await Section.findById(id);
    if (!section) return NextResponse.json({ error: "Section not found" }, { status: 404 });

    // 2. If Teacher assigned, Free them
    if (section.teacherId) {
        await Teacher.findByIdAndUpdate(section.teacherId, {
            assignedClass: "", // Clear Class
            assignedSection: "" // Clear Section
        });
    }

    // 3. Delete Section
    await Section.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Section Deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// --- NEW: PUT (REPLACE TEACHER) ---
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { sectionId, newTeacherId } = await req.json();

    // 1. Find Section
    const section = await Section.findById(sectionId);
    if (!section) return NextResponse.json({ error: "Section not found" }, { status: 404 });

    // 2. Remove Old Teacher (if any)
    if (section.teacherId) {
        await Teacher.findByIdAndUpdate(section.teacherId, {
            assignedClass: "",
            assignedSection: ""
        });
    }

    // 3. Assign New Teacher
    await Section.findByIdAndUpdate(sectionId, { teacherId: newTeacherId });
    
    // 4. Update New Teacher Profile
    await Teacher.findByIdAndUpdate(newTeacherId, {
        assignedClass: section.className,
        assignedSection: section.name
    });

    return NextResponse.json({ success: true, message: "Teacher Replaced Successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}