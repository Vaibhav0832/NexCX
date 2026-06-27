import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { calculators, MONEY_FIELDS, PERCENT_FIELDS } from "./constants";
import { calculateOpportunity, calculatorEngines, validateInputs } from "./calculations";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

function initialValues() {
  return calculators.reduce((state, calculator) => {
    state[calculator.id] = calculator.fields.reduce((values, field) => {
      values[field.id] = field.value;
      return values;
    }, {});
    return state;
  }, {});
}

function formatMetric(metric) {
  if (metric.type === "text") return metric.value;
  const value = Number(metric.value) || 0;
  if (metric.type === "money") return currency.format(value);
  if (metric.type === "percent") return `${number.format(value)}%`;
  return `${number.format(metric.digits === 0 ? Math.round(value) : value)}${metric.suffix || ""}`;
}

function FieldInput({ field, value, error, onChange }) {
  const suffix = PERCENT_FIELDS.has(field.id) ? "%" : MONEY_FIELDS.has(field.id) ? "₹" : "";

  return (
    <label className="group flex flex-col gap-1.5 rounded-lg border border-white/8 bg-white/[0.035] p-2.5 transition-colors focus-within:border-signal/60">
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-soft">{field.label}</span>
      <span className="flex items-center gap-2">
        {suffix === "₹" && <span className="font-mono text-sm text-signal">₹</span>}
        <input
          type="number"
          min="0"
          max={PERCENT_FIELDS.has(field.id) ? "100" : undefined}
          step="0.1"
          value={value}
          onChange={(event) => onChange(field.id, event.target.value)}
          className="w-full bg-transparent font-display text-base font-semibold text-ice outline-none"
        />
        {suffix === "%" && <span className="font-mono text-sm text-signal">%</span>}
      </span>
      {error && <span className="text-xs text-rose-300">{error}</span>}
    </label>
  );
}

function MetricCard({ metric }) {
  return (
    <div className="rounded-lg border border-white/8 bg-navy-100/70 p-3">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-soft">{metric.label}</p>
      <p className="mt-2 break-words font-display text-xl font-semibold text-ice">{formatMetric(metric)}</p>
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map((item) => Number(item.value) || 0), 1);

  return (
    <div className="space-y-3">
      {data.slice(0, 8).map((item) => {
        const width = Math.max(((Number(item.value) || 0) / max) * 100, 4);
        return (
          <div key={item.label} className="grid grid-cols-[7.5rem_1fr] items-center gap-3 text-sm">
            <span className="truncate text-slate-soft">{item.label}</span>
            <span className="h-3 overflow-hidden rounded-full bg-white/8">
              <span
                className="block h-full rounded-full bg-gradient-to-r from-signal via-electric to-violet"
                style={{ width: `${width}%` }}
              />
            </span>
          </div>
        );
      })}
    </div>
  );
}

function CalculatorShell({ calculator, values, result, errors, onChange }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-lg border border-white/8 bg-white/[0.04] p-4">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <p className="section-label">{calculator.category}</p>
            <h3 className="mt-2 font-display text-xl font-semibold text-ice">{calculator.title}</h3>
          </div>
          <span className={`h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br ${calculator.accent} shadow-glow`} />
        </div>
        <p className="mb-4 max-w-2xl text-sm leading-6 text-slate-soft">{calculator.description}</p>
        {calculator.fields.length > 0 ? (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {calculator.fields.map((field) => (
              <FieldInput
                key={field.id}
                field={field}
                value={values[field.id] ?? ""}
                error={errors[field.id]}
                onChange={onChange}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-signal/20 bg-signal/10 p-4 text-sm leading-6 text-slate-soft">
            This analyzer uses the live outputs from the other Insight Engine modules.
          </div>
        )}
      </div>

      <div className="rounded-lg border border-white/8 bg-navy-50/80 p-4">
        <p className="section-label">Live Output</p>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {result.metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-white/8 bg-white/[0.035] p-3">
          <p className="text-sm font-semibold text-ice">Recommendation</p>
          <p className="mt-2 text-sm leading-6 text-slate-soft">{result.recommendation}</p>
        </div>
        {result.summary && (
          <div className="mt-3 rounded-lg border border-white/8 bg-white/[0.035] p-3">
            <p className="text-sm font-semibold text-ice">Business Summary</p>
            <p className="mt-2 text-sm leading-6 text-slate-soft">{result.summary}</p>
          </div>
        )}
        {result.chart?.length > 0 && (
          <div className="mt-4 rounded-lg border border-white/8 bg-white/[0.035] p-3">
            <p className="mb-4 text-sm font-semibold text-ice">Signal Chart</p>
            <BarChart data={result.chart} />
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCards({ results }) {
  const monthlySavings = Object.entries(results)
    .filter(([id]) => id !== "opportunity")
    .reduce((sum, [, result]) => sum + (Number(result.savings) || 0), 0);
  const annualSavings = monthlySavings * 12;
  const healthScore = results.health?.metrics?.[0]?.value || 0;
  const priority = results.opportunity?.metrics?.find((metric) => metric.label === "Priority")?.value || "Targeted";

  const cards = [
    { label: "Annual Opportunity", value: currency.format(annualSavings), note: "Modeled across active calculators" },
    { label: "Monthly Savings", value: currency.format(monthlySavings), note: "Live financial signal" },
    { label: "Health Score", value: `${Math.round(healthScore)}/100`, note: "Weighted maturity engine" },
    { label: "Priority", value: priority, note: "Opportunity analyzer output" },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border border-white/8 bg-white/[0.045] p-4 shadow-glass">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-soft">{card.label}</p>
          <p className="mt-2 font-display text-2xl font-semibold text-ice">{card.value}</p>
          <p className="mt-2 text-sm text-slate-soft">{card.note}</p>
        </div>
      ))}
    </div>
  );
}

function RecentCalculations({ activeId, setActiveId, results }) {
  return (
    <div className="rounded-lg border border-white/8 bg-white/[0.04] p-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="section-label">Calculator Navigation</p>
          <h3 className="mt-2 font-display text-lg font-semibold text-ice">Select a calculator</h3>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {calculators.map((calculator) => (
          <button
            key={calculator.id}
            type="button"
            onClick={() => setActiveId(calculator.id)}
            className={`min-h-16 rounded-lg border p-2.5 text-left transition-all ${
              activeId === calculator.id
                ? "border-signal/60 bg-signal/10 text-ice"
                : "border-white/8 bg-navy-100/55 text-slate-soft hover:border-white/20 hover:text-ice"
            }`}
          >
            <span className={`mb-2 block h-1 w-10 rounded-full bg-gradient-to-r ${calculator.accent}`} />
            <span className="block text-xs font-semibold leading-5">{calculator.title}</span>
            <span className="mt-1 block font-mono text-[0.7rem] text-slate-soft">
              {currency.format((results[calculator.id]?.savings || 0) * 12)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Recommendations({ results }) {
  const ranked = Object.entries(results)
    .filter(([id]) => id !== "opportunity")
    .map(([id, result]) => ({
      title: calculators.find((calculator) => calculator.id === id)?.title || id,
      savings: result.savings || 0,
      recommendation: result.recommendation,
    }))
    .sort((a, b) => b.savings - a.savings)
    .slice(0, 4);

  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-lg border border-white/8 bg-white/[0.04] p-4">
        <p className="section-label">Optimization Opportunities</p>
        <div className="mt-5 space-y-4">
          {ranked.map((item, index) => (
            <div key={item.title} className="flex items-center justify-between gap-4 rounded-lg bg-navy-100/65 p-3">
              <div>
                <p className="font-semibold text-ice">{item.title}</p>
                <p className="mt-1 text-sm text-slate-soft">Priority {index + 1}</p>
              </div>
              <p className="font-mono text-sm text-signal">{currency.format(item.savings * 12)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-white/8 bg-white/[0.04] p-4">
        <p className="section-label">Recommendations</p>
        <div className="mt-5 space-y-3">
          {ranked.map((item) => (
            <div key={item.recommendation} className="rounded-lg border border-white/8 bg-navy-100/65 p-3">
              <p className="text-sm font-semibold text-ice">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-soft">{item.recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function InsightEngine() {
  const [activeId, setActiveId] = useState("cost");
  const [values, setValues] = useState(() => initialValues());

  const baseResults = useMemo(() => {
    return calculators.reduce((results, calculator) => {
      if (calculatorEngines[calculator.id]) {
        results[calculator.id] = calculatorEngines[calculator.id](values[calculator.id] || {});
      }
      return results;
    }, {});
  }, [values]);

  const results = useMemo(
    () => ({
      ...baseResults,
      opportunity: calculateOpportunity(baseResults),
    }),
    [baseResults]
  );

  const activeCalculator = calculators.find((calculator) => calculator.id === activeId) || calculators[0];
  const activeErrors = validateInputs(activeCalculator.fields, values[activeCalculator.id] || {});

  function handleChange(fieldId, value) {
    setValues((current) => ({
      ...current,
      [activeCalculator.id]: {
        ...current[activeCalculator.id],
        [fieldId]: value,
      },
    }));
  }

  return (
    <section id="insights" className="relative overflow-hidden py-20 sm:py-24">
      <div className="absolute inset-0 -z-10 bg-grad-radial-glow" />
      <div className="absolute left-1/2 top-20 -z-10 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-electric/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-7 max-w-4xl"
        >
          <p className="section-label">Calculators</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-ice sm:text-5xl">
            NexCX Insight Engine<sup className="text-gradient text-xl sm:text-2xl">TM</sup>
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-soft">
            A premium decision cockpit for cost, workforce, ROI, platform health, KPI performance,
            and optimization opportunity analysis.
          </p>
        </motion.div>

        <div className="space-y-5">
          <SummaryCards results={results} />
          <RecentCalculations activeId={activeId} setActiveId={setActiveId} results={results} />
          <CalculatorShell
            calculator={activeCalculator}
            values={values[activeCalculator.id] || {}}
            result={results[activeCalculator.id]}
            errors={activeErrors}
            onChange={handleChange}
          />
          <Recommendations results={results} />
        </div>
      </div>
    </section>
  );
}
