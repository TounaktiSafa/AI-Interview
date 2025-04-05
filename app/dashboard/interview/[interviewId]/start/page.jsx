"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AIinterview } from "../../../../utils/schema";
import { eq } from "drizzle-orm";
import { db } from "../../../../utils/db";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";

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
        return;
      }

      let jsonMockResp = [];
      try {
        jsonMockResp = JSON.parse(result[0]?.jsonMockResp || "[]");
      } catch (jsonError) {
        console.error("Error parsing jsonMockResp:", jsonError);
        jsonMockResp = [];
      }

      console.log("Parsed Interview Questions:", jsonMockResp);

      setInterviewQuestions(jsonMockResp);
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

    // Simulation d'une évaluation IA
    const aiRating = Math.floor(Math.random() * 5) + 1; // Note entre 1 et 5

    setRatings((prev) => ({
      ...prev,
      [currentQuestionIndex]: aiRating,
    }));

    console.log(`🎯 Note de l'IA pour la question ${currentQuestionIndex + 1} :`, aiRating);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      console.log("✅ Interview terminée !");
    }
  };

  useEffect(() => {
    console.log("📝 Réponses mises à jour :", responses);
    console.log("⭐ Notes mises à jour :", ratings);
  }, [responses, ratings]);

  if (loading) return <div>Loading...</div>;

  if (!interviewQuestions.length) return <div>No interview questions found.</div>;

  if (currentQuestionIndex >= interviewQuestions.length) {
    return <div>Interview completed! Thank you for your responses.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <QuestionsSection
        interviewQuestions={interviewQuestions}
        currentQuestionIndex={currentQuestionIndex}
      />
      <RecordAnswerSection
        interviewQuestion={interviewQuestions[currentQuestionIndex]?.question}
        onSaveAnswer={handleRecordAnswer}
        onNextQuestion={handleNextQuestion}
      />
    </div>
  );
}

