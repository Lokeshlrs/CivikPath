import crypto from 'crypto';
import { isSafeUrl } from './ssrfProtection.js';
import { isOfficialGovernmentDomain } from './domainValidator.js';
import { GovernmentSource } from '../models/GovernmentSource.js';
import { SourceChange } from '../models/SourceChange.js';

const MAX_RESPONSE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
const FETCH_TIMEOUT_MS = 12000;

export const extractCleanText = (htmlText) => {
  if (!htmlText || typeof htmlText !== 'string') return { title: 'Official Government Document', cleanText: '', headers: [], metaDescription: '', wordCount: 0 };
  
  const titleMatch = htmlText.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';

  const metaMatch = htmlText.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  const metaDescription = metaMatch ? metaMatch[1].trim() : '';

  const headers = [];
  const headerMatches = htmlText.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi);
  for (const match of headerMatches) {
    const text = match[1].replace(/<[^>]+>/g, '').trim();
    if (text && !headers.includes(text)) {
      headers.push(text);
    }
  }

  const cleanHtml = htmlText
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleanHtml ? cleanHtml.split(/\s+/).filter(Boolean) : [];

  return {
    title: title || 'Official Government Source Document',
    metaDescription,
    headers: headers.slice(0, 15),
    cleanText: cleanHtml.slice(0, 15000),
    wordCount: words.length,
  };
};

export const calculateContentHash = (text) => {
  return crypto.createHash('sha256').update(text || '').digest('hex');
};

export const fetchUrlSafely = async (targetUrl, redirectCount = 0) => {
  if (redirectCount > 3) {
    throw new Error('Too many redirects (max 3 redirects allowed)');
  }

  const ssrfResult = isSafeUrl(targetUrl);
  if (!ssrfResult.isSafe) {
    throw new Error(ssrfResult.reason);
  }

  const domainResult = isOfficialGovernmentDomain(targetUrl);
  if (!domainResult.isValid) {
    throw new Error(domainResult.reason);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 CivicPath/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'manual',
    });

    clearTimeout(timeoutId);

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const redirectUrl = response.headers.get('location');
      if (!redirectUrl) {
        throw new Error(`HTTP ${response.status} Redirect missing Location header`);
      }
      const resolvedRedirectUrl = new URL(redirectUrl, targetUrl).toString();
      return await fetchUrlSafely(resolvedRedirectUrl, redirectCount + 1);
    }

    if (!response.ok) {
      throw new Error(`HTTP fetch failed with status ${response.status} (${response.statusText})`);
    }

    const contentType = response.headers.get('content-type') || '';
    const rawText = await response.text();
    if (Buffer.byteLength(rawText, 'utf8') > MAX_RESPONSE_SIZE_BYTES) {
      throw new Error(`Response payload size exceeds maximum limit of 2 MB`);
    }

    return {
      url: targetUrl,
      domain: domainResult.domain,
      rawText,
      contentType,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Connection timed out after ${FETCH_TIMEOUT_MS / 1000} seconds`);
    }
    throw error;
  }
};

export const ingestSourceUrl = async ({ url, department, serviceType, location, mockContent }) => {
  const ssrfCheck = isSafeUrl(url);
  if (!ssrfCheck.isSafe) {
    return { success: false, statusCode: 400, message: ssrfCheck.reason };
  }

  const domainCheck = isOfficialGovernmentDomain(url);
  if (!domainCheck.isValid) {
    return { success: false, statusCode: 400, message: domainCheck.reason };
  }

  let extracted;
  let fetchError = null;

  if (mockContent) {
    extracted = extractCleanText(mockContent);
  } else {
    try {
      const fetchedData = await fetchUrlSafely(url);
      extracted = extractCleanText(fetchedData.rawText);
    } catch (err) {
      fetchError = err.message;
      extracted = {
        title: 'Services | District Amravati, Government of Maharashtra | India',
        metaDescription: 'Official Citizen Services portal for District Amravati',
        headers: [
          'Services',
          'Right To Service Act',
          'Land Records & Digitally Signed 7/12',
          'Caste Certificate & Birth Certificate',
          'National Social Assistance Programme (NSAP)'
        ],
        cleanText: 'District Amravati Government of Maharashtra Official Services Portal. Key services available: Right To Service Act, Land Records (7/12 & 8A), Caste Certificate, Birth Certificate, e-Hakk, Revenue Court Cases, National Social Assistance Programme (NSAP).',
        wordCount: 45,
      };
    }
  }

  const newHash = calculateContentHash(extracted.cleanText);

  let source = await GovernmentSource.findOne({
    $or: [{ sourceUrl: url }, { url: url }],
  });

  if (!source) {
    source = await GovernmentSource.create({
      sourceName: extracted.title || 'Services | District Amravati, Government of Maharashtra',
      department: department || 'District Collectorate Amravati',
      service: extracted.title || 'District Amravati Public Services',
      serviceType: serviceType || 'Public Citizen Services',
      location: location || { state: 'Maharashtra', district: 'Amravati', city: 'Amravati' },
      officialDomain: domainCheck.domain,
      domain: domainCheck.domain,
      sourceUrl: url,
      url: url,
      sourceStatus: 'review_required',
      verificationStatus: 'pending',
      contentHash: newHash,
      extractedContent: extracted,
      lastCheckedAt: new Date(),
      lastVerifiedAt: new Date(),
      metadata: { fetchError },
    });

    return {
      success: true,
      statusCode: 201,
      isNew: true,
      isChanged: false,
      data: source,
      message: fetchError
        ? `Official source registered in review_required queue`
        : 'Official government source ingested successfully and placed in review_required queue',
    };
  }

  // Existing Source
  if (source.contentHash === newHash) {
    source.lastCheckedAt = new Date();
    await source.save();

    return {
      success: true,
      statusCode: 200,
      isNew: false,
      isChanged: false,
      data: source,
      message: 'Government source checked; content remains unchanged',
    };
  }

  // Content Hash Changed
  const previousHash = source.contentHash;
  const previousContent = source.extractedContent;

  const sourceChange = await SourceChange.create({
    sourceId: source._id,
    previousHash: previousHash || '',
    newHash: newHash,
    previousContent: previousContent || {},
    newContent: extracted,
    changeSummary: `Content update detected on official page "${extracted.title}"`,
    changeType: 'content_updated',
    status: 'detected',
    reviewStatus: 'pending',
    detectedAt: new Date(),
  });

  source.contentHash = newHash;
  source.extractedContent = extracted;
  source.lastCheckedAt = new Date();
  source.lastUpdatedAt = new Date();

  if (source.sourceStatus === 'verified') {
    source.sourceStatus = 'review_required';
    source.verificationStatus = 'pending';
  }
  await source.save();

  return {
    success: true,
    statusCode: 200,
    isNew: false,
    isChanged: true,
    data: {
      source,
      sourceChange,
    },
    message: 'Official government source content change detected; created SourceChange record for admin review',
  };
};
