export const PersonalDetails = ({ user, isEditing, formData, handleChange }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
          <span className="material-symbols-outlined text-[18px]">person</span>
        </span>
        Personal Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          {isEditing ? (
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
          ) : (
            <p className="text-[15px] font-medium text-slate-800 capitalize py-2.5">
              {user.fullName || "—"}
            </p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Gender
          </label>
          {isEditing ? (
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          ) : (
            <p className="text-[15px] font-medium text-slate-800 capitalize py-2.5">
              {user.gender || "—"}
            </p>
          )}
        </div>

        {/* College */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            College / University
          </label>
          {isEditing ? (
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
          ) : (
            <p className="text-[15px] font-medium text-slate-800 capitalize py-2.5">
              {user.college || "—"}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Location
          </label>
          {isEditing ? (
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
          ) : (
            <p className="text-[15px] font-medium text-slate-800 capitalize py-2.5">
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
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
          <span className="material-symbols-outlined text-[18px]">code</span>
        </span>
        Skills & Interests
      </h2>

      <div className="space-y-6">
        {/* Skills */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all min-h-[80px] resize-y"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {user.skills && user.skills.length > 0 ? (
                user.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-yellow-50 text-amber-900 rounded-xl text-xs font-bold border border-yellow-200/60"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-400 italic py-4 w-full text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No skills added yet
                </p>
              )}
            </div>
          )}
        </div>

        {/* Interests */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all min-h-[80px] resize-y"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {user.interests && user.interests.length > 0 ? (
                user.interests.map((interest, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold border border-slate-200"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-400 italic py-4 w-full text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
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
