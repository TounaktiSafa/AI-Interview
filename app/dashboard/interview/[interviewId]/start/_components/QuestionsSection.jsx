

import React from 'react';
import { Lightbulb } from "lucide-react";

function QuestionsSection({ interviewQuestions }) {
  if (!interviewQuestions || interviewQuestions.length === 0) {
    return <div>No questions available.</div>; // Handle empty or undefined data
  }

  return (
    <div className="p-5 border rounded-lg">
      <ol className="space-y-8"> {/* Removed overflow-hidden */}
        {interviewQuestions.map((question, index) => (
          <li
            key={index}
            className={`relative flex-1 ${
              index < interviewQuestions.length - 1
                ? "after:content-[''] after:w-0.5 after:h-[calc(100%+2rem)] after:inline-block after:absolute after:-bottom-8 after:left-4 lg:after:left-5"
                : ''
            } ${
              index === 0
                ? 'after:bg-indigo-600'
                : index < interviewQuestions.length - 1
                ? 'after:bg-gray-200'
                : ''
            }`}
          >
            <div className="flex items-center font-medium w-full">
              <span
                className={`w-8 h-8 ${
                  index === 0
                    ? 'bg-indigo-600 border-2 border-transparent rounded-full flex justify-center items-center mr-3 text-sm text-white lg:w-10 lg:h-10'
                    : index === 1
                    ? 'bg-indigo-50 border-2 border-indigo-600 rounded-full flex justify-center items-center mr-3 text-sm text-indigo-600 lg:w-10 lg:h-10'
                    : 'bg-gray-50 border-2 border-gray-200 rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10'
                }`}
              >
                {index === 0 ? (
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12L9.28722 16.2923C9.62045 16.6259 9.78706 16.7927 9.99421 16.7928C10.2014 16.7929 10.3681 16.6262 10.7016 16.2929L20 7"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
              <div className="block">
                <h4 className="text-lg text-indigo-600">Question {index + 1}</h4>
                <span className="text-sm">
                  {typeof question === "object" ? question.question : question}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ol>
      
      <div className="border rounded-lg p-5 bg-indigo-100 mt-20  ">
     <h2 className='flex gap-2 items-cneter text-primary'>
     <Lightbulb></Lightbulb>
 <strong className='text-indigo-900'>Note :</strong>
 </h2>
 <h2 className='text-sm text-primary my-2'>Click on Record Answer the question . At the end of interview we will give you the feedback along with correct ansewer for each of question and your answer to compare it.</h2>
     </div>
    </div>
    
  );
}

export default QuestionsSection;

