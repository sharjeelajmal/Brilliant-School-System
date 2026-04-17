import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Fee from '@/models/Fee';
import Student from '@/models/Student';

export async function GET() {
    try {
        await connectDB();
        
        // 1. Get all fees
        const allFees = await Fee.find({});
        
        // 2. Get all active student IDs
        const activeStudents = await Student.find({}, { _id: 1 });
        const activeIds = new Set(activeStudents.map(s => s._id.toString()));
        
        // 3. Find "Orphan" fees (Fees of non-active students)
        const orphans = allFees.filter(f => !activeIds.has(f.studentId.toString()));
        
        const summary = orphans.map(o => ({
            id: o._id,
            studentName: o.studentName,
            amount: o.amount,
            month: o.month,
            year: o.year,
            type: o.feeType
        }));

        const totalOrphanAmount = summary.reduce((sum, item) => sum + (item.amount || 0), 0);

        return NextResponse.json({
            success: true,
            totalOrphans: summary.length,
            totalAmountToClean: totalOrphanAmount,
            orphans: summary
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
