import Event from "../../models/Event.js";
import { fetchDevpostHackathons } from "./devpostScraper.js";
import { fetchCodeforcesContests } from "./codeforcesScraper.js";
import { fetchLeetCodeContests } from "./leetcodeScraper.js";
import { fetchCodeChefContests } from "./codechefScraper.js";
import { fetchHackerRankEvents } from "./hackerrankScraper.js";

/**
 * Orchestrates fetching from all external sources and executes
 * atomic upserts into MongoDB.
 */
export async function runEventIngestion() {
  const startTime = Date.now();
  console.log("🚀 Starting external event ingestion cycle...");

  // 1. Fetch concurrently with failure isolation
  const scrapers = [
    { name: "Devpost", fn: fetchDevpostHackathons },
    { name: "Codeforces", fn: fetchCodeforcesContests },
    { name: "LeetCode", fn: fetchLeetCodeContests },
    { name: "CodeChef", fn: fetchCodeChefContests },
    { name: "HackerRank", fn: fetchHackerRankEvents },
  ];

  const results = await Promise.allSettled(
    scrapers.map(async (s) => {
      const items = await s.fn();
      return { name: s.name, items };
    })
  );

  const allEvents = [];
  results.forEach((res, index) => {
    const scraperName = scrapers[index].name;
    if (res.status === "fulfilled") {
      console.log(`✅ [${scraperName}] Fetched ${res.value.items.length} items`);
      allEvents.push(...res.value.items);
    } else {
      console.error(`⚠️ [${scraperName}] Scraper failed:`, res.reason?.message || res.reason);
    }
  });

  if (allEvents.length === 0) {
    console.log("ℹ️ No events to ingest this cycle.");
    return { totalFetched: 0, upserted: 0, modified: 0 };
  }

  // 2. Prepare atomic bulk operations
  const bulkOps = allEvents.map((evt) => ({
    updateOne: {
      filter: { registrationLink: evt.registrationLink },
      update: {
        $set: {
          title: evt.title,
          description: evt.description,
          startDate: evt.startDate,
          endDate: evt.endDate,
          location: evt.location,
          venue: evt.venue,
          image: evt.image,
          category: evt.category,
          mode: evt.mode,
          price: evt.price,
          organizer: evt.organizer,
          tags: evt.tags,
          source: evt.source,
          status: evt.status,
        },
        $setOnInsert: {
          participants: [],
          announcements: [],
        },
      },
      upsert: true,
    },
  }));

  console.log(`💾 Executing bulk upsert for ${bulkOps.length} events...`);
  const bulkResult = await Event.bulkWrite(bulkOps, { ordered: false });

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  const summary = {
    totalFetched: allEvents.length,
    upsertedCount: bulkResult.upsertedCount,
    modifiedCount: bulkResult.modifiedCount,
    matchedCount: bulkResult.matchedCount,
    durationSeconds: durationSec,
  };

  console.log(
    `✨ Ingestion finished in ${durationSec}s: ${summary.upsertedCount} new added, ${summary.modifiedCount} updated.`
  );

  return summary;
}
