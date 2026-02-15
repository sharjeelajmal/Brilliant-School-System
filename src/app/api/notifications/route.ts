import { NextResponse } from 'next/server';
import { connectDB as dbConnect } from '@/lib/db';
import Student from '@/models/Student';
import Fee from '@/models/Fee';
import Attendance from '@/models/Attendance';

export async function GET() {
    await dbConnect();
    try {
        const today = new Date();
        const currentMonth = today.toLocaleString('default', { month: 'long' }); // e.g., "October"
        const currentYear = today.getFullYear();
        const dateString = today.toISOString().split('T')[0];

        // 1. Fee Defaulters (Active Students who haven't paid current month's fee)
        // Get all active students
        const students = await Student.find({ leavingReason: { $exists: false } }).select('_id firstName lastName rollNo classJoining section monthlyFee');

        // Get all fee records for current month/year
        const fees = await Fee.find({
            month: currentMonth,
            year: currentYear,
            feeType: 'Monthly Fee' // Assuming we only care about monthly fee default
        }).select('studentId status');

        const paidStudentIds = fees.map(f => f.studentId.toString());

        const defaulters = students.filter(s => !paidStudentIds.includes(s._id.toString())).map(s => ({
            id: s._id,
            name: `${s.firstName} ${s.lastName}`,
            details: `Class ${s.classJoining}-${s.section}`,
            amount: s.monthlyFee,
            type: 'Fee Defaulter'
        }));

        // 2. Absent Students (Today)
        const attendance = await Attendance.find({
            date: dateString,
            status: 'absent'
        }).select('studentId');

        // We need to fetch student details for these attendance records if not populated
        // A better way is to rely on Attendance schema if it has student info or fetch again
        // Assuming Attendance has studentId, let's filter from our fetched students list to avoid extra DB call if possible
        // But attendance loop might include students not in our 'active' list? Unlikely.

        const absentStudentIds = attendance.map(a => a.studentId.toString());
        const absentees = students.filter(s => absentStudentIds.includes(s._id.toString())).map(s => ({
            id: s._id,
            name: `${s.firstName} ${s.lastName}`,
            details: `Class ${s.classJoining}-${s.section}`,
            type: 'Absent Today'
        }));

        return NextResponse.json({
            success: true,
            data: {
                defaulters,
                absentees,
                summary: {
                    defaultersCount: defaulters.length,
                    absenteesCount: absentees.length
                }
            }
        });

    } catch (error) {
        console.error('Notifications API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch notifications' }, { status: 500 });
    }
}
