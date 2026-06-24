import React, { Suspense, lazy } from "react";
import { motion } from "framer-motion";

const NetworkScene = lazy(() => import("../three/NetworkScene.jsx"));

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden"
    >
      {/* Ambient gradient glow */}
      <div className="absolute inset-0 bg-grad-radial-glow pointer-events-none" />

      {/* 3D network */}
      <Suspense fallback={null}>
        <NetworkScene className="opacity-70" />
      </Suspense>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.img
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          src="/logo-full.png"
          alt="NexCX — Optimize Your Genesys Investment"
          className="mx-auto w-full max-w-md md:max-w-lg mb-8 select-none"
          draggable="false"
        />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-display text-4xl md:text-6xl font-semibold leading-tight tracking-tight text-ice"
        >
          Optimize Your{" "}
          <span className="text-gradient">Genesys Investment</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-6 text-lg md:text-xl text-slate-soft max-w-2xl mx-auto leading-relaxed"
        >
          Independent Genesys consulting helping organizations reduce costs,
          improve architecture, strengthen governance, and maximize platform
          value.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href="#contact" className="btn-primary">
            Book Discovery Call
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a href="#contact" className="btn-secondary">
            Contact Us
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-mono uppercase tracking-widest text-slate-soft/70"
        >
          <span>Vendor-Neutral</span>
          <span className="w-1 h-1 rounded-full bg-slate-soft/40" />
          <span>Independent Advisory</span>
          <span className="w-1 h-1 rounded-full bg-slate-soft/40" />
          <span>Enterprise Genesys Expertise</span>
        </motion.div>
      </div>
    </section>
  );
}
