import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { BASE_URL } from "../lib/constants";

const ResourceDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResourceDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${BASE_URL}/resources/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch resource details:", err);
        setError("Failed to load resource details. It might have been removed.");
      } finally {
        setLoading(false);
      }
    };
    
    // Scroll to top when ID changes
    window.scrollTo(0, 0);
    fetchResourceDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0a0f1e]">
        <div className="w-12 h-12 border-4 border-[#0d4af2]/30 border-t-[#0d4af2] rounded-full animate-spin" />
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">Loading resource details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0a0f1e] px-4">
        <span className="material-symbols-outlined text-6xl text-red-400 mb-4">error</span>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Resource Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 text-center max-w-md">
          {error || "We couldn't find the resource you were looking for."}
        </p>
        <Link
          to="/resources"
          className="bg-[#0d4af2] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#0d4af2]/90 transition-colors shadow-lg shadow-[#0d4af2]/20"
        >
          Back to Resource Hub
        </Link>
      </div>
    );
  }

  const { resource, relatedResources } = data;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e] pt-6 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          to="/resources"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#0d4af2] transition-colors mb-8"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Resource Hub
        </Link>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#161d2f] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-black/20 overflow-hidden mb-10"
        >
          <div className="p-8 sm:p-10">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-[#0d4af2]/10 dark:bg-[#0d4af2]/20 text-[#0d4af2] text-xs font-black uppercase tracking-wider rounded-lg">
                {resource.domain}
              </span>
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-black uppercase tracking-wider rounded-lg">
                {resource.type}
              </span>
              {resource.pricing === "Free" ? (
                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider rounded-lg">
                  Free
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider rounded-lg">
                  Paid
                </span>
              )}
            </div>

            {/* Title & Description */}
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
              {resource.title}
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              {resource.description}
            </p>

            {/* Meta Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-[#1c2438] border border-slate-100 dark:border-slate-700/60 mb-8">
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                  Provider
                </p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">business</span>
                  {resource.provider || "Community"}
                </p>
              </div>
              
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                  Difficulty
                </p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">speed</span>
                  {resource.difficulty}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                  Tags
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {resource.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="flex justify-center sm:justify-start">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0d4af2] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#0d4af2]/90 hover:-translate-y-0.5 transition-all shadow-lg shadow-[#0d4af2]/25"
              >
                Access Resource
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Related Resources */}
        {relatedResources && relatedResources.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0d4af2]">auto_awesome</span>
              Related {resource.domain} Resources
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedResources.map((rel) => (
                <Link
                  to={`/resources/${rel._id}`}
                  key={rel._id}
                  className="bg-white dark:bg-[#161d2f] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:shadow-[#0d4af2]/10 hover:border-[#0d4af2]/30 transition-all group flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-black uppercase tracking-wider rounded">
                      {rel.type}
                    </span>
                    {rel.pricing === "Free" && (
                      <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-wider rounded">
                        Free
                      </span>
                    )}
                  </div>
                  
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2 group-hover:text-[#0d4af2] transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-auto">
                    {rel.description}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResourceDetails;
