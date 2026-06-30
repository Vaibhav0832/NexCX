import React from "react";
import { motion } from "framer-motion";

const technologies = [
  { name: "Genesys Cloud CX", status: "Available" },
  { name: "Genesys Engage", status: "Coming Soon" },
];

export default function About() {
  return (
    <section id="technologies" className="relative py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-16">
          <span className="section-label">Technologies</span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mt-4 text-ice leading-snug">
            Genesys knowledge coverage
          </h2>
          <p className="mt-5 text-slate-soft leading-relaxed">
            Genesys Cloud CX knowledge is available now. Genesys Engage coverage
            is scheduled for an upcoming update.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {technologies.map((technology, index) => (
            <motion.div
              key={technology.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: (index % 5) * 0.06 }}
              className="glass rounded-2xl p-5 hover:shadow-glow transition-shadow duration-300"
            >
              <h3 className="font-display font-semibold text-ice text-base">
                {technology.name}
              </h3>
              <p
                className={`mt-2 text-xs font-mono uppercase tracking-widest ${
                  technology.status === "Available" ? "text-signal" : "text-slate-soft"
                }`}
              >
                {technology.status}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
