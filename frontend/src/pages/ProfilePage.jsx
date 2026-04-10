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

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f5f6f8] dark:bg-[#080c18] py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          {/* Background decorative blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

          {/* Avatar with upload overlay */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-800">
              <img
                src={avatarPreview || user.avatar || DEFAULT_AVATAR}
                alt="Avatar"
                className={`w-full h-full object-cover transition-opacity ${avatarLoading ? "opacity-50" : ""}`}
              />
              {/* Loading spinner overlay */}
              {avatarLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl">
                  <span className="loading loading-spinner loading-md text-white"></span>
                </div>
              )}
            </div>

            {/* Upload overlay on hover and focus */}
            {!avatarLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/0 group-hover:bg-black/40 group-focus-within:bg-black/40 rounded-2xl transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-1 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-white rounded-lg p-2"
                  title="Upload new avatar"
                >
                  <span className="material-symbols-outlined text-2xl drop-shadow">
                    photo_camera
                  </span>
                  <span className="text-xs font-semibold drop-shadow">
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

            {/* Remove avatar button */}
            {isCustomAvatar && !avatarLoading && (
              <button
                onClick={() => setShowDeleteAvatarConfirm(true)}
                className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                title="Remove avatar"
              >
                <span className="material-symbols-outlined text-[16px]">
                  close
                </span>
              </button>
            )}
          </div>

          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white capitalize">
              {user.fullName}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
              {user.email}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wider">
                {user.role}
              </span>
              {user.role === "organizer" && user.verified && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-500 uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    verified
                  </span>
                  Verified
                </span>
              )}
              {user.location && (
                <span className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-[18px] mr-1">
                    location_on
                  </span>
                  <span className="capitalize">{user.location}</span>
                </span>
              )}
            </div>
          </div>

          <div className="z-10 flex flex-col gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn bg-primary hover:bg-primary-focus text-white border-none rounded-xl px-6"
              >
                <span className="material-symbols-outlined text-[20px]">
                  edit
                </span>
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="btn btn-ghost rounded-xl"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn bg-primary hover:bg-primary-focus text-white border-none rounded-xl px-6"
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

            {/* Change Password button — only for local auth */}
            {user.authProvider === "local" && !isEditing && (
              <button
                onClick={openPasswordModal}
                className="btn btn-ghost btn-sm rounded-xl text-slate-600 dark:text-slate-300 gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">
                  lock
                </span>
                Change Password
              </button>
            )}
          </div>
        </div>

        {/* Avatar error message */}
        {avatarError && (
          <div className="alert alert-error rounded-xl shadow-sm">
            <span className="material-symbols-outlined">error</span>
            <span>{avatarError}</span>
            <button
              onClick={() => setAvatarError(null)}
              className="btn btn-ghost btn-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Status Messages */}
        {error && (
          <div className="alert alert-error rounded-xl shadow-sm">
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="alert alert-success rounded-xl shadow-sm text-white">
            <span className="material-symbols-outlined">check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  person
                </span>
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-0">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="input input-bordered focus:border-primary focus:outline-none rounded-xl dark:bg-slate-800 dark:border-slate-700"
                    />
                  ) : (
                    <p className="font-medium text-slate-900 dark:text-slate-200 capitalize">
                      {user.fullName || "—"}
                    </p>
                  )}
                </div>

                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-0">
                    Gender
                  </label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="select select-bordered focus:border-primary focus:outline-none rounded-xl dark:bg-slate-800 dark:border-slate-700"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <p className="font-medium text-slate-900 dark:text-slate-200 capitalize">
                      {user.gender || "—"}
                    </p>
                  )}
                </div>

                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-0">
                    College/University
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      className="input input-bordered focus:border-primary focus:outline-none rounded-xl dark:bg-slate-800 dark:border-slate-700"
                    />
                  ) : (
                    <p className="font-medium text-slate-900 dark:text-slate-200 capitalize">
                      {user.college || "—"}
                    </p>
                  )}
                </div>

                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-0">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="input input-bordered focus:border-primary focus:outline-none rounded-xl dark:bg-slate-800 dark:border-slate-700"
                    />
                  ) : (
                    <p className="font-medium text-slate-900 dark:text-slate-200 capitalize">
                      {user.location || "—"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  psychology
                </span>
                Skills & Interests
              </h2>

              <div className="space-y-6">
                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-0">
                    Skills{" "}
                    {isEditing && (
                      <span className="lowercase normal-case text-xs font-normal opacity-70">
                        (Comma separated)
                      </span>
                    )}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="React, Node.js, Python"
                      className="input input-bordered focus:border-primary focus:outline-none rounded-xl dark:bg-slate-800 dark:border-slate-700"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.skills && user.skills.length > 0 ? (
                        user.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-slate-500 dark:text-slate-400 text-sm italic">
                          — No skills added —
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-0">
                    Interests{" "}
                    {isEditing && (
                      <span className="lowercase normal-case text-xs font-normal opacity-70">
                        (Comma separated)
                      </span>
                    )}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="interests"
                      value={formData.interests}
                      onChange={handleChange}
                      placeholder="Web Dev, AI/ML, Design"
                      className="input input-bordered focus:border-primary focus:outline-none rounded-xl dark:bg-slate-800 dark:border-slate-700"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.interests && user.interests.length > 0 ? (
                        user.interests.map((interest, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium border border-blue-100 dark:border-blue-800/30"
                          >
                            {interest}
                          </span>
                        ))
                      ) : (
                        <p className="text-slate-500 dark:text-slate-400 text-sm italic">
                          — No interests added —
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Links & Organizer Meta Section */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  link
                </span>
                Social Links
              </h2>

              <div className="space-y-4">
                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-0">
                    GitHub
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      placeholder="https://github.com/username"
                      className="input input-bordered focus:border-primary focus:outline-none rounded-xl dark:bg-slate-800 dark:border-slate-700"
                    />
                  ) : user.github ? (
                    <a
                      href={user.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline truncate font-medium"
                    >
                      {user.github}
                    </a>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      —
                    </p>
                  )}
                </div>

                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-0">
                    LinkedIn
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/username"
                      className="input input-bordered focus:border-primary focus:outline-none rounded-xl dark:bg-slate-800 dark:border-slate-700"
                    />
                  ) : user.linkedin ? (
                    <a
                      href={user.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline truncate font-medium"
                    >
                      {user.linkedin}
                    </a>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      —
                    </p>
                  )}
                </div>

                {user.role === "organizer" && (
                  <div className="form-control">
                    <label className="label text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-0">
                      Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://your-organization.com"
                        className="input input-bordered focus:border-primary focus:outline-none rounded-xl dark:bg-slate-800 dark:border-slate-700"
                      />
                    ) : user.website ? (
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline truncate font-medium"
                      >
                        {user.website}
                      </a>
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        —
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 shadow-md text-white">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">analytics</span>
                Activity
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <span className="font-medium">Bookmarked</span>
                  <span className="text-2xl font-bold">
                    {user.bookmarkedEvents?.length || 0}
                  </span>
                </div>
                {user.role === "user" && (
                  <div className="flex justify-between items-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <span className="font-medium">Registered</span>
                    <span className="text-2xl font-bold">
                      {user.registeredEvents?.length || 0}
                    </span>
                  </div>
                )}
                {user.role === "organizer" && (
                  <div className="flex justify-between items-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <span className="font-medium">Organized</span>
                    <span className="text-2xl font-bold">
                      {user.submittedEvents?.length || 0}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Account Info Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  security
                </span>
                Account
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Auth Provider
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 capitalize">
                    {user.authProvider || "local"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Member Since
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
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

      {/* ── Change Password Modal ── */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !passwordLoading && setShowPasswordModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md animate-[slide-up_0.3s_ease-out]">
            <button
              onClick={() => setShowPasswordModal(false)}
              disabled={passwordLoading}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">
                  lock
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Change Password
              </h3>
            </div>

            {passwordError && (
              <div className="alert alert-error rounded-xl mb-4 text-sm">
                <span className="material-symbols-outlined text-lg">
                  error
                </span>
                <span>{passwordError}</span>
              </div>
            )}
            {passwordSuccess && (
              <div className="alert alert-success rounded-xl mb-4 text-sm text-white">
                <span className="material-symbols-outlined text-lg">
                  check_circle
                </span>
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Current Password */}
              <div className="form-control">
                <label className="label text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-0">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="input input-bordered focus:border-primary focus:outline-none rounded-xl dark:bg-slate-800 dark:border-slate-700 w-full pr-12"
                    placeholder="Enter current password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showCurrentPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="form-control">
                <label className="label text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-0">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="input input-bordered focus:border-primary focus:outline-none rounded-xl dark:bg-slate-800 dark:border-slate-700 w-full pr-12"
                    placeholder="Enter new password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showNewPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>

                {/* Password strength bar */}
                {passwordData.newPassword && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            newPwStrength.score >= level
                              ? newPwStrength.color
                              : "bg-slate-200 dark:bg-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                    <p
                      className={`text-xs mt-1 font-medium ${
                        newPwStrength.score <= 1
                          ? "text-red-500"
                          : newPwStrength.score === 2
                            ? "text-amber-500"
                            : newPwStrength.score === 3
                              ? "text-blue-500"
                              : "text-emerald-500"
                      }`}
                    >
                      {newPwStrength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="form-control">
                <label className="label text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-0">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`input input-bordered focus:border-primary focus:outline-none rounded-xl dark:bg-slate-800 dark:border-slate-700 w-full ${
                    passwordData.confirmPassword &&
                    passwordData.newPassword !== passwordData.confirmPassword
                      ? "border-red-400 dark:border-red-500"
                      : ""
                  }`}
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                />
                {passwordData.confirmPassword &&
                  passwordData.newPassword !==
                    passwordData.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      Passwords do not match
                    </p>
                  )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="btn btn-ghost rounded-xl flex-1"
                  disabled={passwordLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-primary hover:bg-primary-focus text-white border-none rounded-xl flex-1"
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

      {/* ── Delete Avatar Confirmation Modal ── */}
      {showDeleteAvatarConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteAvatarConfirm(false)}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-sm animate-[slide-up_0.2s_ease-out]">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-500 text-2xl">
                  delete
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Remove Avatar?
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Your profile picture will be reset to the default avatar.
                </p>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowDeleteAvatarConfirm(false)}
                  className="btn btn-ghost rounded-xl flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAvatar}
                  className="btn bg-red-500 hover:bg-red-600 text-white border-none rounded-xl flex-1"
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