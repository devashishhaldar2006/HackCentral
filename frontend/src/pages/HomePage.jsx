import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { EVENTS } from "../api/data";
import heroImage from "../assets/hero-bg.png";
import { STATS, STEPS, TESTIMONIALS } from "../api/homeData";

const HomePage = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* ───────── HERO ───────── */}
      <section className="relative w-full overflow-hidden bg-[#060c1f]">
        {/* background image overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060c1f]/60 via-[#060c1f]/80 to-[#060c1f]"></div>
        </div>

        {/* animated gradient orbs */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-[#0d4af2]/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/15 blur-[100px] animate-pulse delay-1000"></div>

        <div
          className={`relative z-10 max-w-7xl mx-auto px-4 pt-24 pb-28 md:pt-36 md:pb-40 flex flex-col items-center text-center transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0d4af2]/15 border border-[#0d4af2]/30 text-[#5b8def] text-xs font-bold uppercase tracking-wider mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0d4af2] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0d4af2]"></span>
            </span>
            Trusted by 50,000+ Developers
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight max-w-4xl">
            Where Builders{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d4af2] via-blue-400 to-cyan-400">
              Connect
            </span>
            <br />& Innovations{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400">
              Begin
            </span>
          </h1>

          <p className="mt-6 text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed">
            Discover hackathons, find dream teammates, and build projects that
            launch careers — all on one platform designed for the next
            generation of developers.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              to="/signin?mode=signup"
              id="hero-get-started"
              className="group relative px-8 py-4 bg-[#0d4af2] hover:bg-[#0b3fd4] text-white font-bold rounded-xl shadow-2xl shadow-[#0d4af2]/30 transition-all duration-300 hover:shadow-[#0d4af2]/50 hover:-translate-y-0.5 text-base flex items-center gap-2"
            >
              Get Started — It's Free
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
            <Link
              to="/events"
              id="hero-explore"
              className="px-8 py-4 border border-slate-700 hover:border-[#0d4af2]/50 text-slate-300 hover:text-white font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 text-base flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">explore</span>
              Explore Hackathons
            </Link>
          </div>

          {/* hero stat bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 w-full max-w-3xl">
            {STATS.map((s) => (
              <div key={s.label} className="text-center space-y-1">
                <span className="material-symbols-outlined text-[#0d4af2] text-3xl">
                  {s.icon}
                </span>
                <p className="text-2xl md:text-3xl font-black text-white">
                  {s.value}
                </p>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FEATURED EVENTS ───────── */}
      <section className="w-full py-20 px-4 bg-[#f5f6f8] dark:bg-[#0a0f1e]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <span className="inline-block text-[#0d4af2] font-bold text-sm uppercase tracking-wider mb-2">
                🔥 Trending Now
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Featured Events
              </h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-lg">
                Hand-picked hackathons and workshops happening soon. Don't miss
                out on your chance to build, learn and win.
              </p>
            </div>
            <Link
              to="/events"
              className="mt-4 md:mt-0 text-[#0d4af2] hover:text-[#0b3fd4] font-bold text-sm flex items-center gap-1 transition-colors"
            >
              View All Events
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {EVENTS.slice(0, 6).map((event) => (
              <div
                key={event.id}
                className="group bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-[#0d4af2]/50 transition-all duration-300 flex flex-col shadow-sm hover:shadow-xl hover:shadow-[#0d4af2]/5 hover:-translate-y-1"
              >
                {/* Card header gradient */}
                <div
                  className={`relative h-44 w-full bg-gradient-to-br ${event.bgGradient} overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  {/* decorative circles */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 right-4 w-24 h-24 border-2 border-white/30 rounded-full"></div>
                    <div className="absolute bottom-6 right-8 w-16 h-16 border-2 border-white/20 rounded-full"></div>
                    <div className="absolute top-8 left-1/2 w-12 h-12 border border-white/20 rounded-lg rotate-45"></div>
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`${event.typeColor} text-white text-[10px] uppercase font-black px-2.5 py-1 rounded-md`}
                    >
                      {event.type}
                    </span>
                    <span
                      className={`${event.modeColor} text-white text-[10px] uppercase font-black px-2.5 py-1 rounded-md`}
                    >
                      {event.mode}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5 flex-1 flex flex-col gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#0d4af2] transition-colors leading-tight">
                      {event.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        calendar_today
                      </span>
                      {event.date}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold py-1 px-2.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
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
        </div>
      </section>

      {/* ───────── HOW IT WORKS ───────── */}
      <section className="w-full py-20 px-4 bg-white dark:bg-[#101522]">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block text-[#0d4af2] font-bold text-sm uppercase tracking-wider mb-2">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            How HackCentral Works
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            From sign-up to submission, we've streamlined every step so you can
            focus on what matters — building.
          </p>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                className="group relative bg-[#f5f6f8] dark:bg-[#0a0f1e] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 hover:border-[#0d4af2]/40 transition-all duration-300 hover:-translate-y-1"
              >
                {/* step number */}
                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#0d4af2] text-white text-xs font-black flex items-center justify-center shadow-lg shadow-[#0d4af2]/30">
                  {i + 1}
                </span>
                <div className="w-14 h-14 rounded-xl bg-[#0d4af2]/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-[#0d4af2]/20 transition-colors">
                  <span className="material-symbols-outlined text-[#0d4af2] text-3xl">
                    {s.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── TESTIMONIALS ───────── */}
      <section className="w-full py-20 px-4 bg-[#f5f6f8] dark:bg-[#0a0f1e]">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block text-[#0d4af2] font-bold text-sm uppercase tracking-wider mb-2">
            Community Love
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            What Developers Say
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Join thousands of developers who have accelerated their careers
            through HackCentral.
          </p>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-left hover:border-[#0d4af2]/30 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg"
              >
                {/* star row */}
                <div className="flex gap-1 mb-4 text-amber-400">
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
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"
                  />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                      {t.name}
                    </p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CTA BANNER ───────── */}
      <section className="w-full py-20 px-4 bg-white dark:bg-[#101522]">
        <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d4af2] via-[#1e5af5] to-[#3b6ff7] p-12 md:p-16 text-center shadow-2xl shadow-[#0d4af2]/20">
          {/* deco */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Ready to Build Something
              <br />
              <span className="text-cyan-200">Extraordinary?</span>
            </h2>
            <p className="mt-4 text-blue-100/80 text-lg max-w-xl mx-auto">
              Join 50,000+ developers already winning hackathons, finding
              teammates, and launching careers on HackCentral.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signin?mode=signup"
                id="cta-signup"
                className="px-8 py-4 bg-white text-[#0d4af2] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 justify-center"
              >
                Join HackCentral
                <span className="material-symbols-outlined text-lg">
                  arrow_forward
                </span>
              </Link>
              <Link
                to="/events"
                className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-xl transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5"
              >
                Browse Events
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
