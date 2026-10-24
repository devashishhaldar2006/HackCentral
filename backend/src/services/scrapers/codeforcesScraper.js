import { normalizeEvent } from "./normalizer.js";

/**
 * Fetches upcoming contests from Codeforces official API
 */
export async function fetchCodeforcesContests() {
  try {
    const url = "https://codeforces.com/api/contest.list";
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) HackCentral-Event-Sync/1.0",
      },
    });

    if (!res.ok) {
      console.warn(`[Codeforces] Request failed with status ${res.status}`);
      return [];
    }

    const data = await res.json();
    if (data.status !== "OK" || !Array.isArray(data.result)) {
      return [];
    }

    const upcoming = data.result.filter((c) => c.phase === "BEFORE");

    return upcoming
      .map((item) => {
        const startDate = new Date(item.startTimeSeconds * 1000);
        const durationSec = item.durationSeconds || 7200;
        const endDate = new Date(startDate.getTime() + durationSec * 1000);

        return normalizeEvent({
          title: item.name,
          description: `Codeforces Competitive Programming Contest (${item.type || "Official"}). Duration: ${Math.round(durationSec / 60)} mins.`,
          startDate,
          endDate,
          location: "Online",
          venue: "codeforces.com",
          category: "Competition",
          mode: "Online",
          price: "Free",
          registrationLink: `https://codeforces.com/contest/${item.id}`,
          organizer: "Codeforces",
          tags: ["Codeforces", "Competitive Programming", "Algorithms"],
          source: "Codeforces",
        });
      })
      .filter(Boolean);
  } catch (error) {
    console.error("[Codeforces] Error fetching contests:", error.message);
    return [];
  }
}
