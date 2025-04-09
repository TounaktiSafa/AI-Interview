"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AIinterview } from "../../../../utils/schema";
import { eq } from "drizzle-orm";
import { db } from "../../../../utils/db";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { getGeminiResponse } from "../../../../utils/GeminiAiModel";

export default function StartInterview() {
  const { interviewId } = useParams();
  const router = useRouter();
  const [interviewData, setInterviewData] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState({});
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedResponses = localStorage.getItem(`responses-${interviewId}`);
      const savedRatings = localStorage.getItem(`ratings-${interviewId}`);
      if (savedResponses) setResponses(JSON.parse(savedResponses));
      if (savedRatings) setRatings(JSON.parse(savedRatings));
    }
  }, [interviewId]);

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  useEffect(() => {
    if (!interviewId) return;

    const fetchInterviewDetails = async () => {
      try {
        console.log("Fetching data for interviewId:", interviewId);

        const result = await db
          .select()
          .from(AIinterview)
          .where(eq(AIinterview.id, interviewId));

        console.log("Database Query Result:", result);

        if (result.length) {
          const jsonMockResp = JSON.parse(result[0]?.jsonMockResp || "{}");

          // Debugging: Log the parsed jsonMockResp
          console.log("Parsed jsonMockResp:", jsonMockResp);

          // Attempt to extract questions from multiple possible keys
          const questions =
            jsonMockResp.interviewQuestions || // Standard key
            jsonMockResp.questions || // Alternative key
            (Array.isArray(jsonMockResp) ? jsonMockResp : []); // If the response itself is an array

          if (questions.length > 0) {
            setInterviewQuestions(questions);
          } else {
            console.error("No valid questions found in jsonMockResp:", jsonMockResp);
          }

          setInterviewData(result[0]);
        } else {
          console.error("No interview data found for this ID.");
        }
      } catch (error) {
        console.error("Error fetching interview details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewDetails();
  }, [interviewId]);

  const handleRecordAnswer = async (answer) => {
    try {
      const newResponses = { ...responses, [currentQuestionIndex]: answer };
      setResponses(newResponses);
      localStorage.setItem(
        `responses-${interviewId}`,
        JSON.stringify(newResponses)
      );

      const feedbackPrompt = `Question: ${interviewQuestions[currentQuestionIndex].question}\nUser Answer: ${answer}\n\nPlease provide a rating (1-5) and feedback for this answer in JSON format with "rating" and "feedback" fields.`;

      const response = await getGeminiResponse(feedbackPrompt);
      const jsonResponse = JSON.parse(response.replace(/```json|```/g, "").trim());

      const newRatings = {
        ...ratings,
        [currentQuestionIndex]: {
          rating: jsonResponse.rating,
          feedback: jsonResponse.feedback,
        },
      };

      setRatings(newRatings);
      localStorage.setItem(
        `ratings-${interviewId}`,
        JSON.stringify(newRatings)
      );
    } catch (error) {
      console.error("Error getting rating:", error);
      const newRatings = {
        ...ratings,
        [currentQuestionIndex]: {
          rating: 3,
          feedback: "Unable to get feedback",
        },
      };
      setRatings(newRatings);
      localStorage.setItem(
        `ratings-${interviewId}`,
        JSON.stringify(newRatings)
      );
    } finally {
      handleNextQuestion();
    }
  };

  const navigateToResults = () => {
    const resultsArray = interviewQuestions.map((q, idx) => ({
      question: q.question || "No question provided",
      answer: responses[idx] || "No answer provided",
      rating: ratings[idx]?.rating || 0,
      feedback: ratings[idx]?.feedback || "No feedback",
      suggestedAnswer: q.answer || "No suggested answer",
    }));

    sessionStorage.setItem(
      `interviewResults-${interviewId}`,
      JSON.stringify(resultsArray)
    );
    router.push(`/dashboard/interview/${interviewId}/rating`);
  };

  if (loading)
    return <div className="flex justify-center items-center h-screen">Loading interview...</div>;
  if (!interviewQuestions.length)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 max-w-md bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">No Interview Questions Found</h2>
          <p className="text-gray-600 mb-4">
            We couldn't find any questions for this interview. Please try creating a new interview.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );

  if (currentQuestionIndex >= interviewQuestions.length) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Interview Completed!</h2>
        <button
          onClick={navigateToResults}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          View Detailed Results
        </button>
      </div>
    );
  }

  const currentQuestion =
    typeof interviewQuestions[currentQuestionIndex] === "object"
      ? interviewQuestions[currentQuestionIndex].question
      : interviewQuestions[currentQuestionIndex];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6">
      <QuestionsSection
        interviewQuestions={interviewQuestions}
        currentQuestionIndex={currentQuestionIndex}
      />

      <RecordAnswerSection
        interviewQuestion={currentQuestion}
        onNextQuestion={handleRecordAnswer}
      />
      <button
        onClick={navigateToResults}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Get Rating
      </button>
    </div>
  );
}