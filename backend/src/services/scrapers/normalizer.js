/**
 * Data Sanitizer and Normalizer for Scraped Events
 * Ensures strict compliance with Event.js Mongoose Schema.
 * Strips HTML, validates URLs, and prevents injection/leakage.
 */

const VALID_CATEGORIES = [
  "Conference",
  "Hackathon",
  "Workshop",
  "Expo",
  "Meetup",
  "Entertainment",
  "Competition",
];

const VALID_MODES = ["Online", "Offline", "Hybrid"];

// Default curated banners per source to ensure 100% reliable image rendering
const FALLBACK_IMAGES = {
  Codeforces: "https://i.postimg.cc/s2gDBvz9/img-4.png",
  LeetCode: "https://i.postimg.cc/9X6tHq5g/img-8.png",
  CodeChef: "https://i.postimg.cc/kD3yT0sK/img-1.png",
  HackerRank: "https://i.postimg.cc/Xq4j98y7/img-10.png",
  Devpost: "https://i.postimg.cc/7ZFffSXY/img-15.png",
  Default: "https://i.postimg.cc/Xq4j98y7/img-10.png",
};

/**
 * Remove any HTML tags or script elements from scraped strings
 */
export function sanitizeText(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Validate that a URL is a genuine HTTP/HTTPS URL
 */
export function sanitizeUrl(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (/^https?:\/\/.+/i.test(trimmed)) {
    return trimmed;
  }
  return null;
}

/**
 * Normalizes an external event into the exact HackCentral Event schema
 */
export function normalizeEvent(raw) {
  const title = sanitizeText(raw.title);
  const registrationLink = sanitizeUrl(raw.registrationLink);

  // Mandatory fields check
  if (!title || !registrationLink) {
    return null;
  }

  const startDate = raw.startDate ? new Date(raw.startDate) : null;
  if (!startDate || isNaN(startDate.getTime())) {
    return null;
  }

  let endDate = raw.endDate ? new Date(raw.endDate) : null;
  if (!endDate || isNaN(endDate.getTime()) || endDate < startDate) {
    // If no valid endDate or endDate is prior to startDate, default to 2 hours or same day
    endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
  }

  // Determine category
  const category = VALID_CATEGORIES.includes(raw.category)
    ? raw.category
    : "Hackathon";

  // Determine mode
  const mode = VALID_MODES.includes(raw.mode) ? raw.mode : "Online";

  // Determine source & image
  const source = sanitizeText(raw.source) || "External";
  let image = sanitizeUrl(raw.image);
  if (!image) {
    image = FALLBACK_IMAGES[source] || FALLBACK_IMAGES.Default;
  }

  // Tags sanitization
  const tags = Array.isArray(raw.tags)
    ? [...new Set(raw.tags.map((t) => sanitizeText(t)).filter(Boolean))]
    : [source];

  return {
    title: title.slice(0, 200),
    description: sanitizeText(raw.description).slice(0, 1500) || `${title} hosted by ${source}`,
    startDate,
    endDate,
    location: sanitizeText(raw.location) || "Online",
    venue: sanitizeText(raw.venue) || source,
    image,
    category,
    mode,
    price: raw.price === "Paid" ? "Paid" : "Free",
    registrationLink,
    organizer: sanitizeText(raw.organizer) || source,
    tags: tags.slice(0, 8),
    source,
    status: "approved", // Pre-approved so it automatically displays in listings
  };
}
