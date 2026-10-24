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

// Curated, diverse, high-definition tech and hackathon banners
const TECH_BANNER_POOL = [
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80", // Cyber Matrix code
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80", // Cyberpunk neon tech
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80", // Coding on laptop
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80", // Hackathon neon banner
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80", // Hackathon collaborative team
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80", // Cloud servers & networking
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80", // Modern abstract glowing geometric
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80", // AI neural brains & circuits
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80", // Syntax highlighted code
  "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80", // Minimalist developer workspace
  "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80", // Neon futuristic gaming
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80", // Electronic processor chip
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80", // Collaborative hack meeting
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80", // Tech office workspace
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80", // Global digital space network
  "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80", // Geometric mathematics / algorithms
];

/**
 * Deterministically pick an aesthetic image based on string hash
 */
function getDeterministicImage(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % TECH_BANNER_POOL.length;
  return TECH_BANNER_POOL[index];
}

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
    image = getDeterministicImage(title + (raw.registrationLink || ""));
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
