import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Fee from '@/models/Fee';
import Student from '@/models/Student';

// GET: Fetch Fees (by Student ID, Parent CNIC, or Monthly Collection Summary)
export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const studentId = searchParams.get('studentId');
        const parentCnic = searchParams.get('parentCnic');
        const monthFilter = searchParams.get('month');
        const yearFilter = searchParams.get('year');
        const statusFilter = searchParams.get('status');
        const summary = searchParams.get('summary');
        const search = searchParams.get('search');

        // --- SUMMARY MODE: Monthly Fee Collection Dashboard ---
        if (summary === 'true') {
            const now = new Date();
            const targetMonth = monthFilter || now.toLocaleString('default', { month: 'long' });
            const targetYear = parseInt(yearFilter || String(now.getFullYear()));

            // Get all students with their monthly fees
            const allStudents = await Student.find({}, {
                _id: 1, rollNo: 1, firstName: 1, lastName: 1,
                parentFirstName: 1, parentLastName: 1, parentCnic: 1,
                monthlyFee: 1, classJoining: 1, section: 1, mobileNo: 1, whatsappNo: 1
            }).sort({ rollNo: 1 });

            // Get fees for this month/year
            const monthFees = await Fee.find({ month: targetMonth, year: targetYear, feeType: 'Monthly Fee' });

            // Build student fee map
            const feeMap: any = {};
            const activeIds = new Set(allStudents.map((s: any) => s._id.toString()));
            
            // Only count fees for students who are in the active list
            const validFees = monthFees.filter((f: any) => activeIds.has(f.studentId.toString()));

            validFees.forEach((f: any) => {
                feeMap[f.studentId.toString()] = f;
            });

            // Build combined data
            let students = allStudents.map((s: any) => {
                const fee = feeMap[s._id.toString()];
                const totalFee = s.monthlyFee || 0;
                let status = 'Unpaid';
                let paidAmount = 0;
                let feeDate = null;
                let feeId = null;

                if (fee) {
                    paidAmount = fee.amount || 0;
                    feeDate = fee.date;
                    feeId = fee._id;
                    if (paidAmount >= totalFee) {
                        status = 'Paid';
                    } else if (paidAmount > 0) {
                        status = 'Partial Paid';
                    }
                }

                return {
                    studentId: s._id,
                    rollNo: s.rollNo,
                    studentName: `${s.firstName} ${s.lastName}`,
                    parentName: `${s.parentFirstName || ''} ${s.parentLastName || ''}`.trim(),
                    parentCnic: s.parentCnic,
                    className: s.classJoining,
                    section: s.section,
                    totalFee,
                    paidAmount,
                    status,
                    dueDate: `10/${targetMonth}/${targetYear}`,
                    feeDate,
                    feeId,
                    mobileNo: s.mobileNo,
                    whatsappNo: s.whatsappNo
                };
            });

            // Apply filters
            if (statusFilter && statusFilter !== 'All') {
                students = students.filter((s: any) => s.status === statusFilter);
            }
            if (search) {
                const q = search.toLowerCase();
                students = students.filter((s: any) =>
                    s.studentName.toLowerCase().includes(q) ||
                    s.parentName.toLowerCase().includes(q) ||
                    String(s.rollNo).includes(q)
                );
            }

            // Calculate summary stats
            const totalFeeSum = allStudents.reduce((sum: number, s: any) => sum + (s.monthlyFee || 0), 0);
            const collectedFee = students.reduce((sum: number, s: any) => sum + (s.paidAmount || 0), 0);
            const remainingFee = totalFeeSum - collectedFee;
            const studentsUnpaid = allStudents.filter((s: any) => !feeMap[s._id.toString()]).length;

            return NextResponse.json({
                success: true,
                data: students,
                summary: {
                    totalFee: totalFeeSum,
                    collectedFee,
                    remainingFee: Math.max(0, remainingFee),
                    studentsUnpaid,
                    totalStudents: allStudents.length,
                    month: targetMonth,
                    year: targetYear
                }
            });
        }

        // --- NORMAL MODE: Filter by studentId or parentCnic ---
        let query: any = {};
        if (studentId) query.studentId = studentId;
        if (parentCnic) query.parentCnic = parentCnic;
        if (monthFilter) query.month = monthFilter;
        if (yearFilter) query.year = parseInt(yearFilter);
        if (statusFilter && statusFilter !== 'All') query.status = statusFilter;

        const fees = await Fee.find(query).sort({ date: -1 });
        return NextResponse.json({ success: true, data: fees });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch fees' }, { status: 500 });
    }
}

// POST: Submit New Fee
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { studentId, feeType, amount, month, year, status, lateFine } = body;

        // Verify Student exists
        const student = await Student.findById(studentId);
        if (!student) return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });

        const finalParentCnic = body.parentCnic || student.parentCnic;
        if (!finalParentCnic) return NextResponse.json({ success: false, error: 'Parent CNIC is missing from Student record' }, { status: 400 });

        const newFee = await Fee.create({
            studentId,
            studentName: student.firstName + ' ' + student.lastName,
            parentCnic: finalParentCnic,
            feeType,
            amount,
            month,
            year,
            status: status || 'Paid',
            lateFine: lateFine || 0,
            date: new Date()
        });

        return NextResponse.json({ success: true, data: newFee });
    } catch (error: any) {
        console.error("Fee Submission Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
