import { normalizeEvent } from "./normalizer.js";

/**
 * Fetches upcoming and open hackathons from Devpost
 */
export async function fetchDevpostHackathons() {
  try {
    const url = "https://devpost.com/api/hackathons?status[]=upcoming&status[]=open";
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) HackCentral-Event-Sync/1.0",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.warn(`[Devpost] Request failed with status ${res.status}`);
      return [];
    }

    const data = await res.json();
    const hackathons = data.hackathons || [];

    return hackathons
      .map((item) => {
        // Thumbnail handling
        let imageUrl = item.thumbnail_url || "";
        if (imageUrl.startsWith("//")) {
          imageUrl = "https:" + imageUrl;
        }

        const isOnline =
          item.displayed_location?.location?.toLowerCase().includes("online") ?? true;

        const themes = Array.isArray(item.themes)
          ? item.themes.map((t) => t.name)
          : [];

        // Estimate dates (Devpost API provides submission deadline or dates string)
        const now = new Date();
        const startDate = now;
        // Default end date 14 days out if not specified
        const endDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

        return normalizeEvent({
          title: item.title,
          description: `Devpost Hackathon: ${item.title}. Prizes: ${item.prize_amount ? item.prize_amount.replace(/<[^>]*>/g, "") : "See event details"}`,
          startDate,
          endDate,
          location: item.displayed_location?.location || (isOnline ? "Online" : "Global"),
          venue: isOnline ? "devpost.com" : (item.displayed_location?.location || "Offline"),
          image: imageUrl || null,
          category: "Hackathon",
          mode: isOnline ? "Online" : "Hybrid",
          price: "Free",
          registrationLink: item.url,
          organizer: item.organization_name || "Devpost Community",
          tags: ["Hackathon", "Devpost", ...themes],
          source: "Devpost",
        });
      })
      .filter(Boolean);
  } catch (error) {
    console.error("[Devpost] Error fetching hackathons:", error.message);
    return [];
  }
}
