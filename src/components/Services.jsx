import React, { useRef } from "react";
import { motion } from "framer-motion";

const services = [
  {
    title: "Discovery Call",
    desc: "Understand current challenges and business goals.",
    icon: (
      <path
        d="M9 17l3-3 3 3M9 13l3-3 3 3M5 21h14a2 2 0 002-2V7l-6-4H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    title: "Genesys Optimization Assessment",
    desc: "Improve operational efficiency and platform utilization.",
    icon: (
      <path
        d="M3 12h4l3 8 4-16 3 8h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    title: "Genesys Cost Optimization Assessment",
    desc: "Identify cost reduction opportunities and licensing optimization.",
    icon: (
      <path
        d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    title: "Genesys Architecture Review",
    desc: "Assess scalability, resilience, and best-practice alignment.",
    icon: (
      <path
        d="M4 6h16M4 12h16M4 18h16M8 6v12M16 6v12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    title: "Genesys Security & Governance Review",
    desc: "Evaluate security posture, controls, compliance, and governance.",
    icon: (
      <path
        d="M12 2l8 3.5V11c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V5.5L12 2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    title: "Genesys Advisory Retainer",
    desc: "Ongoing strategic and operational guidance.",
    icon: (
      <path
        d="M12 8v4l3 3M12 2a10 10 0 100 20 10 10 0 000-20z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
];

function ServiceCard({ s, index }) {
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
          {s.icon}
        </svg>
      </div>
      <h3 className="font-display font-semibold text-ice text-lg leading-snug">
        {s.title}
      </h3>
      <p className="mt-3 text-sm text-slate-soft leading-relaxed">{s.desc}</p>
      <a
        href="#contact"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-signal opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        Learn more
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8H13M13 8L9 4M13 8L9 12"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative py-28 md:py-36 bg-navy-50/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-16">
          <span className="section-label">What We Do</span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mt-4 text-ice leading-snug">
            Specialist Genesys advisory across the platform lifecycle
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <ServiceCard key={s.title} s={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
