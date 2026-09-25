import { useEffect } from "react";

export const PasswordModal = ({
  showPasswordModal,
  setShowPasswordModal,
  passwordData,
  passwordLoading,
  passwordError,
  passwordSuccess,
  showCurrentPassword,
  setShowCurrentPassword,
  showNewPassword,
  setShowNewPassword,
  handlePasswordSubmit,
  handlePasswordChange,
  newPwStrength,
  strengthColors,
  strengthTextColors,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showPasswordModal && !passwordLoading) {
        setShowPasswordModal(false);
      }
    };
    if (showPasswordModal) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showPasswordModal, passwordLoading, setShowPasswordModal]);

  if (!showPasswordModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="password-modal-title">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => !passwordLoading && setShowPasswordModal(false)}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 w-full max-w-md animate-[slide-up_0.25s_ease-out]">
        <button
          onClick={() => setShowPasswordModal(false)}
          disabled={passwordLoading}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
            <span className="material-symbols-outlined text-yellow-600 text-xl">lock_reset</span>
          </span>
          <h3 id="password-modal-title" className="text-xl font-bold text-slate-900">
            Change Password
          </h3>
        </div>

        {passwordError && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-5 bg-red-50 border border-red-200 text-red-600">
            <span className="material-symbols-outlined text-lg shrink-0">error</span>
            <span className="text-sm font-medium">{passwordError}</span>
          </div>
        )}
        {passwordSuccess && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-5 bg-emerald-50 border border-emerald-200 text-emerald-600">
            <span className="material-symbols-outlined text-lg shrink-0">check_circle</span>
            <span className="text-sm font-medium">{passwordSuccess}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all pr-11"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showCurrentPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all pr-11"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded transition-colors"
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
                          ? (strengthColors[newPwStrength.score] || "bg-yellow-400")
                          : "bg-slate-200"
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
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className={`w-full px-3.5 py-3 rounded-xl border bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-1 transition-all ${
                passwordData.confirmPassword &&
                passwordData.newPassword !== passwordData.confirmPassword
                  ? "border-red-400 focus:border-red-500 focus:ring-red-400/20"
                  : "border-slate-200 focus:border-yellow-400 focus:ring-yellow-400"
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
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
              disabled={passwordLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-yellow flex-1 justify-center py-3"
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
  );
};

export const DeleteAvatarModal = ({
  showDeleteAvatarConfirm,
  setShowDeleteAvatarConfirm,
  handleDeleteAvatar,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showDeleteAvatarConfirm) {
        setShowDeleteAvatarConfirm(false);
      }
    };
    if (showDeleteAvatarConfirm) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showDeleteAvatarConfirm, setShowDeleteAvatarConfirm]);

  if (!showDeleteAvatarConfirm) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="delete-avatar-modal-title">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setShowDeleteAvatarConfirm(false)}
      />
      <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 w-full max-w-sm animate-[slide-up_0.2s_ease-out]">
        <div className="flex flex-col items-center text-center gap-4">
          <span className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center border border-red-100">
            <span className="material-symbols-outlined text-red-500 text-2xl">
              delete_forever
            </span>
          </span>
          <div>
            <h3 id="delete-avatar-modal-title" className="text-lg font-bold text-slate-900">
              Remove Avatar
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Your picture will be reset to the default avatar.
            </p>
          </div>
          <div className="flex gap-3 w-full mt-1">
            <button
              onClick={() => setShowDeleteAvatarConfirm(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Keep It
            </button>
            <button
              onClick={handleDeleteAvatar}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors shadow-sm cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
