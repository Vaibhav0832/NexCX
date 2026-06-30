import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadKnowledgeBase, searchKnowledgeBase } from "./knowledgeSearch";
import { getTechnologyById, technologies } from "./technologyConfig";

function buildWelcomeMessage(technologyName) {
  return {
    role: "assistant",
    text: `Ask me anything about ${technologyName}. I will answer from the local NexCX knowledge base.`,
  };
}

function buildComingSoonMessage(technologyName) {
  return `Knowledge base for ${technologyName} will be available in an upcoming update.`;
}

export default function AIConsultant() {
  const [open, setOpen] = useState(false);
  const [selectedTechnologyId, setSelectedTechnologyId] = useState("");
  const [recordsByTechnology, setRecordsByTechnology] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const threadRef = useRef(null);

  const selectedTechnology = getTechnologyById(selectedTechnologyId);
  const activeRecords = selectedTechnologyId ? recordsByTechnology[selectedTechnologyId] || [] : [];
  const chatEnabled = Boolean(selectedTechnology?.enabled);

  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener("nexcx:open-ai-consultant", openChat);
    return () => window.removeEventListener("nexcx:open-ai-consultant", openChat);
  }, []);

  useEffect(() => {
    if (!open || !selectedTechnology?.enabled || activeRecords.length || loading) return;

    setLoading(true);
    loadKnowledgeBase(selectedTechnology.knowledgeBaseUrl)
      .then((loadedRecords) => {
        setRecordsByTechnology((current) => ({
          ...current,
          [selectedTechnology.id]: loadedRecords,
        }));
        setError("");
      })
      .catch(() => {
        setError("The local knowledge base could not be loaded.");
      })
      .finally(() => setLoading(false));
  }, [activeRecords.length, loading, open, selectedTechnology]);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, open, selectedTechnologyId]);

  function handleTechnologySelect(technologyId) {
    const technology = getTechnologyById(technologyId);
    setSelectedTechnologyId(technologyId);
    setInput("");
    setError("");

    if (technology?.enabled) {
      setMessages([buildWelcomeMessage(technology.name)]);
      return;
    }

    setMessages([
      {
        role: "assistant",
        text: buildComingSoonMessage(technology?.name || "this technology"),
      },
    ]);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const question = input.trim();
    if (!question || loading || !chatEnabled) return;

    const result = searchKnowledgeBase(activeRecords, question);
    const sourceLine = result.match
      ? `Source: ${result.match.category || selectedTechnology.name}${result.match.id ? ` #${result.match.id}` : ""}`
      : `Source: Local ${selectedTechnology.name} knowledge base`;

    setMessages((current) => [
      ...current,
      { role: "user", text: question },
      {
        role: "assistant",
        text: result.answer,
        meta: sourceLine,
      },
    ]);
    setInput("");
  }

  return (
    <div id="ai-consultant" className="fixed bottom-5 right-5 z-[60]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="mb-4 w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-navy/95 shadow-glass backdrop-blur-xl"
          >
            <div className="border-b border-white/8 bg-white/[0.04] px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base font-semibold text-ice">
                    {"\uD83E\uDD16"} NexCX AI Consultant
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-white/10 px-2 py-1 text-sm text-slate-soft transition-colors hover:text-ice"
                  aria-label="Close AI Consultant"
                >
                  x
                </button>
              </div>
            </div>

            <div ref={threadRef} className="max-h-80 space-y-3 overflow-y-auto px-4 py-4">
              <div className="rounded-xl border border-white/8 bg-white/[0.045] px-3 py-3">
                <p className="text-sm font-semibold text-ice">Select a Technology</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {technologies.map((technology) => (
                    <button
                      key={technology.id}
                      type="button"
                      onClick={() => handleTechnologySelect(technology.id)}
                      className={`rounded-lg border px-2.5 py-2 text-left text-xs font-medium transition-colors ${
                        selectedTechnologyId === technology.id
                          ? "border-signal/60 bg-signal/10 text-ice"
                          : "border-white/8 bg-navy-100/55 text-slate-soft hover:border-white/20 hover:text-ice"
                      }`}
                    >
                      {technology.name}
                    </button>
                  ))}
                </div>
              </div>

              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`whitespace-pre-line rounded-xl px-3 py-2 text-sm leading-6 ${
                    message.role === "user"
                      ? "ml-8 bg-grad-primary text-white"
                      : "mr-8 border border-white/8 bg-white/[0.045] text-slate-soft"
                  }`}
                >
                  <p>{message.text}</p>
                  {message.meta && <p className="mt-2 text-xs text-signal">{message.meta}</p>}
                </div>
              ))}
              {error && (
                <div className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-100">
                  {error}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-white/8 p-3">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={
                    chatEnabled
                      ? selectedTechnology.placeholder
                      : selectedTechnology
                        ? "Knowledge base coming soon."
                        : "Select a technology to continue..."
                  }
                  readOnly={!chatEnabled}
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-ice outline-none transition-colors placeholder:text-slate-soft/70 focus:border-signal/70"
                />
                <button
                  type="submit"
                  disabled={loading || !chatEnabled || !input.trim()}
                  className="rounded-lg bg-grad-primary px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Ask
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-grad-primary px-5 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
        aria-expanded={open}
      >
        <span aria-hidden="true">{"\uD83E\uDD16"}</span>
        NexCX AI Consultant
      </button>
    </div>
  );
}
