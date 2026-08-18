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

    const { searchParams } = new URL(request.url);
    const payload = searchParams.get('payload');

    if (!payload) {
      return NextResponse.json({ error: 'Payload is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({
      _id: (session.user as any).id,
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      plan: user.plan,
      creditsRemaining: user.creditsRemaining,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
