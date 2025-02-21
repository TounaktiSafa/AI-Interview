"use client"; // ✅ Nécessaire pour Next.js

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Features() {
  const [activeTab, setActiveTab] = useState("tabs-with-card-1");

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div id="how-it-works" className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.5 }} // Updated for continuous animation
        className="relative p-6 md:p-16"
      >
        {/* Grid */}
        <div className="relative z-10 lg:grid lg:grid-cols-12 lg:gap-16 bg-gray-100 lg:items-center">
          <div className="mb-10 lg:mb-0 lg:col-span-6 lg:col-start-8 lg:order-2">
            <h2 className="text-2xl text-indigo-800 font-bold sm:text-3xl dark:text-neutral-200">
              Empower Your Job Search with AI
            </h2>

            {/* Tab Navs */}
            <nav className="grid gap-4 mt-5 md:mt-10" aria-label="Tabs" role="tablist" aria-orientation="vertical">
              {[ 
                {
                  id: "tabs-with-card-1",
                  title: "AI-Powered Interview Prep",
                  description: "Get tailored interview questions based on your job title and description.",
                  imgSrc: "./feature.png",
                },
                {
                  id: "tabs-with-card-2",
                  title: "Real-Time Answer Feedback",
                  description: "Record your answers and receive instant AI-driven feedback to improve.",
                  imgSrc: "./time-left.png",
                },
                {
                  id: "tabs-with-card-3",
                  title: "Personalized Job Insights",
                  description: "Gain insights into your strengths and areas for improvement based on your performance.",
                  imgSrc: "./job.png",
                },
              ].map((tab, index) => (
                <motion.button
                  key={tab.id}
                  type="button"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: false, amount: 0.5 }} // Updated for continuous animation
                  className={`text-start hover:bg-indigo-100 focus:outline-none focus:bg-indigo-200 p-4 md:p-5 rounded-xl ${
                    activeTab === tab.id
                      ? "bg-indigo-200 shadow-md border border-indigo-300"
                      : "dark:bg-neutral-700"
                  }`}
                  onClick={() => handleTabClick(tab.id)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                >
                  <span className="flex gap-x-6">
                    <img className="w-10 h-10" src={tab.imgSrc} alt={tab.title} />
                    <span className="grow">
                      <span className="block text-lg font-semibold text-gray-800">{tab.title}</span>
                      <span className="block mt-1 text-gray-800">{tab.description}</span>
                    </span>
                  </span>
                </motion.button>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {[ 
                  {
                    id: "tabs-with-card-1",
                    imgSrc: "https://images.unsplash.com/photo-1605629921711-2f6b00c6bbf4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&h=720&q=80",
                    alt: "AI-Powered Interview Prep",
                  },
                  {
                    id: "tabs-with-card-2",
                    imgSrc: "https://images.unsplash.com/photo-1665686306574-1ace09918530?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&h=720&q=80",
                    alt: "Real-Time Answer Feedback",
                  },
                  {
                    id: "tabs-with-card-3",
                    imgSrc: "https://images.unsplash.com/photo-1598929213452-52d72f63e307?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&h=720&q=80",
                    alt: "Personalized Job Insights",
                  },
                ].map(
                  (tab) =>
                    activeTab === tab.id && (
                      <motion.img
                        key={tab.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: false }} // Updated for continuous animation
                        className="shadow-xl shadow-gray-200 rounded-xl"
                        src={tab.imgSrc}
                        alt={tab.alt}
                      />
                    )
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
