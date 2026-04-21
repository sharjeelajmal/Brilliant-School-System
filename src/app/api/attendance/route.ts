import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Attendance from '@/models/Attendance';
import mongoose from 'mongoose';

// POST: Save Attendance (Same as before)
export async function POST(req: Request) {
  try {
    await connectDB();
    const { date, records, className, section } = await req.json();

    const operations = records.map((rec: any) => ({
      updateOne: {
        filter: { studentId: rec.studentId, date: date },
        update: { 
            $set: { 
                status: rec.status,
                class: className,
                section: section
            } 
        },
        upsert: true
      }
    }));

    await Attendance.bulkWrite(operations);
    return NextResponse.json({ success: true, message: "Attendance Saved" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET: Fetch Attendance (Updated for Trend)
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const className = searchParams.get('class');
    const section = searchParams.get('section');
    const studentId = searchParams.get('studentId');

    // Query Builder
    let query: any = {};

    if (studentId) {
        query.$or = [
            { studentId: studentId },
            { studentId: mongoose.Types.ObjectId.isValid(studentId) ? new mongoose.Types.ObjectId(studentId) : studentId }
        ];
    } else {
        // Validation: Class & Section zaroori hain
        if (!className || !section) {
            return NextResponse.json({ success: false, error: "Class and Section required" });
        }
        query = { class: className, section };
    }
    
    // Agar Date mili to specific din ka data, warna sara data (Trend ke liye)
    if (date) {
        query.date = date;
    }

    const records = await Attendance.find(query).sort({ date: 1 }); // Sort by date for chart
    return NextResponse.json({ success: true, data: records }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}