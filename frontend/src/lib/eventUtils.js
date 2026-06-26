/* ── icon map for categories ── */
export const CATEGORY_ICONS = {
  All: "apps",
  Conference: "groups",
  Hackathon: "code",
  Workshop: "build",
  Expo: "storefront",
  Meetup: "handshake",
  Entertainment: "celebration",
  Competition: "emoji_events",
};

/* ── gradient palettes for cards ── */
export const GRADIENTS = [
  "from-indigo-600 via-blue-700 to-cyan-500",
  "from-orange-500 via-rose-500 to-pink-600",
  "from-purple-600 via-violet-600 to-indigo-700",
  "from-sky-500 via-blue-500 to-indigo-600",
  "from-red-600 via-rose-600 to-pink-700",
  "from-teal-500 via-emerald-500 to-green-600",
  "from-amber-500 via-orange-500 to-red-500",
  "from-fuchsia-600 via-pink-600 to-rose-500",
];

/* ── badge colours ── */
export const CATEGORY_COLORS = {
  Conference: "bg-[#0d4af2]",
  Hackathon: "bg-violet-600",
  Workshop: "bg-amber-500",
  Expo: "bg-emerald-600",
  Meetup: "bg-sky-500",
  Entertainment: "bg-rose-500",
  Competition: "bg-fuchsia-600",
};

export const MODE_COLORS = {
  Online: "bg-emerald-500",
  Offline: "bg-[#0d4af2]",
  Hybrid: "bg-purple-500",
};

/* ── date helper ── */
export const formatDate = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateRange = (start, end) => {
  const s = formatDate(start);
  const e = formatDate(end);
  if (!e || s === e) return s;
  return `${s} – ${e}`;
};

export const ALL_CATEGORIES = ["All", "Conference", "Hackathon", "Workshop", "Expo", "Meetup", "Entertainment", "Competition"];
export const ALL_MODES = ["All Modes", "Online", "Offline", "Hybrid"];
export const ALL_PRICES = ["All", "Free", "Paid"];
export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title", label: "A → Z" },
];
