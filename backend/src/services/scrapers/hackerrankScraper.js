import { normalizeEvent, sanitizeText } from "./normalizer.js";

/**
 * Fetches upcoming contests and hackathons from HackerRank official API
 */
export async function fetchHackerRankEvents() {
  try {
    const url = "https://www.hackerrank.com/rest/contests/upcoming?limit=20";
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) HackCentral-Event-Sync/1.0",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.warn(`[HackerRank] Request failed with status ${res.status}`);
      return [];
    }

    const data = await res.json();
    const models = data.models || [];

    return models
      .map((item) => {
        const startDate = item.epoch_starttime
          ? new Date(item.epoch_starttime * 1000)
          : new Date(item.get_starttimeiso);

        const endDate = item.epoch_endtime
          ? new Date(item.epoch_endtime * 1000)
          : new Date(item.get_endtimeiso);

        const isHackathon = item.name.toLowerCase().includes("hackathon") ||
          item.slug.toLowerCase().includes("hack") ||
          item.has_codesprint_reg_page;

        const regLink = item.custom_sign_up_link || `https://www.hackerrank.com/contests/${item.slug}`;

        return normalizeEvent({
          title: item.name,
          description: sanitizeText(item.description) || `HackerRank challenge: ${item.name}`,
          startDate,
          endDate,
          location: "Online",
          venue: "hackerrank.com",
          category: isHackathon ? "Hackathon" : "Competition",
          mode: "Online",
          price: "Free",
          registrationLink: regLink,
          organizer: item.organization_name || "HackerRank",
          tags: ["HackerRank", isHackathon ? "Hackathon" : "Contest", "Coding"],
          source: "HackerRank",
        });
      })
      .filter(Boolean);
  } catch (error) {
    console.error("[HackerRank] Error fetching events:", error.message);
    return [];
  }
}
