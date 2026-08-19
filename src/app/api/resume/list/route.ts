export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const resumes = await db
      .collection('resumes')
      .find({ userId: (session.user as any).id })
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, resumes });
  } catch (error) {
    console.error('List resumes error:', error);
    return NextResponse.json({ error: 'Failed to list resumes' }, { status: 500 });
  }
}