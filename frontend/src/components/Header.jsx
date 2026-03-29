import { useState } from "react";
import Logo from "../assets/Logo.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { removeUser } from "../lib/userSlice";
import { BASE_URL } from "../lib/constants";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await axios.post(
        BASE_URL + "/auth/signout",
        {},
        { withCredentials: true },
      );
      dispatch(removeUser());
      navigate("/signin");
    } catch {
      dispatch(removeUser());
      navigate("/signin");
    }
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-[#f5f6f8]/80 dark:bg-[#101522]/80 backdrop-blur-md px-4 lg:px-20 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-[#0d4af2]">
          <Logo className="w-8 h-8" />
          <span className="text-slate-900 dark:text-white text-xl font-black leading-tight tracking-tight">
            HackCentral
          </span>
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

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            /* ───── Logged-in State ───── */
            <>
              {/* Notifications bell */}
              <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                <span className="material-symbols-outlined text-xl">
                  notifications
                </span>
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <img
                    src={
                      user.avatar ||
                      "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=1480"
                    }
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-[#0d4af2]/30"
                  />
                  <span className="hidden sm:block text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[120px] truncate capitalize">
                    {user.fullName || "User"}
                  </span>
                  <span className="material-symbols-outlined text-slate-400 text-lg">
                    {profileDropdownOpen ? "expand_less" : "expand_more"}
                  </span>
                </button>

                {/* Dropdown menu */}
                {profileDropdownOpen && (
                  <>
                    {/* Backdrop to close */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 z-50 bg-white dark:bg-[#1a2035] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl shadow-slate-200/30 dark:shadow-black/30 py-2 animate-[fadeIn_0.15s_ease-out]">
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/50">
                        <p className="text-sm font-bold text-slate-800 dark:text-white capitalize truncate">
                          {user.fullName || "User"}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        to={user?.role === "organizer" ? "/organizer/dashboard" : "/user/events"}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">
                          dashboard
                        </span>
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">
                          person
                        </span>
                        My Profile
                      </Link>
                      <Link
                        to="/bookmarks"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">
                          bookmark
                        </span>
                        Saved Events
                      </Link>

                      <div className="border-t border-slate-100 dark:border-slate-700/50 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            handleSignOut();
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-lg">
                            logout
                          </span>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            /* ───── Logged-out State ───── */
            <>
              <Link
                to="/signin"
                className="hidden sm:inline-flex text-slate-600 dark:text-slate-300 hover:text-[#0d4af2] font-semibold text-sm transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signin?mode=signup"
                className="bg-[#0d4af2] hover:bg-[#0d4af2]/90 text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-[#0d4af2]/20 text-sm"
              >
                Get Started
              </Link>
            </>
          )}

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
          <nav className="flex flex-col gap-1 px-2">
            <Link
              to="/events"
              className="text-slate-600 dark:text-slate-300 hover:text-[#0d4af2] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-semibold py-2.5 px-3 rounded-lg"
              onClick={closeMobile}
            >
              Find Hackathons
            </Link>
            <Link
              to="/teamfinder"
              className="text-slate-600 dark:text-slate-300 hover:text-[#0d4af2] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-semibold py-2.5 px-3 rounded-lg"
              onClick={closeMobile}
            >
              Team Finder
            </Link>
            <Link
              to="/about"
              className="text-slate-600 dark:text-slate-300 hover:text-[#0d4af2] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-semibold py-2.5 px-3 rounded-lg"
              onClick={closeMobile}
            >
              About Us
            </Link>

            {user ? (
              <>
                <div className="border-t border-slate-200 dark:border-slate-700 my-2" />
                <Link
                  to={user?.role === "organizer" ? "/organizer/dashboard" : "/user/events"}
                  className="text-slate-600 dark:text-slate-300 hover:text-[#0d4af2] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-semibold py-2.5 px-3 rounded-lg"
                  onClick={closeMobile}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="text-slate-600 dark:text-slate-300 hover:text-[#0d4af2] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-semibold py-2.5 px-3 rounded-lg"
                  onClick={closeMobile}
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    closeMobile();
                    handleSignOut();
                  }}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-left text-sm font-semibold py-2.5 px-3 rounded-lg transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-slate-200 dark:border-slate-700 my-2" />
                <Link
                  to="/signin"
                  className="text-slate-600 dark:text-slate-300 hover:text-[#0d4af2] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-semibold py-2.5 px-3 rounded-lg"
                  onClick={closeMobile}
                >
                  Log In
                </Link>
                <Link
                  to="/signin?mode=signup"
                  className="bg-[#0d4af2] text-white text-center text-sm font-bold py-2.5 px-3 rounded-lg"
                  onClick={closeMobile}
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
