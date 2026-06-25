import { defaultAssumptions } from "./constants";

const n = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const pct = (value) => Math.min(Math.max(n(value), 0), 100) / 100;
const annualToMonthly = (value) => n(value) / 12;
const round = (value, digits = 0) => Number(value.toFixed(digits));

const fteFromHours = (hours, workingHours = defaultAssumptions.productiveHoursPerMonth) =>
  workingHours > 0 ? hours / workingHours : 0;

export function validateInputs(fields, values) {
  return fields.reduce((errors, field) => {
    const value = Number(values[field.id]);
    if (!Number.isFinite(value) || value < 0) {
      errors[field.id] = "Enter a valid non-negative value.";
    }
    if (
      /occupancy|shrinkage|containment|sla|utilization|abandonRate|fcr|csat/i.test(field.id) &&
      value > 100
    ) {
      errors[field.id] = "Percentages must be 100 or less.";
    }
    return errors;
  }, {});
}

export function calculateCost(values) {
  const leadershipCost =
    n(values.teamLeaders) * annualToMonthly(72000) +
    n(values.assistantManagers) * annualToMonthly(96000) +
    n(values.operationsManagers) * annualToMonthly(132000) +
    n(values.directors) * annualToMonthly(180000);
  const salaryCost = n(values.agents) * annualToMonthly(values.averageSalary) + leadershipCost;
  const infrastructureCost = ["buildingLease", "electricity", "internet", "servers", "maintenance", "security"].reduce(
    (sum, key) => sum + n(values[key]),
    0
  );
  const technologyCost = ["genesysCost", "crmCost", "otherSoftware"].reduce((sum, key) => sum + n(values[key]), 0);
  const miscellaneousCost = ["recruitment", "training", "otherExpenses"].reduce((sum, key) => sum + n(values[key]), 0);
  const monthlyCost = salaryCost + infrastructureCost + technologyCost + miscellaneousCost;
  const contacts = Math.max(n(values.agents) * defaultAssumptions.contactsPerAgent, 1);
  const techShare = monthlyCost ? technologyCost / monthlyCost : 0;
  const estimatedSavingsOpportunity = monthlyCost * Math.min(Math.max(techShare - 0.18, 0.04), 0.14);

  return {
    metrics: [
      { label: "Monthly Cost", value: monthlyCost, type: "money" },
      { label: "Annual Cost", value: monthlyCost * 12, type: "money" },
      { label: "Cost Per Agent", value: monthlyCost / Math.max(n(values.agents), 1), type: "money" },
      { label: "Cost Per Contact", value: monthlyCost / contacts, type: "money", digits: 2 },
      { label: "Salary Cost", value: salaryCost, type: "money" },
      { label: "Technology Cost", value: technologyCost, type: "money" },
      { label: "Infrastructure Cost", value: infrastructureCost, type: "money" },
      { label: "Miscellaneous Cost", value: miscellaneousCost, type: "money" },
    ],
    summary: "The largest controllable levers are workforce structure, technology spend, and occupancy discipline.",
    recommendation: techShare > 0.22 ? "Run a Genesys and CRM license optimization review first." : "Prioritize workforce efficiency and service design improvements.",
    savings: estimatedSavingsOpportunity,
    chart: [
      { label: "Salary", value: salaryCost },
      { label: "Technology", value: technologyCost },
      { label: "Infrastructure", value: infrastructureCost },
      { label: "Other", value: miscellaneousCost },
    ],
  };
}

export function calculateFte(values) {
  const workloadHours = (n(values.calls) * n(values.aht)) / 60;
  const productiveHours = n(values.workingHours) * Math.max(pct(values.occupancy), 0.01) * Math.max(1 - pct(values.shrinkage), 0.01);
  const requiredFte = workloadHours / productiveHours;
  const variance = n(values.currentFte) - requiredFte;

  return {
    metrics: [
      { label: "Required FTE", value: requiredFte, type: "number", digits: 1 },
      { label: "Overstaffed", value: Math.max(variance, 0), type: "number", digits: 1 },
      { label: "Understaffed", value: Math.max(-variance, 0), type: "number", digits: 1 },
    ],
    recommendation: variance > 5 ? "Rebalance schedules and redeploy capacity to high-value queues." : variance < -5 ? "Add capacity or reduce handle time before service levels degrade." : "Staffing is within a manageable operating band.",
    savings: Math.max(variance, 0) * annualToMonthly(defaultAssumptions.costPerFte),
    chart: [
      { label: "Required", value: requiredFte },
      { label: "Current", value: n(values.currentFte) },
    ],
  };
}

export function calculateRoi(values) {
  const annualSavings = n(values.monthlySavings) * 12;
  const roi = n(values.projectCost) ? ((annualSavings - n(values.projectCost)) / n(values.projectCost)) * 100 : 0;
  const payback = n(values.monthlySavings) ? n(values.projectCost) / n(values.monthlySavings) : 0;

  return {
    metrics: [
      { label: "ROI", value: roi, type: "percent", digits: 1 },
      { label: "Payback Period", value: payback, suffix: " mo", type: "number", digits: 1 },
      { label: "Annual Savings", value: annualSavings, type: "money" },
    ],
    recommendation: payback <= 9 ? "Strong investment case; package for executive approval." : "Improve the benefit case by sequencing high-confidence savings first.",
    savings: annualSavings,
    chart: [
      { label: "Project Cost", value: n(values.projectCost) },
      { label: "Annual Savings", value: annualSavings },
    ],
  };
}

export function calculateAht(values) {
  const minutesSaved = Math.max(n(values.currentAht) - n(values.targetAht), 0) * n(values.calls);
  const hoursSaved = minutesSaved / 60;
  const fteSaved = fteFromHours(hoursSaved);
  const savings = fteSaved * annualToMonthly(values.costPerFte || defaultAssumptions.costPerFte);

  return {
    metrics: [
      { label: "Hours Saved", value: hoursSaved, type: "number", digits: 0 },
      { label: "FTE Saved", value: fteSaved, type: "number", digits: 1 },
      { label: "Savings", value: savings, type: "money" },
    ],
    recommendation: "Target knowledge articles, wrap-up automation, and routing precision to capture handle-time savings.",
    savings,
    chart: [
      { label: "Current AHT", value: n(values.currentAht) },
      { label: "Target AHT", value: n(values.targetAht) },
    ],
  };
}

export function calculateOccupancy(values) {
  const improvement = Math.max(pct(values.targetOccupancy) - pct(values.currentOccupancy), 0);
  const additionalCapacity = n(values.currentFte) * improvement;
  const fteOptimization = additionalCapacity * 0.72;
  const savings = fteOptimization * annualToMonthly(values.costPerFte || defaultAssumptions.costPerFte);

  return {
    metrics: [
      { label: "Additional Capacity", value: additionalCapacity, type: "number", digits: 1 },
      { label: "FTE Optimization", value: fteOptimization, type: "number", digits: 1 },
      { label: "Savings", value: savings, type: "money" },
    ],
    recommendation: "Use schedule adherence, queue balancing, and forecast discipline to raise usable capacity.",
    savings,
    chart: [
      { label: "Current", value: n(values.currentOccupancy) },
      { label: "Target", value: n(values.targetOccupancy) },
    ],
  };
}

export function calculateIvr(values) {
  const callsAvoided = n(values.calls) * Math.max(pct(values.targetContainment) - pct(values.currentContainment), 0);
  const hoursAvoided = (callsAvoided * defaultAssumptions.ahtMinutes) / 60;
  const fteSaved = fteFromHours(hoursAvoided);
  const savings = fteSaved * annualToMonthly(values.costPerFte || defaultAssumptions.costPerFte);

  return {
    metrics: [
      { label: "Calls Avoided", value: callsAvoided, type: "number", digits: 0 },
      { label: "FTE Saved", value: fteSaved, type: "number", digits: 1 },
      { label: "Savings", value: savings, type: "money" },
    ],
    recommendation: "Improve top intents, authentication, and callback flows before adding new IVR branches.",
    savings,
    chart: [
      { label: "Current", value: n(values.currentContainment) },
      { label: "Target", value: n(values.targetContainment) },
    ],
  };
}

export function calculateGenesys(values) {
  const totalLicenses = n(values.namedLicenses) + n(values.concurrentLicenses);
  const utilization = totalLicenses ? (n(values.activeUsers) / totalLicenses) * 100 : 0;
  const unusedLicenses = Math.max(totalLicenses - n(values.activeUsers), 0);
  const monthlyWaste = unusedLicenses * n(values.licenseCost);

  return {
    metrics: [
      { label: "License Utilization", value: utilization, type: "percent", digits: 1 },
      { label: "Unused Licenses", value: unusedLicenses, type: "number", digits: 0 },
      { label: "Monthly Waste", value: monthlyWaste, type: "money" },
      { label: "Annual Waste", value: monthlyWaste * 12, type: "money" },
    ],
    recommendation: utilization < 80 ? "Right-size named and concurrent licenses using login and peak concurrency evidence." : "Utilization is healthy; monitor seasonal peaks before reducing seats.",
    savings: monthlyWaste,
    chart: [
      { label: "Active", value: n(values.activeUsers) },
      { label: "Unused", value: unusedLicenses },
    ],
  };
}

export function calculateHealth(values) {
  const weights = {
    architecture: 1.2,
    security: 1.2,
    routing: 1,
    reporting: 0.9,
    automation: 1.1,
    licensing: 0.9,
    governance: 1,
    disasterRecovery: 0.9,
    analytics: 0.9,
    businessContinuity: 0.9,
  };
  const weightedTotal = Object.entries(weights).reduce((sum, [key, weight]) => sum + pct(values[key]) * 100 * weight, 0);
  const weightTotal = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  const score = weightedTotal / weightTotal;
  const maturity = score >= 82 ? "Optimized" : score >= 68 ? "Managed" : score >= 50 ? "Developing" : "At Risk";
  const weakest = Object.keys(weights).sort((a, b) => n(values[a]) - n(values[b])).slice(0, 3);

  return {
    metrics: [
      { label: "Health Score", value: score, suffix: "/100", type: "number", digits: 0 },
      { label: "Maturity Level", value: maturity, type: "text" },
    ],
    recommendation: `Focus next on ${weakest.map((key) => key.replace(/([A-Z])/g, " $1").toLowerCase()).join(", ")}.`,
    savings: Math.max(85 - score, 0) * 900,
    chart: Object.keys(weights).map((key) => ({
      label: key.replace(/([A-Z])/g, " $1"),
      value: n(values[key]),
    })),
  };
}

export function calculateKpi(values) {
  const positive = (n(values.sla) + n(values.occupancy) + n(values.utilization) + n(values.fcr) + n(values.csat)) / 5;
  const penalty = (n(values.shrinkage) + n(values.abandonRate) * 4 + Math.max(n(values.aht) - 5, 0) * 7) / 3;
  const performance = Math.max(positive - penalty, 0);

  return {
    metrics: [
      { label: "Performance Index", value: performance, suffix: "/100", type: "number", digits: 0 },
      { label: "SLA", value: n(values.sla), type: "percent", digits: 0 },
      { label: "CSAT", value: n(values.csat), type: "percent", digits: 0 },
      { label: "Abandon Rate", value: n(values.abandonRate), type: "percent", digits: 1 },
    ],
    recommendation: performance >= 75 ? "KPIs show a stable operation; tune automation and experience levers." : "Stabilize SLA, abandon, and shrinkage before pushing growth workload.",
    savings: Math.max(78 - performance, 0) * 1250,
    chart: [
      { label: "SLA", value: n(values.sla) },
      { label: "Occupancy", value: n(values.occupancy) },
      { label: "Utilization", value: n(values.utilization) },
      { label: "FCR", value: n(values.fcr) },
      { label: "CSAT", value: n(values.csat) },
    ],
  };
}

export function calculateOpportunity(results) {
  const ranked = Object.entries(results)
    .filter(([id]) => id !== "opportunity")
    .map(([id, result]) => ({ id, savings: result.savings || 0, recommendation: result.recommendation }))
    .sort((a, b) => b.savings - a.savings);
  const best = ranked[0] || { id: "cost", savings: 0, recommendation: "Run the core calculators to identify savings." };
  const serviceMap = {
    cost: "Genesys Cost Optimization Assessment",
    fte: "Genesys Optimization Assessment",
    roi: "Genesys Advisory Retainer",
    aht: "Genesys Optimization Assessment",
    occupancy: "Genesys Optimization Assessment",
    ivr: "Genesys Architecture Review",
    genesys: "Genesys Cost Optimization Assessment",
    health: "Genesys Architecture Review",
    kpi: "Genesys Advisory Retainer",
  };

  return {
    metrics: [
      { label: "Highest Savings Opportunity", value: best.id.toUpperCase(), type: "text" },
      { label: "Priority", value: best.savings > 50000 ? "High" : best.savings > 15000 ? "Medium" : "Targeted", type: "text" },
      { label: "Estimated Savings", value: best.savings, type: "money" },
      { label: "Recommended NexCX Service", value: serviceMap[best.id] || "NexCX Advisory", type: "text" },
    ],
    recommendation: best.recommendation,
    summary: "Business impact is ranked by monthly savings potential and confidence of operational control.",
    savings: best.savings,
    chart: ranked.slice(0, 5).map((item) => ({ label: item.id.toUpperCase(), value: item.savings })),
  };
}

export const calculatorEngines = {
  cost: calculateCost,
  fte: calculateFte,
  roi: calculateRoi,
  aht: calculateAht,
  occupancy: calculateOccupancy,
  ivr: calculateIvr,
  genesys: calculateGenesys,
  health: calculateHealth,
  kpi: calculateKpi,
};
