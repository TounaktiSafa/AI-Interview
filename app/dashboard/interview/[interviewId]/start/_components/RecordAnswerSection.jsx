"use client";
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import { Button } from '@headlessui/react';
import { Mic } from 'lucide-react';

function RecordAnswerSection() {
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

  // Check if the browser supports the Web Speech API
  const isSpeechRecognitionSupported =
    'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

  // Combine results into userAnswer
  useEffect(() => {
    if (results.length > 0) {
      const combinedTranscript = results.map((result) => result.transcript).join(" ");
      setUserAnswer(combinedTranscript);
    }
  }, [results]);

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
            className="opacity-50" // Optional: Add opacity for better visibility
          />
        </div>
      </div>

      {/* Record Answer Button */}
      <button
        variant="outline"
        className="my-10 py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        onClick={isRecording ? stopSpeechToText : startSpeechToText}
      >
        {isRecording ? (
          <h2 className="text-red-600 flex gap-2 ">
            <Mic /> Stop Recording
          </h2>
        ) : (
          'Record Answer'
        )}
      </button>

      {/* Show User Answer Button 
      <Button onClick={() => console.log(userAnswer)}>Show User Answer</Button>*/}
    </div>
  );
}

export default RecordAnswerSection;