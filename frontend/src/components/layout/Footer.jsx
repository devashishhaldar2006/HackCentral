import { Link } from "react-router-dom";
import Logo from "../icons/Logo.jsx";

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 py-14 px-4 bg-white text-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center font-bold">
              <Logo className="w-4.5 h-4.5 text-slate-950" color="#020617" />
            </div>
            <span className="text-slate-900 text-xl font-bold tracking-tight">
              HackCentral
            </span>
          </div>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
            The world's leading hackathon community and project workspace. Discover events, formulate teams, and ship extraordinary ideas.
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-full w-fit">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
            <span>50,000+ Active Builders Worldwide</span>
          </div>
        </div>

        {/* Platform Links */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            Platform
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-600">
            <li>
              <Link className="hover:text-yellow-600 transition-colors" to="/events">
                Find Hackathons
              </Link>
            </li>
            <li>
              <Link className="hover:text-yellow-600 transition-colors" to="/projectlab">
                Project Lab
              </Link>
            </li>
            <li>
              <Link className="hover:text-yellow-600 transition-colors" to="/resources">
                Resource Hub
              </Link>
            </li>
            <li>
              <Link className="hover:text-yellow-600 transition-colors" to="/aboutus">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Community & Support */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            Developer
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Built by Devashish Haldar for the global developer ecosystem.
          </p>
          <div className="space-y-2 text-xs text-slate-600">
            <a href="https://github.com/devashishhaldar2006" target="_blank" rel="noopener noreferrer" className="block hover:text-yellow-600 transition-colors">
              GitHub Repository
            </a>
            <a href="https://linkedin.com/in/devashish-haldar-dev" target="_blank" rel="noopener noreferrer" className="block hover:text-yellow-600 transition-colors">
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 mt-10 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <p>© 2026 HackCentral. All rights reserved.</p>
        <div className="flex gap-6 items-center">
          <span className="hover:text-slate-900 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-slate-900 cursor-pointer">Terms of Service</span>
          <span className="text-yellow-600 font-semibold">Global Hackathon Network</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
