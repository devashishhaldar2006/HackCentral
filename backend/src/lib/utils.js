import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";
import mongoose from "mongoose";

export const normalizeStringArray = (arr = []) =>
  arr.map((item) => item.trim()).filter(Boolean);


// ── XP & Level constants ──
export const LEVELS = [
  { level: 1, name: "Newcomer", minXp: 0 },
  { level: 2, name: "Explorer", minXp: 50 },
  { level: 3, name: "Learner", minXp: 150 },
  { level: 4, name: "Builder", minXp: 300 },
  { level: 5, name: "Hacker", minXp: 500 },
  { level: 6, name: "Innovator", minXp: 800 },
  { level: 7, name: "Mentor", minXp: 1200 },
  { level: 8, name: "Champion", minXp: 2000 },
];

// ── Achievement definitions ──
export const BADGE_DEFINITIONS = [
  {
    badge: "first_event",
    label: "First Event",
    description: "Registered for your first event",
    icon: "emoji_events",
    check: (stats) => stats.registered >= 1,
  },
  {
    badge: "explorer",
    label: "Explorer",
    description: "Registered for 10 events",
    icon: "explore",
    check: (stats) => stats.registered >= 10,
  },
  {
    badge: "hackathon_enthusiast",
    label: "Hackathon Enthusiast",
    description: "Registered for 5 hackathons",
    icon: "code",
    check: (stats) => stats.hackathonCount >= 5,
  },
  {
    badge: "bookworm",
    label: "Bookworm",
    description: "Bookmarked 20 events",
    icon: "bookmark",
    check: (stats) => stats.bookmarked >= 20,
  },
  {
    badge: "consistent_learner",
    label: "Consistent Learner",
    description: "Maintained a 3-month streak",
    icon: "local_fire_department",
    check: (stats) => stats.bestStreak >= 3,
  },
  {
    badge: "veteran",
    label: "Veteran",
    description: "Attended 25 events",
    icon: "military_tech",
    check: (stats) => stats.attended >= 25,
  },
  {
    badge: "diverse_learner",
    label: "Diverse Learner",
    description: "Participated in 4+ categories",
    icon: "category",
    check: (stats) => stats.categoryCount >= 4,
  },
  {
    badge: "early_adopter",
    label: "Early Adopter",
    description: "One of the first users on the platform",
    icon: "rocket_launch",
    check: (stats) => stats.accountAgeDays >= 30,
  },
];

export function getLevelInfo(xp) {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.minXp) current = lvl;
    else break;
  }
  const nextLevel = LEVELS.find((l) => l.level === current.level + 1);
  return {
    total: xp,
    level: current.level,
    levelName: current.name,
    currentLevelXp: current.minXp,
    nextLevelXp: nextLevel ? nextLevel.minXp : null,
    nextLevelName: nextLevel ? nextLevel.name : null,
  };
}

// ── Helper: time ago string ──
export function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

// ── Helper: update streak ──
export async function updateStreak(user) {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  if (user.lastActiveMonth === currentMonth) {
    // Already active this month, nothing to update
    return;
  }

  if (user.lastActiveMonth) {
    // Check if last active month was the previous month
    const [lastYear, lastMonth] = user.lastActiveMonth.split("-").map(Number);
    const lastDate = new Date(lastYear, lastMonth - 1);
    const expectedPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1);

    if (
      lastDate.getFullYear() === expectedPrevMonth.getFullYear() &&
      lastDate.getMonth() === expectedPrevMonth.getMonth()
    ) {
      // Consecutive month
      user.currentStreak += 1;
    } else {
      // Streak broken
      user.currentStreak = 1;
    }
  } else {
    // First activity ever
    user.currentStreak = 1;
  }

  if (user.currentStreak > user.bestStreak) {
    user.bestStreak = user.currentStreak;
  }
  user.lastActiveMonth = currentMonth;
}

// ── Helper: check and award achievements ──
export async function checkAchievements(user, stats) {
  const earnedBadges = user.achievements.map((a) => a.badge);
  const newBadges = [];

  for (const def of BADGE_DEFINITIONS) {
    if (!earnedBadges.includes(def.badge) && def.check(stats)) {
      user.achievements.push({ badge: def.badge, earnedAt: new Date() });
      newBadges.push(def.badge);
    }
  }

  return newBadges;
}

// ── Helper: log activity and award XP ──
export async function logActivity(userId, action, targetEventId = null, xpAmount = 0) {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await ActivityLog.create([{
        user: userId,
        action,
        targetEvent: targetEventId,
      }], { session });

      if (xpAmount > 0) {
        const user = await User.findById(userId).session(session);
        if (user) {
          user.xp = (user.xp || 0) + xpAmount;
          await updateStreak(user);

          // Build quick stats for achievement checks
          const stats = {
            registered: user.registeredEvents?.length || 0,
            bookmarked: user.bookmarkedEvents?.length || 0,
            attended: 0,
            bestStreak: user.bestStreak || 0,
            hackathonCount: 0,
            categoryCount: 0,
            accountAgeDays: Math.floor(
              (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
            ),
          };

          await checkAchievements(user, stats);
          await user.save({ session });
        }
      }
    });
  } catch (err) {
    console.error("logActivity error:", err);
    // Non-fatal — don't break the main operation
  } finally {
    session.endSession();
  }
}

// ai utils

export const projectEvaluationPrompt = (title, description, techStack) => `
You are an expert hackathon judge.

Evaluate the following project.

Project Title:
${title}

Description:
${description}

Tech Stack:
${techStack || "Not Provided"}

Return ONLY valid JSON.

{
  "innovationScore": 0,
  "technicalComplexity": 0,
  "marketPotential": 0,
  "presentationReadiness": 0,
  "strengths": [],
  "weaknesses": [],
  "improvements": [],
  "overallFeedback": ""
}

Rules:
- Scores must be between 1 and 10
- Return only JSON
- Do not use markdown
`;

export const pitchDeckPrompt = (title, problem, solution, targetAudience, techStack) => `
You are an experienced startup mentor and hackathon judge.

Generate a professional hackathon pitch deck.

Project Title:
${title}

Problem:
${problem}

Solution:
${solution}

Target Audience:
${targetAudience || "Not Provided"}

Tech Stack:
${techStack || "Not Provided"}

Return ONLY valid JSON.

{
  "problemStatement": "",
  "solutionOverview": "",
  "marketOpportunity": "",
  "targetAudience": "",
  "businessModel": "",
  "technicalArchitecture": "",
  "competitiveAdvantage": "",
  "futureScope": "",
  "elevatorPitch": ""
}

Rules:
- Return only JSON.
- No markdown.
- No explanation outside JSON.
- Make responses concise but professional.
`;


//socket io

export const parseCookies = (cookieStr) => {
  if (!cookieStr) return {};
  return cookieStr
    .split(";")
    .map((v) => v.split("="))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1] ? v[1].trim() : "");
      return acc;
    }, {});
};