"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function RatingPage() {
  const { interviewId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = () => {
      const sessionData = sessionStorage.getItem("interviewResults");
      if (sessionData) {
        try {
          const parsedData = JSON.parse(sessionData);
          console.log("Parsed Results Data:", parsedData); // Log the data
          setResults(parsedData);
        } catch (error) {
          console.error("Error parsing session data:", error);
        }
      }
      setLoading(false);
    };

    loadResults();
  }, [interviewId]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading results...</div>;
  if (!results.length) return <div className="flex justify-center items-center h-screen">No results available. Please complete the interview first.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-indigo-700">Interview Results</h1>

      <div className="space-y-8">
        {results.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow bg-white">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-indigo-700 mb-4">Question {index + 1}: {item.question}</h3>

              <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Your Answer:</h4>
                <p className="text-gray-700">{item.answer}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Rating:</h4>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-6 h-6 ${i < item.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-lg font-medium text-gray-700">{item.rating}/5</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Feedback:</h4>
                {typeof item.feedback === "object" && item.feedback !== null ? (
                  <ul className="list-disc list-inside text-gray-700">
                    {Object.entries(item.feedback).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong>{" "}
                        {typeof value === "object" && value !== null ? (
                          <ul className="list-disc list-inside ml-4">
                            {Object.entries(value).map(([subKey, subValue]) => (
                              <li key={subKey}>
                                <strong>{subKey}:</strong> {subValue}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          value
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700">{item.feedback}</p>
                )}
              </div>

              {item.suggestedAnswer && (
  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-md">
    <h4 className="font-semibold text-indigo-800 text-lg mb-3">Suggested Answer:</h4>
    {typeof item.suggestedAnswer === "object" ? (
      <ul className="list-disc list-inside text-gray-900 space-y-2">
        {Object.entries(item.suggestedAnswer).map(([key, value]) => (
          <li key={key}>
            <strong className="text-indigo-900">{key} :</strong> {value}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-blue-700">{item.suggestedAnswer}</p>
    )}
  </div>

              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}