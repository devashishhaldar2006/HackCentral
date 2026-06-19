import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../lib/constants";
import { addUser } from "../lib/userSlice";
import { getPasswordStrength } from "../lib/passwordStrength";
import { DEFAULT_AVATAR } from "../lib/constants";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showDeleteAvatarConfirm, setShowDeleteAvatarConfirm] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    college: "",
    location: "",
    skills: "",
    interests: "",
    github: "",
    linkedin: "",
    website: "",
  });

  useEffect(() => {
    let isMounted = true;
    const fetchFreshProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/profile/me`, {
          withCredentials: true,
        });
        if (isMounted) {
          dispatch(addUser(response.data.data));
        }
      } catch (err) {
        console.error("Failed to fetch fresh profile data", err);
      }
    };

    fetchFreshProfile();
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        gender: user.gender || "",
        college: user.college || "",
        location: user.location || "",
        skills:
          user.skills && Array.isArray(user.skills)
            ? user.skills.join(", ")
            : "",
        interests:
          user.interests && Array.isArray(user.interests)
            ? user.interests.join(", ")
            : "",
        github: user.github || "",
        linkedin: user.linkedin || "",
        website: user.website || "",
      });
    }
  }, [user]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ── Profile Edit Save ──
  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const urlPattern = /^https?:\/\/.+/i;

    if (formData.github && !urlPattern.test(formData.github)) {
      setError("GitHub link must be a valid URL starting with http/https");
      setLoading(false);
      return;
    }
    if (formData.linkedin && !urlPattern.test(formData.linkedin)) {
      setError("LinkedIn link must be a valid URL starting with http/https");
      setLoading(false);
      return;
    }
    if (
      user?.role === "organizer" &&
      formData.website &&
      !urlPattern.test(formData.website)
    ) {
      setError("Website must be a valid URL starting with http/https");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        skills: formData.skills
          ? formData.skills
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : [],
        interests: formData.interests
          ? formData.interests
              .split(",")
              .map((i) => i.trim())
              .filter((i) => i)
          : [],
      };

      if (user?.role !== "organizer") {
        delete payload.website;
      }

      const response = await axios.patch(
        `${BASE_URL}/profile/me/edit`,
        payload,
        { withCredentials: true }
      );

      dispatch(addUser(response.data.data));
      setSuccessMsg("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Avatar Upload ──
  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validations
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setAvatarError("Only JPG, PNG, and WebP images are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Image must be smaller than 5 MB");
      return;
    }

    setAvatarError(null);
    // Show local preview mapping
    setAvatarPreview(URL.createObjectURL(file));

    // Upload
    uploadAvatar(file);
  };

  const uploadAvatar = async (file) => {
    setAvatarLoading(true);
    setAvatarError(null);
    try {
      const formPayload = new FormData();
      formPayload.append("avatar", file);

      const response = await axios.patch(
        `${BASE_URL}/profile/me/upload-avatar`,
        formPayload,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      dispatch(addUser(response.data.data));
      setAvatarPreview(null);
      setSuccessMsg("Avatar updated successfully!");
    } catch (err) {
      setAvatarError(
        err.response?.data?.message || "Failed to upload avatar"
      );
      setAvatarPreview(null);
    } finally {
      setAvatarLoading(false);
      // Reset file input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Delete Avatar ──
  const handleDeleteAvatar = async () => {
    setAvatarLoading(true);
    setAvatarError(null);
    setShowDeleteAvatarConfirm(false);
    try {
      const response = await axios.delete(`${BASE_URL}/profile/me/avatar`, {
        withCredentials: true,
      });
      dispatch(addUser(response.data.data));
      setSuccessMsg("Avatar removed successfully!");
    } catch (err) {
      setAvatarError(
        err.response?.data?.message || "Failed to remove avatar"
      );
    } finally {
      setAvatarLoading(false);
    }
  };

  // ── Change Password ──
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }

    const pwStrength = getPasswordStrength(newPassword);
    if (pwStrength.score < 4) {
      setPasswordError(
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
      );
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await axios.patch(
        `${BASE_URL}/profile/me/change-password`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      setPasswordSuccess(response.data.message);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // Auto-close after success
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(null);
      }, 2000);
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const openPasswordModal = () => {
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError(null);
    setPasswordSuccess(null);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowPasswordModal(true);
  };

  const newPwStrength = getPasswordStrength(passwordData.newPassword);
  const isCustomAvatar = user?.avatar && user.avatar !== DEFAULT_AVATAR;

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const strengthColors = {
    1: "bg-red-400",
    2: "bg-amber-400",
    3: "bg-sky-400",
    4: "bg-emerald-400",
  };

  const strengthTextColors = {
    1: "text-red-500",
    2: "text-amber-500",
    3: "text-sky-500",
    4: "text-emerald-500",
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f5f6f8] dark:bg-[#0e1220] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ═══════════════ STATUS MESSAGES ═══════════════ */}
        {error && (
          <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 animate-[slide-up_0.25s_ease-out]">
            <span className="material-symbols-outlined text-xl shrink-0">error</span>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
        {avatarError && (
          <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 animate-[slide-up_0.25s_ease-out]">
            <span className="material-symbols-outlined text-xl shrink-0">error</span>
            <span className="text-sm font-medium">{avatarError}</span>
          </div>
        )}
        {successMsg && (
          <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 animate-[slide-up_0.25s_ease-out]">
            <span className="material-symbols-outlined text-xl shrink-0">check_circle</span>
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
        )}

        {/* ═══════════════ PROFILE HEADER CARD ═══════════════ */}
        <div className="bg-white dark:bg-[#161d2f] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="px-6 sm:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              {/* Avatar */}
              <div className="relative group shrink-0 self-center sm:self-auto">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 shadow-md">
                  <img
                    src={avatarPreview || user.avatar || DEFAULT_AVATAR}
                    alt="Avatar"
                    className={`w-full h-full object-cover transition-opacity duration-200 ${avatarLoading ? "opacity-30" : ""}`}
                  />
                  {avatarLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="loading loading-spinner loading-md text-slate-500"></span>
                    </div>
                  )}
                </div>

                {/* Upload overlay */}
                {!avatarLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 rounded-full transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center gap-0.5 text-white cursor-pointer focus:outline-none"
                      title="Upload new avatar"
                    >
                      <span className="material-symbols-outlined text-2xl drop-shadow">
                        photo_camera
                      </span>
                      <span className="text-[11px] font-semibold drop-shadow">
                        Change
                      </span>
                    </button>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarSelect}
                />

                {/* Remove avatar */}
                {isCustomAvatar && !avatarLoading && (
                  <button
                    onClick={() => setShowDeleteAvatarConfirm(true)}
                    className="absolute -top-1 -right-1 z-10 w-7 h-7 bg-white dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/40 text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center shadow-md transition-all duration-200 scale-0 group-hover:scale-100 cursor-pointer border border-slate-200 dark:border-slate-600"
                    title="Remove avatar"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
              </div>

              {/* Name / Email / Badges */}
              <div className="flex-1 text-center sm:text-left pb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white capitalize leading-tight">
                  {user.fullName}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5 select-all">
                  {user.email}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase tracking-wide">
                    {user.role}
                  </span>
                  {user.role === "organizer" && user.verified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      Verified
                    </span>
                  )}
                  {user.location && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      <span className="capitalize">{user.location}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 shrink-0 self-center sm:self-end sm:pb-1">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setError(null);
                        setSuccessMsg(null);
                      }}
                      className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                )}

                {user.authProvider === "local" && !isEditing && (
                  <button
                    onClick={openPasswordModal}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    Change Password
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ MAIN GRID ═══════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ─── LEFT COLUMN: Personal + Skills ─── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Personal Details */}
            <div className="bg-white dark:bg-[#161d2f] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </span>
                Personal Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1c2438] text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-slate-500 dark:focus:border-slate-400 focus:ring-1 focus:ring-slate-500/20 transition-all"
                    />
                  ) : (
                    <p className="text-[15px] font-medium text-slate-800 dark:text-slate-200 capitalize py-2.5">
                      {user.fullName || "—"}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                    Gender
                  </label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1c2438] text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-slate-500 dark:focus:border-slate-400 focus:ring-1 focus:ring-slate-500/20 transition-all"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <p className="text-[15px] font-medium text-slate-800 dark:text-slate-200 capitalize py-2.5">
                      {user.gender || "—"}
                    </p>
                  )}
                </div>

                {/* College */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                    College / University
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1c2438] text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-slate-500 dark:focus:border-slate-400 focus:ring-1 focus:ring-slate-500/20 transition-all"
                    />
                  ) : (
                    <p className="text-[15px] font-medium text-slate-800 dark:text-slate-200 capitalize py-2.5">
                      {user.college || "—"}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1c2438] text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-slate-500 dark:focus:border-slate-400 focus:ring-1 focus:ring-slate-500/20 transition-all"
                    />
                  ) : (
                    <p className="text-[15px] font-medium text-slate-800 dark:text-slate-200 capitalize py-2.5">
                      {user.location || "—"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills & Interests */}
            <div className="bg-white dark:bg-[#161d2f] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-[18px]">code</span>
                </span>
                Skills & Interests
              </h2>

              <div className="space-y-6">
                {/* Skills */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
                    Technical Skills
                    {isEditing && (
                      <span className="normal-case text-[11px] font-normal text-slate-400 ml-1.5">
                        (comma separated)
                      </span>
                    )}
                  </label>
                  {isEditing ? (
                    <textarea
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="React, Node.js, Python, UI/UX..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1c2438] text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-slate-500 dark:focus:border-slate-400 focus:ring-1 focus:ring-slate-500/20 transition-all min-h-[80px] resize-y"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.skills && user.skills.length > 0 ? (
                        user.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 rounded-md text-sm font-medium border border-slate-200 dark:border-slate-700"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-slate-400 dark:text-slate-500 italic py-4 w-full text-center bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                          No skills added yet
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
                    Areas of Interest
                    {isEditing && (
                      <span className="normal-case text-[11px] font-normal text-slate-400 ml-1.5">
                        (comma separated)
                      </span>
                    )}
                  </label>
                  {isEditing ? (
                    <textarea
                      name="interests"
                      value={formData.interests}
                      onChange={handleChange}
                      placeholder="Web Dev, AI/ML, Open Source, Hackathons..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1c2438] text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-slate-500 dark:focus:border-slate-400 focus:ring-1 focus:ring-slate-500/20 transition-all min-h-[80px] resize-y"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.interests && user.interests.length > 0 ? (
                        user.interests.map((interest, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 rounded-md text-sm font-medium border border-sky-100 dark:border-sky-800/40"
                          >
                            {interest}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-slate-400 dark:text-slate-500 italic py-4 w-full text-center bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                          No interests added yet
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: Stats + Links + Account ─── */}
          <div className="space-y-6">

            {/* Activity Stats */}
            <div className="bg-white dark:bg-[#161d2f] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-[18px]">bar_chart</span>
                </span>
                Activity
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#1c2438] border border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[20px] text-amber-500">bookmark</span>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Bookmarked</span>
                  </div>
                  <span className="text-xl font-bold text-slate-800 dark:text-white tabular-nums">
                    {user.bookmarkedEvents?.length || 0}
                  </span>
                </div>

                {user.role === "user" && (
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#1c2438] border border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[20px] text-emerald-500">check_circle</span>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Registered</span>
                    </div>
                    <span className="text-xl font-bold text-slate-800 dark:text-white tabular-nums">
                      {user.registeredEvents?.length || 0}
                    </span>
                  </div>
                )}

                {user.role === "organizer" && (
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#1c2438] border border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[20px] text-blue-500">event</span>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Organized</span>
                    </div>
                    <span className="text-xl font-bold text-slate-800 dark:text-white tabular-nums">
                      {user.submittedEvents?.length || 0}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white dark:bg-[#161d2f] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-[18px]">link</span>
                </span>
                Links
              </h2>

              <div className="space-y-4">
                {/* GitHub */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                    GitHub
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      placeholder="https://github.com/..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1c2438] text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-slate-500 dark:focus:border-slate-400 focus:ring-1 focus:ring-slate-500/20 transition-all"
                    />
                  ) : user.github ? (
                    <a
                      href={user.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-3 bg-slate-50 dark:bg-[#1c2438] rounded-lg border border-slate-100 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group"
                    >
                      <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">open_in_new</span>
                      <span className="truncate">{user.github.replace(/^https?:\/\/(www\.)?github\.com\//, '@')}</span>
                    </a>
                  ) : (
                    <p className="text-sm text-slate-400 dark:text-slate-500 py-2.5">Not connected</p>
                  )}
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                    LinkedIn
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1c2438] text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-slate-500 dark:focus:border-slate-400 focus:ring-1 focus:ring-slate-500/20 transition-all"
                    />
                  ) : user.linkedin ? (
                    <a
                      href={user.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-3 bg-slate-50 dark:bg-[#1c2438] rounded-lg border border-slate-100 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group"
                    >
                      <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">open_in_new</span>
                      <span className="truncate">{user.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
                    </a>
                  ) : (
                    <p className="text-sm text-slate-400 dark:text-slate-500 py-2.5">Not connected</p>
                  )}
                </div>

                {/* Website (organizer only) */}
                {user.role === "organizer" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                      Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://your-organization.com"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1c2438] text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-slate-500 dark:focus:border-slate-400 focus:ring-1 focus:ring-slate-500/20 transition-all"
                      />
                    ) : user.website ? (
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-3 bg-slate-50 dark:bg-[#1c2438] rounded-lg border border-slate-100 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group"
                      >
                        <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">open_in_new</span>
                        <span className="truncate">{user.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                      </a>
                    ) : (
                      <p className="text-sm text-slate-400 dark:text-slate-500 py-2.5">Not connected</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white dark:bg-[#161d2f] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-[18px]">shield</span>
                </span>
                Account
              </h2>

              <div className="space-y-1">
                <div className="flex items-center justify-between py-3 px-1">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Auth Provider</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 capitalize bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-700">
                    {user.authProvider || "local"}
                  </span>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800"></div>
                <div className="flex items-center justify-between py-3 px-1">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Member Since</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ CHANGE PASSWORD MODAL ═══════════════ */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 dark:bg-black/60 transition-opacity"
            onClick={() => !passwordLoading && setShowPasswordModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white dark:bg-[#161d2f] rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md animate-[slide-up_0.25s_ease-out]">
            <button
              onClick={() => setShowPasswordModal(false)}
              disabled={passwordLoading}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-xl">lock_reset</span>
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Change Password
              </h3>
            </div>

            {passwordError && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg mb-5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-300">
                <span className="material-symbols-outlined text-lg shrink-0">error</span>
                <span className="text-sm font-medium">{passwordError}</span>
              </div>
            )}
            {passwordSuccess && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg mb-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-300">
                <span className="material-symbols-outlined text-lg shrink-0">check_circle</span>
                <span className="text-sm font-medium">{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3.5 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1c2438] text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-slate-500 dark:focus:border-slate-400 focus:ring-1 focus:ring-slate-500/20 transition-all pr-11"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5 rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showCurrentPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3.5 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1c2438] text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-slate-500 dark:focus:border-slate-400 focus:ring-1 focus:ring-slate-500/20 transition-all pr-11"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5 rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showNewPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>

                {/* Strength bar */}
                {passwordData.newPassword && (
                  <div className="mt-2.5">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                            newPwStrength.score >= level
                              ? (strengthColors[newPwStrength.score] || "bg-slate-300")
                              : "bg-slate-200 dark:bg-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-[11px] uppercase tracking-wider mt-1.5 font-semibold ${
                      strengthTextColors[newPwStrength.score] || "text-slate-400"
                    }`}>
                      {newPwStrength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-3.5 py-3 rounded-lg border bg-white dark:bg-[#1c2438] text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-1 transition-all ${
                    passwordData.confirmPassword &&
                    passwordData.newPassword !== passwordData.confirmPassword
                      ? "border-red-400 dark:border-red-500 focus:border-red-500 focus:ring-red-400/20"
                      : "border-slate-300 dark:border-slate-600 focus:border-slate-500 dark:focus:border-slate-400 focus:ring-slate-500/20"
                  }`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                {passwordData.confirmPassword &&
                  passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1.5 font-medium">
                      Passwords do not match
                    </p>
                  )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  disabled={passwordLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════ DELETE AVATAR MODAL ═══════════════ */}
      {showDeleteAvatarConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 dark:bg-black/60 transition-opacity"
            onClick={() => setShowDeleteAvatarConfirm(false)}
          />
          <div className="relative bg-white dark:bg-[#161d2f] rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-sm animate-[slide-up_0.2s_ease-out]">
            <div className="flex flex-col items-center text-center gap-4">
              <span className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center border border-red-100 dark:border-red-900/50">
                <span className="material-symbols-outlined text-red-500 text-2xl">
                  delete_forever
                </span>
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Remove Avatar
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Your picture will be reset to the default avatar.
                </p>
              </div>
              <div className="flex gap-3 w-full mt-1">
                <button
                  onClick={() => setShowDeleteAvatarConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Keep It
                </button>
                <button
                  onClick={handleDeleteAvatar}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors shadow-sm cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;