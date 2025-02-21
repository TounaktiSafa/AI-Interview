"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-indigo-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-manrope text-5xl font-bold text-indigo-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-gray-500 text-lg">7 Days free trial. No credit card required.</p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-6">
          {[{
            name: "Free",
            price: "$0",
            features: [
              "2 auto tracking",
              "7 Day transaction clearing",
              "24/7 Customer support",
              "All widget access",
            ],
            bgColor: "bg-white",
          }, {
            name: "Advanced",
            price: "$150",
            features: [
              "AI Advisor",
              "Unlimited auto tracking",
              "1 Day transaction clearing",
              "Priority customer support",
              "All Widget Access",
            ],
            bgColor: "bg-indigo-100",
            badge: "MOST POPULAR",
          }, {
            name: "Team",
            price: "$180",
            features: [
              "AI Advisor",
              "Unlimited auto tracking",
              "1 Day transaction clearing",
              "Priority customer support",
              "All Widget Access",
            ],
            bgColor: "bg-white",
          }].map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true, amount: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPlan(plan.name)}
              className={`relative flex flex-col p-8 rounded-3xl shadow-lg cursor-pointer transition-all duration-500 ${
                selectedPlan === plan.name
                  ? "border-4 border-indigo-500 shadow-2xl scale-105"
                  : "hover:shadow-xl"
              } ${plan.bgColor}`}
            >
              {plan.badge && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-indigo-900 text-white text-xs font-semibold uppercase px-4 py-2 rounded-b-2xl">
                  {plan.badge}
                </div>
              )}
              <h3 className="text-3xl font-bold text-indigo-900 text-center mb-4">{plan.name}</h3>
              <div className="flex justify-center items-center mb-6">
                <span className="text-5xl font-extrabold text-indigo-600">{plan.price}</span>
                <span className="text-lg text-gray-500">/ month</span>
              </div>
              <ul className="space-y-4 text-lg text-gray-600 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center space-x-3">
                    <span className="text-indigo-600">✔</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 text-lg font-semibold rounded-xl transition-all duration-300 ${
                selectedPlan === plan.name ? "bg-indigo-600 text-white" : "bg-indigo-700 text-gray-100  hover:bg-indigo-500 hover:text-white"
              }`}
              >
                Choose Plan
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
