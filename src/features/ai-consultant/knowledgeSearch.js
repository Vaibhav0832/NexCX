const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "can",
  "does",
  "for",
  "from",
  "how",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "the",
  "to",
  "what",
  "when",
  "where",
  "which",
  "with",
]);

const cachedRecords = new Map();

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value) {
  return normalize(value)
    .split(" ")
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function parseField(block, label) {
  const nextLabels = [
    "Question Number",
    "Category",
    "Question",
    "Keywords",
    "Answer",
    "Related Topics",
    "Difficulty",
  ].filter((item) => item !== label);
  const pattern = new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n(?:${nextLabels.join("|")}):|$)`, "i");
  const match = block.match(pattern);
  return match ? match[1].replace(/\s+/g, " ").trim() : "";
}

export function parseKnowledgeBase(rawText) {
  return rawText
    .split(/\n(?=Question Number:\s*\d+)/g)
    .map((block) => ({
      id: parseField(block, "Question Number"),
      category: parseField(block, "Category"),
      question: parseField(block, "Question"),
      keywords: parseField(block, "Keywords"),
      answer: parseField(block, "Answer"),
      relatedTopics: parseField(block, "Related Topics"),
      difficulty: parseField(block, "Difficulty"),
    }))
    .filter((record) => record.question && record.answer)
    .map((record) => ({
      ...record,
      searchable: normalize(
        `${record.question} ${record.keywords} ${record.category} ${record.relatedTopics} ${record.answer}`
      ),
      questionTokens: tokenize(record.question),
      keywordTokens: tokenize(record.keywords),
      allTokens: tokenize(
        `${record.question} ${record.keywords} ${record.category} ${record.relatedTopics} ${record.answer}`
      ),
    }));
}

function fuzzyTokenMatch(queryToken, candidateToken) {
  if (candidateToken.includes(queryToken) || queryToken.includes(candidateToken)) return true;
  if (queryToken.length < 5 || candidateToken.length < 5) return false;

  let mismatches = 0;
  const maxLength = Math.max(queryToken.length, candidateToken.length);
  const minLength = Math.min(queryToken.length, candidateToken.length);

  for (let index = 0; index < minLength; index += 1) {
    if (queryToken[index] !== candidateToken[index]) mismatches += 1;
    if (mismatches > 2) return false;
  }

  return mismatches + (maxLength - minLength) <= 2;
}

function scoreRecord(record, query, queryTokens) {
  const normalizedQuery = normalize(query);
  let score = 0;

  if (record.searchable.includes(normalizedQuery)) score += 80;
  if (normalize(record.question).includes(normalizedQuery)) score += 120;

  queryTokens.forEach((token) => {
    if (record.questionTokens.includes(token)) score += 28;
    if (record.keywordTokens.includes(token)) score += 22;
    if (record.allTokens.includes(token)) score += 8;
    if (record.allTokens.some((candidate) => fuzzyTokenMatch(token, candidate))) score += 4;
  });

  return score;
}

export async function loadKnowledgeBase(knowledgeBaseUrl) {
  if (cachedRecords.has(knowledgeBaseUrl)) return cachedRecords.get(knowledgeBaseUrl);

  const response = await fetch(knowledgeBaseUrl);
  if (!response.ok) {
    throw new Error("Knowledge base could not be loaded.");
  }

  const records = parseKnowledgeBase(await response.text());
  cachedRecords.set(knowledgeBaseUrl, records);
  return records;
}

export function searchKnowledgeBase(records, question) {
  const queryTokens = tokenize(question);

  if (queryTokens.length === 0) {
    return {
      answer: "Ask me a Genesys Cloud CX question and I will search the local NexCX knowledge base.",
      confidence: 0,
      match: null,
    };
  }

  const ranked = records
    .map((record) => ({
      record,
      score: scoreRecord(record, question, queryTokens),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];

  if (!best || best.score < 18) {
    return {
      answer:
        "I could not find a strong match in the Genesys Cloud CX knowledge base. Try asking with product terms such as Architect, routing, licensing, WEM, queues, or AI Studio.",
      confidence: 0,
      match: null,
    };
  }

  return {
    answer: best.record.answer,
    confidence: Math.min(Math.round(best.score), 100),
    match: best.record,
  };
}
