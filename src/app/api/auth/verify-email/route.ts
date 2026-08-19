export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/mongodb';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json({ success: true, message: 'If an account exists, a verification email was sent.' });
    }

    if (user.emailVerified) {
      return NextResponse.json({ success: true, message: 'Email is already verified.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.collection('users').updateOne(
      { email },
      { $set: { verificationToken: token, verificationExpires: expires } }
    );

    await sendVerificationEmail(email, token);

    return NextResponse.json({ success: true, message: 'Verification email sent.' });
  } catch (error) {
    console.error('Send verification email error:', error);
    return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({
      verificationToken: token,
      verificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: { emailVerified: new Date() },
        $unset: { verificationToken: '', verificationExpires: '' },
      }
    );

    return NextResponse.json({ success: true, message: 'Email verified successfully.' });
  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json({ error: 'Failed to verify email' }, { status: 500 });
  }
}
