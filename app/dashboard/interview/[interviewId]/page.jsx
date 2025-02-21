'use client'; // Mark this file as a client component

import React, { useEffect, useState } from 'react';
import { db } from '../../../utils/db';
import { AIinterview } from '../../../utils/schema';
import { eq } from 'drizzle-orm';
import { Webcam, WebcamIcon } from 'lucide-react';
import { Button } from '@headlessui/react';

export default function Interview({ params }) {
  // Unwrap the params Promise using React.use()
  const { interviewId } = React.use(params); // Use React.use() to unwrap params
  const [interviewData, setInterviewData] = useState(null); // State to store interview details
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [webCamEnabled,setWebCamEnabled]=useState(false)
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
    return <div>Loading...</div>; // Display a loading message while fetching data
  }

  if (!interviewData) {
    return <div>No interview data found for this user.</div>; // Display if no data is found
  }

  return (
<div>
 <div id='title'>
    <h1>Let's get started</h1>
    </div>
<div >
{webCamEnabled ? (
  <Webcam
    onUserMedia={() => setWebCamEnabled(true)}
    onUserMediaError={(error) => {
      console.error("Webcam error:", error);
      setWebCamEnabled(false);
    }}
    mirrored={true}
    style={{
      height: 300,
      width: 300,
    }}
  />
) : (
  <>
    <WebcamIcon className='h-72 w-48 p-20 my-9 bg-slate-300 rounded-lg border' />
    <Button onClick={() => setWebCamEnabled(true)}>Enable webcam and microphone</Button>
  </>
)}

  </div>
      <h1>Interview Details</h1>
      <h2>Job Position: {interviewData.jobPosition}</h2>
      <h3>Job Description: {interviewData.jobDesc}</h3>
      <h3>Experience: {interviewData.jobExperience} years</h3>

      <h2>Questions and Answers:</h2>
      {interviewData.jsonMockResp ? (
        <div>
          {JSON.parse(interviewData.jsonMockResp).map((qa, index) => (
            <div key={index}>
              <h3>Question {index + 1}: {qa.question}</h3>
              <p>Answer: {qa.answer}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No questions and answers available.</p>
      )}
    </div>
  );
}