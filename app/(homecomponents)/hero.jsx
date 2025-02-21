"use client"; // ✅ Required for client-side interactions

import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section id="home" className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, y: 50 }} // Starts hidden & moved down
          whileInView={{ opacity: 1, y: 0 }} // Animates when visible
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }} // ⏳ Increased delay
          viewport={{ once: false, amount: 0.5 }} // Continuously triggers when 50% visible
        >
          <h1 className="block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight dark:text-white">
            Unlock Your{" "}
            <span className="text-indigo-600">Interview Success with AI</span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            viewport={{ once: false, amount: 0.5 }} // Continuously triggers when 50% visible
            className="mt-3 text-lg text-gray-800 dark:text-neutral-400"
          >
            Prepare smarter, practice with purpose, and ace your interviews with
            InterviewAI — your key to standing out.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
            viewport={{ once: false, amount: 0.5 }} // Continuously triggers when 50% visible
            className="mt-7 grid gap-3 w-full sm:inline-flex"
          >
            <a
              className="py-3 px-10 inline-flex justify-center items-center gap-x-2 text-lg font-medium rounded-lg border border-transparent bg-indigo-800 text-white hover:bg-indigo-600 focus:outline-none focus:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none"
              href="/sign-in"
            >
              Join Us
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>
          </motion.div>
        </motion.div>

        {/* Right Side - Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }} // Moves in from right
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: "easeOut" }} // ⏳ Increased delay
          viewport={{ once: false, amount: 0.5 }} // Continuously triggers when 50% visible
          className="flex justify-end"
        >
          <img
            src="/herobg.png"
            alt="Hero Image"
            className="w-full max-w-lg rounded-lg"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
