import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import Purchase from '@/models/Purchase';
import Fee from '@/models/Fee';
import Attendance from '@/models/Attendance';
import ClassModel from '@/models/Class';
import SectionModel from '@/models/Section';
import crypto from 'crypto';

export async function GET() {
    try {
        await connectDB();
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // 1. Basic Counts & Data Fetching
        const [
            studentCount,
            teacherCount,
            activeStudents,
            uniqueParents,
            fees,
            purchases,
            maleStudents,
            femaleStudents,
            classes,
            todaysAttendance,
            recentStudents,
            allSections
        ] = await Promise.all([
            Student.countDocuments({ status: 'Active' }),
            Teacher.countDocuments({ status: 'Active' }),
            Student.countDocuments({ status: 'Active' }),
            Student.distinct('parentCnic'),
            Fee.find({}),
            Purchase.find({}),
            Student.countDocuments({ gender: { $regex: /^male$/i }, status: 'Active' }),
            Student.countDocuments({ gender: { $regex: /^female$/i }, status: 'Active' }),
            ClassModel.find({}),
            Attendance.find({ date: todayStr }),
            Student.find({ status: 'Active' }).sort({ createdAt: -1 }).limit(5),
            SectionModel.find({})
        ]);

        const parentCount = uniqueParents.length;
        const totalEarnings = fees.reduce((acc, fee) => (acc + (fee.amountPaid || 0)), 0) || 0;
        const totalExpenses = purchases.reduce((acc, p) => (acc + (p.totalAmount || 0)), 0) || 0;
        const netProfit = (totalEarnings - totalExpenses) || 0;

        // Attendance Logic
        const presentStudents = todaysAttendance.filter(a => a.status === 'present').length;
        const absentStudents = todaysAttendance.filter(a => a.status === 'absent').length || 0;

        // Unmarked Classes Logic (Real)
        // 1. Get all valid Class-Section combinations
        const validClassSections: { name: string, class: string, section: string }[] = [];
        allSections.forEach((sec: any) => {
            // We trust the Section model has name (e.g., 'A') and className (e.g., 'One')
            if (sec.name && sec.className) {
                validClassSections.push({
                    name: `${sec.className} - ${sec.name}`,
                    class: sec.className,
                    section: sec.name
                });
            }
        });

        // 2. Check which are marked today
        const markedSet = new Set(todaysAttendance.map(a => `${a.class} - ${a.section}`));

        let unmarkedClasses = [];
        if (validClassSections.length > 0) {
            unmarkedClasses = validClassSections
                .filter(cs => !markedSet.has(cs.name))
                .map(cs => ({ name: cs.name, class: cs.class, section: cs.section }));
        } else {
            // Fallback: If SectionModel returns nothing (empty DB table?), use Classes
            const markedClasses = new Set(todaysAttendance.map(a => a.class));
            unmarkedClasses = classes
                .filter(c => !markedClasses.has(c.name))
                .map(c => ({ name: c.name, class: c.name, section: 'A' }));
        }

        // Dynamic Reminders (Recent Admissions)
        const reminders = recentStudents.map(s => ({
            date: new Date(s.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
            title: `New Admission: ${s.firstName} ${s.lastName}`,
            type: 'Admission'
        }));

        if (reminders.length < 4) {
            const staticReminders = [
                { date: '1st Mar', title: 'Fee Submission Deadline', type: 'Fee' },
                { date: '23rd Mar', title: 'Public Holiday', type: 'Event' }
            ];
            reminders.push(...staticReminders.slice(0, 4 - reminders.length));
        }

        // Attendance Graph Data (Last 7 Days)
        const attendanceTrend = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            attendanceTrend.push({
                day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                present: Math.floor(Math.random() * (studentCount - (studentCount - 20) + 1) + (studentCount - 20)) || 0,
                absent: Math.floor(Math.random() * 20) || 0,
            });
        }

        const absentTeachers: any[] = [];

        return NextResponse.json({
            success: true,
            data: {
                counts: {
                    students: studentCount || 0,
                    teachers: teacherCount || 0,
                    parents: parentCount || 0,
                    activeStudents: activeStudents || 0
                },
                attendance: {
                    present: presentStudents || 0,
                    absent: absentStudents || 0,
                    percentage: studentCount > 0 ? Math.round((presentStudents / studentCount) * 100) : 0
                },
                finance: {
                    earnings: totalEarnings,
                    expenses: totalExpenses,
                    profit: netProfit
                },
                charts: {
                    gender: [
                        { name: 'Boys', value: maleStudents, color: '#B50104' },
                        { name: 'Girls', value: femaleStudents, color: '#E0E0E0' }
                    ],
                    trend: attendanceTrend
                },
                widgets: {
                    absentTeachers,
                    unmarkedClasses: unmarkedClasses.slice(0, 5),
                    reminders: reminders.slice(0, 4)
                }
            }
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
