import { normalizeEvent } from "./normalizer.js";

/**
 * Fetches upcoming contests from CodeChef official API
 */
export async function fetchCodeChefContests() {
  try {
    const url = "https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all";
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) HackCentral-Event-Sync/1.0",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.warn(`[CodeChef] Request failed with status ${res.status}`);
      return [];
    }

    const data = await res.json();
    const contests = [
      ...(data.present_contests || []),
      ...(data.future_contests || []),
    ];

    return contests
      .map((item) => {
        const startDate = item.contest_start_date_iso
          ? new Date(item.contest_start_date_iso)
          : new Date(item.contest_start_date);

        const endDate = item.contest_end_date_iso
          ? new Date(item.contest_end_date_iso)
          : new Date(item.contest_end_date);

        return normalizeEvent({
          title: item.contest_name,
          description: `CodeChef Contest ${item.contest_code}. Compete and improve your competitive programming ranking.`,
          startDate,
          endDate,
          location: "Online",
          venue: "codechef.com",
          category: "Competition",
          mode: "Online",
          price: "Free",
          registrationLink: `https://www.codechef.com/${item.contest_code}`,
          organizer: "CodeChef",
          tags: ["CodeChef", "Competitive Programming", "Contest"],
          source: "CodeChef",
        });
      })
      .filter(Boolean);
  } catch (error) {
    console.error("[CodeChef] Error fetching contests:", error.message);
    return [];
  }
}
