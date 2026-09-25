import { useState } from "react";
import Logo from "../icons/Logo.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { removeUser } from "../../lib/userSlice";
import { BASE_URL } from "../../lib/constants";
import NotificationBell from "./NotificationBell";

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
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 lg:px-12 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo in Bright Yellow */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center font-black group-hover:scale-105 transition-transform shadow-sm">
            <Logo className="w-4.5 h-4.5 text-slate-950" color="#020617" />
          </div>
          <span className="text-slate-900 text-xl font-bold tracking-tight flex items-center gap-1">
            HackCentral
            <span className="inline-block w-2 h-2 rounded-full bg-yellow-400"></span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {(!user || user.role === "user") && (
            <>
              <Link
                to="/events"
                className="text-slate-600 hover:text-yellow-600 transition-colors text-sm font-medium"
              >
                Find Hackathons
              </Link>
              <Link
                to="/projectlab"
                className="text-slate-600 hover:text-yellow-600 transition-colors text-sm font-medium"
              >
                Project Lab
              </Link>
              <Link
                to="/resources"
                className="text-slate-600 hover:text-yellow-600 transition-colors text-sm font-medium"
              >
                Resource Hub
              </Link>
            </>
          )}
          <Link
            to="/aboutus"
            className="text-slate-600 hover:text-yellow-600 transition-colors text-sm font-medium"
          >
            About Us
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            /* Logged-in State */
            <>
              <div className="block">
                <NotificationBell />
              </div>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                >
                  <img
                    src={
                      user.avatar ||
                      "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=1480"
                    }
                    alt="Profile"
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-yellow-400/50"
                  />
                  <span className="hidden sm:block text-xs font-semibold text-slate-800 max-w-[120px] truncate capitalize">
                    {user.fullName || "User"}
                  </span>
                  <span className="material-symbols-outlined text-slate-400 text-base">
                    {profileDropdownOpen ? "expand_less" : "expand_more"}
                  </span>
                </button>

                {/* Dropdown menu */}
                {profileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl py-2">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900 capitalize truncate">
                          {user.fullName || "User"}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        to={user?.role === "organizer" ? "/organizer/dashboard" : "/dashboard"}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">
                          dashboard
                        </span>
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">
                          person
                        </span>
                        My Profile
                      </Link>
                      {(!user || user.role !== "organizer") && (
                        <Link
                          to="/saved"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">
                            bookmark
                          </span>
                          Saved Events
                        </Link>
                      )}

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            handleSignOut();
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors w-full cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base">
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
            /* Logged-out State */
            <>
              <Link
                to="/signin"
                className="hidden sm:inline-flex text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signin?mode=signup"
                className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-5 py-2 rounded-xl font-bold transition-all text-xs shadow-sm hover:shadow"
              >
                Get Started
              </Link>
            </>
          )}

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-950"
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
        <div className="md:hidden mt-3 pb-4 border-t border-slate-100 pt-4 bg-white rounded-xl px-2">
          <nav className="flex flex-col gap-1">
            {(!user || user.role === "user") && (
              <>
                <Link
                  to="/events"
                  className="text-slate-700 hover:text-yellow-700 hover:bg-yellow-50 text-sm font-medium py-2.5 px-3 rounded-lg"
                  onClick={closeMobile}
                >
                  Find Hackathons
                </Link>
                <Link
                  to="/projectlab"
                  className="text-slate-700 hover:text-yellow-700 hover:bg-yellow-50 text-sm font-medium py-2.5 px-3 rounded-lg"
                  onClick={closeMobile}
                >
                  Project Lab
                </Link>
                <Link
                  to="/resources"
                  className="text-slate-700 hover:text-yellow-700 hover:bg-yellow-50 text-sm font-medium py-2.5 px-3 rounded-lg"
                  onClick={closeMobile}
                >
                  Resource Hub
                </Link>
              </>
            )}
            <Link
              to="/aboutus"
              className="text-slate-700 hover:text-yellow-700 hover:bg-yellow-50 text-sm font-medium py-2.5 px-3 rounded-lg"
              onClick={closeMobile}
            >
              About Us
            </Link>

            {user ? (
              <>
                <div className="border-t border-slate-100 my-2" />
                <Link
                  to={user?.role === "organizer" ? "/organizer/dashboard" : "/dashboard"}
                  className="text-slate-700 hover:text-yellow-700 hover:bg-yellow-50 text-sm font-medium py-2.5 px-3 rounded-lg"
                  onClick={closeMobile}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="text-slate-700 hover:text-yellow-700 hover:bg-yellow-50 text-sm font-medium py-2.5 px-3 rounded-lg"
                  onClick={closeMobile}
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    closeMobile();
                    handleSignOut();
                  }}
                  className="text-red-600 hover:bg-red-50 text-left text-sm font-medium py-2.5 px-3 rounded-lg transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-slate-100 my-2" />
                <Link
                  to="/signin"
                  className="text-slate-700 hover:text-slate-900 text-sm font-medium py-2.5 px-3 rounded-lg"
                  onClick={closeMobile}
                >
                  Log In
                </Link>
                <Link
                  to="/signin?mode=signup"
                  className="bg-yellow-400 text-slate-950 text-center text-sm font-bold py-2.5 px-3 rounded-lg"
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
