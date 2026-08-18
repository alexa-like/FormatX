export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface Resume {
  _id?: string;
  userId: string;
  title: string;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: string[];
  certifications: string[];
  atsScore?: number;
  jobDescription?: string;
  aiOptimized: boolean;
  templateId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CoverLetter {
  _id?: string;
  userId: string;
  resumeId: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  content: string;
  tone: 'professional' | 'friendly' | 'confident';
  createdAt: Date;
}

export interface User {
  _id?: string;
  email: string;
  name: string;
  image?: string;
  plan: 'free' | 'pro' | 'enterprise';
  creditsRemaining: number;
  telegramId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Usage {
  _id?: string;
  userId: string;
  type: 'resume_optimize' | 'cover_letter' | 'ats_check';
  count: number;
  month: string;
  createdAt: Date;
}

export interface ATSScoreResult {
  overall: number;
  categories: {
    keywordRelevance: number;
    formatCompatibility: number;
    sectionCompleteness: number;
    actionVerbUsage: number;
    quantifiedAchievements: number;
  };
  suggestions: string[];
}
