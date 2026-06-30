import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const [status, setStatus] = useState("idle");

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const company = form.company.value;
    const message = form.message.value;
    const subject = encodeURIComponent(`NexCX Contact - ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:info@nexcx.in?subject=${subject}&body=${body}`;
    setStatus("sent");
  }

  return (
    <section id="contact" className="relative py-28 md:py-36">
      <div className="absolute inset-0 bg-grad-radial-glow pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">Contact</span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mt-4 text-ice leading-snug">
              Contact NexCX
            </h2>
            <p className="mt-6 text-slate-soft text-lg leading-relaxed">
              Send a message about the NexCX knowledge platform.
            </p>

            <div className="mt-10 space-y-5">
              <a
                href="mailto:info@nexcx.in"
                className="flex items-center gap-4 glass rounded-xl p-4 hover:shadow-glow transition-shadow duration-300"
              >
                <span className="w-10 h-10 rounded-lg bg-grad-primary flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16v16H4V4z" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 6l8 7 8-7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <div className="text-xs text-slate-soft font-mono uppercase tracking-wider">
                    Email
                  </div>
                  <div className="text-ice font-medium">info@nexcx.in</div>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 glass rounded-xl p-4 hover:shadow-glow transition-shadow duration-300"
              >
                <span className="w-10 h-10 rounded-lg bg-grad-primary flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M6.94 8.5a1.94 1.94 0 100-3.88 1.94 1.94 0 000 3.88zM5.5 10.5h3v9h-3v-9zM10.5 10.5h2.88v1.23h.04c.4-.76 1.4-1.56 2.88-1.56 3.08 0 3.65 2.02 3.65 4.66V19.5h-3v-4.1c0-.98-.02-2.24-1.37-2.24-1.37 0-1.58 1.07-1.58 2.17v4.17h-3v-9z" fill="white" />
                  </svg>
                </span>
                <div>
                  <div className="text-xs text-slate-soft font-mono uppercase tracking-wider">
                    LinkedIn
                  </div>
                  <div className="text-ice font-medium">NexCX on LinkedIn</div>
                </div>
              </a>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-7 md:p-9 space-y-5"
          >
            <div>
              <label htmlFor="name" className="block text-sm text-slate-soft mb-2">Full name</label>
              <input id="name" name="name" type="text" required placeholder="Jordan Lee" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-ice placeholder:text-slate-soft/50 focus:outline-none focus:border-signal/60 transition-colors" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-slate-soft mb-2">Work email</label>
              <input id="email" name="email" type="email" required placeholder="jordan@company.com" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-ice placeholder:text-slate-soft/50 focus:outline-none focus:border-signal/60 transition-colors" />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm text-slate-soft mb-2">Company</label>
              <input id="company" name="company" type="text" placeholder="Acme Corporation" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-ice placeholder:text-slate-soft/50 focus:outline-none focus:border-signal/60 transition-colors" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm text-slate-soft mb-2">Message</label>
              <textarea id="message" name="message" rows="4" placeholder="Write your message..." className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-ice placeholder:text-slate-soft/50 focus:outline-none focus:border-signal/60 transition-colors resize-none" />
            </div>
            <button type="submit" className="btn-primary w-full">
              {status === "sent" ? "Opening your mail client..." : "Send Message"}
            </button>
            <p className="text-xs text-slate-soft/60 text-center">
              Submitting opens your email client addressed to info@nexcx.in.
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
