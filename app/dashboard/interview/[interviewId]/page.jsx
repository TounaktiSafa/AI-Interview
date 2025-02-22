'use client'; // Mark this file as a client component

import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../../utils/db';
import { AIinterview } from '../../../utils/schema';
import { eq } from 'drizzle-orm';
import { WebcamIcon } from 'lucide-react';
import { Button } from '@headlessui/react';
import Webcam from 'react-webcam'; // Import Webcam from react-webcam
import Link from 'next/link';
export default function Interview({ params }) {
  // Unwrap the params Promise using React.use()
  const { interviewId } = React.use(params); // Use React.use() to unwrap params
  const [interviewData, setInterviewData] = useState(null); // State to store interview details
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [webCamEnabled, setWebCamEnabled] = useState(false); // State to manage webcam
  const webcamRef = useRef(null); // Ref for the webcam component

  useEffect(() => {
    console.log('User ID from URL:', interviewId); // Log the interviewId
    GetInterviewDetails();
  }, [interviewId]); // Re-run effect when interviewId changes

  const GetInterviewDetails = async () => {
    try {
      // Fetch interview details for the specific userId
      const result = await db
        .select()
        .from(AIinterview)
        .where(eq(AIinterview.userId, interviewId)); // Use interviewId

      console.log('Detailed information:', result);

      if (result.length > 0) {
        setInterviewData(result[0]); // Store the first matching record
      } else {
        console.log('No interview data found for this user.');
      }
    } catch (error) {
      console.error('Error fetching interview details:', error);
    } finally {
      setLoading(false); // Set loading to false after the operation
    }
  };

  if (loading) {
    return (
      <div className="grid place-items-center h-screen">
        <button type="button" className="bg-indigo-800 text-white px-4 py-2 rounded-md flex items-center" disabled>
          <svg className="mr-3 w-5 h-5 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading
        </button>
      </div>
    );
  }

  if (!interviewData) {
    return <div>No interview data found for this user.</div>; // Display if no data is found
  }

  return (
    <div>
      {/* Title Section */}
      <div className="text-center mx-auto mt-7" id="title">
        <h1 className="text-2xl md:text-3xl border-l-4 font-sans font-bold border-indigo-700 text-gray-900 inline-block pl-4">
          Let's get started
        </h1>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-2">
        {/* First Column: Webcam and Button */}
        <div className="flex flex-col justify-center items-center">
          {webCamEnabled ? (
            <Webcam
              ref={webcamRef}
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={(error) => {
                console.error('Webcam error:', error);
                setWebCamEnabled(false);
              }}
              mirrored={true}
              style={{
                height: 500,
                width: 700,
              }}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-48 p-20 my-9 bg-slate-300 rounded-lg border" />
              <Button
                className="text-white bg-purple-500 hover:bg-purple-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                onClick={() => setWebCamEnabled(true)}
              >
                Enable webcam and microphone
              </Button>
            </>
          )}
        </div>

        {/* Second Column: Interview Details */}
        <div className="flex flex-col justify-center items-center mr-40 mt-16">
          <div className="mt-11 bg-white px-8 pt-12 pb-10 shadow-2xl  ring-1 ring-indigo-900/5 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-3xl sm:max-w-md w-full">
            {/* Card Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-indigo-900">Interview Details</h1>
              <p className="text-sm text-gray-500 mt-2">Here are the details of your upcoming interview.</p>
            </div>

            {/* Card Content */}
            <div className="space-y-6">
              {/* Job Position */}
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Job Position</h2>
                  <p className="text-gray-600">{interviewData.jobPosition}</p>
                </div>
              </div>

              {/* Job Description */}
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Job Description</h2>
                  <p className="text-gray-600">{interviewData.jobDesc}</p>
                </div>
              </div>

              {/* Experience */}
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Experience</h2>
                  <p className="text-gray-600">{interviewData.jobExperience} years</p>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">Good luck with your interview Preparation !</p>
             <br></br>
             <Link href={`/dashboard/interview/${interviewId}/start`}>
                <button className="py-3 px-14 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">
                  Start Interview
                </button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}