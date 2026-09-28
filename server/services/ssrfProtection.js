import { URL } from 'url';

const BLOCKED_HOSTNAMES = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '::',
  '[::1]',
  'localhost.localdomain',
];

const PRIVATE_IP_REGEXES = [
  /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, // Loopback 127.0.0.0/8
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,  // Private 10.0.0.0/8
  /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/, // Private 172.16.0.0/12
  /^192\.168\.\d{1,3}\.\d{1,3}$/,     // Private 192.168.0.0/16
  /^169\.254\.\d{1,3}\.\d{1,3}$/,     // Link-local 169.254.0.0/16
  /^0\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,   // Current network
];

export const isSafeUrl = (urlStr) => {
  if (!urlStr || typeof urlStr !== 'string') {
    return { isSafe: false, reason: 'Empty or non-string URL provided' };
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(urlStr.trim());
  } catch (err) {
    return { isSafe: false, reason: 'Invalid URL format' };
  }

  const protocol = parsedUrl.protocol.toLowerCase();
  if (protocol !== 'http:' && protocol !== 'https:') {
    return {
      isSafe: false,
      reason: `Blocked protocol: ${protocol}. Only http: and https: are allowed.`,
    };
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  // Check blocked hostnames
  if (BLOCKED_HOSTNAMES.includes(hostname)) {
    return {
      isSafe: false,
      reason: `SSRF Violation: Access to loopback/localhost hostname "${hostname}" is forbidden.`,
    };
  }

  // Check private IP ranges
  const isPrivateIp = PRIVATE_IP_REGEXES.some((regex) => regex.test(hostname));
  if (isPrivateIp) {
    return {
      isSafe: false,
      reason: `SSRF Violation: Access to internal/private IP address "${hostname}" is forbidden.`,
    };
  }

  return { isSafe: true, hostname, url: parsedUrl.toString() };
};
