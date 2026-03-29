import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../lib/firebase";
import { addUser } from "../lib/userSlice";
import { BASE_URL } from "../lib/constants";
import Logo from "../assets/Logo.jsx";
import GoogleIcon from "../assets/GoogleIcon.jsx";
import GitHubIcon from "../assets/GitHubIcon.jsx";
import { Spinner } from "../components/Spinner.jsx";
import { getPasswordStrength } from "../components/PasswordStrength.jsx";

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

  // Sync with URL if user navigates here with ?mode=signup
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
      // Firebase auth errors
      if (code === "auth/account-exists-with-different-credential") {
        setError(
          "An account already exists with this email using a different sign-in method.",
        );
      } else if (
        code === "auth/popup-closed-by-user" ||
        code === "auth/cancelled-popup-request"
      ) {
        // User closed popup — silently ignore
      } else if (code === "auth/popup-blocked") {
        setError(
          "Pop-up was blocked by your browser. Please enable pop-ups and try again.",
        );
      } else if (code === "auth/network-request-failed") {
        setError("Network error. Please check your internet connection.");
      } else if (!err?.response && err?.message === "Network Error") {
        // Server unreachable
        setError(
          "Unable to reach the server. Please make sure the backend is running.",
        );
      } else {
        setError(
          err?.response?.data?.message ||
            "Social sign-in failed. Please try again.",
        );
      }
    } finally {
      setSocialLoading("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Frontend validation before hitting API
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
        setError(
          "Unable to reach the server. Please check your connection and try again.",
        );
      } else if (err?.response?.status === 409) {
        setError(
          "An account with this email already exists. Try signing in instead.",
        );
      } else if (err?.response?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(
          err?.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
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
    // Keep URL in sync
    setSearchParams(newMode ? { mode: "signup" } : {}, { replace: true });
  };

  return (
    <section className="flex-1 flex items-center justify-center relative overflow-hidden min-h-[calc(100vh-64px)] bg-[#f5f6f8] dark:bg-[#080c18]">
      {/* ─── animated grid background ─── */}
      <div className="login-grid-bg absolute inset-0 pointer-events-none" />

      {/* ─── floating orbs ─── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none">
        {/* Orbiting dot 1 */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ animation: "orbit 25s linear infinite" }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#0d4af2] shadow-[0_0_20px_6px_rgba(13,74,242,0.4)]" />
        </div>
        {/* Orbiting dot 2 */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ animation: "orbit-reverse 18s linear infinite" }}
        >
          <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_16px_4px_rgba(139,92,246,0.4)]" />
        </div>
        {/* Orbiting dot 3 */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            animation: "orbit 32s linear infinite",
            animationDelay: "-8s",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_14px_4px_rgba(6,182,212,0.35)]" />
        </div>
        {/* Centre pulse */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full border border-[#0d4af2]/10 dark:border-[#0d4af2]/15"
          style={{ animation: "pulse-ring 4s ease-in-out infinite" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full border border-purple-500/8 dark:border-purple-500/12"
          style={{ animation: "pulse-ring 5s ease-in-out infinite 1s" }}
        />
      </div>

      {/* ─── ambient blurs ─── */}
      <div className="absolute top-[-10%] right-[-5%] w-[420px] h-[420px] rounded-full bg-[#0d4af2]/8 dark:bg-[#0d4af2]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-8%] left-[-5%] w-[380px] h-[380px] rounded-full bg-purple-600/6 dark:bg-purple-600/12 blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-[15%] w-[200px] h-[200px] rounded-full bg-cyan-400/5 dark:bg-cyan-400/8 blur-[80px] pointer-events-none" />

      {/* ═══════════ CARD ═══════════ */}
      <div className="relative z-10 w-full max-w-[480px] mx-4 login-card-enter">
        {/* Gradient border card wrapper */}
        <div className="gradient-border rounded-2xl">
          <div className="bg-white/80 dark:bg-[#111827]/85 backdrop-blur-xl rounded-2xl p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
            {/* ── Logo + heading ── */}
            <div className="text-center mb-8">
              <Link
                to="/"
                className="inline-flex items-center gap-2.5 mb-6 group"
              >
                <div className="w-9 h-9 text-[#0d4af2] transition-transform group-hover:scale-110">
                  <Logo className="w-9 h-9" />
                </div>
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  HackCentral
                </span>
              </Link>

              <h1 className="text-[28px] sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {isSignUp ? "Create your account" : "Welcome back"}
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {isSignUp
                  ? "Join 50,000+ developers building the future of tech"
                  : "Sign in to continue to your account"}
              </p>
            </div>

            {/* ── Social login ── */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                id="google-signin"
                disabled={!!socialLoading}
                onClick={() => handleSocialLogin(googleProvider, "google")}
                className="social-btn flex items-center justify-center gap-2.5 h-12 rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {socialLoading === "google" ? <Spinner /> : <GoogleIcon />}
                Google
              </button>
              <button
                type="button"
                id="github-signin"
                disabled={!!socialLoading}
                onClick={() => handleSocialLogin(githubProvider, "github")}
                className="social-btn flex items-center justify-center gap-2.5 h-12 rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {socialLoading === "github" ? <Spinner /> : <GitHubIcon />}
                GitHub
              </button>
            </div>

            {/* ── Divider ── */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-[11px] uppercase tracking-[0.15em] font-semibold text-slate-400 bg-white/80 dark:bg-[#111827]/85 backdrop-blur-xl">
                  or use email
                </span>
              </div>
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full name */}
              {isSignUp && (
                <div
                  className="space-y-1.5"
                  style={{ animation: "slide-up 0.3s ease-out" }}
                >
                  <label
                    htmlFor="fullName"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                      person
                    </span>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="input-focus-glow w-full h-12 pl-11 pr-4 bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 rounded-xl focus:border-[#0d4af2] focus:bg-white dark:focus:bg-slate-800/60 outline-none transition-all duration-200 placeholder:text-slate-400 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Role Selection (Sign Up only) */}
              {isSignUp && (
                <div
                  className="space-y-1.5"
                  style={{ animation: "slide-up 0.3s ease-out" }}
                >
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    I am a
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${formData.role === "user" ? "border-[#0d4af2] bg-[#0d4af2]/10" : "border-slate-300 dark:border-slate-600"}`}
                      >
                        {formData.role === "user" && (
                          <div className="w-2 h-2 rounded-full bg-[#0d4af2]" />
                        )}
                      </div>
                      <input
                        type="radio"
                        name="role"
                        value="user"
                        checked={formData.role === "user"}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <span
                        className={`text-sm font-semibold transition-colors ${formData.role === "user" ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
                      >
                        Participant
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${formData.role === "organizer" ? "border-[#0d4af2] bg-[#0d4af2]/10" : "border-slate-300 dark:border-slate-600"}`}
                      >
                        {formData.role === "organizer" && (
                          <div className="w-2 h-2 rounded-full bg-[#0d4af2]" />
                        )}
                      </div>
                      <input
                        type="radio"
                        name="role"
                        value="organizer"
                        checked={formData.role === "organizer"}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <span
                        className={`text-sm font-semibold transition-colors ${formData.role === "organizer" ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
                      >
                        Organizer
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                >
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                    mail
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-focus-glow w-full h-12 pl-11 pr-4 bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 rounded-xl focus:border-[#0d4af2] focus:bg-white dark:focus:bg-slate-800/60 outline-none transition-all duration-200 placeholder:text-slate-400 text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    Password
                  </label>
                  {!isSignUp && (
                    <Link
                      to="/forgot-password"
                      className="text-xs text-[#0d4af2] font-semibold hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                    lock
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="input-focus-glow w-full h-12 pl-11 pr-12 bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 rounded-xl focus:border-[#0d4af2] focus:bg-white dark:focus:bg-slate-800/60 outline-none transition-all duration-200 placeholder:text-slate-400 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>

                {/* Password strength bar (sign-up only) */}
                {isSignUp && formData.password && (
                  <div
                    className="pt-1.5 space-y-1"
                    style={{ animation: "slide-up 0.2s ease-out" }}
                  >
                    <div className="flex gap-1 h-1 rounded-full overflow-hidden">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            i <= pwStrength.score
                              ? pwStrength.color
                              : "bg-slate-200 dark:bg-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {pwStrength.label && (
                        <>
                          Password strength:{" "}
                          <span
                            className={`${pwStrength.score >= 3 ? "text-emerald-500" : pwStrength.score >= 2 ? "text-amber-500" : "text-red-500"}`}
                          >
                            {pwStrength.label}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div
                  className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50/80 dark:bg-red-900/15 border border-red-200/60 dark:border-red-800/40 backdrop-blur-sm"
                  style={{ animation: "slide-up 0.25s ease-out" }}
                >
                  <span className="material-symbols-outlined text-red-500 text-lg mt-0.5 shrink-0">
                    error
                  </span>
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium leading-snug">
                    {error}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                id="login-submit"
                disabled={loading}
                className="relative w-full h-12 bg-[#0d4af2] text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer group overflow-hidden hover:shadow-[0_8px_30px_-6px_rgba(13,74,242,0.5)] active:scale-[0.98]"
              >
                {/* sheen effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  style={{ animation: "shimmer 2s ease-in-out infinite" }}
                />

                {loading ? (
                  <>
                    <Spinner />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                    <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform duration-200">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* ── Toggle mode ── */}
            <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-[#0d4af2] font-bold hover:underline cursor-pointer transition-colors"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>

        {/* ── Terms ── */}
        <p className="mt-6 text-center text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
          By continuing, you agree to HackCentral's{" "}
          <Link
            to="#"
            className="underline hover:text-[#0d4af2] transition-colors"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            to="#"
            className="underline hover:text-[#0d4af2] transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
