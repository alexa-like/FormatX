'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface CoverLetterFormProps {
  resumes: any[];
  onGenerated?: (coverLetter: any) => void;
}

export default function CoverLetterForm({ resumes, onGenerated }: CoverLetterFormProps) {
  const [formData, setFormData] = useState({
    resumeId: '',
    jobTitle: '',
    company: '',
    jobDescription: '',
    tone: 'professional',
  });
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!formData.resumeId || !formData.jobTitle || !formData.company || !formData.jobDescription) {
      toast.error('Please fill in all required fields');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/cover-letter/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.coverLetter.content);
        toast.success('Cover letter generated!');
        onGenerated?.(data.coverLetter);
      } else {
        toast.error(data.error || 'Failed to generate cover letter');
      }
    } catch (error) {
      toast.error('Failed to generate cover letter');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast.success('Copied to clipboard!');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Generate Cover Letter</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Resume *
          </label>
          <select
            value={formData.resumeId}
            onChange={(e) => setFormData({ ...formData, resumeId: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Select a resume</option>
            {resumes.map((resume) => (
              <option key={resume._id} value={resume._id}>
                {resume.title || resume.personalInfo?.fullName || 'Untitled'}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Software Engineer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company *
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Google"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Description *
          </label>
          <textarea
            value={formData.jobDescription}
            onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Paste the job description here..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tone
          </label>
          <select
            value={formData.tone}
            onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="confident">Confident</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
        >
          {generating ? 'Generating...' : 'Generate Cover Letter'}
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Generated Cover Letter</h4>
            <button
              onClick={copyToClipboard}
              className="text-primary-600 hover:text-primary-700 text-sm"
            >
              Copy to Clipboard
            </button>
          </div>
          <div className="whitespace-pre-wrap text-gray-700 text-sm">{result}</div>
        </div>
      )}
    </div>
  );
}
