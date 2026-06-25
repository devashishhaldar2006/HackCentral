import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "../components/ui/Skeleton";
import axios from "axios";
import { BASE_URL } from "../lib/constants";
import { DOMAINS, containerVariants, cardVariants } from "../lib/resourceUtils";

const ResourceHub = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeDomain, setActiveDomain] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        setError(null);
        let url = `${BASE_URL}/resources`;
        const params = new URLSearchParams();
        if (activeDomain !== "All") params.append("domain", activeDomain);
        if (debouncedQuery) params.append("q", debouncedQuery);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const { data } = await axios.get(url, { withCredentials: true });
        if (data.success) {
          setResources(data.resources);
        }
      } catch (err) {
        console.error("Failed to fetch resources:", err);
        setError("Failed to load resources. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [activeDomain, debouncedQuery]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e] pt-8 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4"
          >
            Developer <span className="text-[#0d4af2]">Resource Hub</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto"
          >
            Discover APIs, datasets, starter templates, and tools to accelerate your hackathon projects.
          </motion.p>
        </div>

        {/* Search and Filters */}
        <div className="mb-10 space-y-6">
          <div className="max-w-xl mx-auto relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
              search
            </span>
            <input
              type="text"
              placeholder="Search technologies, services, or tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161d2f] text-slate-800 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0d4af2]/50 focus:border-[#0d4af2] transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {DOMAINS.map((domain) => (
              <button
                key={domain}
                onClick={() => setActiveDomain(domain)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeDomain === domain
                    ? "bg-[#0d4af2] text-white shadow-md shadow-[#0d4af2]/30"
                    : "bg-white dark:bg-[#161d2f] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#0d4af2]/50 hover:text-[#0d4af2]"
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col bg-white dark:bg-[#161d2f] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 gap-4">
                <div className="flex justify-between items-start">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <Skeleton className="w-16 h-6 rounded-full" />
                </div>
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="w-full h-12" />
                <div className="mt-auto pt-4 flex gap-2">
                  <Skeleton className="w-16 h-6 rounded-full" />
                  <Skeleton className="w-16 h-6 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-5xl text-red-400 mb-3 block">error</span>
            <p className="text-red-500 font-semibold">{error}</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#161d2f] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4 block">
              search_off
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No resources found</h3>
            <p className="text-slate-500 dark:text-slate-400">
              Try adjusting your search query or selecting a different domain.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveDomain("All");
              }}
              className="mt-6 text-[#0d4af2] font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {resources.map((resource) => (
              <motion.div
                key={resource._id}
                variants={cardVariants}
                className="group flex flex-col bg-white dark:bg-[#161d2f] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-[#0d4af2]/10 transition-all duration-300 overflow-hidden"
              >
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {resource.type}
                    </span>
                    {resource.pricing === "Free" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">
                        Free
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md">
                        Paid
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#0d4af2] transition-colors line-clamp-2">
                    {resource.title}
                  </h3>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-3 flex-1">
                    {resource.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                    {resource.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                    {resource.tags?.length > 3 && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        +{resource.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-[#111726] flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">
                      business
                    </span>
                    {resource.provider || "Community"}
                  </span>
                  
                  <Link
                    to={`/resources/${resource._id}`}
                    className="flex items-center gap-1 text-[#0d4af2] text-sm font-bold hover:underline"
                  >
                    View Details
                    <span className="material-symbols-outlined text-[16px]">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResourceHub;
