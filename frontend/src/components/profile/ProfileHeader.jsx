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
  openPasswordModal,
  handleCancelEdit
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div className="px-6 sm:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative group shrink-0 self-center sm:self-auto">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-slate-100 shadow-md">
              <img
                src={avatarPreview || user.avatar || DEFAULT_AVATAR}
                alt="Avatar"
                className={`w-full h-full object-cover transition-opacity duration-200 ${avatarLoading ? "opacity-30" : ""}`}
              />
              {avatarLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="loading loading-spinner loading-md text-yellow-500"></span>
                </div>
              )}
            </div>

            {/* Upload overlay */}
            {!avatarLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 focus-within:bg-black/40 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-0.5 text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg p-1"
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
                className="absolute -top-1 -right-1 z-10 w-7 h-7 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center shadow-md transition-all duration-200 scale-0 group-hover:scale-100 focus:scale-100 cursor-pointer border border-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                title="Remove avatar"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Name / Email / Badges */}
          <div className="flex-1 text-center sm:text-left pb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 capitalize leading-tight">
              {user.fullName}
            </h1>
            <p className="text-slate-500 text-sm mt-0.5 select-all">
              {user.email}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-100 text-yellow-900 uppercase tracking-wide">
                {user.role}
              </span>
              {user.role === "organizer" && user.verified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Verified
                </span>
              )}
              {user.location && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
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
                className="btn-yellow text-xs py-2.5 px-5"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit ? handleCancelEdit : () => {
                    setIsEditing(false);
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn-yellow text-xs py-2.5 px-5"
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
                className="btn-white text-xs py-2.5 px-5"
              >
                <span className="material-symbols-outlined text-[16px] text-yellow-600">lock</span>
                Change Password
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
