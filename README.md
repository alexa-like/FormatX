# AI Resume Builder

AI-powered resume and cover letter builder that tailors applications to specific job descriptions. Optimized for ATS (Applicant Tracking Systems) to help job seekers land interviews.

---

## Why This Project?

- **Evergreen demand** - People always need jobs, always need resume help
- **Clear monetization** - Freemium model with proven willingness to pay
- **Low API costs** - Text-based AI calls are cheap ($0.01-0.05 per resume)
- **Scalable** - Can expand to LinkedIn optimizer, interview prep, job matching

---

## Tech Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | Next.js 14+ | Free (Render) |
| Backend API | Next.js API Routes | Free (Render) |
| Database | MongoDB Atlas | Free (512MB) |
| AI Models | OpenRouter | Pay-per-use (~$0.02/resume) |
| Auth | NextAuth.js | Free |
| Payments | Stripe | Free until revenue |
| Hosting | Render (Web Service) | Free |
| Keep-Alive | Render (Cron Service) | Free |
| CDN | Cloudflare | Free |
| Email | Resend | Free (100/day) |

---

## Features

### MVP (Week 1-2)
- [ ] User registration/login (Google + Email)
- [ ] Resume builder with drag-and-drop sections
- [ ] AI resume optimization (paste job description → get optimized resume)
- [ ] ATS score checker
- [ ] Export to PDF
- [ ] 3 free resumes/month limit

### Phase 2 (Week 3-4)
- [ ] AI cover letter generator
- [ ] Resume templates (3-5 designs)
- [ ] Job description parser
- [ ] History of all resumes
- [ ] Stripe subscription integration

### Phase 3 (Month 2)
- [ ] LinkedIn profile optimizer
- [ ] Interview question generator
- [ ] Resume analytics (views, downloads)
- [ ] Team/agency plan
- [ ] API access for developers

---

## Database Schema (MongoDB)

```
Users Collection:
{
  _id: ObjectId,
  email: String,
  name: String,
  image: String,
  plan: "free" | "pro" | "enterprise",
  creditsRemaining: Number,
  stripeCustomerId: String,
  createdAt: Date,
  updatedAt: Date
}

Resumes Collection:
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  title: String,
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    website: String,
    summary: String
  },
  experience: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    description: String,
    achievements: [String]
  }],
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: Date,
    endDate: Date,
    gpa: String
  }],
  skills: [String],
  languages: [String],
  certifications: [String],
  atsScore: Number,
  jobDescription: String,
  aiOptimized: Boolean,
  templateId: String,
  createdAt: Date,
  updatedAt: Date
}

CoverLetters Collection:
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  resumeId: ObjectId (ref: Resumes),
  jobTitle: String,
  company: String,
  jobDescription: String,
  content: String,
  tone: "professional" | "friendly" | "confident",
  createdAt: Date
}

Usage Collection:
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  type: "resume_optimize" | "cover_letter" | "ats_check",
  count: Number,
  month: String, // "2026-08"
  createdAt: Date
}
```

---

## API Endpoints

```
GET    /api/health                   - Health check (for cron ping)

POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
GET    /api/user/profile         - Get user profile
PUT    /api/user/profile         - Update user profile

POST   /api/resume/create        - Create new resume
GET    /api/resume/list          - List user's resumes
GET    /api/resume/[id]          - Get resume by ID
PUT    /api/resume/[id]          - Update resume
DELETE /api/resume/[id]          - Delete resume

POST   /api/resume/optimize      - AI optimize resume for job
POST   /api/resume/ats-check     - Check ATS score
POST   /api/resume/export/pdf    - Export resume as PDF

POST   /api/cover-letter/create  - Generate cover letter
GET    /api/cover-letter/list    - List user's cover letters

POST   /api/stripe/checkout      - Create Stripe checkout
POST   /api/stripe/webhook       - Handle Stripe webhooks
```

---

## AI Prompts

### Resume Optimization Prompt
```
You are an expert ATS resume optimizer. Given the following resume and job description:

RESUME:
{resume_content}

JOB DESCRIPTION:
{job_description}

Optimize the resume by:
1. Incorporating relevant keywords from the job description
2. Quantifying achievements with metrics where possible
3. Using strong action verbs
4. Ensuring ATS-friendly formatting
5. Maintaining truthfulness - only enhance existing content

Return the optimized resume in JSON format.
```

### ATS Score Check Prompt
```
Analyze this resume for ATS compatibility:

{resume_content}

Rate each category 0-100:
- Keyword relevance
- Format compatibility
- Section completeness
- Action verb usage
- Quantified achievements

Provide an overall ATS score and specific improvement suggestions.
```

---

## Environment Variables

```env
# MongoDB (from MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-builder

# OpenRouter (for AI)
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxx

# NextAuth
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=https://resume-builder.onrender.com

# Google OAuth (for login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_live_xxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxx

# Resend (for email)
RESEND_API_KEY=re_xxxxxxxx

# App URL
NEXT_PUBLIC_APP_URL=https://resume-builder.onrender.com
```

---

## Monetization Strategy

### Free Tier
- 3 resume optimizations/month
- 1 cover letter/month
- Basic ATS check
- 1 template

### Pro Plan ($29/month)
- Unlimited resume optimizations
- Unlimited cover letters
- Advanced ATS scoring
- All templates
- Priority support
- Export to multiple formats

### Enterprise ($99/month)
- Team accounts (up to 10)
- Custom branding
- API access
- Dedicated support
- Custom templates

---

## Deployment (Render Blueprint)

### Prerequisites
- GitHub repository connected to Render
- MongoDB Atlas connection string
- OpenRouter API key

### Step 1: Connect Repo to Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Blueprint**
3. Connect your GitHub repo `alexa-like/FormatX`
4. Render will detect `render.yaml` automatically

### Step 2: Set Environment Variables
In Render Dashboard → resume-builder service → Environment:

```
MONGODB_URI=mongodb+srv://your-connection-string
OPENROUTER_API_KEY=sk-or-your-key
NEXTAUTH_SECRET=your-random-secret
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret
STRIPE_SECRET_KEY=sk-your-stripe-key
STRIPE_WEBHOOK_SECRET=whsec-your-webhook-secret
RESEND_API_KEY=re_your-resend-key
```

### Step 3: Deploy
Click **Deploy** → Render will:
1. Build the Next.js app
2. Start the web service
3. Start the cron ping service (every 5 minutes)

### Step 4: Verify
- Web Service: `https://resume-builder.onrender.com`
- Health Check: `https://resume-builder.onrender.com/api/health`
- Cron Logs: Check Render dashboard → ping-service → Logs

### How the Keep-Alive Works
- **Cron Service** runs every 5 minutes
- Hits `/api/health` endpoint
- Prevents free tier from sleeping
- Zero downtime, always responsive

---

## Revenue Projections

| Users | Conversion | MRR | ARR |
|-------|-----------|-----|-----|
| 1,000 | 5% | $1,450 | $17,400 |
| 5,000 | 5% | $7,250 | $87,000 |
| 10,000 | 5% | $14,500 | $174,000 |
| 50,000 | 5% | $72,500 | $870,000 |

---

## File Structure

```
resume-builder/
├── README.md
├── render.yaml              ← Render Blueprint (web + cron)
├── ping.js                  ← Keep-alive script for cron
├── package.json
├── next.config.js
├── tailwind.config.js
├── .env.local
├── public/
│   └── templates/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── resume/
│   │   │   │   ├── new/page.tsx
│   │   │   │   ├── [id]/page.tsx
│   │   │   │   └── list/page.tsx
│   │   │   ├── cover-letter/
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── list/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── resume/
│   │       │   ├── create/route.ts
│   │       │   ├── list/route.ts
│   │       │   ├── [id]/route.ts
│   │       │   ├── optimize/route.ts
│   │       │   └── ats-check/route.ts
│   │       ├── cover-letter/
│   │       │   └── create/route.ts
│   │       └── stripe/
│   │           ├── checkout/route.ts
│   │           └── webhook/route.ts
│   ├── components/
│   │   ├── ui/
│   │   ├── ResumeBuilder.tsx
│   │   ├── ResumePreview.tsx
│   │   ├── ATSScore.tsx
│   │   └── CoverLetterForm.tsx
│   ├── lib/
│   │   ├── mongodb.ts
│   │   ├── openrouter.ts
│   │   ├── stripe.ts
│   │   └── auth.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Resume.ts
│   │   ├── CoverLetter.ts
│   │   └── Usage.ts
│   └── types/
│       └── index.ts
└── docs/
    └── api.md
```

---

## Build Order

1. **Day 1:** Project setup, health check endpoint, MongoDB connection, auth
2. **Day 2-3:** Resume CRUD operations, form builder UI
3. **Day 4-5:** AI optimization, ATS scoring
4. **Day 6-7:** PDF export, templates
5. **Day 8-9:** Cover letter generator
6. **Day 10-11:** Stripe integration, payment flow
7. **Day 12-14:** Testing, polish, deploy to Render

---

## Open Source Tools Used

- **Next.js** - React framework
- **Tailwind CSS** - Styling
- **Shadcn/UI** - Component library
- **MongoDB** - Database
- **NextAuth.js** - Authentication
- **Puppeteer** - PDF generation (or @react-pdf/renderer)
- **Zod** - Schema validation
- **Stripe** - Payments

---

## License

MIT
