import { Procedure } from '../models/Procedure.js';
import { CivicTask } from '../models/CivicTask.js';

export const isPromptInjection = (text) => {
  if (!text || typeof text !== 'string') return false;
  const t = text.toLowerCase();

  const patterns = [
    /ignore\s+(all\s+)?(previous|system|civicpath|database|verified|official|source)/i,
    /use\s+(your\s+own|general|model)\s+knowledge/i,
    /create\s+(a\s+)?(new|custom|fake|unverified)\s+(procedure|caste|certificate|service|roadmap)/i,
    /invent\s+(a\s+)?(new|custom|fake|fee|document|procedure)/i,
    /bypass\s+(verification|official|sources|database|grounding)/i,
    /make\s+up\s+(a\s+)?(procedure|roadmap|document|fee)/i,
    /tell\s+me\s+(the\s+actual\s+fee|from\s+your\s+own\s+knowledge)/i,
  ];

  return patterns.some((pattern) => pattern.test(t));
};

export const normalizeQuery = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

let catalogCache = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 5000; // 5s TTL for fast updates

export const invalidateCatalogCache = () => {
  catalogCache = null;
  lastCacheTime = 0;
};

export const matchCivicService = async (userQuestion) => {
  if (!userQuestion || typeof userQuestion !== 'string' || !userQuestion.trim()) {
    return { matched: false, reason: 'Empty question' };
  }

  const rawQuestion = userQuestion.trim();

  // Safety check for prompt injection before matching
  if (isPromptInjection(rawQuestion)) {
    console.log(`[CivicMatcher] Prompt injection / fabrication attempt blocked: "${rawQuestion}"`);
    return { matched: false, isInjection: true, reason: 'Prompt injection attempt blocked' };
  }

  const cleanQuery = normalizeQuery(rawQuestion);

  // Read procedures fast using cached catalog with 5s TTL
  const now = Date.now();
  if (!catalogCache || now - lastCacheTime > CACHE_TTL_MS) {
    catalogCache = await Procedure.find({ status: 'published' }).lean();
    lastCacheTime = now;
  }
  const procedures = catalogCache;
  if (!procedures || procedures.length === 0) {
    return { matched: false, reason: 'No catalog procedures available' };
  }

  // Check direct ObjectId match for procedureId or taskId
  if (/^[0-9a-fA-F]{24}$/.test(rawQuestion)) {
    const procById = procedures.find((p) => p._id.toString() === rawQuestion) || (await Procedure.findById(rawQuestion).lean());
    if (procById) {
      return await buildMatchResult(procById, 'id_lookup');
    }
    const taskById = await CivicTask.findById(rawQuestion).lean();
    if (taskById && taskById.procedureId) {
      const procByTask = procedures.find((p) => p._id.toString() === taskById.procedureId.toString()) || (await Procedure.findById(taskById.procedureId).lean());
      if (procByTask) {
        return await buildMatchResult(procByTask, 'task_id_lookup');
      }
    }
  }

  // Sort procedures so longer, more specific titles are checked first
  const sortedProcedures = [...procedures].sort((a, b) => b.title.length - a.title.length);

  // 1. FAST EXACT MATCH (Title, Aliases, Keywords)
  for (const proc of sortedProcedures) {
    const normTitle = normalizeQuery(proc.title);
    if (cleanQuery === normTitle) {
      return await buildMatchResult(proc, 'exact_title');
    }

    if (Array.isArray(proc.aliases)) {
      for (const alias of proc.aliases) {
        if (cleanQuery === normalizeQuery(alias)) {
          return await buildMatchResult(proc, 'exact_alias');
        }
      }
    }
  }

  // 2. SUBSTRING / PHRASE MATCHING
  let bestMatch = null;
  let highestScore = 0;

  const queryTokens = cleanQuery
    .split(' ')
    .filter((t) => t.length >= 2 && !['i', 'want', 'to', 'apply', 'for', 'a', 'an', 'the', 'need', 'get', 'in', 'my', 'new'].includes(t));

  for (const proc of sortedProcedures) {
    let score = 0;
    const titleNorm = normalizeQuery(proc.title);
    const aliasesNorm = (proc.aliases || []).map(normalizeQuery);
    const keywordsNorm = (proc.keywords || []).map(normalizeQuery);
    const fullTextNorm = normalizeQuery(`${proc.title} ${proc.department || ''} ${proc.sector || ''} ${proc.description || ''}`);

    // Direct phrase containment in title or aliases (weighted heavily by title length)
    if (cleanQuery.includes(titleNorm)) {
      score += 200 + titleNorm.length * 10;
    } else if (titleNorm.includes(cleanQuery)) {
      score += 50;
    }

    for (const alias of aliasesNorm) {
      if (cleanQuery.includes(alias) || alias.includes(cleanQuery)) {
        score += 25;
      }
    }

    for (const kw of keywordsNorm) {
      if (cleanQuery.includes(kw)) {
        score += 20;
      }
    }

    // Token overlap score
    for (const token of queryTokens) {
      if (titleNorm.includes(token)) score += 10;
      else if (keywordsNorm.some(k => k.includes(token))) score += 8;
      else if (aliasesNorm.some(a => a.includes(token))) score += 7;
      else if (fullTextNorm.includes(token)) score += 3;
    }

    if (score > highestScore && score >= 12) {
      highestScore = score;
      bestMatch = proc;
    }
  }

  if (bestMatch) {
    return await buildMatchResult(bestMatch, `scored_${highestScore}`);
  }

  return { matched: false, reason: 'Requested service is not present in CivicPath authoritative catalog' };
};

const buildMatchResult = async (procedure, matchType) => {
  const matchedTask = await CivicTask.findOne({
    $or: [{ procedureId: procedure._id }, { title: procedure.title }],
  }).lean() || {
    _id: procedure._id,
    title: procedure.title,
    description: procedure.description,
  };

  return {
    matched: true,
    confidence: matchType.startsWith('exact') ? 'high' : 'medium',
    matchType,
    procedure,
    task: matchedTask,
  };
};
