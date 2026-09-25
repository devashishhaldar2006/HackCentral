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
import { EventCardSkeleton } from "../components/ui/Skeleton";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ===== Header Section ===== */}
      <section className="w-full bg-white py-12 px-4 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-6">
          <div className="max-w-2xl space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Find Your Next <span className="text-yellow-500">Hackathon</span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              The premier directory of developer hackathons, coding contests, and global workshops.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-2xl bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/20 transition-all">
            <div className="flex-1 flex items-center px-3 gap-3">
              <span className="material-symbols-outlined text-yellow-500">
                search
              </span>
              <input
                id="events-search"
                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-slate-900 placeholder:text-slate-400 py-1.5 text-sm"
                placeholder="Search by keywords, tags, or host..."
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
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
            </div>
            <button
              id="events-search-btn"
              onClick={handleSearch}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm"
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
          className="lg:hidden flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-yellow-500">tune</span>
            <span className="text-sm">
              {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
            </span>
          </div>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
          )}
        </button>

        {/* Filters Sidebar */}
        <aside className={`w-full lg:w-64 space-y-6 shrink-0 ${mobileFiltersOpen ? "block" : "hidden lg:block"}`}>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-yellow-500 text-lg">
                  tune
                </span>
                <h3 className="font-bold text-sm text-slate-900">
                  Filters
                </h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-yellow-600 hover:text-yellow-700 font-semibold cursor-pointer"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Category
              </label>
              <div className="space-y-1">
                {ALL_CATEGORIES.map((cat) => (
                  <div
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setPage(1); }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-colors text-xs ${
                      activeCategory === cat
                        ? "bg-yellow-100 text-yellow-900 font-bold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {CATEGORY_ICONS[cat] || "category"}
                    </span>
                    <span>{cat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mode Filter */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Mode
              </label>
              <div className="space-y-1">
                {ALL_MODES.map((m) => (
                  <div
                    key={m}
                    onClick={() => { setActiveMode(m); setPage(1); }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-colors text-xs ${
                      activeMode === m
                        ? "bg-yellow-100 text-yellow-900 font-bold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {m === "All Modes" ? "blur_on" : m === "Online" ? "wifi" : m === "Offline" ? "location_on" : "swap_horiz"}
                    </span>
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Pricing
              </label>
              <div className="flex gap-2">
                {ALL_PRICES.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setActivePrice(p); setPage(1); }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      activePrice === p
                        ? "bg-yellow-400 text-slate-950"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Filter */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Starting From
              </label>
              <input
                id="events-date-filter"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs p-2 text-slate-800 focus:border-yellow-400 focus:outline-none"
                type="date"
                value={dateFilter}
                onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
              />
            </div>
          </div>
        </aside>

        {/* Events Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4 pb-3 border-b border-slate-200">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span>{activeCategory !== "All" ? activeCategory + "s" : "All Hackathons"}</span>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full font-bold">
                {pagination.total} events
              </span>
            </h2>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm"
              >
                <span>Sort by:</span>
                <span className="font-bold text-yellow-600">
                  {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}
                </span>
                <span className="material-symbols-outlined text-sm">
                  {showSortDropdown ? "expand_less" : "expand_more"}
                </span>
              </button>
              {showSortDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-20 min-w-[160px] py-1.5">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setShowSortDropdown(false);
                        setPage(1);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs cursor-pointer transition-colors ${
                        sortBy === opt.value
                          ? "bg-yellow-50 text-yellow-800 font-bold"
                          : "text-slate-700 hover:bg-slate-50"
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
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-full text-xs font-medium">
                  Search: "{activeSearch}"
                  <button onClick={() => { setSearchQuery(""); setActiveSearch(""); setPage(1); }} className="hover:text-yellow-600 cursor-pointer">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </span>
              )}
              {activeCategory !== "All" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-full text-xs font-medium">
                  Category: {activeCategory}
                  <button onClick={() => { setActiveCategory("All"); setPage(1); }} className="hover:text-yellow-600 cursor-pointer">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </span>
              )}
              {activeMode !== "All Modes" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-full text-xs font-medium">
                  Mode: {activeMode}
                  <button onClick={() => { setActiveMode("All Modes"); setPage(1); }} className="hover:text-yellow-600 cursor-pointer">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </span>
              )}
              {activePrice !== "All" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-full text-xs font-medium">
                  Price: {activePrice}
                  <button onClick={() => { setActivePrice("All"); setPage(1); }} className="hover:text-yellow-600 cursor-pointer">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </span>
              )}
              {dateFilter && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-full text-xs font-medium">
                  From: {dateFilter}
                  <button onClick={() => { setDateFilter(""); setPage(1); }} className="hover:text-yellow-600 cursor-pointer">
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
                <EventCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <span className="material-symbols-outlined text-5xl text-red-400 mb-3">error</span>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Unable to load events</h3>
              <p className="text-slate-500 text-sm mb-6">{error}</p>
              <button
                onClick={loadEvents}
                className="btn-yellow"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && events.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <span className="material-symbols-outlined text-5xl text-yellow-400 mb-4">event_busy</span>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No hackathons found</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                Try widening your search terms or clearing your selected filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="btn-yellow"
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
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-white border border-slate-200 text-slate-700 hover:border-yellow-400 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                    Prev
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
                      .map((p, idx, arr) => (
                        <span key={p} className="flex items-center">
                          {idx > 0 && arr[idx - 1] !== p - 1 && (
                            <span className="px-2 text-slate-400">…</span>
                          )}
                          <button
                            onClick={() => setPage(p)}
                            className={`w-9 h-9 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm ${
                              page === p
                                ? "bg-yellow-400 text-slate-950"
                                : "bg-white border border-slate-200 text-slate-700 hover:border-yellow-400"
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
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-white border border-slate-200 text-slate-700 hover:border-yellow-400 shadow-sm"
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
    </div>
  );
};

export default EventsPage;
