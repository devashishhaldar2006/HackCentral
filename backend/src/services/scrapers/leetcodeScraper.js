import { normalizeEvent } from "./normalizer.js";

/**
 * Fetches upcoming contests from LeetCode official GraphQL API
 */
export async function fetchLeetCodeContests() {
  try {
    const url = "https://leetcode.com/graphql";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) HackCentral-Event-Sync/1.0",
      },
      body: JSON.stringify({
        query: `
          query {
            allContests {
              title
              titleSlug
              startTime
              duration
            }
          }
        `,
      }),
    });

    if (!res.ok) {
      console.warn(`[LeetCode] Request failed with status ${res.status}`);
      return [];
    }

    const data = await res.json();
    const contests = data?.data?.allContests || [];
    const now = Math.floor(Date.now() / 1000);

    const upcoming = contests.filter((c) => c.startTime > now);

    return upcoming
      .map((item) => {
        const startDate = new Date(item.startTime * 1000);
        const durationSec = item.duration || 5400;
        const endDate = new Date(startDate.getTime() + durationSec * 1000);

        return normalizeEvent({
          title: item.title,
          description: `LeetCode Weekly/Biweekly Algorithmic Contest: ${item.title}. Duration: ${Math.round(durationSec / 60)} minutes.`,
          startDate,
          endDate,
          location: "Online",
          venue: "leetcode.com",
          category: "Competition",
          mode: "Online",
          price: "Free",
          registrationLink: `https://leetcode.com/contest/${item.titleSlug}`,
          organizer: "LeetCode",
          tags: ["LeetCode", "DSA", "Algorithms", "Contest"],
          source: "LeetCode",
        });
      })
      .filter(Boolean);
  } catch (error) {
    console.error("[LeetCode] Error fetching contests:", error.message);
    return [];
  }
}
