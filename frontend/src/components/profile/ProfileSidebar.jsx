export const ActivityStats = ({ user }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
          <span className="material-symbols-outlined text-[18px]">bar_chart</span>
        </span>
        Activity
      </h2>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-amber-500">bookmark</span>
            <span className="text-sm font-medium text-slate-600">Bookmarked</span>
          </div>
          <span className="text-xl font-bold text-slate-900 tabular-nums">
            {user.bookmarkedEvents?.length || 0}
          </span>
        </div>

        {user.role === "user" && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-emerald-500">check_circle</span>
              <span className="text-sm font-medium text-slate-600">Registered</span>
            </div>
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {user.registeredEvents?.length || 0}
            </span>
          </div>
        )}

        {user.role === "organizer" && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-yellow-600">event</span>
              <span className="text-sm font-medium text-slate-600">Organized</span>
            </div>
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {user.submittedEvents?.length || 0}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const SocialLinks = ({ user, isEditing, formData, handleChange }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
          <span className="material-symbols-outlined text-[18px]">link</span>
        </span>
        Links
      </h2>

      <div className="space-y-4">
        {/* GitHub */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            GitHub
          </label>
          {isEditing ? (
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
          ) : user.github ? (
            <a
              href={user.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-yellow-400 transition-colors group"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-yellow-600 transition-colors">open_in_new</span>
              <span className="truncate">{user.github.replace(/^https?:\/\/(www\.)?github\.com\//, '@')}</span>
            </a>
          ) : (
            <p className="text-sm text-slate-400 py-2.5">Not connected</p>
          )}
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            LinkedIn
          </label>
          {isEditing ? (
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
          ) : user.linkedin ? (
            <a
              href={user.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-yellow-400 transition-colors group"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-yellow-600 transition-colors">open_in_new</span>
              <span className="truncate">{user.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
            </a>
          ) : (
            <p className="text-sm text-slate-400 py-2.5">Not connected</p>
          )}
        </div>

        {/* Website (organizer only) */}
        {user.role === "organizer" && (
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Website
            </label>
            {isEditing ? (
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://your-organization.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
              />
            ) : user.website ? (
              <a
                href={user.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-yellow-400 transition-colors group"
              >
                <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-yellow-600 transition-colors">open_in_new</span>
                <span className="truncate">{user.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
              </a>
            ) : (
              <p className="text-sm text-slate-400 py-2.5">Not connected</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const AccountInfo = ({ user }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
          <span className="material-symbols-outlined text-[18px]">shield</span>
        </span>
        Account
      </h2>

      <div className="space-y-1">
        <div className="flex items-center justify-between py-3 px-1">
          <span className="text-sm text-slate-500">Auth Provider</span>
          <span className="text-sm font-semibold text-slate-700 capitalize bg-yellow-50 text-yellow-900 px-2.5 py-1 rounded-md border border-yellow-200/60">
            {user.authProvider || "local"}
          </span>
        </div>
        <div className="border-t border-slate-100"></div>
        <div className="flex items-center justify-between py-3 px-1">
          <span className="text-sm text-slate-500">Member Since</span>
          <span className="text-sm font-semibold text-slate-800">
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
  );
};
