import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../lib/constants";
import { addUser } from "../lib/userSlice";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    avatar: "",
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
    
    // Always try to fetch fresh data on mount to get populated fields
    fetchFreshProfile();

    return () => { isMounted = false; };
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        gender: user.gender || "",
        avatar: user.avatar || "",
        college: user.college || "",
        location: user.location || "",
        skills: user.skills && Array.isArray(user.skills) ? user.skills.join(", ") : "",
        interests: user.interests && Array.isArray(user.interests) ? user.interests.join(", ") : "",
        github: user.github || "",
        linkedin: user.linkedin || "",
        website: user.website || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    
    // Front end simple basic validations
    const urlPattern = /^https?:\/\/.+/i;
    
    if (formData.avatar && !urlPattern.test(formData.avatar)) {
        setError("Avatar must be a valid URL starting with http/https");
        setLoading(false);
        return;
    }
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
    if (user?.role === 'organizer' && formData.website && !urlPattern.test(formData.website)) {
        setError("Website must be a valid URL starting with http/https");
        setLoading(false);
        return;
    }

    try {
      const payload = {
        ...formData,
        skills: formData.skills ? formData.skills.split(",").map(s => s.trim()).filter(s => s) : [],
        interests: formData.interests ? formData.interests.split(",").map(i => i.trim()).filter(i => i) : [],
      };

      const response = await axios.patch(`${BASE_URL}/profile/me/edit`, payload, {
        withCredentials: true,
      });

      dispatch(addUser(response.data.data));
      setSuccessMsg("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
          
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-800">
              <img 
                src={user.avatar || "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=1480"} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
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
              {user.role === 'organizer' && user.verified && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-500 uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Verified
                </span>
              )}
              {user.location && (
                <span className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-[18px] mr-1">location_on</span>
                  <span className="capitalize">{user.location}</span>
                </span>
              )}
            </div>
          </div>
          
          <div className="z-10">
             {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn bg-primary hover:bg-primary-focus text-white border-none rounded-xl px-6"
                >
                  <span className="material-symbols-outlined text-[20px]">edit</span>
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
                    {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Save Changes'}
                  </button>
                </div>
             )}
          </div>
        </div>

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
                <span className="material-symbols-outlined text-primary">person</span>
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-0">Full Name</label>
                  {isEditing ? (
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="input input-bordered focus:border-primary focus:outline-none rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                  ) : (
                    <p className="font-medium text-slate-900 dark:text-slate-200 capitalize">{user.fullName || "—"}</p>
                  )}
                </div>

                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-0">Gender</label>
                  {isEditing ? (
                    <select name="gender" value={formData.gender} onChange={handleChange} className="select select-bordered focus:border-primary focus:outline-none rounded-xl dark:bg-slate-800 dark:border-slate-700">
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <p className="font-medium text-slate-900 dark:text-slate-200 capitalize">{user.gender || "—"}</p>
                  )}
                </div>

                {isEditing && (
                    <div className="form-control md:col-span-2">
                    <label className="label text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-0">Avatar URL</label>
                    <input type="text" name="avatar" value={formData.avatar} onChange={handleChange} placeholder="https://..." className="input input-bordered focus:border-primary focus:outline-none rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                    </div>
                )}

                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-0">College/University</label>
                  {isEditing ? (
                    <input type="text" name="college" value={formData.college} onChange={handleChange} className="input input-bordered focus:border-primary focus:outline-none rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                  ) : (
                    <p className="font-medium text-slate-900 dark:text-slate-200 capitalize">{user.college || "—"}</p>
                  )}
                </div>

                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-0">Location</label>
                  {isEditing ? (
                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="input input-bordered focus:border-primary focus:outline-none rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                  ) : (
                    <p className="font-medium text-slate-900 dark:text-slate-200 capitalize">{user.location || "—"}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">psychology</span>
                Skills & Interests
              </h2>
              
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-0">
                    Skills {isEditing && <span className="lowercase normal-case text-xs font-normal opacity-70">(Comma separated)</span>}
                  </label>
                  {isEditing ? (
                    <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Python" className="input input-bordered focus:border-primary focus:outline-none rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.skills && user.skills.length > 0 ? user.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700">
                          {skill}
                        </span>
                      )) : <p className="text-slate-500 dark:text-slate-400 text-sm italic">— No skills added —</p>}
                    </div>
                  )}
                </div>

                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-0">
                    Interests {isEditing && <span className="lowercase normal-case text-xs font-normal opacity-70">(Comma separated)</span>}
                  </label>
                  {isEditing ? (
                    <input type="text" name="interests" value={formData.interests} onChange={handleChange} placeholder="Web Dev, AI/ML, Design" className="input input-bordered focus:border-primary focus:outline-none rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.interests && user.interests.length > 0 ? user.interests.map((interest, i) => (
                        <span key={i} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium border border-blue-100 dark:border-blue-800/30">
                          {interest}
                        </span>
                      )) : <p className="text-slate-500 dark:text-slate-400 text-sm italic">— No interests added —</p>}
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
                <span className="material-symbols-outlined text-primary">link</span>
                Social Links
              </h2>
              
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-0">GitHub</label>
                  {isEditing ? (
                    <input type="url" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/username" className="input input-bordered focus:border-primary focus:outline-none rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                  ) : (
                    user.github ? <a href={user.github} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline truncate font-medium">{user.github}</a> : <p className="text-slate-500 dark:text-slate-400 text-sm">—</p>
                  )}
                </div>

                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-0">LinkedIn</label>
                  {isEditing ? (
                    <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/username" className="input input-bordered focus:border-primary focus:outline-none rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                  ) : (
                    user.linkedin ? <a href={user.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline truncate font-medium">{user.linkedin}</a> : <p className="text-slate-500 dark:text-slate-400 text-sm">—</p>
                  )}
                </div>
                
                {user.role === 'organizer' && (
                  <div className="form-control">
                    <label className="label text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-0">Website</label>
                    {isEditing ? (
                      <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://your-organization.com" className="input input-bordered focus:border-primary focus:outline-none rounded-xl dark:bg-slate-800 dark:border-slate-700" />
                    ) : (
                      user.website ? <a href={user.website} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline truncate font-medium">{user.website}</a> : <p className="text-slate-500 dark:text-slate-400 text-sm">—</p>
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
                    <span className="text-2xl font-bold">{user.bookmarkedEvents?.length || 0}</span>
                 </div>
                 {user.role === 'user' && (
                 <div className="flex justify-between items-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <span className="font-medium">Registered</span>
                    <span className="text-2xl font-bold">{user.registeredEvents?.length || 0}</span>
                 </div>
                 )}
                 {user.role === 'organizer' && (
                 <div className="flex justify-between items-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <span className="font-medium">Organized</span>
                    <span className="text-2xl font-bold">{user.submittedEvents?.length || 0}</span>
                 </div>
                 )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;