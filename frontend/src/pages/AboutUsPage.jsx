import React from 'react';
import { Link } from 'react-router-dom';

const AboutUsPage = () => {
  return (
    <div className="bg-slate-50 dark:bg-[#0a0f1e] min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101522]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            The story behind <span className="text-[#0d4af2]">HackCentral</span>.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A solo-developed platform built to connect passionate builders with world-class hackathons, workshops, and tech events.
          </p>
        </div>
      </section>

      {/* The Creator & The Vision */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Meet the Developer</h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                Hi, I'm <strong className="text-slate-900 dark:text-white">Devashish Haldar</strong>, the sole creator and developer behind HackCentral. I am currently pursuing my B.Tech in Computer Science and Engineering (AI and Machine Learning) at Pranveer Singh Institute of Technology, Kanpur.
              </p>
              <p>
                The idea for HackCentral started from a personal frustration. As a developer participating in hackathons, I found it incredibly difficult to keep track of upcoming events, find reliable teammates, and discover high-quality tech opportunities. Information was always scattered.
              </p>
              <p>
                I decided to build a solution. Using my experience as a Full-Stack Developer, I engineered HackCentral from the ground up to be a unified workspace where developers can easily find events, and organizers can effortlessly manage them.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a href="https://github.com/devashishhaldar2006" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                <span className="material-symbols-outlined">code</span>
                GitHub
              </a>
              <a href="https://linkedin.com/in/devashish-haldar-dev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg font-semibold hover:bg-[#004182] transition-colors">
                <span className="material-symbols-outlined">work</span>
                LinkedIn
              </a>
              <a href="mailto:workfordevashishhaldar@gmail.com" className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined">mail</span>
                Email Me
              </a>
            </div>
          </div>
          
          {/* Developer Card */}
          <div className="bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="w-24 h-24 bg-[#0d4af2]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#0d4af2]/20 overflow-hidden">
              <img 
                src="https://i.postimg.cc/5tQzM4zt/WANO-LUFFY.jpg" 
                alt="Devashish Haldar" 
                className="w-full h-full object-cover" 
              />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Devashish Haldar</h3>
            <p className="text-[#0d4af2] font-semibold mb-6">Full-Stack Developer</p>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Tech Stack Used</p>
                <div className="flex flex-wrap gap-2">
                  {['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'JavaScript'].map(tech => (
                    <span key={tech} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  Lucknow, Uttar Pradesh, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Who */}
      <section className="py-20 px-4 bg-white dark:bg-[#101522] border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0d4af2] rounded-3xl p-10 md:p-14 text-white">
            <h2 className="text-3xl font-bold mb-6">For Developers</h2>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined shrink-0">check_circle</span>
                <span>Discover hackathons, workshops, and tech conferences worldwide.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined shrink-0">check_circle</span>
                <span>Find skilled teammates for your next big project.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined shrink-0">check_circle</span>
                <span>Build your portfolio and connect with industry leaders.</span>
              </li>
            </ul>
            <Link to="/events" className="inline-block px-6 py-3 bg-white text-[#0d4af2] font-bold rounded-lg hover:bg-slate-50 transition-colors">
              Find Events
            </Link>
          </div>
          
          <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-10 md:p-14 text-white">
            <h2 className="text-3xl font-bold mb-6">For Organizers</h2>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined shrink-0 text-slate-400">check_circle</span>
                <span className="text-slate-300">Reach a targeted audience of passionate developers.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined shrink-0 text-slate-400">check_circle</span>
                <span className="text-slate-300">Manage registrations and event details effortlessly.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined shrink-0 text-slate-400">check_circle</span>
                <span className="text-slate-300">Boost your event's visibility within the tech ecosystem.</span>
              </li>
            </ul>
            <Link to="/signin?mode=signup" className="inline-block px-6 py-3 bg-slate-800 dark:bg-slate-700 text-white border border-slate-700 dark:border-slate-600 font-bold rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors">
              Become an Organizer
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUsPage;