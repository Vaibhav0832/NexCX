import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function useCountUp(target, isInView, duration = 1.6) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = null;
    let raf;
    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, target, duration]);

  return value;
}

const pillars = [
  {
    label: "Reduce Costs",
    value: 30,
    suffix: "%",
    desc: "Average licensing & operational cost reduction identified.",
  },
  {
    label: "Improve Performance",
    value: 45,
    suffix: "%",
    desc: "Faster issue resolution through architecture refinement.",
  },
  {
    label: "Strengthen Security",
    value: 100,
    suffix: "%",
    desc: "Governance frameworks aligned to enterprise compliance.",
  },
  {
    label: "Maximize ROI",
    value: 3,
    suffix: "x",
    desc: "Typical platform value uplift within 12 months.",
  },
];

function Pillar({ p, i }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const count = useCountUp(p.value, isInView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: i * 0.1 }}
      className="glass rounded-2xl p-8 text-center hover:shadow-glow transition-shadow duration-300"
    >
      <div className="font-display text-5xl font-semibold text-gradient">
        {count}
        {p.suffix}
      </div>
      <h3 className="mt-4 font-display font-semibold text-ice text-lg">
        {p.label}
      </h3>
      <p className="mt-2 text-sm text-slate-soft leading-relaxed">{p.desc}</p>
    </motion.div>
  );
}

export default function WhyNexCX() {
  return (
    <section id="why" className="relative py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="section-label">Why NexCX</span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mt-4 text-ice leading-snug">
            Measurable outcomes, not just recommendations
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, i) => (
            <Pillar key={p.label} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
