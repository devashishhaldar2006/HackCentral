import { Link } from "react-router-dom";
import Logo from "../assets/Logo.jsx";

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-12 px-4 bg-white dark:bg-[#101522]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-[#0d4af2]">
            <Logo className="w-6 h-6" />
            <h2 className="text-slate-900 dark:text-white text-lg font-bold">
              HackCentral
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-sm">
            The world's leading platform for developer collaboration and
            innovation. Join 50k+ developers building the future.
          </p>
        </div>

        {/* Platform Links */}
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-4">
            Platform
          </h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li>
              <Link
                className="hover:text-[#0d4af2] transition-colors"
                to="/events"
              >
                Find Hackathons
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-[#0d4af2] transition-colors"
                to="/teamfinder"
              >
                Team Finder
              </Link>
            </li>
            <li>
              <Link className="hover:text-[#0d4af2] transition-colors" to="#">
                Workshops
              </Link>
            </li>
            <li>
              <Link className="hover:text-[#0d4af2] transition-colors" to="#">
                Resources
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-4">
            Support
          </h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li>
              <Link className="hover:text-[#0d4af2] transition-colors" to="#">
                Help Center
              </Link>
            </li>
            <li>
              <Link className="hover:text-[#0d4af2] transition-colors" to="#">
                Partner with us
              </Link>
            </li>
            <li>
              <Link className="hover:text-[#0d4af2] transition-colors" to="#">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link className="hover:text-[#0d4af2] transition-colors" to="#">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
        <p>© 2026 HackCentral. All rights reserved.</p>
        <div className="flex gap-4 items-center">
          <span className="material-symbols-outlined text-sm">language</span>
          <span>English (US)</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
