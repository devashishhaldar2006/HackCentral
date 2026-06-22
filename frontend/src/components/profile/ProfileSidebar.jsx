export const ActivityStats = ({ user }) => {
  return (
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
  );
};

export const SocialLinks = ({ user, isEditing, formData, handleChange }) => {
  return (
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
  );
};

export const AccountInfo = ({ user }) => {
  return (
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
  );
};
