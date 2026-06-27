import React, { Suspense, lazy } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Services from "./components/Services.jsx";
import WhyNexCX from "./components/WhyNexCX.jsx";
import Process from "./components/Process.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

const InsightEngine = lazy(() => import("./features/insights/InsightEngine.jsx"));
const AIConsultant = lazy(() => import("./features/ai-consultant/AIConsultant.jsx"));

export default function App() {
  return (
    <div className="relative bg-navy min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Suspense
          fallback={
            <section id="insights" className="py-24">
              <div className="mx-auto max-w-7xl px-6 lg:px-10">
                <div className="glass rounded-lg p-8 text-slate-soft">Loading NexCX Insight Engine...</div>
              </div>
            </section>
          }
        >
          <InsightEngine />
        </Suspense>
        <WhyNexCX />
        <Process />
        <Contact />
      </main>
      <Footer />
      <Suspense fallback={null}>
        <AIConsultant />
      </Suspense>
    </div>
  );
}
