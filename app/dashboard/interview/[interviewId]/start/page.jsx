"use client"; // Mark this file as a client component
import React, { useEffect, useState } from "react";
import { AIinterview } from "../../../../utils/schema";
import { eq } from "drizzle-orm";
import { db } from "../../../../utils/db";
import QuestionsSection from './_components/QuestionsSection'; // Correct import path
import RecordAnswerSection from './_components/RecordAnswerSection'
function StartInterview({ params }) {
  // Unwrap params using React.use()
  const { interviewId } = React.use(params); // Use React.use() to unwrap params
  const [interviewData, setInterviewData] = useState();
  const [interviewQuestion, setInterviewQuestion] = useState();
  const [loading, setLoading] = useState(true); // Add loading state

  // Fetch interview details on component mount
  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    try {
      // Fetch interview details for the specific userId
      const result = await db
        .select()
        .from(AIinterview)
        .where(eq(AIinterview.userId, interviewId)); // Use interviewId

      const jsonMockResp = JSON.parse(result[0].jsonMockResp);
      console.log("Fetched Interview Questions:", jsonMockResp);
      setInterviewQuestion(jsonMockResp);
      setInterviewData(result[0]);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Questions */}
      <QuestionsSection interviewQuestions={interviewQuestion} />
     
      {/* Video/Audio Recording */}
      <RecordAnswerSection></RecordAnswerSection>
    </div>
  );
}

export default StartInterview;