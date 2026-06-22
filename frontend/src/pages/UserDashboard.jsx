import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BASE_URL } from "../lib/constants";
import { CATEGORY_COLORS, formatDate } from "../lib/eventUtils";
import { staggerContainerUserDashboard as staggerContainer, fadeUp, PIE_COLORS, TAG_COLORS } from "../lib/dashboardUtils";
import { StatCard, Section, CustomTooltip, EmptyState } from "../components/dashboard/DashboardComponents";


const UserDashboard = () => {
  const user = useSelector((state) => state.user);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const { data: res } = await axios.get(`${BASE_URL}/dashboard/user`, {
          withCredentials: true,
        });
        setData(res);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0d4af2]/30 border-t-[#0d4af2] rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Loading your dashboard…
          </p>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e] flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-red-400 mb-3 block">
            error
          </span>
          <p className="text-red-500 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const {
    stats,
    xp,
    heatmap,
    monthlyActivity,
    categoryBreakdown,
    topTags,
    achievements,
    streak,
    upcomingEvents,
    timeline,
    recentActivity,
    recommendations,
  } = data;

  // Heatmap date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  // XP progress percentage
  const xpProgress = xp.nextLevelXp
    ? ((xp.total - xp.currentLevelXp) / (xp.nextLevelXp - xp.currentLevelXp)) *
      100
    : 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e] pt-6 pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* ═══════ HEADER ═══════ */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Welcome back,{" "}
                <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">
                  {user?.fullName || "User"}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 bg-[#0d4af2] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#0d4af2]/90 transition-colors shadow-lg shadow-[#0d4af2]/20"
              >
                <span className="material-symbols-outlined text-sm">search</span>
                Find Events
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ═══════ STATS OVERVIEW ═══════ */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            icon="how_to_reg"
            label="Registered"
            value={stats.registered}
            color="bg-[#0d4af2]"
            delay={0}
          />
          <StatCard
            icon="bookmark"
            label="Bookmarked"
            value={stats.bookmarked}
            color="bg-amber-500"
            delay={1}
          />
          <StatCard
            icon="check_circle"
            label="Attended"
            value={stats.attended}
            color="bg-emerald-500"
            delay={2}
          />
          <StatCard
            icon="upcoming"
            label="Upcoming"
            value={stats.upcoming}
            color="bg-violet-500"
            delay={3}
          />
        </motion.div>

        {/* ═══════ XP & LEVEL + STREAK ROW ═══════ */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8"
        >
          {/* XP Progress */}
          <motion.div
            variants={fadeUp}
            custom={4}
            className="lg:col-span-2 bg-white dark:bg-[#161d2f] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0d4af2] to-violet-600 flex items-center justify-center shadow-lg shadow-[#0d4af2]/20">
                  <span className="text-white font-black text-lg">
                    {xp.level}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {xp.levelName}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    Level {xp.level}{" "}
                    {xp.nextLevelName
                      ? `• ${xp.total} / ${xp.nextLevelXp} XP`
                      : `• ${xp.total} XP (Max Level)`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-[#0d4af2]">
                  {xp.total}
                  <span className="text-sm font-bold text-slate-400 ml-1">
                    XP
                  </span>
                </p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0d4af2] to-violet-500 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${Math.min(100, xpProgress)}%`,
                  animation: "progress-fill 1.2s ease-out",
                }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-[11px] font-semibold text-slate-400">
                {xp.currentLevelXp} XP
              </p>
              {xp.nextLevelXp && (
                <p className="text-[11px] font-semibold text-slate-400">
                  {xp.nextLevelXp} XP
                </p>
              )}
            </div>
          </motion.div>

          {/* Streak */}
          <motion.div
            variants={fadeUp}
            custom={5}
            className="bg-white dark:bg-[#161d2f] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center justify-center text-center"
          >
            <div className="streak-fire mb-2">
              <span className="material-symbols-outlined text-5xl text-amber-500">
                local_fire_department
              </span>
            </div>
            <p className="text-4xl font-black text-slate-900 dark:text-white tabular-nums">
              {streak.current}
            </p>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">
              Month Streak
            </p>
            <div className="mt-3 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                Best: {streak.best} months
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* ═══════ ACTIVITY HEATMAP ═══════ */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={6}
          className="mb-8"
        >
          <Section title="Activity Heatmap" icon="grid_view" delay={6}>
            <div className="overflow-x-auto -mx-2">
              <div className="min-w-[700px] px-2">
                <CalendarHeatmap
                  startDate={startDate}
                  endDate={endDate}
                  values={heatmap}
                  classForValue={(value) => {
                    if (!value || !value.count) return "color-empty";
                    if (value.count >= 4) return "color-scale-4";
                    if (value.count >= 3) return "color-scale-3";
                    if (value.count >= 2) return "color-scale-2";
                    return "color-scale-1";
                  }}
                  titleForValue={(value) => {
                    if (!value) return "No activity";
                    return `${value.date}: ${value.count} ${value.count === 1 ? "activity" : "activities"}`;
                  }}
                  showWeekdayLabels
                  gutterSize={3}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] font-bold text-slate-400 dark:text-slate-500">
              <span>Less</span>
              <span className="w-3 h-3 rounded-[3px] bg-slate-200 dark:bg-slate-800" />
              <span className="w-3 h-3 rounded-[3px] bg-blue-300 dark:bg-[#1e3a5f]" />
              <span className="w-3 h-3 rounded-[3px] bg-blue-500 dark:bg-blue-700" />
              <span className="w-3 h-3 rounded-[3px] bg-blue-700 dark:bg-blue-600" />
              <span className="w-3 h-3 rounded-[3px] bg-[#0d4af2] dark:bg-blue-500" />
              <span>More</span>
            </div>
          </Section>
        </motion.div>

        {/* ═══════ CHARTS ROW ═══════ */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8"
        >
          {/* Monthly Activity */}
          <Section title="Monthly Activity" icon="bar_chart" delay={7}>
            {monthlyActivity.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyActivity}>
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(13,74,242,0.05)" }} />
                  <Bar
                    dataKey="count"
                    fill="#0d4af2"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState text="No activity data yet" icon="bar_chart" />
            )}
          </Section>

          {/* Category Distribution */}
          <Section title="Event Categories" icon="donut_large" delay={8}>
            {categoryBreakdown.length > 0 ? (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      stroke="none"
                      paddingAngle={3}
                    >
                      {categoryBreakdown.map((_, i) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} events`, name]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2.5">
                  {categoryBreakdown.map((cat, i) => (
                    <div key={cat.category} className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{
                          backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                        }}
                      />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300 flex-1 truncate">
                        {cat.category}
                      </span>
                      <span className="text-sm font-bold text-slate-800 dark:text-white tabular-nums">
                        {cat.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState text="No category data yet" icon="donut_large" />
            )}
          </Section>
        </motion.div>

        {/* ═══════ TECH INTERESTS ═══════ */}
        {topTags.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={9}
            className="mb-8"
          >
            <Section title="Technology Interests" icon="interests" delay={9}>
              <div className="space-y-3">
                {topTags.map((tag, i) => {
                  const maxCount = topTags[0]?.count || 1;
                  const pct = (tag.count / maxCount) * 100;
                  return (
                    <div key={tag.tag} className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 w-32 truncate">
                        {tag.tag}
                      </span>
                      <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                        <div
                          className="h-full rounded-lg flex items-center justify-end pr-2 transition-all duration-700"
                          style={{
                            width: `${Math.max(pct, 8)}%`,
                            backgroundColor:
                              TAG_COLORS[i % TAG_COLORS.length],
                          }}
                        >
                          <span className="text-[10px] font-black text-white">
                            {tag.count}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          </motion.div>
        )}

        {/* ═══════ ACHIEVEMENTS ═══════ */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={10}
          className="mb-8"
        >
          <Section title="Achievement Badges" icon="workspace_premium" delay={10}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {achievements.map((badge, i) => (
                <div
                  key={badge.badge}
                  className={`relative rounded-xl p-4 text-center transition-all duration-200 border ${
                    badge.earned
                      ? "bg-slate-50 dark:bg-[#1c2438] border-[#0d4af2]/30 hover:border-[#0d4af2]/60 badge-enter"
                      : "bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/50 opacity-40 grayscale"
                  }`}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <span
                    className={`material-symbols-outlined text-3xl mb-2 block ${
                      badge.earned
                        ? "text-[#0d4af2]"
                        : "text-slate-400 dark:text-slate-600"
                    }`}
                  >
                    {badge.icon}
                  </span>
                  <p
                    className={`text-xs font-bold ${
                      badge.earned
                        ? "text-slate-800 dark:text-white"
                        : "text-slate-400 dark:text-slate-600"
                    }`}
                  >
                    {badge.label}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {badge.description}
                  </p>
                  {badge.earned && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[12px]">
                        check
                      </span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Section>
        </motion.div>

        {/* ═══════ UPCOMING + RECENT ACTIVITY ROW ═══════ */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8"
        >
          {/* Upcoming Events */}
          <Section
            title="Upcoming Events"
            icon="event_upcoming"
            delay={11}
          >
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event._id}
                    className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 dark:bg-[#1c2438] border border-slate-100 dark:border-slate-700/60 hover:border-[#0d4af2]/30 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0d4af2] to-violet-600 flex items-center justify-center shrink-0">
                      <span className="text-white font-black text-sm">
                        {event.daysRemaining}d
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[12px]">
                          calendar_today
                        </span>
                        {formatDate(event.startDate)}
                        {event.location && (
                          <>
                            <span className="mx-1">•</span>
                            <span className="material-symbols-outlined text-[12px]">
                              location_on
                            </span>
                            {event.location}
                          </>
                        )}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${
                        CATEGORY_COLORS[event.category] || "bg-slate-500"
                      } text-white`}
                    >
                      {event.category}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                text="No upcoming events"
                icon="event_upcoming"
                action={
                  <Link
                    to="/events"
                    className="text-[#0d4af2] text-xs font-bold hover:underline"
                  >
                    Browse events →
                  </Link>
                }
              />
            )}
          </Section>

          {/* Recent Activity */}
          <Section title="Recent Activity" icon="history" delay={12}>
            {recentActivity.length > 0 ? (
              <div className="space-y-2">
                {recentActivity.map((item, i) => {
                  const iconMap = {
                    register: "how_to_reg",
                    bookmark: "bookmark_add",
                    unbookmark: "bookmark_remove",
                    create_event: "add_circle",
                    profile_update: "person",
                  };
                  const colorMap = {
                    register: "text-emerald-500",
                    bookmark: "text-amber-500",
                    unbookmark: "text-slate-400",
                    create_event: "text-[#0d4af2]",
                    profile_update: "text-violet-500",
                  };
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1c2438] transition-colors"
                    >
                      <span
                        className={`material-symbols-outlined text-xl ${
                          colorMap[item.type] || "text-slate-400"
                        }`}
                      >
                        {iconMap[item.type] || "circle"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                          {item.action}
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 shrink-0">
                        {item.timeAgo}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                text="No recent activity"
                icon="history"
                action={
                  <p className="text-xs text-slate-400">
                    Start by browsing and bookmarking events
                  </p>
                }
              />
            )}
          </Section>
        </motion.div>

        {/* ═══════ EVENT TIMELINE ═══════ */}
        {timeline.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={13}
            className="mb-8"
          >
            <Section title="Event Journey" icon="timeline" delay={13}>
              <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700 space-y-6">
                {timeline.map((group) => (
                  <div key={group.month}>
                    <div className="absolute -left-[9px] w-4 h-4 rounded-full bg-[#0d4af2] border-2 border-white dark:border-[#161d2f]" />
                    <p className="text-sm font-bold text-slate-800 dark:text-white mb-2">
                      {group.month}
                    </p>
                    <div className="space-y-1.5">
                      {group.events.map((evt) => (
                        <div
                          key={evt._id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span
                            className={`material-symbols-outlined text-[14px] ${
                              evt.action === "attended"
                                ? "text-emerald-500"
                                : "text-[#0d4af2]"
                            }`}
                          >
                            {evt.action === "attended"
                              ? "check_circle"
                              : "app_registration"}
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">
                            {evt.action === "attended"
                              ? "Attended"
                              : "Registered for"}{" "}
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {evt.title}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </motion.div>
        )}

        {/* ═══════ RECOMMENDATIONS ═══════ */}
        {recommendations.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={14}
            className="mb-8"
          >
            <Section
              title="Recommended For You"
              icon="auto_awesome"
              delay={14}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((rec) => (
                  <div
                    key={rec.event._id}
                    className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-[#1c2438] p-4 hover:border-[#0d4af2]/40 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${
                          CATEGORY_COLORS[rec.event.category] || "bg-slate-500"
                        } text-white`}
                      >
                        {rec.event.category}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black">
                        {rec.matchScore}% match
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white mb-1 line-clamp-2 group-hover:text-[#0d4af2] transition-colors">
                      {rec.event.title}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">
                        calendar_today
                      </span>
                      {formatDate(rec.event.startDate)}
                    </p>
                    {rec.event.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {rec.event.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-bold py-0.5 px-2 rounded-md bg-slate-200/80 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;