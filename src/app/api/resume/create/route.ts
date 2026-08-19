export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { db } = await connectToDatabase();

    const resume = {
      userId: (session.user as any).id,
      title: body.title || 'Untitled Resume',
      personalInfo: body.personalInfo || {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        website: '',
        summary: '',
      },
      experience: body.experience || [],
      education: body.education || [],
      skills: body.skills || [],
      languages: body.languages || [],
      certifications: body.certifications || [],
      aiOptimized: false,
      templateId: body.templateId || 'default',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('resumes').insertOne(resume);

    return NextResponse.json({
      success: true,
      resume: { ...resume, _id: result.insertedId },
    });
  } catch (error) {
    console.error('Create resume error:', error);
    return NextResponse.json({ error: 'Failed to create resume' }, { status: 500 });
  }
}