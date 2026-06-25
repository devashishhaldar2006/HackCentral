import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../../lib/constants";
import { Spinner } from "../ui/Spinner";

export const EventSubmissionModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Hackathon",
    mode: "Online",
    price: "Free",
    startDate: "",
    endDate: "",
    location: "",
    venue: "",
    registrationLink: "",
    image: "",
    tags: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Edit mode: format dates to YYYY-MM-DDThh:mm
        const formatDateForInput = (isoString) => {
          if (!isoString) return "";
          const d = new Date(isoString);
          const tzOffset = d.getTimezoneOffset() * 60000;
          return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
        };
        
        setFormData({
          title: initialData.title || "",
          description: initialData.description || "",
          category: initialData.category || "Hackathon",
          mode: initialData.mode || "Online",
          price: initialData.price || "Free",
          startDate: formatDateForInput(initialData.startDate),
          endDate: formatDateForInput(initialData.endDate),
          location: initialData.location || "",
          venue: initialData.venue || "",
          registrationLink: initialData.registrationLink || "",
          image: initialData.image || "",
          tags: initialData.tags ? initialData.tags.join(", ") : "",
        });
      } else {
        // Create mode
        setFormData({
          title: "",
          description: "",
          category: "Hackathon",
          mode: "Online",
          price: "Free",
          startDate: "",
          endDate: "",
          location: "",
          venue: "",
          registrationLink: "",
          image: "",
          tags: "",
        });
      }
      setError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      };

      if (initialData) {
        await axios.put(`${BASE_URL}/events/${initialData._id}`, payload, {
          withCredentials: true,
        });
      } else {
        await axios.post(`${BASE_URL}/events`, payload, {
          withCredentials: true,
        });
      }

      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || (initialData ? "Failed to update event" : "Failed to submit event"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800/60">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {initialData ? "Edit Event" : "Create New Event"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {initialData ? "Update the details of your event." : "Fill out the details below to publish your event."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 shrink-0">
                  error
                </span>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  {error}
                </p>
              </div>
            )}

            <form id="event-submit-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Global Tech Hackathon 2026"
                    className="w-full h-12 px-4 bg-slate-50 dark:bg-[#1a2235] border border-slate-200 dark:border-slate-700/60 rounded-xl focus:border-[#0d4af2] focus:ring-1 focus:ring-[#0d4af2] outline-none transition-all text-sm text-slate-900 dark:text-white"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe your event..."
                    className="w-full p-4 bg-slate-50 dark:bg-[#1a2235] border border-slate-200 dark:border-slate-700/60 rounded-xl focus:border-[#0d4af2] focus:ring-1 focus:ring-[#0d4af2] outline-none transition-all text-sm text-slate-900 dark:text-white resize-y"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full h-12 px-4 bg-slate-50 dark:bg-[#1a2235] border border-slate-200 dark:border-slate-700/60 rounded-xl focus:border-[#0d4af2] outline-none text-sm text-slate-900 dark:text-white"
                    >
                      <option value="Conference">Conference</option>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Expo">Expo</option>
                      <option value="Meetup">Meetup</option>
                      <option value="Entertainment">Entertainment</option>
                    </select>
                  </div>

                  {/* Mode */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Mode *
                    </label>
                    <select
                      name="mode"
                      value={formData.mode}
                      onChange={handleChange}
                      className="w-full h-12 px-4 bg-slate-50 dark:bg-[#1a2235] border border-slate-200 dark:border-slate-700/60 rounded-xl focus:border-[#0d4af2] outline-none text-sm text-slate-900 dark:text-white"
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Price *
                    </label>
                    <select
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full h-12 px-4 bg-slate-50 dark:bg-[#1a2235] border border-slate-200 dark:border-slate-700/60 rounded-xl focus:border-[#0d4af2] outline-none text-sm text-slate-900 dark:text-white"
                    >
                      <option value="Free">Free</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Start Date *
                    </label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="w-full h-12 px-4 bg-slate-50 dark:bg-[#1a2235] border border-slate-200 dark:border-slate-700/60 rounded-xl focus:border-[#0d4af2] outline-none text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      End Date
                    </label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full h-12 px-4 bg-slate-50 dark:bg-[#1a2235] border border-slate-200 dark:border-slate-700/60 rounded-xl focus:border-[#0d4af2] outline-none text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Location & Venue */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Location / City
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. San Francisco, CA"
                      className="w-full h-12 px-4 bg-slate-50 dark:bg-[#1a2235] border border-slate-200 dark:border-slate-700/60 rounded-xl focus:border-[#0d4af2] outline-none text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Venue Name
                    </label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange}
                      placeholder="e.g. Moscone Center"
                      className="w-full h-12 px-4 bg-slate-50 dark:bg-[#1a2235] border border-slate-200 dark:border-slate-700/60 rounded-xl focus:border-[#0d4af2] outline-none text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Links & Image */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Registration Link
                    </label>
                    <input
                      type="url"
                      name="registrationLink"
                      value={formData.registrationLink}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full h-12 px-4 bg-slate-50 dark:bg-[#1a2235] border border-slate-200 dark:border-slate-700/60 rounded-xl focus:border-[#0d4af2] outline-none text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Promotional Image URL
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full h-12 px-4 bg-slate-50 dark:bg-[#1a2235] border border-slate-200 dark:border-slate-700/60 rounded-xl focus:border-[#0d4af2] outline-none text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g. AI, React, Web3"
                    className="w-full h-12 px-4 bg-slate-50 dark:bg-[#1a2235] border border-slate-200 dark:border-slate-700/60 rounded-xl focus:border-[#0d4af2] outline-none text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-[#1a2235]/50 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="event-submit-form"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#0d4af2] hover:bg-[#0d4af2]/90 text-white shadow-lg shadow-[#0d4af2]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {loading && <Spinner />}
              {loading ? "Submitting..." : initialData ? "Save Changes" : "Submit Event"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
