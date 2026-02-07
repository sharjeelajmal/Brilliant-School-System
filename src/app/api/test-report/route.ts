import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import TestReport from '@/models/TestReport';

// POST: Save Marks (Bulk)
export async function POST(req: Request) {
  try {
    await connectDB();
    const { date, testType, subject, totalMarks, passingMarks, records, className, section } = await req.json();

    const operations = records.map((rec: any) => ({
      updateOne: {
        filter: { studentId: rec.studentId, date: date, subject: subject }, // Unique Identifier
        update: { 
            $set: { 
                obtainedMarks: rec.obtainedMarks,
                testType, totalMarks, passingMarks, class: className, section: section
            } 
        },
        upsert: true 
      }
    }));

    await TestReport.bulkWrite(operations);

    return NextResponse.json({ success: true, message: "Result Saved" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET: Fetch Marks
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const subject = searchParams.get('subject');
    const className = searchParams.get('class');
    const section = searchParams.get('section');

    if (!date || !subject || !className || !section) return NextResponse.json({ success: false, data: [] });

    const records = await TestReport.find({ date, subject, class: className, section });
    return NextResponse.json({ success: true, data: records }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}