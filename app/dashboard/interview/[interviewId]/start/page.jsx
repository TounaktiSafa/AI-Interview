"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AIinterview } from "../../../../utils/schema";
import { eq } from "drizzle-orm";
import { db } from "../../../../utils/db";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { getGeminiResponse } from "../../../../utils/GeminiAiModel";

export default function StartInterview() {
  const { interviewId } = useParams();
  const [interviewData, setInterviewData] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);

  
  
  useEffect(() => {
    if (!interviewId) {
      console.error("Error: interviewId is undefined.");
      setLoading(false);
      return;
    }
    GetInterviewDetails();
  }, [interviewId]);

  const GetInterviewDetails = async () => {
    try {
      console.log("Fetching interview details for ID:", interviewId);

      if (!db) {
        throw new Error("Database connection is undefined.");
      }

      const result = await db
        .select()
        .from(AIinterview)
        .where(eq(AIinterview.id, interviewId));

      console.log("Query result:", result);

      if (!result.length) {
        console.warn("No interview data found for this ID.");
        setInterviewQuestions([]);
        setLoading(false);
        return;
      }

      let jsonMockResp = {};
      try {
        jsonMockResp = JSON.parse(result[0]?.jsonMockResp || "{}");
        
        if (!jsonMockResp.interviewQuestions || !Array.isArray(jsonMockResp.interviewQuestions)) {
          console.warn("Invalid format: No 'interviewQuestions' array found.");
          setInterviewQuestions([]);
          setLoading(false);
          return;
        }
      } catch (jsonError) {
        console.error("Error parsing jsonMockResp:", jsonError);
        setInterviewQuestions([]);
        setLoading(false);
        return;
      }

      console.log("Parsed Interview Questions:", jsonMockResp.interviewQuestions);
      setInterviewQuestions(jsonMockResp.interviewQuestions);
      setInterviewData(result[0]);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordAnswer = async (answer) => {
    console.log("✅ Réponse enregistrée :", answer);

    setResponses((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));

    try {
      const feedbackPrompt = `Question: ${interviewQuestions[currentQuestionIndex].question}\nUser Answer: ${answer}\n\nPlease provide a rating (1-5) and feedback for this answer in JSON format with "rating" and "feedback" fields.`;
      
      const response = await getGeminiResponse(feedbackPrompt);
      const jsonResponse = JSON.parse(response.replace(/```json|```/g, '').trim());

      setRatings((prev) => ({
        ...prev,
        [currentQuestionIndex]: {
          rating: jsonResponse.rating,
          feedback: jsonResponse.feedback
        },
      }));
    } catch (error) {
      console.error("Error getting rating from Gemini:", error);
      setRatings((prev) => ({
        ...prev,
        [currentQuestionIndex]: {
          rating: 3,
          feedback: "Unable to get feedback from AI"
        },
      }));
    }

    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  
  
  };

  if (loading) return <div>Loading...</div>;

  if (!interviewQuestions.length) return <div>No interview questions found.</div>;

  if (currentQuestionIndex >= interviewQuestions.length) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Interview Completed!</h2>
        <div className="space-y-6">
          {interviewQuestions.map((q, idx) => (
            <div key={idx} className="border p-4 rounded-lg">
              <h3 className="font-semibold">Question {idx + 1}: {q.question}</h3>
              <p className="mt-2"><strong>Your Answer:</strong> {responses[idx] || "No answer provided"}</p>
              {ratings[idx] && (
                <>
                  <p><strong>Rating:</strong> {ratings[idx].rating}/5</p>
                  <p><strong>Feedback:</strong> {ratings[idx].feedback}</p>
                </>
              )}
              <p className="mt-2 text-sm text-gray-600"><strong>Suggested Answer:</strong> {q.answer}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6">
  <QuestionsSection 
  interviewQuestions={interviewQuestions} 
  currentQuestionIndex={currentQuestionIndex} 
/>

    <RecordAnswerSection 
  interviewQuestion={interviewQuestions[currentQuestionIndex].question}
  onNextQuestion={handleNextQuestion} // Ensure this function exists
/>

    </div>
  );
}
