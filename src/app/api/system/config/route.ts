import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import SystemConfig from '@/models/SystemConfig';

export async function GET() {
  try {
    await connectDB();
    let config = await SystemConfig.findOne({ key: 'software_status' });
    
    if (!config) {
      config = await SystemConfig.create({ key: 'software_status', isSoftwareActive: true });
    }
    
    return NextResponse.json({ success: true, isSoftwareActive: config.isSoftwareActive });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { isSoftwareActive } = await req.json();
    
    const config = await SystemConfig.findOneAndUpdate(
      { key: 'software_status' },
      { isSoftwareActive, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ success: true, isSoftwareActive: config.isSoftwareActive });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
