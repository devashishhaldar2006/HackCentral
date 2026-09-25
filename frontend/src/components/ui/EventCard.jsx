import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  CATEGORY_COLORS,
  MODE_COLORS,
  formatDateRange,
} from "../../lib/eventUtils";
import { RSVPModal } from "./RSVPModal";

const EventCard = ({ event, idx }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const bookmarkedIds = useSelector(
    (state) => state.user?.bookmarkedEvents || []
  );
  const isBookmarked = bookmarkedIds.some(
    (id) => id?.toString() === event._id?.toString()
  );
  
  const registeredIds = useSelector(
    (state) => state.user?.registeredEvents || []
  );
  const isRegistered = registeredIds.some(
    (id) => id?.toString() === event._id?.toString()
  );

  const [loading, setLoading] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [participantCount, setParticipantCount] = useState(
    event.participants ? event.participants.length : 0
  );

  const handleRSVPClick = (e) => {
    e.stopPropagation();
    if (!user) return;
    setIsRSVPModalOpen(true);
  };

  const handleConfirmRSVP = async (teamName) => {
    setRsvpLoading(true);
    try {
      const { data } = await axios.post(`/api/events/${event._id}/register`, { teamName }, { withCredentials: true });
      dispatch({ type: "user/setRegisteredEvents", payload: data.registeredEvents });
      setIsRSVPModalOpen(false);
      setParticipantCount((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to RSVP:", error);
      alert(error.response?.data?.message || "Failed to register for the event");
    } finally {
      setRsvpLoading(false);
    }
  };

  const toggleBookmark = async (e) => {
    e.stopPropagation();
    if (!user) return;
    setLoading(true);
    try {
      const url = isBookmarked ? "/api/saved/unsave" : "/api/saved/save";
      const { data } = await axios.post(url, { eventId: event._id }, { withCredentials: true });
      dispatch({ type: "user/setBookmarkedEvents", payload: data.bookmarkedEvents });
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-yellow-400 transition-all duration-300 flex flex-col shadow-sm hover:shadow-lg hover:-translate-y-1">
      {/* Card header image or light banner */}
      <div className="relative h-44 w-full bg-yellow-50 overflow-hidden">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center select-none bg-gradient-to-br from-yellow-100 to-amber-50">
            <span className="text-xl font-bold text-yellow-900/40">
              {event.title}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          <span
            className="bg-yellow-400 text-slate-950 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md shadow-sm"
          >
            {event.category}
          </span>
          <span
            className="bg-white/90 text-slate-800 text-[10px] font-bold uppercase px-2 py-1 rounded-md backdrop-blur-sm"
          >
            {event.mode}
          </span>
        </div>

        {/* Price badge */}
        {event.price && (
          <div className="absolute bottom-3 right-3 z-10">
            <span
              className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md shadow-sm ${
                event.price === "Free"
                  ? "bg-emerald-500 text-white"
                  : "bg-yellow-400 text-slate-950"
              }`}
            >
              {event.price}
            </span>
          </div>
        )}

        {/* Bookmark button */}
        {user && (
          <button
            onClick={toggleBookmark}
            disabled={loading}
            title={isBookmarked ? "Remove bookmark" : "Save event"}
            className={`absolute top-3 right-3 z-10 p-1.5 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
              isBookmarked
                ? "bg-yellow-400 text-slate-950 shadow-md"
                : "bg-black/30 hover:bg-yellow-400 hover:text-slate-950 text-white"
            } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <span className="material-symbols-outlined text-base leading-none block">
              {isBookmarked ? "bookmark" : "bookmark_add"}
            </span>
          </button>
        )}
      </div>

      {/* Card body */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-yellow-600 transition-colors leading-snug line-clamp-2">
            {event.title}
          </h3>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 font-medium">
            <span className="material-symbols-outlined text-sm text-yellow-600">
              calendar_today
            </span>
            {formatDateRange(event.startDate, event.endDate)}
          </p>
          {event.location && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-sm text-yellow-600">
                location_on
              </span>
              {event.location}
            </p>
          )}
        </div>

        {event.description && (
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {event.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-semibold py-0.5 px-2 rounded-md bg-slate-100 text-slate-600"
            >
              #{tag}
            </span>
          ))}
          {event.tags?.length > 3 && (
            <span className="text-[10px] font-semibold py-0.5 px-1.5 rounded-md bg-slate-100 text-slate-400">
              +{event.tags.length - 3}
            </span>
          )}
        </div>

        {/* Footer info & RSVP CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1 truncate max-w-[130px]">
            <span className="material-symbols-outlined text-sm text-yellow-600">business</span>
            {event.organizer}
          </span>
          <div className="flex gap-2">
            {event.registrationLink ? (
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="bg-yellow-50 text-yellow-800 hover:bg-yellow-400 hover:text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1"
              >
                <span>Link</span>
                <span className="material-symbols-outlined text-xs">
                  open_in_new
                </span>
              </a>
            ) : user ? (
              <button
                onClick={handleRSVPClick}
                disabled={rsvpLoading || isRegistered}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer ${
                  isRegistered
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                    : "bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-sm"
                } ${rsvpLoading ? "opacity-60 cursor-wait" : ""}`}
              >
                {isRegistered ? (
                  <>
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Registered
                  </>
                ) : (
                  <>
                    <span>RSVP</span>
                    {participantCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-black/15 rounded text-[9px]">
                        {participantCount}
                      </span>
                    )}
                  </>
                )}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <RSVPModal
        isOpen={isRSVPModalOpen}
        onClose={() => setIsRSVPModalOpen(false)}
        onConfirm={handleConfirmRSVP}
        loading={rsvpLoading}
        eventTitle={event.title}
      />
    </div>
  );
};

export default EventCard;
