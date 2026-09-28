import { GovernmentSource } from '../models/GovernmentSource.js';
import mongoose from 'mongoose';

const STRICT_VERIFIED_FILTER = {
  sourceStatus: 'verified',
  verificationStatus: 'approved',
};

export const formatSourceForRetrieval = (source) => {
  if (!source) return null;

  const extracted = source.extractedContent || {};
  const title = extracted.title || source.sourceName || source.service || 'Official Government Source';
  const cleanText = extracted.cleanText || '';
  const headers = extracted.headers || [];

  return {
    sourceId: source._id.toString(),
    _id: source._id.toString(),
    title,
    sourceName: source.sourceName || title,
    url: source.sourceUrl || source.url,
    officialDomain: source.officialDomain || source.domain,
    domain: source.domain || source.officialDomain,
    department: source.department || '[Department]',
    serviceType: source.serviceType || 'General',
    location: source.location || { state: 'National', district: 'All', city: 'All' },
    extractedText: cleanText,
    extractedHeaders: headers,
    contentHash: source.contentHash || '',
    fetchedAt: source.lastVerifiedAt || source.updatedAt,
    lastVerifiedAt: source.lastVerifiedAt || source.updatedAt,
    lastCheckedAt: source.lastCheckedAt || source.updatedAt,
    sourceStatus: source.sourceStatus,
    verificationStatus: source.verificationStatus,
    attribution: {
      sourceTitle: title,
      department: source.department || '[Department]',
      url: source.sourceUrl || source.url,
      officialDomain: source.officialDomain || source.domain,
      contentHash: source.contentHash || '',
      lastCheckedAt: source.lastCheckedAt || source.updatedAt,
      verificationStatus: '✓ Official Source Verified',
    },
  };
};

export const getVerifiedSources = async (filters = {}) => {
  const query = {
    ...STRICT_VERIFIED_FILTER,
  };

  if (filters.domain) {
    query.officialDomain = new RegExp(filters.domain, 'i');
  }

  if (filters.department) {
    query.department = new RegExp(filters.department, 'i');
  }

  if (filters.serviceType) {
    query.serviceType = new RegExp(filters.serviceType, 'i');
  }

  const sources = await GovernmentSource.find(query).sort({ lastVerifiedAt: -1, updatedAt: -1 });
  return sources.map(formatSourceForRetrieval);
};

export const getVerifiedSourceById = async (sourceId) => {
  if (!sourceId || !mongoose.Types.ObjectId.isValid(sourceId)) {
    return null;
  }

  const source = await GovernmentSource.findOne({
    _id: sourceId,
    ...STRICT_VERIFIED_FILTER,
  });

  if (!source) {
    return null;
  }

  return formatSourceForRetrieval(source);
};

export const searchVerifiedSources = async (searchQuery) => {
  if (!searchQuery || typeof searchQuery !== 'string' || !searchQuery.trim()) {
    return {
      query: '',
      resultsCount: 0,
      results: [],
    };
  }

  const cleanQuery = searchQuery.trim();
  
  const stopWords = ['what', 'is', 'are', 'the', 'on', 'in', 'of', 'for', 'to', 'can', 'find', 'where', 'how', 'a', 'an', 'tell', 'me'];
  const terms = cleanQuery
    .toLowerCase()
    .split(/[^a-z0-9/]/)
    .filter((term) => term.length >= 3 && !stopWords.includes(term));

  if (terms.length === 0) {
    return { query: cleanQuery, resultsCount: 0, results: [] };
  }

  const termRegexes = terms.map((t) => new RegExp(t, 'i'));

  const query = {
    ...STRICT_VERIFIED_FILTER,
    $or: termRegexes.flatMap((regex) => [
      { sourceName: regex },
      { department: regex },
      { service: regex },
      { officialDomain: regex },
      { 'extractedContent.title': regex },
      { 'extractedContent.cleanText': regex },
      { 'extractedContent.headers': regex },
    ]),
  };

  const candidateSources = await GovernmentSource.find(query).sort({ lastVerifiedAt: -1 });

  // Calculate required minimum matching score: proportional to query complexity
  const minRequiredScore = terms.length >= 4 ? Math.ceil(terms.length * 0.45) : (terms.length >= 2 ? 2 : 1);

  const scoredSources = candidateSources
    .map((source) => {
      const formatted = formatSourceForRetrieval(source);
      const fullText = (
        formatted.title +
        ' ' +
        formatted.department +
        ' ' +
        formatted.officialDomain +
        ' ' +
        formatted.extractedText +
        ' ' +
        formatted.extractedHeaders.join(' ')
      ).toLowerCase();

      let score = 0;
      for (const term of terms) {
        if (fullText.includes(term)) {
          score++;
        }
      }

      let matchedContent = formatted.extractedText.slice(0, 300);
      for (const term of terms) {
        const matchIdx = formatted.extractedText.toLowerCase().indexOf(term);
        if (matchIdx !== -1) {
          const start = Math.max(0, matchIdx - 40);
          const end = Math.min(formatted.extractedText.length, matchIdx + 200);
          matchedContent = (start > 0 ? '...' : '') + formatted.extractedText.slice(start, end) + (end < formatted.extractedText.length ? '...' : '');
          break;
        }
      }

      return {
        score,
        result: {
          sourceId: formatted.sourceId,
          title: formatted.title,
          url: formatted.url,
          officialDomain: formatted.officialDomain,
          department: formatted.department,
          matchedContent,
          sourceStatus: formatted.sourceStatus,
          verificationStatus: formatted.verificationStatus,
          lastCheckedAt: formatted.lastCheckedAt,
          attribution: formatted.attribution,
        },
      };
    })
    .filter((item) => item.score >= minRequiredScore)
    .sort((a, b) => b.score - a.score);

  const results = scoredSources.map((s) => s.result);

  return {
    query: cleanQuery,
    resultsCount: results.length,
    results,
  };
};
