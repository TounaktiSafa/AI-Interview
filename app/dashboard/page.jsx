'use client'; // Mark file as client component

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { db } from '../utils/db';
import { AIinterview } from '../utils/schema';
import { LoaderCircle } from 'lucide-react';
import moment from 'moment';

const { getGeminiResponse } = require('../utils/GeminiAIModel');

function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [experience, setExperience] = useState('');
  const router = useRouter();
  const [jsonResponse, setJsonResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  // Open modal
  const handleGetStartedClick = () => {
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log('Job Title:', jobTitle);
    console.log('Job Description:', jobDescription);
    console.log('Experience:', experience);
    
    // Keep the modal open while generating the questions (no immediate close)
    // The modal will close only after the interview data is processed and saved.
    
    const InputPrompt = `Job Position: ${jobTitle}, Job Description: ${jobDescription}, Years of Experience: ${experience}. Generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions with answers in JSON format. Each answer should be 2 lines.`;

    try {
      const result = await getGeminiResponse(InputPrompt);
      let interview = result.replace('```json', '').replace('```', '');

      try {
        const parsedInterview = JSON.parse(interview);
        console.log('Parsed Interview:', parsedInterview);
        setJsonResponse(parsedInterview);

        // Ensure userId is correctly fetched from Firebase Auth
        const user = auth.currentUser;
        if (!user) {
          throw new Error('User not authenticated.');
        }

        // Prepare data for insertion
        const interviewData = {
          jsonMockResp: JSON.stringify(parsedInterview), // Ensure data is stringified
          jobPosition: jobTitle,
          jobDesc: jobDescription,
          jobExperience: experience,
          createdBy: user.email,
          userId: user.uid,
          createdAt: moment().format('YYYY-MM-DD'),
        };

        // Save data to the database
        const rep = await db.insert(AIinterview).values(interviewData).returning({ id: AIinterview.id });

        console.log('Data saved to the database:', rep);
        
        // Close modal and navigate after successful save
        if (rep && rep.length > 0) {
          const interviewId = rep[0].id; // Extract the inserted interview ID
          setIsModalOpen(false); 
          router.push(`/dashboard/interview/${interviewId}`); // Redirect using interview ID
        }

      } catch (error) {
        console.error('JSON parsing or database error:', error);
      }
    } catch (error) {
      console.error('Error generating interview questions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Enter Job Details
            <strong className="font-extrabold text-indigo-700 sm:block">
              Try your interview for free
            </strong>
          </h1>
          <p className="mt-4 sm:text-xl/relaxed">
            To apply for a job or update your details, please provide the required information below.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              className="block w-full rounded-sm bg-indigo-600 px-12 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-3 focus:outline-hidden sm:w-auto"
              onClick={handleGetStartedClick}
            >
              Get Started
            </button>

            <a
              className="block w-full rounded-sm px-12 py-3 text-sm font-medium text-indigo-600 shadow-sm hover:text-indigo-700 focus:ring-3 focus:outline-hidden sm:w-auto"
              href="#"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">
              Explain more about your job interviewing
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Experience (in years)
                </label>
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin" /> Generating from AI...
                    </>
                  ) : (
                    'Start Interview'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Page;
