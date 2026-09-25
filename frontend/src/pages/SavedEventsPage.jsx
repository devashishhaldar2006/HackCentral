import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import EventCard from "../components/ui/EventCard";
import { EventCardSkeleton } from "../components/ui/Skeleton";

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
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-10 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="yellow-badge mb-2">SAVED EVENTS</div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Bookmarked <span className="text-yellow-500">Hackathons</span>
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Events you've saved for future participation.
            </p>
          </div>
          <Link
            to="/events"
            className="btn-white self-start sm:self-auto text-xs py-2 px-4"
          >
            <span className="material-symbols-outlined text-base text-yellow-600">search</span>
            <span>Browse More</span>
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <span className="material-symbols-outlined text-5xl text-red-400 mb-3 block">
              error
            </span>
            <p className="text-red-500 text-sm font-semibold">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-5 bg-white rounded-3xl border border-slate-200 text-center p-8 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-yellow-600">
                bookmark_border
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                No saved events yet
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm max-w-sm">
                Browse hackathons and click the bookmark icon to keep track of upcoming events.
              </p>
            </div>
            <Link
              to="/events"
              className="btn-yellow"
            >
              <span className="material-symbols-outlined text-sm">search</span>
              <span>Browse Events</span>
            </Link>
          </div>
        )}

        {/* Events grid */}
        {!loading && !error && events.length > 0 && (
          <>
            <p className="text-xs font-semibold text-slate-500 mb-6 uppercase">
              {events.length} SAVED {events.length === 1 ? "EVENT" : "EVENTS"}
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
