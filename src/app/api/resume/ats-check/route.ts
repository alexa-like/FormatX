import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { checkATSScore } from '@/lib/openrouter';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { resumeId } = await request.json();

    if (!resumeId) {
      return NextResponse.json({ error: 'Resume ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const resume = await db.collection('resumes').findOne({
      _id: new ObjectId(resumeId),
      userId: (session.user as any).id,
    });

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Format resume content for AI
    const resumeContent = `
Name: ${resume.personalInfo.fullName}
Email: ${resume.personalInfo.email}
Phone: ${resume.personalInfo.phone}
Location: ${resume.personalInfo.location}
Summary: ${resume.personalInfo.summary}

Experience:
${resume.experience.map((exp: any) => `
- ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate})
  ${exp.description}
  Achievements: ${exp.achievements.join(', ')}
`).join('\n')}

Education:
${resume.education.map((edu: any) => `
- ${edu.degree} in ${edu.field} from ${edu.institution} (${edu.startDate} - ${edu.endDate})
`).join('\n')}

Skills: ${resume.skills.join(', ')}
Languages: ${resume.languages.join(', ')}
Certifications: ${resume.certifications.join(', ')}
    `.trim();

    // Check ATS score with AI
    const atsResult = await checkATSScore(resumeContent);

    // Parse the result (expecting JSON)
    let parsedResult;
    try {
      parsedResult = JSON.parse(atsResult);
    } catch {
      parsedResult = { overall: 75, suggestions: ['Could not parse AI response'] };
    }

    // Update resume with ATS score
    await db.collection('resumes').updateOne(
      { _id: new ObjectId(resumeId) },
      {
        $set: {
          atsScore: parsedResult.overall || 75,
          updatedAt: new Date(),
        },
      }
    );

    // Log usage
    await db.collection('usage').insertOne({
      userId: (session.user as any).id,
      type: 'ats_check',
      count: 1,
      month: new Date().toISOString().slice(0, 7),
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, atsResult: parsedResult });
  } catch (error) {
    console.error('ATS check error:', error);
    return NextResponse.json({ error: 'Failed to check ATS score' }, { status: 500 });
  }
}
