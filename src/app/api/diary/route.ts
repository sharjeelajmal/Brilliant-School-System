import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Diary from '@/models/Diary';
import Class from '@/models/Class';
import Section from '@/models/Section';

// GET — Fetch diary entries (filter by date, className, section, teacherId)
export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date');
        const className = searchParams.get('className');
        const section = searchParams.get('section');
        const teacherId = searchParams.get('teacherId');
        const summary = searchParams.get('summary');

        const filter: any = {};
        if (date) filter.date = date;
        if (className) filter.className = className;
        if (section) filter.section = section;
        if (teacherId) filter.teacherId = teacherId;

        // Summary mode — stats for dashboard cards
        if (summary === 'true' && date) {
            const allDiaries = await Diary.find({ date });

            // Get all class-section combos
            const sections = await Section.find({});
            const totalClassSections = sections.length;
            const coveredClassSections = allDiaries.length;
            const totalSubjectsCovered = allDiaries.reduce((acc, d) => acc + d.entries.filter((e: any) => e.homework || e.classwork || e.notes).length, 0);
            const pendingClasses = totalClassSections - coveredClassSections;

            return NextResponse.json({
                success: true,
                summary: {
                    totalEntries: allDiaries.length,
                    classesCovered: coveredClassSections,
                    subjectsCovered: totalSubjectsCovered,
                    pendingClasses: pendingClasses > 0 ? pendingClasses : 0,
                }
            });
        }

        const diaries = await Diary.find(filter).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: diaries });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST — Create new diary entry
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { date, className, section, teacherName, teacherId, entries } = body;

        if (!date || !className || !section) {
            return NextResponse.json({ success: false, error: 'Date, Class aur Section required hain' }, { status: 400 });
        }

        // Check if diary already exists for this date+class+section
        const existing = await Diary.findOne({ date, className, section });
        if (existing) {
            // Update existing
            existing.entries = entries;
            existing.teacherName = teacherName || existing.teacherName;
            existing.teacherId = teacherId || existing.teacherId;
            await existing.save();
            return NextResponse.json({ success: true, data: existing, message: 'Diary updated successfully' });
        }

        const diary = await Diary.create({ date, className, section, teacherName, teacherId, entries });
        return NextResponse.json({ success: true, data: diary, message: 'Diary saved successfully' }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PUT — Update existing diary
export async function PUT(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { id, entries, teacherName, teacherId } = body;

        if (!id) {
            return NextResponse.json({ success: false, error: 'Diary ID required hai' }, { status: 400 });
        }

        const diary = await Diary.findByIdAndUpdate(id, {
            entries,
            ...(teacherName && { teacherName }),
            ...(teacherId && { teacherId }),
        }, { new: true });

        if (!diary) {
            return NextResponse.json({ success: false, error: 'Diary not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: diary, message: 'Diary updated successfully' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE — Delete diary entry
export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'Diary ID required hai' }, { status: 400 });
        }

        const diary = await Diary.findByIdAndDelete(id);
        if (!diary) {
            return NextResponse.json({ success: false, error: 'Diary not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Diary deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
