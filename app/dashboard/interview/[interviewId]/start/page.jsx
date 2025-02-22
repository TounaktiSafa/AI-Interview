"use client"; // Mark this file as a client component
import React, { useEffect, useState } from "react";
import { AIinterview } from "../../../../utils/schema";
import { eq } from "drizzle-orm";
import { db } from "../../../../utils/db";
import QuestionsSection from './_components/QuestionsSection'; // Correct import path
import RecordAnswerSection from "./_components/RecordAnswerSection"

export default function StartInterview({ params }) {
  const { interviewId } = React.use(params);
  const [interviewData, setInterviewData] = useState();
  const [interviewQuestions, setInterviewQuestions] = useState([]); // Array of questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(AIinterview)
        .where(eq(AIinterview.userId, interviewId));

      const jsonMockResp = JSON.parse(result[0].jsonMockResp);
      console.log("Fetched Interview Questions:", jsonMockResp);
      setInterviewQuestions(jsonMockResp); // Set the array of questions
      setInterviewData(result[0]);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if there are no questions
  if (interviewQuestions.length === 0) {
    return <div>No interview questions found.</div>;
  }

  // Check if all questions have been answered
  if (currentQuestionIndex >= interviewQuestions.length) {
    return <div>Interview completed! Thank you for your responses.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Questions */}
      <QuestionsSection interviewQuestions={interviewQuestions} />
     
      {/* Video/Audio Recording */}
      <RecordAnswerSection
        interviewQuestion={interviewQuestions[currentQuestionIndex]?.question} // Pass the current question
        onNextQuestion={() => setCurrentQuestionIndex((prev) => prev + 1)} // Function to move to the next question
      />
    </div>
  );
}