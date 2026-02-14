import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Purchase from '@/models/Purchase';
import Vendor from '@/models/Vendor';

// GET: Fetch Purchases (By Vendor or All)
export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const vendorId = searchParams.get('vendorId');
        const summary = searchParams.get('summary');

        // IF SUMMARY REQUESTED (For Dashboard Stats)
        if (summary === 'true') {
            const allPurchases = await Purchase.find({});

            const totalSpent = allPurchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
            const paidAmount = allPurchases.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
            const remainingAmount = allPurchases.reduce((sum, p) => sum + (p.balance || 0), 0);
            const unpaidBills = allPurchases.filter(p => p.balance > 0).length;

            return NextResponse.json({
                success: true,
                stats: {
                    totalSpent,
                    paidAmount,
                    remainingAmount,
                    unpaidBills
                }
            });
        }

        // REGULAR FETCH
        const filter: any = {};
        if (vendorId) filter.vendorId = vendorId;

        const purchases = await Purchase.find(filter)
            .populate('vendorId', 'name type') // Populate Vendor Name & Type
            .sort({ date: -1, createdAt: -1 });

        return NextResponse.json({ success: true, data: purchases });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST: Create New Purchase
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        const { vendorId, items, totalAmount, paidAmount, date, notes } = body;

        if (!vendorId || !items || items.length === 0) {
            return NextResponse.json({ success: false, error: "Invalid Data" }, { status: 400 });
        }

        // 1. Create Purchase
        const balance = totalAmount - paidAmount;
        const purchase = await Purchase.create({
            vendorId,
            items,
            totalAmount,
            paidAmount,
            balance,
            date,
            notes
        });

        // 2. Update Vendor Outstanding Amount
        // If balance is positive, we owe money (Increase outstanding)
        // If we paid full, balance is 0. 
        // Logic: Outstanding Amount = Existing + New Balance
        // NOTE: If we paid EXTRA (negative balance?), we usually don't support that here yet.

        if (balance !== 0) {
            await Vendor.findByIdAndUpdate(vendorId, {
                $inc: { outstandingAmount: balance }
            });
        }

        return NextResponse.json({ success: true, message: "Purchase recorded successfully", data: purchase });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
