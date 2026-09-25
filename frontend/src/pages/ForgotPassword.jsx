import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../lib/constants";
import Logo from "../components/icons/Logo.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import { getPasswordStrength } from "../lib/passwordStrength";

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
  const [otpAttempts, setOtpAttempts] = useState(0);

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
    setOtpAttempts(0);

    try {
      const res = await axios.post(
        BASE_URL + "/auth/send-otp",
        { email: formData.email.trim() },
        { withCredentials: true },
      );
      setMessage(res.data.message || "OTP sent to your email.");
      setFormData((f) => ({ ...f, otp: "" }));
      setStep(2);
    } catch (err) {
      if (!err?.response && err?.message === "Network Error") {
        setError(
          "Unable to reach the server. Please check your connection and try again.",
        );
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
        { withCredentials: true },
      );
      setMessage(
        res.data.message || "Password reset successfully. Redirecting...",
      );
      setOtpAttempts(0);
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err) {
      if (!err?.response && err?.message === "Network Error") {
        setError(
          "Unable to reach the server. Please check your connection and try again.",
        );
      } else if (err?.response?.status === 429) {
        setOtpAttempts(5);
        setError(
          err?.response?.data?.message ||
            "Too many incorrect attempts. Please request a new OTP.",
        );
      } else {
        const newAttempts = otpAttempts + 1;
        setOtpAttempts(newAttempts);
        const remainingAttempts = 5 - newAttempts;

        let errorMsg =
          err?.response?.data?.message ||
          "Failed to reset password. Please try again or request a new OTP.";

        if (remainingAttempts > 0 && remainingAttempts < 5) {
          errorMsg += ` (${remainingAttempts} attempts remaining)`;
        }

        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex-1 flex items-center justify-center relative overflow-hidden min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4">
      {/* Soft yellow ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-yellow-200/40 blur-[100px] pointer-events-none" />

      {/* ═══════════ CARD ═══════════ */}
      <div className="relative z-10 w-full max-w-[440px] mx-auto login-card-enter">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-lg">
          {/* ── Logo + heading ── */}
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 mb-4 group"
            >
              <div className="w-8 h-8 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center font-bold">
                <Logo className="w-4.5 h-4.5 text-slate-950" color="#020617" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">
                HackCentral
              </span>
            </Link>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Reset Password
            </h1>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                {step === 1
                  ? "Enter your email to receive a password reset OTP."
                  : `We've sent an OTP to ${formData.email}.`}
              </p>
            </div>

            {/* ── Form ── */}
            <form
              onSubmit={step === 1 ? handleSendOTP : handleResetPassword}
              className="space-y-4"
            >
              {step === 1 && (
                <div
                  className="space-y-1.5"
                  style={{ animation: "slide-up 0.3s ease-out" }}
                >
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-500"
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
                      className="input-focus-glow w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-yellow-400 focus:bg-white outline-none transition-all duration-200 placeholder:text-slate-400 text-sm"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <>
                  <div
                    className="space-y-1.5"
                    style={{ animation: "slide-up 0.3s ease-out" }}
                  >
                    <label
                      htmlFor="otp"
                      className="text-xs font-semibold uppercase tracking-wider text-slate-500"
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
                        className="input-focus-glow w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-yellow-400 focus:bg-white outline-none transition-all duration-200 placeholder:text-slate-400 text-sm tracking-widest font-mono"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div
                    className="space-y-1.5"
                    style={{ animation: "slide-up 0.3s ease-out" }}
                  >
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="newPassword"
                        className="text-xs font-semibold uppercase tracking-wider text-slate-500"
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
                        className="input-focus-glow w-full h-12 pl-11 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:border-yellow-400 focus:bg-white outline-none transition-all duration-200 placeholder:text-slate-400 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>

                    {/* Password strength bar */}
                    {formData.newPassword && (
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
                                  : "bg-slate-200"
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
                  className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200"
                  style={{ animation: "slide-up 0.25s ease-out" }}
                >
                  <span className="material-symbols-outlined text-red-500 text-lg mt-0.5 shrink-0">
                    error
                  </span>
                  <p className="text-sm text-red-600 font-medium leading-snug">
                    {error}
                  </p>
                </div>
              )}

              {/* Message */}
              {message && (
                <div
                  className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200"
                  style={{ animation: "slide-up 0.25s ease-out" }}
                >
                  <span className="material-symbols-outlined text-emerald-500 text-lg mt-0.5 shrink-0">
                    check_circle
                  </span>
                  <p className="text-sm text-emerald-600 font-medium leading-snug">
                    {message}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || otpAttempts >= 5}
                className="w-full h-11 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {loading ? (
                  <>
                    <Spinner />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{step === 1 ? "Send OTP" : "Reset Password"}</span>
                    <span className="material-symbols-outlined text-base">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </form>

            {step === 2 && (
              <div
                className="flex justify-between items-center mt-5 px-1"
                style={{ animation: "slide-up 0.3s ease-out" }}
              >
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-yellow-600 hover:underline font-semibold"
                >
                  Change Email
                </button>
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="text-xs text-yellow-600 hover:underline font-semibold disabled:opacity-50 disabled:no-underline"
                >
                  {otpAttempts >= 5 ? "Request New OTP" : "Resend OTP"}
                </button>
              </div>
            )}

            <p className="mt-7 text-center text-xs text-slate-500">
              Remember your password?{" "}
              <Link
                to="/signin"
                className="text-yellow-600 font-bold hover:underline cursor-pointer transition-colors"
              >
                Sign In
              </Link>
            </p>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
