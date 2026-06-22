import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../lib/constants";
import { addUser } from "../lib/userSlice";
import { getPasswordStrength } from "../lib/passwordStrength";
import { DEFAULT_AVATAR } from "../lib/constants";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { PersonalDetails, SkillsInterests } from "../components/profile/ProfileForms";
import { ActivityStats, SocialLinks, AccountInfo } from "../components/profile/ProfileSidebar";
import { PasswordModal, DeleteAvatarModal } from "../components/profile/ProfileModals";const ProfilePage = () => {
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

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
    setSuccessMsg(null);
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
        <ProfileHeader
          user={user}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleCancelEdit={handleCancelEdit}
          loading={loading}
          handleSave={handleSave}
          setError={setError}
          setSuccessMsg={setSuccessMsg}
          avatarPreview={avatarPreview}
          avatarLoading={avatarLoading}
          handleAvatarSelect={handleAvatarSelect}
          fileInputRef={fileInputRef}
          isCustomAvatar={isCustomAvatar}
          setShowDeleteAvatarConfirm={setShowDeleteAvatarConfirm}
          openPasswordModal={openPasswordModal}
        />

        {/* ═══════════════ MAIN GRID ═══════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ─── LEFT COLUMN: Personal + Skills ─── */}
          <div className="lg:col-span-2 space-y-6">
            <PersonalDetails
              user={user}
              isEditing={isEditing}
              formData={formData}
              handleChange={handleChange}
            />
            <SkillsInterests
              user={user}
              isEditing={isEditing}
              formData={formData}
              handleChange={handleChange}
            />
          </div>

          {/* ─── RIGHT COLUMN: Stats + Links + Account ─── */}
          <div className="space-y-6">
            <ActivityStats user={user} />
            <SocialLinks
              user={user}
              isEditing={isEditing}
              formData={formData}
              handleChange={handleChange}
            />
            <AccountInfo user={user} />
          </div>
        </div>
      </div>

      <PasswordModal
        showPasswordModal={showPasswordModal}
        setShowPasswordModal={setShowPasswordModal}
        passwordData={passwordData}
        passwordLoading={passwordLoading}
        passwordError={passwordError}
        passwordSuccess={passwordSuccess}
        showCurrentPassword={showCurrentPassword}
        setShowCurrentPassword={setShowCurrentPassword}
        showNewPassword={showNewPassword}
        setShowNewPassword={setShowNewPassword}
        handlePasswordSubmit={handlePasswordSubmit}
        handlePasswordChange={handlePasswordChange}
        newPwStrength={newPwStrength}
        strengthColors={strengthColors}
        strengthTextColors={strengthTextColors}
      />

      <DeleteAvatarModal
        showDeleteAvatarConfirm={showDeleteAvatarConfirm}
        setShowDeleteAvatarConfirm={setShowDeleteAvatarConfirm}
        handleDeleteAvatar={handleDeleteAvatar}
      />
    </div>
  );
};

export default ProfilePage;