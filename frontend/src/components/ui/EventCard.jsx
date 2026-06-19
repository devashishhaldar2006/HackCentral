import {
  GRADIENTS,
  CATEGORY_COLORS,
  MODE_COLORS,
  formatDateRange,
} from "../../lib/eventUtils";

const EventCard = ({ event, idx }) => {
  return (
    <div
      className="group bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-[#0d4af2]/50 transition-all duration-300 flex flex-col shadow-sm hover:shadow-xl hover:shadow-[#0d4af2]/5 hover:-translate-y-1"
    >
      {/* Card header image or gradient */}
      <div
        className={`relative h-44 w-full bg-gradient-to-br ${GRADIENTS[idx % GRADIENTS.length]} overflow-hidden`}
      >
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        {/* decorative circles (only show if there is no image) */}
        {!event.image && (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 right-4 w-24 h-24 border-2 border-white/30 rounded-full"></div>
            <div className="absolute bottom-6 right-8 w-16 h-16 border-2 border-white/20 rounded-full"></div>
            <div className="absolute top-8 left-1/2 w-12 h-12 border border-white/20 rounded-lg rotate-45"></div>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          <span
            className={`${CATEGORY_COLORS[event.category] || "bg-slate-600"} text-white text-[10px] uppercase font-black px-2.5 py-1 rounded-md`}
          >
            {event.category}
          </span>
          <span
            className={`${MODE_COLORS[event.mode] || "bg-slate-600"} text-white text-[10px] uppercase font-black px-2.5 py-1 rounded-md`}
          >
            {event.mode}
          </span>
        </div>
        {event.price && (
          <div className="absolute top-3 right-3 z-10">
             <span
               className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-md ${
                 event.price === "Free"
                   ? "bg-emerald-500/90 text-white"
                   : "bg-amber-500/90 text-white"
               }`}
             >
               {event.price}
             </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#0d4af2] transition-colors leading-tight line-clamp-2">
            {event.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">
              calendar_today
            </span>
            {formatDateRange(event.startDate, event.endDate)}
          </p>
          {event.location && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">
                location_on
              </span>
              {event.location}
            </p>
          )}
        </div>

        {event.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {event.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-bold py-1 px-2.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
          {event.tags?.length > 3 && (
            <span className="text-[10px] font-bold py-1 px-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">
              +{event.tags.length - 3}
            </span>
          )}
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">business</span>
            {event.organizer}
          </span>
          {event.registrationLink && (
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0d4af2]/10 text-[#0d4af2] hover:bg-[#0d4af2] hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer inline-flex items-center gap-1"
            >
              Register
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
