import mongoose from "mongoose";
import User from "../models/User.js";
import Event from "../models/Event.js";
import ActivityLog from "../models/ActivityLog.js";
import { LEVELS, BADGE_DEFINITIONS, getLevelInfo, timeAgo, updateStreak, checkAchievements,logActivity } from "../lib/utils.js";

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .populate("registeredEvents")
      .populate("bookmarkedEvents");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const now = new Date();
    // 1. Overview Stats
    const registeredEvents = (user.registeredEvents || []).filter(Boolean);
    const bookmarkedEvents = (user.bookmarkedEvents || []).filter(Boolean);
    const upcomingEvents = registeredEvents.filter(
      (e) => e.startDate && new Date(e.startDate) > now
    );
    const attendedEvents = registeredEvents.filter(
      (e) => e.endDate && new Date(e.endDate) < now
    );

    const stats = {
      registered: registeredEvents.length,
      bookmarked: bookmarkedEvents.length,
      attended: attendedEvents.length,
      upcoming: upcomingEvents.length,
    };

    // 2. Activity Heatmap (last 365 days)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const heatmapData = await ActivityLog.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: oneYearAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const heatmap = heatmapData.map((d) => ({ date: d._id, count: d.count }));

    // 3. Monthly Activity (last 12 months)
    const monthlyData = await ActivityLog.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: oneYearAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const monthlyActivity = monthlyData.map((d) => {
      const [, month] = d._id.split("-");
      return {
        month: monthNames[parseInt(month) - 1],
        fullMonth: d._id,
        count: d.count,
      };
    });

    // 4. Category Breakdown
    const allEvents = [...registeredEvents, ...bookmarkedEvents];
    const categoryMap = {};
    for (const e of allEvents) {
      if (e.category) {
        categoryMap[e.category] = (categoryMap[e.category] || 0) + 1;
      }
    }
    const categoryBreakdown = Object.entries(categoryMap)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    // 5. Top Tags (Technology Interests)
    const tagMap = {};
    for (const e of allEvents) {
      if (e.tags) {
        for (const tag of e.tags) {
          tagMap[tag] = (tagMap[tag] || 0) + 1;
        }
      }
    }
    const topTags = Object.entries(tagMap)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 6. XP & Level
    const xpInfo = getLevelInfo(user.xp || 0);

    // 7. Achievements
    // Check for new achievements with full stats
    const hackathonCount = registeredEvents.filter(
      (e) => e.category === "Hackathon"
    ).length;
    const achievementStats = {
      registered: registeredEvents.length,
      bookmarked: bookmarkedEvents.length,
      attended: attendedEvents.length,
      bestStreak: user.bestStreak || 0,
      hackathonCount,
      categoryCount: Object.keys(categoryMap).length,
      accountAgeDays: Math.floor(
        (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      ),
    };

    await checkAchievements(user, achievementStats);
    await user.save();

    const achievements = BADGE_DEFINITIONS.map((def) => {
      const earned = user.achievements.find((a) => a.badge === def.badge);
      return {
        badge: def.badge,
        label: def.label,
        description: def.description,
        icon: def.icon,
        earned: !!earned,
        earnedAt: earned?.earnedAt || null,
      };
    });

    // 8. Streak
    const streak = {
      current: user.currentStreak || 0,
      best: user.bestStreak || 0,
    };

    // 9. Upcoming Events (sorted by date)
    const upcomingWidget = upcomingEvents
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 5)
      .map((e) => ({
        _id: e._id,
        title: e.title,
        startDate: e.startDate,
        location: e.location,
        mode: e.mode,
        category: e.category,
        daysRemaining: Math.ceil(
          (new Date(e.startDate) - now) / (1000 * 60 * 60 * 24)
        ),
      }));

    // 10. Event Journey Timeline (grouped by month)
    const allRegistered = registeredEvents
      .filter((e) => e.startDate)
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      .slice(0, 20);

    const timelineMap = {};
    for (const e of allRegistered) {
      const d = new Date(e.startDate);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (!timelineMap[key]) timelineMap[key] = [];
      timelineMap[key].push({
        _id: e._id,
        title: e.title,
        category: e.category,
        action: new Date(e.endDate || e.startDate) < now ? "attended" : "registered",
      });
    }
    const timeline = Object.entries(timelineMap).map(([month, events]) => ({
      month,
      events,
    }));

    // 11. Recent Activity Feed
    const recentLogs = await ActivityLog.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("targetEvent", "title");

    const actionLabels = {
      register: "Registered for",
      bookmark: "Bookmarked",
      unbookmark: "Removed bookmark from",
      create_event: "Created event",
      profile_update: "Updated profile",
    };

    const recentActivity = recentLogs.map((log) => ({
      action: log.targetEvent
        ? `${actionLabels[log.action] || log.action} ${log.targetEvent.title}`
        : actionLabels[log.action] || log.action,
      type: log.action,
      timeAgo: timeAgo(log.createdAt),
      date: log.createdAt,
    }));

    // 12. Personalized Recommendations
    // Score events by tag + category overlap with user's history
    const userTagSet = new Set(Object.keys(tagMap));
    const userCategorySet = new Set(Object.keys(categoryMap));
    const registeredIds = new Set(registeredEvents.map((e) => e._id.toString()));
    const bookmarkedIds = new Set(bookmarkedEvents.map((e) => e._id.toString()));

    // Fetch upcoming events not already registered/bookmarked
    const candidateEvents = await Event.find({
      startDate: { $gt: now },
      _id: {
        $nin: [...registeredIds, ...bookmarkedIds].map(
          (id) => new mongoose.Types.ObjectId(id)
        ),
      },
    })
      .sort({ startDate: 1 })
      .limit(50);

    const recommendations = candidateEvents
      .map((event) => {
        let score = 0;
        const maxTagScore = userTagSet.size || 1;

        // Tag overlap scoring
        if (event.tags) {
          const tagOverlap = event.tags.filter((t) => userTagSet.has(t)).length;
          score += (tagOverlap / maxTagScore) * 60; // Max 60 points from tags
        }

        // Category scoring
        if (event.category && userCategorySet.has(event.category)) {
          score += 25; // 25 points for matching category
        }

        // User interest/skill scoring
        const userInterests = new Set(
          (user.interests || []).map((i) => i.toLowerCase())
        );
        const userSkills = new Set(
          (user.skills || []).map((s) => s.toLowerCase())
        );
        if (event.tags) {
          for (const tag of event.tags) {
            if (userInterests.has(tag.toLowerCase())) score += 5;
            if (userSkills.has(tag.toLowerCase())) score += 5;
          }
        }

        // Cap at 99
        score = Math.min(99, Math.round(score));

        return {
          event: {
            _id: event._id,
            title: event.title,
            category: event.category,
            mode: event.mode,
            startDate: event.startDate,
            location: event.location,
            tags: event.tags,
            image: event.image,
          },
          matchScore: score,
        };
      })
      .filter((r) => r.matchScore > 10)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6);

    // Response
    res.json({
      stats,
      xp: xpInfo,
      heatmap,
      monthlyActivity,
      categoryBreakdown,
      topTags,
      achievements,
      streak,
      upcomingEvents: upcomingWidget,
      timeline,
      recentActivity,
      recommendations,
    });
  } catch (err) {
    console.error("getUserDashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrganizerDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("submittedEvents");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "organizer") {
      return res.status(403).json({ message: "Access denied — organizer only" });
    }

    const submittedEvents = (user.submittedEvents || []).filter(Boolean);
    const eventIds = submittedEvents.map((e) => e._id);

    // Count total registrations across all users for these events
    const registrationCounts = await User.aggregate([
      { $match: { registeredEvents: { $in: eventIds } } },
      { $unwind: "$registeredEvents" },
      { $match: { registeredEvents: { $in: eventIds } } },
      {
        $group: {
          _id: "$registeredEvents",
          count: { $sum: 1 },
        },
      },
    ]);

    // Count total bookmarks across all users for these events
    const bookmarkCounts = await User.aggregate([
      { $match: { bookmarkedEvents: { $in: eventIds } } },
      { $unwind: "$bookmarkedEvents" },
      { $match: { bookmarkedEvents: { $in: eventIds } } },
      {
        $group: {
          _id: "$bookmarkedEvents",
          count: { $sum: 1 },
        },
      },
    ]);

    const regMap = Object.fromEntries(
      registrationCounts.map((r) => [r._id.toString(), r.count])
    );
    const bookMap = Object.fromEntries(
      bookmarkCounts.map((b) => [b._id.toString(), b.count])
    );

    let totalRegistrations = 0;
    let totalBookmarks = 0;

    const eventPerformance = submittedEvents.map((e) => {
      // Use event.participants if available for internal registrations
      let regs = 0;
      if (e.registrationLink) {
        regs = "N/A";
      } else {
        regs = e.participants ? e.participants.length : (regMap[e._id.toString()] || 0);
        totalRegistrations += regs;
      }

      const books = bookMap[e._id.toString()] || 0;
      totalBookmarks += books;
      return {
        _id: e._id,
        title: e.title,
        category: e.category,
        startDate: e.startDate,
        registrations: regs,
        bookmarks: books,
        hasRegistrationLink: !!e.registrationLink
      };
    });

    // Category breakdown for organizer events
    const categoryMap = {};
    for (const e of submittedEvents) {
      if (e.category) {
        categoryMap[e.category] = (categoryMap[e.category] || 0) + 1;
      }
    }
    const categoryBreakdown = Object.entries(categoryMap)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    // Monthly event creations
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const monthlyMap = {};
    for (const e of submittedEvents) {
      if (e.createdAt) {
        const d = new Date(e.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        monthlyMap[key] = (monthlyMap[key] || 0) + 1;
      }
    }
    const monthlyCreations = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, count]) => {
        const [, month] = key.split("-");
        return {
          month: monthNames[parseInt(month) - 1],
          fullMonth: key,
          count,
        };
      });

    res.json({
      stats: {
        eventsCreated: submittedEvents.length,
        totalRegistrations,
        totalBookmarks,
      },
      eventPerformance,
      categoryBreakdown,
      monthlyCreations,
    });
  } catch (err) {
    console.error("getOrganizerDashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
