"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function RatingPage() {
  const { interviewId } = useParams();
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allInterviews, setAllInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(interviewId);

  useEffect(() => {
    const loadResults = () => {
      try {
        // Load all interviews from sessionStorage
        const allResults = JSON.parse(sessionStorage.getItem('allInterviewResults') || "[]");
        setAllInterviews(allResults);

        // Load specific interview results
        const specificResults = allResults.filter(item => item.interviewId === interviewId);
        
        // Fallback to interview-specific storage if not found in allResults
        if (specificResults.length === 0) {
          const fallbackResults = JSON.parse(
            sessionStorage.getItem(`interviewResults-${interviewId}`) || "[]"
          );
          setResults(fallbackResults);
        } else {
          setResults(specificResults);
        }
      } catch (error) {
        console.error("Error loading results:", error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [interviewId]);

  const handleInterviewChange = (e) => {
    const selectedId = e.target.value;
    setSelectedInterview(selectedId);
    const filteredResults = allInterviews.filter(
      (item) => item.interviewId === selectedId
    );
    setResults(filteredResults);
  };

  // Helper function to safely render any value
  const renderValue = (value) => {
    if (value === null || value === undefined) {
      return "N/A";
    }
  
    if (typeof value === "string" || typeof value === "number") {
      return value; // Directly return the string or number
    }
  
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside ml-4">
          {value.map((item, index) => (
            <li key={index}>{renderValue(item)}</li>
          ))}
        </ul>
      );
    }
  
    if (typeof value === "object") {
      return (
        <ul className="list-disc list-inside ml-4">
          {Object.entries(value).map(([key, val]) => (
            <li key={key}>
              <strong>{key}:</strong> {renderValue(val)}
            </li>
          ))}
        </ul>
      );
    }
  
    return JSON.stringify(value); // Fallback for unexpected data types
  };
  // Get unique interviews for dropdown
  const uniqueInterviews = Array.from(
    new Map(allInterviews.map(item => [item.interviewId, item])).values()
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-indigo-700">Interview Results</h1>
        
        {uniqueInterviews.length > 0 && (
          <div className="flex flex-col w-full md:w-auto">
            <label htmlFor="interview-select" className="text-sm font-medium text-gray-700 mb-1">
              Select Interview:
            </label>
            <select
              id="interview-select"
              value={selectedInterview}
              onChange={handleInterviewChange}
              className="px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              {Array.from(uniqueInterviews).map((interview) => (
                <option key={interview.interviewId} value={interview.interviewId}>
                  {interview.jobTitle || `Interview ${interview.interviewId.slice(0, 4)}`} - {new Date(interview.interviewDate).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {results.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Results Found</h3>
          <p className="text-gray-600 mb-6">We couldn't find any results for this interview.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-indigo-800">
                  {results[0]?.jobTitle || 'Interview Review'}
                </h2>
                <p className="text-gray-600 mt-1">
                 
                </p>
              </div>
              <div className="bg-indigo-50 px-4 py-2 rounded-lg">
                <p className="text-indigo-800 font-medium">
                  Overall Rating: {(
                    results.reduce((sum, item) => sum + (item.rating || 0), 0) / results.length
                  ).toFixed(1)}/5
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {results.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-indigo-700">
                    Question {index + 1}: {item.question}
                  </h3>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-3">Rating:</h4>
                      <div className="flex items-center">
                        <div className="flex mr-4">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-6 h-6 ${i < (item.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-lg font-medium text-gray-700">
                          {item.rating || 0}/5
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-3">Feedback:</h4>
                    <div className="bg-white p-4 rounded">
                      {renderValue(item.feedback)}
                    </div>
                  </div>

                  {item.suggestedAnswer && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-3">Suggested Answer:</h4>
                      <div className="bg-white p-4 rounded">
                        {renderValue(item.suggestedAnswer)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}