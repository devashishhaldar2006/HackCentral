import { useState, useEffect, useCallback } from "react";
import { fetchEvents } from "../api/events";

import {
  CATEGORY_ICONS,
  ALL_CATEGORIES,
  ALL_MODES,
  ALL_PRICES,
  SORT_OPTIONS,
} from "../lib/eventUtils";
import EventCard from "../components/ui/EventCard";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState(""); // committed search
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeMode, setActiveMode] = useState("All Modes");
  const [activePrice, setActivePrice] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 12,
        sort: sortBy,
      };
      if (activeSearch) params.search = activeSearch;
      if (activeCategory !== "All") params.category = activeCategory;
      if (activeMode !== "All Modes") params.mode = activeMode;
      if (activePrice !== "All") params.price = activePrice;
      if (dateFilter) params.startDate = dateFilter;

      const res = await fetchEvents(params);
      setEvents(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [activeSearch, activeCategory, activeMode, activePrice, dateFilter, sortBy, page]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);



  const handleSearch = (e) => {
    e?.preventDefault();
    setActiveSearch(searchQuery.trim());
    setPage(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setActiveSearch("");
    setActiveCategory("All");
    setActiveMode("All Modes");
    setActivePrice("All");
    setDateFilter("");
    setSortBy("newest");
    setPage(1);
  };

  const hasActiveFilters =
    activeSearch || activeCategory !== "All" || activeMode !== "All Modes" || activePrice !== "All" || dateFilter;

  return (
    <>
      {/* ===== Hero Section ===== */}
      <section className="w-full bg-slate-100 dark:bg-slate-900/50 py-12 px-4 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-8">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
              Find Your Next{" "}
              <span className="text-[#0d4af2]">Breakthrough</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              The ultimate hub for developers to discover global hackathons,
              workshops, and high-impact tech events.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-2xl bg-white dark:bg-[#101522] p-1.5 rounded-xl shadow-xl shadow-[#0d4af2]/10 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <div className="flex-1 flex items-center px-4 gap-3">
              <span className="material-symbols-outlined text-slate-400">
                search
              </span>
              <input
                id="events-search"
                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-500 py-2"
                placeholder="Search by tech, name, or location..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveSearch("");
                    setPage(1);
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              )}
            </div>
            <button
              id="events-search-btn"
              onClick={handleSearch}
              className="bg-[#0d4af2] hover:bg-[#0d4af2]/90 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-[#0d4af2]/20 cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* ===== Main Content: Sidebar + Cards ===== */}
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8 py-10 px-4">

        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="lg:hidden flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#0d4af2]">tune</span>
          {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
          {hasActiveFilters && (
            <span className="ml-auto w-2 h-2 rounded-full bg-[#0d4af2] animate-pulse"></span>
          )}
        </button>

        {/* Filters Sidebar */}
        <aside className={`w-full lg:w-64 space-y-8 shrink-0 ${mobileFiltersOpen ? "block" : "hidden lg:block"}`}>
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0d4af2]">
                  tune
                </span>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Filters
                </h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-[#0d4af2] hover:text-[#0d4af2]/80 cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">restart_alt</span>
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Category */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Category
                </label>
                <div className="space-y-2">
                  {ALL_CATEGORIES.map((cat) => (
                    <div
                      key={cat}
                      onClick={() => { setActiveCategory(cat); setPage(1); }}
                      className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                        activeCategory === cat
                          ? "bg-[#0d4af2]/10 text-[#0d4af2] border border-[#0d4af2]/20"
                          : "hover:bg-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-xl ${
                          activeCategory === cat ? "" : "text-slate-400"
                        }`}
                      >
                        {CATEGORY_ICONS[cat] || "category"}
                      </span>
                      <span
                        className={`text-sm ${
                          activeCategory === cat
                            ? "font-semibold"
                            : "font-medium"
                        }`}
                      >
                        {cat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mode */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Mode
                </label>
                <div className="space-y-2">
                  {ALL_MODES.map((m) => (
                    <div
                      key={m}
                      onClick={() => { setActiveMode(m); setPage(1); }}
                      className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors text-sm ${
                        activeMode === m
                          ? "bg-[#0d4af2]/10 text-[#0d4af2] font-semibold border border-[#0d4af2]/20"
                          : "font-medium hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-xl ${
                          activeMode === m ? "text-[#0d4af2]" : "text-slate-400"
                        }`}
                      >
                        {m === "All Modes" ? "blur_on" : m === "Online" ? "wifi" : m === "Offline" ? "location_on" : "swap_horiz"}
                      </span>
                      {m}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Price
                </label>
                <div className="flex gap-2">
                  {ALL_PRICES.map((p) => (
                    <button
                      key={p}
                      onClick={() => { setActivePrice(p); setPage(1); }}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold cursor-pointer transition-all ${
                        activePrice === p
                          ? "bg-[#0d4af2] text-white shadow-lg shadow-[#0d4af2]/20"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Starting From
                </label>
                <input
                  id="events-date-filter"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm p-2.5 focus:ring-[#0d4af2] focus:border-[#0d4af2] text-slate-900 dark:text-white"
                  type="date"
                  value={dateFilter}
                  onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Events Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {activeCategory !== "All" ? activeCategory + "s" : "All Events"}{" "}
              <span className="text-slate-400 font-normal ml-2 text-lg">
                ({pagination.total})
              </span>
            </h2>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer hover:text-[#0d4af2] transition-colors"
              >
                <span>Sort by:</span>
                <span className="font-bold text-[#0d4af2]">
                  {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}
                </span>
                <span className="material-symbols-outlined text-sm">
                  {showSortDropdown ? "expand_less" : "expand_more"}
                </span>
              </button>
              {showSortDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-20 min-w-[160px] py-2 overflow-hidden">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setShowSortDropdown(false);
                        setPage(1);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                        sortBy === opt.value
                          ? "bg-[#0d4af2]/10 text-[#0d4af2] font-bold"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {activeSearch && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#0d4af2]/10 text-[#0d4af2] rounded-full text-xs font-bold">
                  Search: "{activeSearch}"
                  <button onClick={() => { setSearchQuery(""); setActiveSearch(""); setPage(1); }} className="hover:text-[#0d4af2]/70 cursor-pointer">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </span>
              )}
              {activeCategory !== "All" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#0d4af2]/10 text-[#0d4af2] rounded-full text-xs font-bold">
                  {activeCategory}
                  <button onClick={() => { setActiveCategory("All"); setPage(1); }} className="hover:text-[#0d4af2]/70 cursor-pointer">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </span>
              )}
              {activeMode !== "All Modes" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#0d4af2]/10 text-[#0d4af2] rounded-full text-xs font-bold">
                  {activeMode}
                  <button onClick={() => { setActiveMode("All Modes"); setPage(1); }} className="hover:text-[#0d4af2]/70 cursor-pointer">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </span>
              )}
              {activePrice !== "All" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#0d4af2]/10 text-[#0d4af2] rounded-full text-xs font-bold">
                  {activePrice}
                  <button onClick={() => { setActivePrice("All"); setPage(1); }} className="hover:text-[#0d4af2]/70 cursor-pointer">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </span>
              )}
              {dateFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#0d4af2]/10 text-[#0d4af2] rounded-full text-xs font-bold">
                  From: {dateFilter}
                  <button onClick={() => { setDateFilter(""); setPage(1); }} className="hover:text-[#0d4af2]/70 cursor-pointer">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden animate-pulse">
                  <div className="h-44 bg-slate-200 dark:bg-slate-800"></div>
                  <div className="p-5 space-y-4">
                    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-red-400 mb-4">error</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong</h3>
              <p className="text-slate-500 mb-6">{error}</p>
              <button
                onClick={loadEvents}
                className="bg-[#0d4af2] text-white px-6 py-3 rounded-lg font-bold cursor-pointer hover:bg-[#0d4af2]/90 transition-all"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && events.length === 0 && (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">event_busy</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No events found</h3>
              <p className="text-slate-500 mb-6">
                Try adjusting your filters or search query.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-[#0d4af2] text-white px-6 py-3 rounded-lg font-bold cursor-pointer hover:bg-[#0d4af2]/90 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Events grid */}
          {!loading && !error && events.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {events.map((event, idx) => (
                  <EventCard key={event._id} event={event} idx={idx} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-3">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="flex items-center gap-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#0d4af2]/50"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                    Prev
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter((p) => {
                        // Show first, last, and pages around current
                        return p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1;
                      })
                      .map((p, idx, arr) => (
                        <span key={p} className="flex items-center">
                          {idx > 0 && arr[idx - 1] !== p - 1 && (
                            <span className="px-1 text-slate-400">…</span>
                          )}
                          <button
                            onClick={() => setPage(p)}
                            className={`w-10 h-10 rounded-lg font-bold text-sm transition-all cursor-pointer ${
                              page === p
                                ? "bg-[#0d4af2] text-white shadow-lg shadow-[#0d4af2]/20"
                                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#0d4af2]/50"
                            }`}
                          >
                            {p}
                          </button>
                        </span>
                      ))}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page >= pagination.totalPages}
                    className="flex items-center gap-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#0d4af2]/50"
                  >
                    Next
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EventsPage;
