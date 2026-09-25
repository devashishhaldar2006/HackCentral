import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchEvents } from "../api/events";
import { STATS, STEPS, TESTIMONIALS } from "../api/homeData";
import EventCard from "../components/ui/EventCard";
import InteractiveBackgroundVideo from "../components/ui/InteractiveBackgroundVideo";

const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await fetchEvents({ sort: "newest", limit: 6 });
        setFeaturedEvents(res.data);
      } catch {
        setFeaturedEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };
    loadFeatured();
  }, []);

  return (
    <div className="relative w-full bg-white text-slate-900">
      {/* ───────── HERO SECTION ───────── */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden border-b border-slate-100">
        {/* Interactive Video Background on Pure White */}
        <InteractiveBackgroundVideo />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="yellow-badge mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span>GLOBAL HACKATHON PLATFORM</span>
            <span className="text-yellow-600/40">•</span>
            <span>50,000+ DEVELOPERS</span>
          </div>

          {/* Clean Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-4xl">
            Where Developers <br />
            <span className="relative inline-block text-slate-900">
              Build & Compete
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-yellow-300/60 -z-10 rounded"></span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-slate-600 text-lg sm:text-xl max-w-2xl font-normal leading-relaxed">
            Discover hackathons worldwide, evaluate concepts in the Project Lab, and connect with teammates to win awards.
          </p>

          {/* Call to Actions */}
          <div className="mt-9 flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/signin?mode=signup"
              id="hero-get-started"
              className="btn-yellow"
            >
              <span>Get Started Free</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
            <Link
              to="/events"
              id="hero-explore"
              className="btn-white"
            >
              <span className="material-symbols-outlined text-lg text-yellow-600">
                explore
              </span>
              <span>Browse Hackathons</span>
            </Link>
          </div>

          {/* Stats Cards in White & Yellow Minimalist Accent */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 text-left shadow-sm hover:border-yellow-400 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-yellow-700 text-xl">
                    {s.icon}
                  </span>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-yellow-600 transition-colors">
                  {s.value}
                </p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FEATURED EVENTS ───────── */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="yellow-badge mb-2">🔥 HAPPENING NOW</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured Hackathons
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Hand-picked competitions with global prize pools and active registrations.
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-bold text-yellow-600 hover:text-yellow-700 transition-colors"
          >
            <span>View All Events</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {eventsLoading
            ? [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 animate-pulse"
                >
                  <div className="h-44 bg-slate-100 rounded-xl"></div>
                  <div className="h-5 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                </div>
              ))
            : featuredEvents.slice(0, 6).map((event, idx) => (
                <EventCard key={event._id} event={event} idx={idx} />
              ))}
        </div>
      </section>

      {/* ───────── HOW IT WORKS ───────── */}
      <section className="w-full py-20 px-4 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="yellow-badge mb-2">SIMPLE WORKFLOW</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How HackCentral Works
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              From discovering opportunities to pitching your solution and winning prizes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                className="bg-white border border-slate-200/80 rounded-2xl p-7 relative shadow-sm hover:border-yellow-400 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-yellow-400/20 text-yellow-800 flex items-center justify-center mb-6 font-bold text-lg group-hover:bg-yellow-400 transition-colors">
                  <span className="material-symbols-outlined text-2xl text-yellow-800 group-hover:text-slate-900">
                    {s.icon}
                  </span>
                </div>
                <div className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-1">
                  STEP 0{i + 1}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── TESTIMONIALS ───────── */}
      <section className="w-full py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="yellow-badge mb-2">COMMUNITY REPUTATION</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Loved by Developers
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Join thousands of developers worldwide accelerating their careers on HackCentral.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:border-yellow-400 transition-all"
            >
              <div>
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6">
                  "{t.text}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full border border-yellow-300 bg-yellow-50"
                />
                <div>
                  <p className="font-bold text-slate-900 text-sm">
                    {t.name}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── CALL TO ACTION ───────── */}
      <section className="w-full py-16 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-yellow-50 via-white to-yellow-100/50 border border-yellow-200 rounded-3xl p-10 sm:p-14 text-center shadow-sm">
          <div className="max-w-2xl mx-auto space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Ready to Build Your Next Big Idea?
            </h2>
            <p className="text-slate-600 text-base">
              Join HackCentral today to discover competitions, evaluate projects with AI, and showcase your achievements.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signin?mode=signup"
                id="cta-signup"
                className="btn-yellow"
              >
                <span>Create Free Account</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
              <Link
                to="/events"
                className="btn-white"
              >
                <span>Explore Events</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
