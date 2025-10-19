// components/MSTGenerator.tsx
'use client';

import { useState } from 'react';

interface GenerationResponse {
  message?: string;
  structure?: any;
  outputPath?: string;
  error?: string;
  details?: string;
}

export default function MSTGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateMST = async () => {
    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate-mst', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: GenerationResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate MST');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Module Structure Generator
        </h2>
        
        <p className="text-gray-600 mb-6">
          Generate the mst.json file by scanning the public/Modules directory structure.
        </p>

        <button
          onClick={generateMST}
          disabled={isGenerating}
          className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
            isGenerating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            'Generate mst.json'
          )}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg">
            <h3 className="text-red-800 font-semibold mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-4 space-y-4">
            {result.message && (
              <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                <h3 className="text-green-800 font-semibold mb-2">Success</h3>
                <p className="text-green-700">{result.message}</p>
                {result.outputPath && (
                  <p className="text-green-600 text-sm mt-1">
                    File available at: <code className="bg-green-200 px-1 rounded">{result.outputPath}</code>
                  </p>
                )}
              </div>
            )}

            {result.structure && (
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
                <h3 className="text-gray-800 font-semibold mb-2">Generated Structure</h3>
                <pre className="text-sm text-gray-700 overflow-x-auto bg-white p-3 rounded border">
                  {JSON.stringify(result.structure, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500">
          <h4 className="font-semibold mb-2">Expected Directory Structure:</h4>
          <pre className="bg-gray-50 p-3 rounded border text-xs">
{`public/
  Modules/
    cardio/
      anatomy/
        topic1/
        topic2/
        topic3/
      Biochemistry/
        topic1/
        topic2/
        topic3/
    HEM/
      anatomy/
        topic1/
        topic2/
        topic3/
      Biochemistry/
        topic1/
        topic2/
        topic3/`}
          </pre>
        </div>
      </div>
    </div>
  );
}