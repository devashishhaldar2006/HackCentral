import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-12 px-4 bg-white dark:bg-[#101522]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-[#0d4af2]">
            <div className="w-6 h-6">
              <svg
                fill="currentColor"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" />
              </svg>
            </div>
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
