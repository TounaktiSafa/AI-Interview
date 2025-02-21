"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function BenefitSection() {
  return (
    <div id="who-we-help" className="max-w-[85rem] px-6 py-16 sm:px-12 lg:px-20 lg:py-20 mx-auto">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.5 }}
        className="max-w-3xl mx-auto text-center mb-14"
      >
        <h2 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          <span className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-indigo-900 md:text-5xl lg:text-6xl dark:text-white">
            Who Can Benefit
          </span>{" "}
          from InterviewAI?
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-neutral-300">
          Elevate your interview skills with AI-driven coaching tailored to your needs.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {[
          {
            title: "Students and Graduates",
            desc: "Gain confidence and practice answering tailored interview questions.",
            imgSrc: "/students.jpg",
          },
          {
            title: "Job Seekers",
            desc: "Improve your performance with AI-driven interview simulations.",
            imgSrc: "/job-seekers.jpg",
          },
          {
            title: "Remote Workers & Freelancers",
            desc: "Ace virtual interviews with personalized AI feedback.",
            imgSrc: "/freelancers.jpg",
          },
        ].map((item, index) => (
          <motion.a
            key={item.title}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: index * 0.2, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.5 }}
            className="group relative block rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 bg-white/10 backdrop-blur-xl border border-white/20 dark:border-white/10"
            href="#"
          >
            <div className="relative w-full h-64">
              <Image
                className="w-full h-full object-cover"
                src={item.imgSrc}
                alt={item.title}
                layout="fill"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            </div>
            {/* Card Content */}
            <div className="p-6">
              <h3 className="text-xl font-semibold  text-indigo-900 transition">
                {item.title}
              </h3>
              <p className="mt-2 text-neutral-300">{item.desc}</p>
            </div>
            {/* Neon Hover Effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400/50 transition"></div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
