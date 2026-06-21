import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import EventCard from "../components/ui/EventCard";

const SavedEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = useSelector((state) => state.user?._id);

  useEffect(() => {
    if (!userId) return;

    const fetchSavedEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get("/api/saved", {
          withCredentials: true,
        });
        setEvents(data.savedEvents || []);
      } catch (err) {
        console.error("Failed to load saved events:", err);
        setError("Could not load your saved events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedEvents();
  }, [userId]);


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e] pt-8 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-3xl text-[#0d4af2]">
              bookmark
            </span>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Saved Events
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Events you've bookmarked for later
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-[#0d4af2]/30 border-t-[#0d4af2] rounded-full animate-spin"></div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Loading your saved events…
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <span className="material-symbols-outlined text-5xl text-red-400 mb-3 block">
                error
              </span>
              <p className="text-red-500 font-semibold">{error}</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="w-20 h-20 rounded-full bg-[#0d4af2]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-[#0d4af2]">
                bookmark_border
              </span>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                No saved events yet
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
                Browse hackathons and click the bookmark icon to save events
                you're interested in.
              </p>
            </div>
            <Link
              to="/events"
              className="mt-2 inline-flex items-center gap-2 bg-[#0d4af2] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0d4af2]/90 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">search</span>
              Browse Events
            </Link>
          </div>
        )}

        {/* Events grid */}
        {!loading && !error && events.length > 0 && (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              {events.length} saved{" "}
              {events.length === 1 ? "event" : "events"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, idx) => (
                <EventCard key={event._id} event={event} idx={idx} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SavedEventsPage;
