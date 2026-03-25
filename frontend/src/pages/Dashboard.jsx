import { EVENTS, CATEGORIES, TECH_TAGS } from "../api/data";
import { useState } from "react";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Development");

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
                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-500 py-2"
                placeholder="Search by tech, name, or location..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-[#0d4af2] hover:bg-[#0d4af2]/90 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-[#0d4af2]/20 cursor-pointer">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* ===== Main Content: Sidebar + Cards ===== */}
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8 py-10 px-4">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 space-y-8 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#0d4af2]">
                tune
              </span>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Filters
              </h3>
            </div>

            <div className="space-y-6">
              {/* Category */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Category
                </label>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <div
                      key={cat.label}
                      onClick={() => setActiveCategory(cat.label)}
                      className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                        activeCategory === cat.label
                          ? "bg-[#0d4af2]/10 text-[#0d4af2] border border-[#0d4af2]/20"
                          : "hover:bg-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-xl ${
                          activeCategory === cat.label
                            ? ""
                            : "text-slate-400"
                        }`}
                      >
                        {cat.icon}
                      </span>
                      <span
                        className={`text-sm ${
                          activeCategory === cat.label
                            ? "font-semibold"
                            : "font-medium"
                        }`}
                      >
                        {cat.label}
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
                <select className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm p-2.5 focus:ring-[#0d4af2] focus:border-[#0d4af2] text-slate-900 dark:text-white">
                  <option>All Modes</option>
                  <option>Online</option>
                  <option>In-Person</option>
                  <option>Hybrid</option>
                </select>
              </div>

              {/* Tech Stack */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Tech Stack
                </label>
                <div className="flex flex-wrap gap-2">
                  {TECH_TAGS.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-full text-xs font-semibold cursor-pointer hover:bg-[#0d4af2]/20 hover:text-[#0d4af2] transition-all text-slate-700 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Date
                </label>
                <input
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm p-2.5 focus:ring-[#0d4af2] focus:border-[#0d4af2] text-slate-900 dark:text-white"
                  type="date"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Events Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Upcoming Events{" "}
              <span className="text-slate-400 font-normal ml-2 text-lg">
                (124)
              </span>
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Sort by:</span>
              <button className="font-bold text-[#0d4af2] flex items-center cursor-pointer">
                Newest First{" "}
                <span className="material-symbols-outlined text-sm">
                  expand_more
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {EVENTS.map((event) => (
              <div
                key={event.id}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-[#0d4af2]/50 transition-all flex flex-col shadow-sm hover:shadow-md"
              >
                {/* Card Image Area */}
                <div
                  className={`relative h-44 w-full bg-gradient-to-br ${event.bgGradient} overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  {/* Decorative pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 right-4 w-24 h-24 border-2 border-white/30 rounded-full"></div>
                    <div className="absolute bottom-6 right-8 w-16 h-16 border-2 border-white/20 rounded-full"></div>
                    <div className="absolute top-8 left-1/2 w-12 h-12 border border-white/20 rounded-lg rotate-45"></div>
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`${event.typeColor} text-white text-[10px] uppercase font-black px-2 py-1 rounded`}
                    >
                      {event.type}
                    </span>
                    <span
                      className={`${event.modeColor} text-white text-[10px] uppercase font-black px-2 py-1 rounded`}
                    >
                      {event.mode}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#0d4af2] transition-colors leading-tight">
                      {event.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        calendar_today
                      </span>{" "}
                      {event.date}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold py-1 px-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">
                      {event.registered} Registered
                    </span>
                    <button className="bg-[#0d4af2]/10 text-[#0d4af2] hover:bg-[#0d4af2] hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer">
                      Register
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 flex justify-center">
            <button className="bg-slate-200 dark:bg-slate-800 hover:bg-[#0d4af2]/20 hover:text-[#0d4af2] transition-all px-8 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              Load More Events
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard