import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ 
      status: 'Success', 
      message: 'MongoDB Connected Successfully! 🚀' 
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'Error', 
      message: 'Database Connection Failed', 
      error: error.message 
    }, { status: 500 });
  }
}