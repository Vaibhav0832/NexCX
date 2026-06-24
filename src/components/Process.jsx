import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Discovery",
    desc: "We learn your current Genesys setup, business goals, and pain points through structured conversations with your team.",
  },
  {
    n: "02",
    title: "Assessment",
    desc: "Deep technical and operational review across architecture, cost, security, and governance.",
  },
  {
    n: "03",
    title: "Recommendations",
    desc: "Clear, prioritized findings with concrete actions — no generic checklists.",
  },
  {
    n: "04",
    title: "Optimization Roadmap",
    desc: "A phased plan your team can execute, with measurable milestones and ROI targets.",
  },
];

export default function Process() {
  return (
    <section id="process" className="relative py-28 md:py-36 bg-navy-50/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-20">
          <span className="section-label">Engagement Process</span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mt-4 text-ice leading-snug">
            A structured path from discovery to optimized outcomes
          </h2>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-7 left-0 right-0 h-px bg-white/10" />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
            className="hidden lg:block absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-electric via-violet to-signal"
          />

          <div className="grid lg:grid-cols-4 gap-10 lg:gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.15 }}
                className="relative"
              >
                <div className="relative z-10 w-14 h-14 rounded-full bg-grad-primary flex items-center justify-center font-display font-semibold text-white shadow-glow mb-6">
                  {s.n}
                </div>
                <h3 className="font-display font-semibold text-ice text-xl">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm text-slate-soft leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
