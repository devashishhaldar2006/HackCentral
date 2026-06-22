export const PersonalDetails = ({ user, isEditing, formData, handleChange }) => {
  return (
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
  );
};

export const SkillsInterests = ({ user, isEditing, formData, handleChange }) => {
  return (
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
  );
};
