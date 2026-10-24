import { describe, it, expect } from "vitest";
import { normalizeEvent, sanitizeText, sanitizeUrl } from "../src/services/scrapers/normalizer.js";

describe("Event Scraper Normalizer & Sanitizer", () => {
  it("sanitizes HTML tags and malicious payloads", () => {
    const dirty = "<script>alert('pwned')</script><b>Hackathon</b> &amp; Challenge";
    const cleaned = sanitizeText(dirty);
    expect(cleaned).toBe("Hackathon & Challenge");
    expect(cleaned).not.toContain("<script>");
  });

  it("validates legitimate URLs and rejects malformed/javascript links", () => {
    expect(sanitizeUrl("https://devpost.com/hackathons/123")).toBe("https://devpost.com/hackathons/123");
    expect(sanitizeUrl("http://codeforces.com/contest/100")).toBe("http://codeforces.com/contest/100");
    expect(sanitizeUrl("javascript:alert(1)")).toBeNull();
    expect(sanitizeUrl("ftp://invalid.com")).toBeNull();
    expect(sanitizeUrl("")).toBeNull();
  });

  it("normalizes an external event to the exact Mongoose schema requirements", () => {
    const raw = {
      title: "  Global AI Innovation Cup  ",
      description: "<p>Compete in the largest <b>AI</b> hackathon</p>",
      startDate: new Date("2026-11-01T10:00:00Z"),
      endDate: new Date("2026-11-03T18:00:00Z"),
      location: "Online",
      category: "Hackathon",
      mode: "Online",
      price: "Free",
      registrationLink: "https://devpost.com/hackathons/ai-cup",
      organizer: "Devpost Inc",
      tags: ["AI", "Innovation", "Machine Learning"],
      source: "Devpost",
    };

    const normalized = normalizeEvent(raw);
    expect(normalized).not.toBeNull();
    expect(normalized.title).toBe("Global AI Innovation Cup");
    expect(normalized.description).toBe("Compete in the largest AI hackathon");
    expect(normalized.category).toBe("Hackathon");
    expect(normalized.mode).toBe("Online");
    expect(normalized.status).toBe("approved");
    expect(normalized.registrationLink).toBe("https://devpost.com/hackathons/ai-cup");
    expect(normalized.tags).toContain("AI");
  });

  it("gracefully drops items without title or valid registration link", () => {
    const invalidItem = {
      title: "",
      registrationLink: "https://example.com",
      startDate: new Date(),
    };
    expect(normalizeEvent(invalidItem)).toBeNull();

    const noUrlItem = {
      title: "Valid Title",
      registrationLink: "not-a-url",
      startDate: new Date(),
    };
    expect(normalizeEvent(noUrlItem)).toBeNull();
  });
});
