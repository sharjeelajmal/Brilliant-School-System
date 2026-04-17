import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Fee from '@/models/Fee';
import Student from '@/models/Student';

export async function GET() {
    try {
        await connectDB();
        
        // 1. Get all active student IDs
        const activeStudents = await Student.find({}, { _id: 1 });
        const activeIds = new Set(activeStudents.map(s => s._id.toString()));
        
        // 2. Find all fees
        const allFees = await Fee.find({});
        
        // 3. Filter for ones where studentId is NOT in activeIds
        const orphanIds = allFees
            .filter(f => !activeIds.has(f.studentId.toString()))
            .map(f => f._id);
            
        if (orphanIds.length === 0) {
            return NextResponse.json({ success: true, message: "No orphan fees found to clean." });
        }

        // 4. Delete them
        const result = await Fee.deleteMany({ _id: { $in: orphanIds } });

        return NextResponse.json({
            success: true,
            message: `Cleanup successful! Removed ${result.deletedCount} orphaned fee records.`,
            deletedCount: result.deletedCount
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
