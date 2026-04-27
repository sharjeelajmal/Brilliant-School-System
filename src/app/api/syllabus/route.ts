import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Syllabus from '@/models/Syllabus';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const className = searchParams.get('className');
    const round = searchParams.get('round');

    const query: any = {};
    if (className) query.className = className;
    if (round) query.round = round;

    const syllabus = await Syllabus.find(query).sort({ subject: 1 });
    return NextResponse.json({ success: true, data: syllabus }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newSyllabus = await Syllabus.create(body);
    return NextResponse.json({ success: true, data: newSyllabus }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    const updatedSyllabus = await Syllabus.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedSyllabus) {
      return NextResponse.json({ success: false, error: "Syllabus entry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedSyllabus }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    const deletedSyllabus = await Syllabus.findByIdAndDelete(id);

    if (!deletedSyllabus) {
      return NextResponse.json({ success: false, error: "Syllabus entry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Syllabus entry deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
