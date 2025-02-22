"use client";
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import { Button } from '@headlessui/react';
import { Mic } from 'lucide-react';
import { getGeminiResponse } from '../../../../GeminiAIModel'; // Import the function

export default function RecordAnswerSection({ interviewQuestion, onNextQuestion }) {
  const [userAnswer, setUserAnswer] = useState('');
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  // Log errors
  if (error) {
    console.error("Speech-to-Text Error:", error);
  }

  // Log recording state
  console.log("Is Recording:", isRecording);

  // Combine results into userAnswer
  useEffect(() => {
    if (results.length > 0) {
      const combinedTranscript = results.map((result) => result.transcript).join(" ");
      setUserAnswer(combinedTranscript);
      console.log("Results:", results); // Log the results array
      console.log("User Answer:", combinedTranscript); // Log the combined transcript
    }
  }, [results]);

  const SaveUserAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();

      // Check if the userAnswer is too short
      if (!userAnswer || userAnswer.length < 10) {
        console.error("User answer is too short.");
        alert("Your answer is too short. Please provide a more detailed response.");
        return;
      }

      // Ensure interviewQuestion is defined and a string
      if (!interviewQuestion || typeof interviewQuestion !== 'string') {
        console.error("Invalid interview question.");
        alert("Invalid interview question. Please refresh the page and try again.");
        return;
      }

      // Prepare the feedback prompt
      const feedbackPrompt = `
        Question: ${interviewQuestion}
        User Answer: ${userAnswer}
        
        Based on the question and user answer, please provide a rating for the answer and feedback in JSON format with "rating" and "feedback" fields.
      `;

      // Log the feedback prompt for debugging
      console.log("Feedback Prompt:", feedbackPrompt);

      try {
        // Get the response from Gemini
        const response = await getGeminiResponse(feedbackPrompt);

        // Log the raw response
        console.log("Raw Response:", response);

        // Extract the JSON portion from the response
        const jsonMatch = response.match(/```json([\s\S]*?)```/);
        if (!jsonMatch || !jsonMatch[1]) {
          throw new Error("No valid JSON found in the response.");
        }

        // Parse the JSON portion
        const jsonResp = JSON.parse(jsonMatch[1].trim());

        // Log the rating and feedback
        console.log("Rating:", jsonResp.rating);
        console.log("Feedback:", jsonResp.feedback);

        // Move to the next question
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
        {/* Webcam Component */}
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
          className="w-full h-auto rounded-lg"
        />

        {/* Centered Icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img
            src={'/webcam.png'}
            width={200}
            height={200}
            alt="Webcam Icon"
            className="opacity-50"
          />
        </div>
      </div>

      {/* Record Answer Button */}
      <button
        variant="outline"
        className="my-10 py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        onClick={SaveUserAnswer}
      >
        {isRecording ? (
          <h2 className="text-red-600 flex gap-2 ">
            <Mic /> Stop Recording
          </h2>
        ) : (
          'Record Answer'
        )}
      </button>
    </div>
  );
}