import React, { useRef } from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI Consultant",
    desc: "Interactive contact center guidance powered by local knowledge search.",
    icon: (
      <path d="M12 3v3M6 8h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7a2 2 0 012-2zM8 13h.01M16 13h.01M9 17h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
  },
  {
    title: "Insight Engine",
    desc: "Calculators for cost, ROI, staffing, health, and optimization signals.",
    icon: (
      <path d="M3 12h4l3 8 4-16 3 8h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
  },
  {
    title: "Knowledge Base",
    desc: "Structured technology intelligence with modular knowledge-base support.",
    icon: (
      <path d="M5 5h10a4 4 0 014 4v10H9a4 4 0 01-4-4V5zM9 9h6M9 13h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
  },
];

function FeatureCard({ feature, index }) {
  const cardRef = useRef(null);

  function handleMouseMove(e) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * -10;
    const rotateY = ((x - rect.width / 2) / rect.width) * 10;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass rounded-2xl p-7 transition-transform duration-200 ease-out will-change-transform hover:shadow-glow group"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="w-12 h-12 rounded-xl bg-grad-primary flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          {feature.icon}
        </svg>
      </div>
      <h3 className="font-display font-semibold text-ice text-lg leading-snug">
        {feature.title}
      </h3>
      <p className="mt-3 text-sm text-slate-soft leading-relaxed">{feature.desc}</p>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="features" className="relative py-28 md:py-36 bg-navy-50/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-16">
          <span className="section-label">Platform Features</span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mt-4 text-ice leading-snug">
            Enterprise contact center intelligence in one interface
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
