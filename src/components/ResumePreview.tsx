'use client';

interface ResumePreviewProps {
  resume: any;
}

export default function ResumePreview({ resume }: ResumePreviewProps) {
  if (!resume) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
        No resume data to preview
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center border-b border-gray-200 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {resume.personalInfo?.fullName || 'Your Name'}
        </h1>
        <div className="mt-2 text-gray-600 space-y-1">
          {resume.personalInfo?.email && <p>{resume.personalInfo.email}</p>}
          {resume.personalInfo?.phone && <p>{resume.personalInfo.phone}</p>}
          {resume.personalInfo?.location && <p>{resume.personalInfo.location}</p>}
          <div className="flex justify-center gap-4 mt-2">
            {resume.personalInfo?.linkedin && (
              <a
                href={resume.personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                LinkedIn
              </a>
            )}
            {resume.personalInfo?.website && (
              <a
                href={resume.personalInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {resume.personalInfo?.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-3">
            Professional Summary
          </h2>
          <p className="text-gray-700 whitespace-pre-wrap">
            {resume.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {resume.experience?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-3">
            Work Experience
          </h2>
          <div className="space-y-4">
            {resume.experience.map((exp: any, index: number) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-700">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                    {exp.description}
                  </p>
                )}
                {exp.achievements?.length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-gray-700">
                    {exp.achievements.map((achievement: string, i: number) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-3">
            Education
          </h2>
          <div className="space-y-3">
            {resume.education.map((edu: any, index: number) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-gray-700">{edu.institution}</p>
                  {edu.gpa && (
                    <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resume.skills?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-3">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill: string, index: number) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {resume.languages?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-3">
            Languages
          </h2>
          <p className="text-gray-700">{resume.languages.join(', ')}</p>
        </div>
      )}

      {/* Certifications */}
      {resume.certifications?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-3">
            Certifications
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            {resume.certifications.map((cert: string, index: number) => (
              <li key={index}>{cert}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
