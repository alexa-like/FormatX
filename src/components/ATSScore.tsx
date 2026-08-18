'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface ATSScoreProps {
  resumeId: string;
  initialScore?: number;
}

export default function ATSScore({ resumeId, initialScore }: ATSScoreProps) {
  const [score, setScore] = useState(initialScore || null);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<any>(null);

  const checkATSScore = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/resume/ats-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId }),
      });

      const data = await response.json();

      if (data.success) {
        setScore(data.atsResult.overall);
        setDetails(data.atsResult);
        toast.success('ATS score calculated!');
      } else {
        toast.error(data.error || 'Failed to calculate ATS score');
      }
    } catch (error) {
      toast.error('Failed to calculate ATS score');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">ATS Score Check</h3>

      {score !== null ? (
        <div>
          <div
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBg(
              score
            )} mb-4`}
          >
            <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
          </div>

          {details?.categories && (
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Keyword Relevance</span>
                <span className="font-medium">
                  {details.categories.keywordRelevance || 0}/100
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Format Compatibility</span>
                <span className="font-medium">
                  {details.categories.formatCompatibility || 0}/100
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Section Completeness</span>
                <span className="font-medium">
                  {details.categories.sectionCompleteness || 0}/100
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Action Verb Usage</span>
                <span className="font-medium">
                  {details.categories.actionVerbUsage || 0}/100
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Quantified Achievements</span>
                <span className="font-medium">
                  {details.categories.quantifiedAchievements || 0}/100
                </span>
              </div>
            </div>
          )}

          {details?.suggestions?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Suggestions:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {details.suggestions.map((suggestion: string, index: number) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={checkATSScore}
            disabled={loading}
            className="mt-4 w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Re-check Score'}
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            Check how well your resume scores with Applicant Tracking Systems
          </p>
          <button
            onClick={checkATSScore}
            disabled={loading}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Check ATS Score'}
          </button>
        </div>
      )}
    </div>
  );
}
