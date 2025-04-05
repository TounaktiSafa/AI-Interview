"use client";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic } from "lucide-react";
import { getGeminiResponse } from "../../../../GeminiAIModel";

export default function RecordAnswerSection({ interviewQuestion, onNextQuestion }) {
  const [userAnswer, setUserAnswer] = useState("");
  const {
    error,
    results,
    isRecording,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    if (results.length > 0) {
      const combinedTranscript = results.map((result) => result.transcript).join(" ");
      setUserAnswer(combinedTranscript);
    }
  }, [results]);

  const SaveUserAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();

      if (!userAnswer || userAnswer.length < 10) {
        alert("Your answer is too short. Please provide a more detailed response.");
        return;
      }

      if (!interviewQuestion || typeof interviewQuestion !== "string") {
        alert("Invalid interview question. Please refresh the page and try again.");
        return;
      }

      const feedbackPrompt = `
        Question: ${interviewQuestion}
        User Answer: ${userAnswer}
        
        Based on the question and user answer, please provide a rating for the answer and feedback in JSON format with \"rating\" and \"feedback\" fields.
      `;

      try {
        const response = await getGeminiResponse(feedbackPrompt);
        const jsonMatch = response.match(/```json([\s\S]*?)```/);
        if (!jsonMatch || !jsonMatch[1]) {
          throw new Error("No valid JSON found in the response.");
        }
        const jsonResp = JSON.parse(jsonMatch[1].trim());
        console.log("Rating:", jsonResp.rating);
        console.log("Feedback:", jsonResp.feedback);
        onNextQuestion();
      } catch (error) {
        console.error("Error getting response from Gemini:", error);
      }
    } else {
      startSpeechToText();
    }
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col justify-center items-center my-20 bg-black rounded-lg p-5 relative">
        <Webcam mirrored={true} className="w-full h-auto rounded-lg" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img src={'/webcam.png'} width={200} height={200} alt="Webcam Icon" className="opacity-50" />
        </div>
      </div>
      <button
        className="my-10 py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700"
        onClick={SaveUserAnswer}
      >
        {isRecording ? (
          <h2 className="text-red-600 flex gap-2 "><Mic /> Stop Recording</h2>
        ) : (
          'Record Answer'
        )}
      </button>
    </div>
  );
}
