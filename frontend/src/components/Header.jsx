import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-[#f5f6f8]/80 dark:bg-[#101522]/80 backdrop-blur-md px-4 lg:px-20 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-[#0d4af2]">
          <div className="w-8 h-8">
            <svg
              fill="currentColor"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" />
            </svg>
          </div>
          <Link to="/" className="text-slate-900 dark:text-white text-xl font-black leading-tight tracking-tight">
            HackCentral
          </Link>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/events"
            className="text-slate-600 dark:text-slate-300 hover:text-[#0d4af2] dark:hover:text-[#0d4af2] transition-colors text-sm font-semibold"
          >
            Find Hackathons
          </Link>
          <Link
            to="/teamfinder"
            className="text-slate-600 dark:text-slate-300 hover:text-[#0d4af2] dark:hover:text-[#0d4af2] transition-colors text-sm font-semibold"
          >
            Team Finder
          </Link>
          <Link
            to="/about"
            className="text-slate-600 dark:text-slate-300 hover:text-[#0d4af2] dark:hover:text-[#0d4af2] transition-colors text-sm font-semibold"
          >
            About Us
          </Link>
        </nav>

        {/* Actions (Unauthenticated) */}
        <div className="flex items-center gap-4">
          <Link
            to="/signin"
            className="hidden sm:inline-flex text-slate-600 dark:text-slate-300 hover:text-[#0d4af2] font-semibold text-sm transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="bg-[#0d4af2] hover:bg-[#0d4af2]/90 text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-[#0d4af2]/20 text-sm"
          >
            Get Started
          </Link>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pb-4 border-t border-slate-200 dark:border-slate-800 pt-4">
          <nav className="flex flex-col gap-3 px-2">
            <Link
              to="/events"
              className="text-slate-600 dark:text-slate-300 hover:text-[#0d4af2] transition-colors text-sm font-semibold py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Hackathons
            </Link>
            <Link
              to="/teamfinder"
              className="text-slate-600 dark:text-slate-300 hover:text-[#0d4af2] transition-colors text-sm font-semibold py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Team Finder
            </Link>
            <Link
              to="/about"
              className="text-slate-600 dark:text-slate-300 hover:text-[#0d4af2] transition-colors text-sm font-semibold py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/signin"
              className="text-slate-600 dark:text-slate-300 hover:text-[#0d4af2] transition-colors text-sm font-semibold py-2 sm:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log In
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
