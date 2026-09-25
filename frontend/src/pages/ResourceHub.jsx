import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-10 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="yellow-badge mb-3">CURATED DEV TOOLS</div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            Resource <span className="text-yellow-500">Hub</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Discover APIs, datasets, starter templates, and tools to accelerate your hackathon submissions.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-10 space-y-5">
          <div className="max-w-xl mx-auto relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 text-xl">
              search
            </span>
            <input
              type="text"
              placeholder="Search technologies, services, or APIs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm shadow-sm focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {DOMAINS.map((domain) => (
              <button
                key={domain}
                onClick={() => setActiveDomain(domain)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeDomain === domain
                    ? "bg-yellow-400 text-slate-950 font-bold shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-yellow-400 hover:text-slate-900"
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
              <div key={i} className="flex flex-col bg-white rounded-2xl border border-slate-200 p-5 gap-4 animate-pulse">
                <div className="flex justify-between items-start">
                  <Skeleton className="w-12 h-12 rounded-xl bg-slate-100" />
                  <Skeleton className="w-16 h-6 rounded-full bg-slate-100" />
                </div>
                <Skeleton className="w-3/4 h-5 bg-slate-100" />
                <Skeleton className="w-full h-12 bg-slate-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <span className="material-symbols-outlined text-5xl text-red-400 mb-3 block">error</span>
            <p className="text-red-500 text-sm font-semibold">{error}</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <span className="material-symbols-outlined text-5xl text-yellow-400 mb-4 block">
              search_off
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No resources found</h3>
            <p className="text-slate-500 text-xs sm:text-sm">
              Adjust your search keywords or explore another domain filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveDomain("All");
              }}
              className="mt-5 text-yellow-600 font-bold text-xs hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resources.map((resource) => (
              <div
                key={resource._id}
                className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-yellow-400 transition-all duration-300 overflow-hidden"
              >
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {resource.type}
                    </span>
                    {resource.pricing === "Free" ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Free
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded-md">
                        Paid
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-yellow-600 transition-colors line-clamp-2">
                    {resource.title}
                  </h3>
                  
                  <p className="text-xs text-slate-600 mb-4 line-clamp-3 flex-1 leading-relaxed">
                    {resource.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4 mt-auto">
                    {resource.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5 truncate max-w-[130px]">
                    <span className="material-symbols-outlined text-sm text-yellow-600">
                      business
                    </span>
                    {resource.provider || "Community"}
                  </span>
                  
                  <Link
                    to={`/resources/${resource._id}`}
                    className="flex items-center gap-1 text-yellow-600 text-xs font-bold hover:underline"
                  >
                    <span>View</span>
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceHub;
