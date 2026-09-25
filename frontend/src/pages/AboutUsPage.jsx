import React from 'react';
import { Link } from 'react-router-dom';

const AboutUsPage = () => {
  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="pt-16 pb-14 px-4 border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="yellow-badge mb-2">ABOUT HACKCENTRAL</div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            The Story Behind <span className="text-yellow-500">HackCentral</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A developer platform created to connect ambitious builders with world-class hackathons and engineering opportunities.
          </p>
        </div>
      </section>

      {/* The Creator & The Vision */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Meet the Developer</h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-sm sm:text-base">
              <p>
                Hi, I'm <strong className="text-slate-900">Devashish Haldar</strong>, the creator and developer behind HackCentral. I am currently pursuing my B.Tech in Computer Science and Engineering (AI & Machine Learning) at Pranveer Singh Institute of Technology, Kanpur.
              </p>
              <p>
                The idea for HackCentral started from personal experience. As a developer participating in hackathons, finding verified events, connecting with reliable teammates, and preparing presentations was often disjointed and difficult.
              </p>
              <p>
                I engineered HackCentral from the ground up as a unified workspace where developers can discover high-impact competitions, evaluate ideas in the Project Lab, and build collaboratively.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="https://github.com/devashishhaldar2006" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all">
                <span className="material-symbols-outlined text-base">code</span>
                GitHub
              </a>
              <a href="https://linkedin.com/in/devashish-haldar-dev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-slate-950 hover:bg-yellow-300 rounded-xl text-xs font-bold transition-all shadow-sm">
                <span className="material-symbols-outlined text-base">work</span>
                LinkedIn
              </a>
              <a href="mailto:workfordevashishhaldar@gmail.com" className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-colors">
                <span className="material-symbols-outlined text-base">mail</span>
                Email
              </a>
            </div>
          </div>
          
          {/* Developer Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="w-24 h-24 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6 border border-yellow-200 overflow-hidden">
              <img 
                src="https://i.postimg.cc/5tQzM4zt/WANO-LUFFY.jpg" 
                alt="Devashish Haldar" 
                className="w-full h-full object-cover" 
              />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">Devashish Haldar</h3>
            <p className="text-yellow-600 text-xs font-bold uppercase tracking-wider mb-6">Full-Stack Developer</p>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Core Tech Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'WebSockets', 'AI/ML'].map(tech => (
                    <span key={tech} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-sm text-yellow-600">location_on</span>
                  Lucknow, Uttar Pradesh, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Developers & Organizers */}
      <section className="py-16 px-4 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10">
            <div className="yellow-badge mb-3">FOR PARTICIPANTS</div>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">For Developers</h2>
            <ul className="space-y-3 mb-8 text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-yellow-600 text-base shrink-0">check_circle</span>
                <span>Discover hackathons, workshops, and coding contests globally.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-yellow-600 text-base shrink-0">check_circle</span>
                <span>Evaluate and structure project decks in the Project Lab.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-yellow-600 text-base shrink-0">check_circle</span>
                <span>Track badges, activity heatmaps, and RSVP statuses.</span>
              </li>
            </ul>
            <Link to="/events" className="btn-yellow">
              Explore Events
            </Link>
          </div>
          
          <div className="bg-yellow-50/50 border border-yellow-200 rounded-3xl p-8 sm:p-10">
            <div className="yellow-badge mb-3">FOR HOSTS</div>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">For Organizers</h2>
            <ul className="space-y-3 mb-8 text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-yellow-600 text-base shrink-0">check_circle</span>
                <span>Publish events to a community of 50,000+ passionate builders.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-yellow-600 text-base shrink-0">check_circle</span>
                <span>Access real-time registration analytics and participant dashboards.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-yellow-600 text-base shrink-0">check_circle</span>
                <span>Post live announcements directly to registered hackers.</span>
              </li>
            </ul>
            <Link to="/signin?mode=signup" className="btn-white">
              Host an Event
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;