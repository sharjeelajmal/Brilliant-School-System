import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Vendor from '@/models/Vendor';

// GET: Fetch all vendors
export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const search = searchParams.get('search');
        const summary = searchParams.get('summary');

        let query: any = { status: 'Active' };

        // Filters
        if (type && type !== 'All') query.type = type;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { contactPerson: { $regex: search, $options: 'i' } }
            ];
        }

        const vendors = await Vendor.find(query).sort({ createdAt: -1 });

        if (summary === 'true') {
            const allVendors = await Vendor.find({ status: 'Active' });
            const total = allVendors.length;
            const stationary = allVendors.filter(v => v.type === 'Stationary').length;
            const furniture = allVendors.filter(v => v.type === 'Furniture').length;
            const other = allVendors.filter(v => v.type !== 'Stationary' && v.type !== 'Furniture').length;

            return NextResponse.json({
                success: true,
                data: vendors,
                summary: { total, stationary, furniture, other }
            });
        }

        return NextResponse.json({ success: true, data: vendors });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST: Add new vendor
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        // Basic validation
        if (!body.name || !body.type) {
            return NextResponse.json({ success: false, error: "Name and Type are required" }, { status: 400 });
        }

        const vendor = await Vendor.create(body);
        return NextResponse.json({ success: true, message: "Supplier added successfully", data: vendor }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PUT: Update vendor
export async function PUT(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { _id, ...updateData } = body;

        if (!_id) return NextResponse.json({ success: false, error: "Vendor ID required" }, { status: 400 });

        const vendor = await Vendor.findByIdAndUpdate(_id, updateData, { new: true });

        if (!vendor) return NextResponse.json({ success: false, error: "Vendor not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Supplier updated", data: vendor });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE: Delete (or soft delete) vendor
export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

        // Soft delete
        const vendor = await Vendor.findByIdAndUpdate(id, { status: 'Inactive' }, { new: true });

        if (!vendor) return NextResponse.json({ success: false, error: "Vendor not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Supplier removed" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
