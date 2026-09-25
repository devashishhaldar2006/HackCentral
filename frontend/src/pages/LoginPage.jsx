import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../lib/firebase";
import { addUser } from "../lib/userSlice";
import { BASE_URL } from "../lib/constants";
import Logo from "../components/icons/Logo.jsx";
import GoogleIcon from "../components/icons/GoogleIcon.jsx";
import GitHubIcon from "../components/icons/GitHubIcon.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import { getPasswordStrength } from "../lib/passwordStrength";

const LoginPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(
    searchParams.get("mode") === "signup",
  );
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user",
  });

  useEffect(() => {
    setIsSignUp(searchParams.get("mode") === "signup");
  }, [searchParams]);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  const dispatch = useDispatch();

  const pwStrength = useMemo(
    () => (isSignUp ? getPasswordStrength(formData.password) : { score: 0 }),
    [formData.password, isSignUp],
  );

  const handleChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSocialLogin = async (provider, name) => {
    setSocialLoading(name);
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const res = await axios.post(
        BASE_URL + "/auth/social-login",
        { idToken, role: formData.role },
        { withCredentials: true },
      );
      dispatch(addUser(res.data.data));
    } catch (err) {
      const code = err?.code;
      if (code === "auth/account-exists-with-different-credential") {
        setError("An account already exists with this email using a different sign-in method.");
      } else if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        // silent
      } else if (code === "auth/popup-blocked") {
        setError("Pop-up was blocked by your browser. Please enable pop-ups and try again.");
      } else if (code === "auth/network-request-failed") {
        setError("Network error. Please check your internet connection.");
      } else {
        setError(err?.response?.data?.message || "Social sign-in failed. Please try again.");
      }
    } finally {
      setSocialLoading("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (isSignUp && formData.fullName.trim().length < 2) {
      setError("Please enter your full name.");
      setLoading(false);
      return;
    }

    try {
      const endpoint = isSignUp ? "/auth/signup" : "/auth/signin";
      const payload = isSignUp
        ? {
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            password: formData.password,
            role: formData.role,
          }
        : { email: formData.email.trim(), password: formData.password };
      const res = await axios.post(BASE_URL + endpoint, payload, {
        withCredentials: true,
      });
      dispatch(addUser(res.data.data));
    } catch (err) {
      if (!err?.response && err?.message === "Network Error") {
        setError("Unable to reach the server. Please check your connection.");
      } else if (err?.response?.status === 409) {
        setError("An account with this email already exists. Try signing in instead.");
      } else if (err?.response?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(err?.response?.data?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    const newMode = !isSignUp;
    setIsSignUp(newMode);
    setError("");
    setFormData({ fullName: "", email: "", password: "", role: "user" });
    setSearchParams(newMode ? { mode: "signup" } : {}, { replace: true });
  };

  return (
    <section className="flex-1 flex items-center justify-center relative overflow-hidden min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4">
      {/* Soft yellow ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-yellow-200/40 blur-[100px] pointer-events-none" />

      {/* Card container */}
      <div className="relative z-10 w-full max-w-[440px] mx-auto">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-lg">
          {/* Logo + Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center font-bold">
                <Logo className="w-4.5 h-4.5 text-slate-950" color="#020617" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">
                HackCentral
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              {isSignUp ? "Join 50,000+ developers building projects" : "Sign in to access your dashboard"}
            </p>
          </div>

          {/* Social Sign-in */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              id="google-signin"
              disabled={!!socialLoading}
              onClick={() => handleSocialLogin(googleProvider, "google")}
              className="flex items-center justify-center gap-2 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              {socialLoading === "google" ? <Spinner /> : <GoogleIcon />}
              <span>Google</span>
            </button>
            <button
              type="button"
              id="github-signin"
              disabled={!!socialLoading}
              onClick={() => handleSocialLogin(githubProvider, "github")}
              className="flex items-center justify-center gap-2 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              {socialLoading === "github" ? <Spinner /> : <GitHubIcon />}
              <span>GitHub</span>
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-[11px] uppercase tracking-wider text-slate-400 bg-white font-medium">
                or use email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Devashish Haldar"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:border-yellow-400 focus:bg-white transition-all"
                />
              </div>
            )}

            {isSignUp && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">
                  Role
                </label>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={formData.role === "user"}
                      onChange={handleChange}
                      className="accent-yellow-400"
                    />
                    <span className="text-xs font-medium text-slate-700">Participant</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="organizer"
                      checked={formData.role === "organizer"}
                      onChange={handleChange}
                      className="accent-yellow-400"
                    />
                    <span className="text-xs font-medium text-slate-700">Organizer</span>
                  </label>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:border-yellow-400 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-600">
                  Password
                </label>
                {!isSignUp && (
                  <Link
                    to="/forgot-password"
                    className="text-xs text-yellow-600 hover:underline font-medium"
                  >
                    Forgot Password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full h-11 px-3.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:border-yellow-400 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-sm">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="w-full h-11 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {loading ? (
                <Spinner />
              ) : (
                <span>{isSignUp ? "Create Account" : "Sign In"}</span>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center text-xs text-slate-500">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-yellow-600 font-bold hover:underline cursor-pointer ml-1"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
