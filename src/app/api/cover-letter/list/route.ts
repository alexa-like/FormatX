import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const coverLetters = await db
      .collection('coverletters')
      .find({ userId: (session.user as any).id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, coverLetters });
  } catch (error) {
    console.error('List cover letters error:', error);
    return NextResponse.json(
      { error: 'Failed to list cover letters' },
      { status: 500 }
    );
  }
}
