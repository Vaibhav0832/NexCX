import React from "react";
import { motion } from "framer-motion";

const points = [
  {
    title: "Independent guidance",
    desc: "No reseller margins, no platform quotas - recommendations driven solely by your outcomes.",
  },
  {
    title: "Vendor-neutral recommendations",
    desc: "We evaluate your contact center estate on its merits, not on what is easiest to sell.",
  },
  {
    title: "Multi-platform expertise",
    desc: "Specialist knowledge across cloud, hybrid, and on-premises contact center platforms.",
  },
  {
    title: "Practical implementation experience",
    desc: "Grounded in real deployments, not theoretical frameworks.",
  },
];

const technologies = [
  "Genesys Cloud CX",
  "Genesys Engage",
  "Cisco UCCE",
  "NICE CXone",
  "Amazon Connect",
  "Five9",
  "Talkdesk",
  "Avaya",
  "Verint",
  "Alvaria",
];

export default function About() {
  return (
    <section id="technologies" className="relative py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-14 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <span className="section-label">Technologies</span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mt-4 text-ice leading-snug">
              Independent advisory for multi-technology contact centers
            </h2>
            <p className="mt-6 text-slate-soft text-base md:text-lg leading-relaxed">
              NexCX helps enterprises optimize the platforms that run their
              customer operations. We improve performance, reduce operational
              cost, strengthen governance, and modernize architecture without
              ties to any vendor sales target.
            </p>
            <p className="mt-4 text-slate-soft text-base md:text-lg leading-relaxed">
              Our role is practical and outcome-focused: make your contact
              center technology work harder for the business, and make every
              platform investment easier to justify.
            </p>
            <div className="mt-7">
              <p className="text-sm font-semibold text-ice">Supported technologies</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {technologies.map((technology) => (
                  <span
                    key={technology}
                    className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-medium text-slate-soft"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
            {points.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass rounded-2xl p-6 hover:shadow-glow transition-shadow duration-300"
              >
                <div className="w-9 h-9 rounded-lg bg-grad-primary flex items-center justify-center mb-4">
                  <span className="font-mono text-xs text-white font-semibold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-ice text-lg">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-slate-soft leading-relaxed">
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
