import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Payroll from '@/models/Payroll';
import Teacher from '@/models/Teacher';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// GET — Fetch payroll records with filters + summary mode
export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const month = searchParams.get('month');
        const year = searchParams.get('year');
        const status = searchParams.get('status');
        const teacherId = searchParams.get('teacherId');
        const search = searchParams.get('search');
        const summary = searchParams.get('summary');
        const generate = searchParams.get('generate');

        const currentMonth = MONTHS[new Date().getMonth()];
        const currentYear = new Date().getFullYear();
        const filterMonth = month || currentMonth;
        const filterYear = Number(year) || currentYear;

        // Generate: auto-create payroll records for all teachers if not exist for this month
        if (generate === 'true') {
            const teachers = await Teacher.find({});
            for (const teacher of teachers) {
                const exists = await Payroll.findOne({ teacherId: teacher._id.toString(), month: filterMonth, year: filterYear });
                if (!exists) {
                    const baseSalary = teacher.monthlySalary || 0;
                    const allowance = teacher.allowance || 0;
                    const lateFine = teacher.lateFine || 0;
                    const absentFine = teacher.absentFine || 0;
                    const leavingFine = teacher.leavingFine || 0;
                    const totalSalary = baseSalary + allowance;
                    const totalDeductions = lateFine + absentFine + leavingFine;
                    const netSalary = totalSalary - totalDeductions;

                    await Payroll.create({
                        teacherId: teacher._id.toString(),
                        teacherName: `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim(),
                        className: teacher.assignedClass || '',
                        section: teacher.assignedSection || '',
                        month: filterMonth,
                        year: filterYear,
                        baseSalary,
                        allowance,
                        lateFine,
                        absentFine,
                        leavingFine,
                        otherDeduction: 0,
                        totalSalary,
                        totalDeductions,
                        netSalary,
                        givenAmount: 0,
                        status: 'Unpaid',
                        paymentDate: '',
                        notes: '',
                    });
                }
            }
        }

        // Build filter
        const filter: any = { month: filterMonth, year: filterYear };
        if (status && status !== 'All') filter.status = status;
        if (teacherId) filter.teacherId = teacherId;

        let payrolls = await Payroll.find(filter).sort({ teacherName: 1 });

        // Search filter
        if (search) {
            const q = search.toLowerCase();
            payrolls = payrolls.filter((p: any) =>
                p.teacherName.toLowerCase().includes(q) ||
                p.className.toLowerCase().includes(q) ||
                p.section.toLowerCase().includes(q)
            );
        }

        // Summary mode
        if (summary === 'true') {
            const allPayrolls = await Payroll.find({ month: filterMonth, year: filterYear });
            const totalSalary = allPayrolls.reduce((sum, p) => sum + p.netSalary, 0);
            const givenSalary = allPayrolls.reduce((sum, p) => sum + p.givenAmount, 0);
            const remainingSalary = totalSalary - givenSalary;
            const teachersUnpaid = allPayrolls.filter(p => p.status === 'Unpaid').length;

            return NextResponse.json({
                success: true,
                data: payrolls,
                summary: {
                    totalSalary,
                    givenSalary,
                    remainingSalary,
                    teachersUnpaid,
                }
            });
        }

        return NextResponse.json({ success: true, data: payrolls });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST — Pay salary (create or update payroll)
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { teacherId, month, year, givenAmount, lateFine, absentFine, leavingFine, otherDeduction, notes, paymentDate } = body;

        if (!teacherId || !month || !year) {
            return NextResponse.json({ success: false, error: 'Teacher, Month aur Year required hain' }, { status: 400 });
        }

        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return NextResponse.json({ success: false, error: 'Teacher not found' }, { status: 404 });
        }

        const baseSalary = teacher.monthlySalary || 0;
        const allowance = teacher.allowance || 0;
        const totalSalary = baseSalary + allowance;
        const fLateFine = lateFine ?? teacher.lateFine ?? 0;
        const fAbsentFine = absentFine ?? teacher.absentFine ?? 0;
        const fLeavingFine = leavingFine ?? teacher.leavingFine ?? 0;
        const fOtherDeduction = otherDeduction ?? 0;
        const totalDeductions = fLateFine + fAbsentFine + fLeavingFine + fOtherDeduction;
        const netSalary = totalSalary - totalDeductions;
        const paid = givenAmount || 0;

        let status: string = 'Unpaid';
        if (paid >= netSalary) status = 'Paid';
        else if (paid > 0) status = 'Partial Paid';

        // Upsert
        const payroll = await Payroll.findOneAndUpdate(
            { teacherId, month, year },
            {
                teacherName: `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim(),
                className: teacher.assignedClass || '',
                section: teacher.assignedSection || '',
                baseSalary,
                allowance,
                lateFine: fLateFine,
                absentFine: fAbsentFine,
                leavingFine: fLeavingFine,
                otherDeduction: fOtherDeduction,
                totalSalary,
                totalDeductions,
                netSalary,
                givenAmount: paid,
                status,
                paymentDate: paymentDate || new Date().toISOString().split('T')[0],
                notes: notes || '',
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, data: payroll, message: `Salary ${status === 'Paid' ? 'paid' : 'updated'} successfully` });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PUT — Update payroll
export async function PUT(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { id, ...updateData } = body;

        if (!id) return NextResponse.json({ success: false, error: 'Payroll ID required' }, { status: 400 });

        // Recalculate status if givenAmount is being updated
        if (updateData.givenAmount !== undefined) {
            const existing = await Payroll.findById(id);
            if (existing) {
                if (updateData.givenAmount >= existing.netSalary) updateData.status = 'Paid';
                else if (updateData.givenAmount > 0) updateData.status = 'Partial Paid';
                else updateData.status = 'Unpaid';
            }
        }

        const payroll = await Payroll.findByIdAndUpdate(id, updateData, { new: true });
        if (!payroll) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

        return NextResponse.json({ success: true, data: payroll, message: 'Payroll updated' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE — Delete payroll record
export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ success: false, error: 'Payroll ID required' }, { status: 400 });

        const payroll = await Payroll.findByIdAndDelete(id);
        if (!payroll) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Payroll deleted' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
