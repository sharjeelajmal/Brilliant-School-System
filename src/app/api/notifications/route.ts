import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Student from '@/models/Student';
import TestReport from '@/models/TestReport';

export async function GET() {
    try {
        await connectDB();

        // 1. Unpaid Fees (Remaining Amount > 0)
        const unpaidStudents = await Student.find({ remainingAmount: { $gt: 0 } })
            .select('firstName lastName remainingAmount classJoining section')
            .limit(10);

        // 2. High Performers (Recent Tests > 90%)
        const highPerformers = await TestReport.find({})
            .sort({ createdAt: -1 })
            .limit(20); // Fetch recent 20 to filter in memory or advanced query

        // Advanced filter for 90% (MongoDB logic can be complex for calculated fields, doing simple loop for MVP)
        const topStudents = [];
        for (const report of highPerformers) {
            if ((report.obtainedMarks / report.totalMarks) >= 0.9) {
                // Fetch student name if possible, or just use ID/Class
                const st = await Student.findOne({ studentId: report.studentId }).select('firstName lastName');
                if (st) {
                    topStudents.push({
                        studentName: `${st.firstName} ${st.lastName}`,
                        subject: report.subject,
                        marks: `${report.obtainedMarks}/${report.totalMarks}`
                    });
                }
                if (topStudents.length >= 5) break;
            }
        }

        return NextResponse.json({
            success: true,
            notifications: {
                unpaid: unpaidStudents,
                performance: topStudents
            }
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
