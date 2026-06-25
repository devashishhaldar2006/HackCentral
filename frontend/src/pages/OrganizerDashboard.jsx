import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { motion } from "framer-motion";
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
import { formatDate } from "../lib/eventUtils";
import { PIE_COLORS, fadeUp, staggerContainerOrganizerDashboard as staggerContainer } from "../lib/dashboardUtils";
import { EmptyState } from "../components/dashboard/DashboardComponents";
import { EventSubmissionModal } from "../components/dashboard/EventSubmissionModal";
import { ParticipantsModal } from "../components/dashboard/ParticipantsModal";
import { AnnouncementModal } from "../components/dashboard/AnnouncementModal";
import { socket } from "../lib/socket";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Skeleton } from "../components/ui/Skeleton";

const OrganizerDashboard = () => {
  const user = useSelector((state) => state.user);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchDashboard = async (controller = new AbortController()) => {
    try {
      setLoading(true);
      const { data: res } = await axios.get(
        `${BASE_URL}/dashboard/organizer`,
        { 
          withCredentials: true,
          signal: controller.signal,
          timeout: 10000
        }
      );
      setData(res);
      setError(null);
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error("Organizer dashboard error:", err);
        setError("Failed to load organizer dashboard.");
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchDashboard(controller);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const handleNewRegistration = (payload) => {
      // payload: { eventId, eventTitle, participantName }
      toast.success(`${payload.participantName} just registered for ${payload.eventTitle}!`, {
        icon: '👤',
      });
      
      // Update local state without full refetch
      setData(prev => {
        if (!prev || !prev.eventPerformance) return prev;
        
        const newPerformance = prev.eventPerformance.map(ev => {
          if (ev._id === payload.eventId && ev.registrations !== "N/A") {
            return { ...ev, registrations: ev.registrations + 1 };
          }
          return ev;
        });

        // Update total registrations in stats
        let newTotal = prev.stats.totalRegistrations;
        if (newPerformance.find(e => e._id === payload.eventId && e.registrations !== "N/A")) {
          newTotal += 1;
        }

        return {
          ...prev,
          stats: {
            ...prev.stats,
            totalRegistrations: newTotal,
          },
          eventPerformance: newPerformance,
        };
      });
    };

    socket.on("new_registration", handleNewRegistration);
    return () => {
      socket.off("new_registration", handleNewRegistration);
    };
  }, []);

  const handleEdit = async (event) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/events/${event._id}`);
      setEditingEvent(data.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch event details:", err);
      alert("Failed to load event details for editing.");
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    try {
      await axios.delete(`${BASE_URL}/events/${eventId}`, {
        withCredentials: true,
      });
      fetchDashboard();
    } catch (err) {
      console.error("Failed to delete event:", err);
      alert("Failed to delete event");
    }
  };

  const handleViewParticipants = (event) => {
    setSelectedEvent(event);
    setIsParticipantsModalOpen(true);
  };

  const handleAnnounce = (event) => {
    setSelectedEvent(event);
    setIsAnnouncementModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e] pt-6 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

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

  const { stats, eventPerformance, categoryBreakdown, monthlyCreations } = data;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e] pt-6 pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 mb-2 sm:mb-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d4af2] to-violet-600 flex items-center justify-center shadow-lg shadow-[#0d4af2]/20 shrink-0">
              <span className="material-symbols-outlined text-xl text-white">
                analytics
              </span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                Organizer Dashboard
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Analytics for your events,{" "}
                <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">
                  {user?.fullName || "Organizer"}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingEvent(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0d4af2] hover:bg-[#0d4af2]/90 text-white font-bold rounded-xl shadow-lg shadow-[#0d4af2]/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            Create Event
          </button>
        </motion.div>

        {/* STATS OVERVIEW */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          {[
            {
              icon: "event",
              label: "Events Created",
              value: stats.eventsCreated,
              color: "bg-[#0d4af2]",
            },
            {
              icon: "group",
              label: "Total Registrations",
              value: stats.totalRegistrations,
              color: "bg-emerald-500",
            },
            {
              icon: "bookmark",
              label: "Total Bookmarks",
              value: stats.totalBookmarks,
              color: "bg-amber-500",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={fadeUp}
              className="bg-white dark:bg-[#161d2f] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg hover:shadow-slate-200/30 dark:hover:shadow-black/20 transition-shadow duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}
                >
                  <span className="material-symbols-outlined text-xl text-white">
                    {stat.icon}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums dashboard-stat-enter">
                {stat.value.toLocaleString()}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CHARTS ROW */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8"
        >
          {/* Monthly Event Creations */}
          <motion.div
            variants={fadeUp}
            custom={3}
            className="bg-white dark:bg-[#161d2f] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6"
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-[18px]">
                  bar_chart
                </span>
              </span>
              Events Over Time
            </h2>
            {monthlyCreations.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyCreations}>
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
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                    formatter={(v) => [`${v} events`, "Created"]}
                  />
                  <Bar
                    dataKey="count"
                    fill="#0d4af2"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState text="No event data yet" />
            )}
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            variants={fadeUp}
            custom={4}
            className="bg-white dark:bg-[#161d2f] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6"
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-[18px]">
                  donut_large
                </span>
              </span>
              Category Distribution
            </h2>
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
                      formatter={(v, n) => [`${v} events`, n]}
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
                    <div
                      key={cat.category}
                      className="flex items-center gap-2.5"
                    >
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
              <EmptyState text="No category data yet" />
            )}
          </motion.div>
        </motion.div>

        {/* EVENT PERFORMANCE TABLE */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={5}
          className="bg-white dark:bg-[#161d2f] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6"
        >
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-[18px]">
                leaderboard
              </span>
            </span>
            Event Performance
          </h2>
          {eventPerformance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-3 px-3">
                      Event
                    </th>
                    <th className="text-left text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-3 px-3">
                      Category
                    </th>
                    <th className="text-left text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-3 px-3">
                      Date
                    </th>
                    <th className="text-right text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-3 px-3">
                      Registrations
                    </th>
                    <th className="text-right text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-3 px-3">
                      Bookmarks
                    </th>
                    <th className="text-right text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-3 px-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {eventPerformance.map((event, i) => (
                    <tr
                      key={event._id}
                      className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#1c2438] transition-colors ${
                        i % 2 === 0 ? "" : "bg-slate-50/50 dark:bg-slate-800/20"
                      }`}
                    >
                      <td className="py-3.5 px-3">
                        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate max-w-[200px]">
                          {event.title}
                        </p>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {event.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {formatDate(event.startDate)}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                          {event.registrations}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <span className="text-sm font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                          {event.bookmarks}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewParticipants(event)}
                            title="View Participants"
                            className="p-2 text-slate-400 hover:text-[#0d4af2] hover:bg-[#0d4af2]/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">group</span>
                          </button>
                          <button
                            onClick={() => handleAnnounce(event)}
                            title="Post Announcement"
                            className="p-2 text-slate-400 hover:text-[#0d4af2] hover:bg-[#0d4af2]/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">campaign</span>
                          </button>
                          <button
                            onClick={() => handleEdit(event)}
                            title="Edit Event"
                            className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(event._id)}
                            title="Delete Event"
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState text="No events created yet" />
          )}
        </motion.div>
      </div>

      <EventSubmissionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        onSuccess={() => fetchDashboard()}
        initialData={editingEvent}
      />

      <ParticipantsModal
        isOpen={isParticipantsModalOpen}
        onClose={() => {
          setIsParticipantsModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />

      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => {
          setIsAnnouncementModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />
    </div>
  );
};

export default OrganizerDashboard;