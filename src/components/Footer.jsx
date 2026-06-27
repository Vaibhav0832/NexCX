import React from "react";

const quickLinks = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "Technologies", href: "#technologies" },
  { label: "Calculators", href: "#insights" },
  { label: "AI Consultant", href: "#ai-consultant", action: "ai" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  function handleLinkClick(link) {
    if (link.action === "ai") {
      window.dispatchEvent(new CustomEvent("nexcx:open-ai-consultant"));
    }
  }

  return (
    <footer className="relative border-t border-white/8 bg-navy-100/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
        <div className="grid md:grid-cols-3 gap-10 items-start">
          <div>
            <img
              src="/logo-wordmark.png"
              alt="NexCX"
              className="h-9 w-auto mb-4 select-none"
              draggable="false"
            />
            <p className="text-sm text-slate-soft max-w-xs leading-relaxed">
              Independent multi-technology contact center consulting for
              enterprises that depend on resilient customer operations.
            </p>
          </div>

          <div className="md:justify-self-center">
            <h4 className="text-xs font-mono uppercase tracking-widest text-signal mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => handleLinkClick(l)}
                    className="text-sm text-slate-soft hover:text-ice transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:justify-self-end">
            <h4 className="text-xs font-mono uppercase tracking-widest text-signal mb-4">
              Contact
            </h4>
            <a
              href="mailto:info@nexcx.in"
              className="text-sm text-slate-soft hover:text-ice transition-colors"
            >
              info@nexcx.in
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-soft/70">
            © {year} NexCX. All rights reserved.
          </p>
          <p className="text-xs text-slate-soft/70">
            Independent Contact Center Consulting &amp; Advisory
          </p>
        </div>
      </div>
    </footer>
  );
}
