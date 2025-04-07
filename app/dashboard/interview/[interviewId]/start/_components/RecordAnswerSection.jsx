"use client";
import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import { Mic } from "lucide-react";
import { getGeminiResponse } from "../../../../../utils/GeminiAIModel";

export default function RecordAnswerSection({ interviewQuestion, onNextQuestion }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");
  const [speechRecognition, setSpeechRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech Recognition is not supported by this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let newTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        newTranscript += event.results[i][0].transcript;
      }
      setUserAnswer((prevAnswer) => prevAnswer + " " + newTranscript.trim());
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error", event);
      setError("An error occurred with speech recognition.");
    };

    setSpeechRecognition(recognition);

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, []);

  const startRecording = () => {
    if (speechRecognition) {
      setUserAnswer("");
      setIsRecording(true);
      speechRecognition.start();
    }
  };

  const stopRecording = () => {
    if (speechRecognition) {
      setIsRecording(false);
      speechRecognition.stop();
    }
  };

  const SaveUserAnswer = async () => {
    if (isRecording) {
      stopRecording();
      setTimeout(async () => {
        console.log("User Answer:", userAnswer);

        if (!userAnswer || userAnswer.length < 10) {
          alert("Your answer is too short. Please provide a more detailed response.");
          return;
        }

        if (!interviewQuestion || typeof interviewQuestion !== "string") {
          alert("Invalid interview question. Please refresh the page and try again.");
          return;
        }

        try {
          const feedbackPrompt = `Question: ${interviewQuestion}\nUser Answer: ${userAnswer}\n\nPlease analyze the response and provide a rating from 1 to 5 along with constructive feedback in JSON format with \"rating\" and \"feedback\" fields.`;
          
          const response = await getGeminiResponse(feedbackPrompt);
          const jsonResponse = JSON.parse(response.replace(/```json|```/g, '').trim());

          const ratingData = {
            rating: jsonResponse.rating,
            feedback: jsonResponse.feedback,
          };

          console.log("AI Feedback:", ratingData);

          onNextQuestion(ratingData);
        } catch (error) {
          console.error("Error getting rating from Gemini:", error);
          onNextQuestion({ rating: 3, feedback: "Unable to get feedback from AI" });
        }
      }, 500);
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col justify-center items-center my-20 bg-black rounded-lg p-5 relative">
        <Webcam mirrored={true} className="w-full h-auto rounded-lg" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img src={"/webcam.png"} width={200} height={200} alt="Webcam Icon" className="opacity-50" />
        </div>
      </div>

      <button
        className="my-10 py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700"
        onClick={SaveUserAnswer}
      >
        {isRecording ? (
          <h2 className="text-red-600 flex gap-2">
            <Mic /> Stop Recording
          </h2>
        ) : (
          "Record Answer"
        )}
      </button>

      {error && <div className="text-red-500">{error}</div>}

      <div>{userAnswer}</div>
    </div>
  );
}
