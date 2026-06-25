import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../../lib/constants";
import { Spinner } from "../ui/Spinner";

export const ParticipantsModal = ({ isOpen, onClose, event }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && event) {
      const fetchParticipants = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get(`${BASE_URL}/events/${event._id}/participants`, {
            withCredentials: true,
          });
          setParticipants(data.data);
          setError(null);
        } catch (err) {
          setError(err.response?.data?.message || "Failed to load participants");
        } finally {
          setLoading(false);
        }
      };

      fetchParticipants();
    }
  }, [isOpen, event]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800/60">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Event Participants
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                {event?.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Spinner />
                <p className="text-sm text-slate-500 dark:text-slate-400">Loading participants...</p>
              </div>
            ) : error ? (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 shrink-0">error</span>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            ) : participants.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-3">group_off</span>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Participants Yet</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Check back later when users RSVP.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2 mb-2">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Total: {participants.length}
                  </span>
                </div>
                {participants.map((p) => (
                  <div key={p._id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#1a2235] border border-slate-200 dark:border-slate-700/50">
                    <img src={p.avatar} alt={p.fullName} className="w-12 h-12 rounded-full object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {p.fullName}
                        {p.teamName && (
                          <span className="ml-2 px-2 py-0.5 bg-[#0d4af2]/10 text-[#0d4af2] text-[10px] uppercase font-black rounded-md">
                            Team: {p.teamName}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{p.email}</p>
                      {(p.college || p.location) && (
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-2 truncate">
                          {p.college && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">school</span> {p.college}</span>}
                          {p.location && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">location_on</span> {p.location}</span>}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
