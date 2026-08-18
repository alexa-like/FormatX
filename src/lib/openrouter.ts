const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function chatCompletion(
  messages: ChatMessage[],
  model: string = 'openai/gpt-4o-mini'
): Promise<string> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'Resume Builder',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${error}`);
  }

  const data: OpenRouterResponse = await response.json();
  return data.choices[0].message.content;
}

export async function optimizeResume(
  resumeContent: string,
  jobDescription: string
): Promise<string> {
  const systemPrompt = `You are an expert ATS resume optimizer. Given a resume and job description, optimize the resume by:
1. Incorporating relevant keywords from the job description
2. Quantifying achievements with metrics where possible
3. Using strong action verbs
4. Ensuring ATS-friendly formatting
5. Maintaining truthfulness - only enhance existing content

Return the optimized resume in a clean, structured format.`;

  const userPrompt = `RESUME:\n${resumeContent}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nPlease optimize this resume for the job description above.`;

  return chatCompletion([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);
}

export async function checkATSScore(resumeContent: string): Promise<string> {
  const systemPrompt = `You are an ATS (Applicant Tracking System) analyzer. Analyze the resume and provide:
1. Overall ATS score (0-100)
2. Category scores:
   - Keyword relevance (0-100)
   - Format compatibility (0-100)
   - Section completeness (0-100)
   - Action verb usage (0-100)
   - Quantified achievements (0-100)
3. Specific improvement suggestions

Return the analysis in a structured JSON format.`;

  const userPrompt = `Analyze this resume for ATS compatibility:\n\n${resumeContent}`;

  return chatCompletion([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);
}

export async function generateCoverLetter(
  resumeContent: string,
  jobDescription: string,
  company: string,
  jobTitle: string,
  tone: string = 'professional'
): Promise<string> {
  const systemPrompt = `You are an expert cover letter writer. Generate a compelling cover letter based on the resume and job description. The tone should be ${tone}. Keep it concise (250-350 words) and personalized for the company.`;

  const userPrompt = `RESUME:\n${resumeContent}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nCOMPANY: ${company}\nJOB TITLE: ${jobTitle}\n\nPlease write a cover letter for this position.`;

  return chatCompletion([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);
}
