import { DEFAULT_AVATAR } from "../../lib/constants";

export const ProfileHeader = ({
  user,
  isEditing,
  setIsEditing,
  loading,
  handleSave,
  setError,
  setSuccessMsg,
  avatarPreview,
  avatarLoading,
  handleAvatarSelect,
  fileInputRef,
  isCustomAvatar,
  setShowDeleteAvatarConfirm,
  openPasswordModal
}) => {
  return (
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
  );
};
