import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../lib/constants";
import Logo from "../assets/Logo.jsx";
import { Spinner } from "../components/Spinner.jsx";
import { getPasswordStrength } from "../components/PasswordStrength.jsx";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1 = Request OTP, 2 = Verify OTP & Reset
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const pwStrength = useMemo(
    () => getPasswordStrength(formData.newPassword),
    [formData.newPassword],
  );

  const handleChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
    setMessage("");
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(
        BASE_URL + "/auth/send-otp",
        { email: formData.email.trim() },
        { withCredentials: true }
      );
      setMessage(res.data.message || "OTP sent to your email.");
      setFormData((f) => ({ ...f, otp: "" }));
      setStep(2);
    } catch (err) {
      if (!err?.response && err?.message === "Network Error") {
        setError(
          "Unable to reach the server. Please check your connection and try again."
        );
      } else {
        setError(
          err?.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.otp.trim() || !formData.newPassword) {
      setError("Please fill out all fields.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(
        BASE_URL + "/auth/verify-otp",
        {
          email: formData.email.trim(),
          otp: formData.otp.trim(),
          newPassword: formData.newPassword,
        },
        { withCredentials: true }
      );
      setMessage(res.data.message || "Password reset successfully. Redirecting...");
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err) {
      if (!err?.response && err?.message === "Network Error") {
        setError(
          "Unable to reach the server. Please check your connection and try again."
        );
      } else {
        setError(
          err?.response?.data?.message ||
            "Failed to reset password. Please try again or request a new OTP."
        );
      }
    } finally {
      setLoading(false);
    }
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
                Reset Password
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {step === 1
                  ? "Enter your email to receive a password reset OTP."
                  : `We've sent an OTP to ${formData.email}.`}
              </p>
            </div>

            {/* ── Form ── */}
            <form onSubmit={step === 1 ? handleSendOTP : handleResetPassword} className="space-y-4">
              
              {step === 1 && (
                <div className="space-y-1.5" style={{ animation: "slide-up 0.3s ease-out" }}>
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
              )}

              {step === 2 && (
                <>
                  <div className="space-y-1.5" style={{ animation: "slide-up 0.3s ease-out" }}>
                    <label
                      htmlFor="otp"
                      className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      Enter OTP
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                        pin
                      </span>
                      <input
                        id="otp"
                        name="otp"
                        type="text"
                        placeholder="6-digit OTP"
                        value={formData.otp}
                        onChange={handleChange}
                        required
                        className="input-focus-glow w-full h-12 pl-11 pr-4 bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 rounded-xl focus:border-[#0d4af2] focus:bg-white dark:focus:bg-slate-800/60 outline-none transition-all duration-200 placeholder:text-slate-400 text-sm tracking-widest font-mono"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5" style={{ animation: "slide-up 0.3s ease-out" }}>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="newPassword"
                        className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                      >
                        New Password
                      </label>
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                        lock
                      </span>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.newPassword}
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

                    {/* Password strength bar */}
                    {formData.newPassword && (
                      <div className="pt-1.5 space-y-1" style={{ animation: "slide-up 0.2s ease-out" }}>
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
                </>
              )}

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

              {/* Message */}
              {message && (
                <div
                  className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-900/15 border border-emerald-200/60 dark:border-emerald-800/40 backdrop-blur-sm"
                  style={{ animation: "slide-up 0.25s ease-out" }}
                >
                  <span className="material-symbols-outlined text-emerald-500 text-lg mt-0.5 shrink-0">
                    check_circle
                  </span>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium leading-snug">
                    {message}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
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
                    <span>{step === 1 ? "Send OTP" : "Reset Password"}</span>
                    <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform duration-200">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </form>

            {step === 2 && (
              <div className="flex justify-between items-center mt-5 px-1" style={{ animation: "slide-up 0.3s ease-out" }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[13px] text-[#0d4af2] hover:underline font-medium"
                >
                  Change Email
                </button>
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="text-[13px] text-[#0d4af2] hover:underline font-medium disabled:opacity-50 disabled:no-underline"
                >
                  Resend OTP
                </button>
              </div>
            )}

            <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
              Remember your password?{" "}
              <Link
                to="/signin"
                className="text-[#0d4af2] font-bold hover:underline cursor-pointer transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ForgotPassword;