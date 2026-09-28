import { URL } from 'url';

// Configurable allowlist of official government top-level domains & state suffixes
const ALLOWED_GOVT_SUFFIXES = [
  '.gov.in',
  '.nic.in',
  '.gov',
  '.gov.uk',
  '.gov.au',
];

const ALLOWED_GOVT_EXACT_DOMAINS = [
  'india.gov.in',
  'maharashtra.gov.in',
  'amravati.gov.in',
  'mumbai.gov.in',
  'nagpur.gov.in',
  'pmindia.gov.in',
  'digitalindia.gov.in',
  'uidai.gov.in',
  'incometax.gov.in',
  'gst.gov.in',
  'epfindia.gov.in',
  'mca.gov.in',
  'parivahan.gov.in',
];

let dynamicAllowlist = [...ALLOWED_GOVT_EXACT_DOMAINS];

export const isOfficialGovernmentDomain = (urlStr) => {
  if (!urlStr || typeof urlStr !== 'string') {
    return {
      isValid: false,
      domain: '',
      reason: 'Invalid or missing URL string',
    };
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(urlStr.trim());
  } catch (err) {
    return {
      isValid: false,
      domain: '',
      reason: 'Malformed URL format',
    };
  }

  const protocol = parsedUrl.protocol.toLowerCase();
  if (protocol !== 'http:' && protocol !== 'https:') {
    return {
      isValid: false,
      domain: parsedUrl.hostname,
      reason: `Unsupported protocol: ${protocol} (only HTTP and HTTPS allowed)`,
    };
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  // Check against exact allowlist
  if (dynamicAllowlist.includes(hostname)) {
    return {
      isValid: true,
      domain: hostname,
      hostname,
    };
  }

  // Check against official government suffixes
  const matchesSuffix = ALLOWED_GOVT_SUFFIXES.some(
    (suffix) => hostname === suffix.slice(1) || hostname.endsWith(suffix)
  );

  if (matchesSuffix) {
    return {
      isValid: true,
      domain: hostname,
      hostname,
    };
  }

  return {
    isValid: false,
    domain: hostname,
    hostname,
    reason: `Domain "${hostname}" does not belong to an verified official government allowlist (.gov.in, .nic.in, etc.)`,
  };
};

export const addAllowedDomain = (domain) => {
  if (domain && !dynamicAllowlist.includes(domain.toLowerCase())) {
    dynamicAllowlist.push(domain.toLowerCase().trim());
  }
};

export const getAllowedDomains = () => {
  return {
    suffixes: ALLOWED_GOVT_SUFFIXES,
    exactDomains: [...dynamicAllowlist],
  };
};
