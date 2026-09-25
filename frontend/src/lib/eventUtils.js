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

/* ── editorial event card gradient accents (curated warm & technical, avoid neon blue/purple) ── */
export const GRADIENTS = [
  "from-amber-600 via-yellow-600 to-stone-900",
  "from-stone-800 via-neutral-900 to-amber-950",
  "from-yellow-700 via-amber-800 to-zinc-900",
  "from-orange-700 via-amber-800 to-neutral-900",
  "from-stone-900 via-amber-900 to-yellow-800",
  "from-yellow-600 via-stone-800 to-neutral-950",
];

/* ── badge colours tailored for yellow/warm white editorial design ── */
export const CATEGORY_COLORS = {
  Conference: "bg-[#facc15] text-[#0b0d11]",
  Hackathon: "bg-[#facc15] text-[#0b0d11]",
  Workshop: "bg-amber-400 text-[#0b0d11]",
  Expo: "bg-yellow-300 text-[#0b0d11]",
  Meetup: "bg-stone-200 text-[#0b0d11]",
  Entertainment: "bg-amber-500 text-white",
  Competition: "bg-[#eab308] text-[#0b0d11]",
};

export const MODE_COLORS = {
  Online: "bg-emerald-500/90 text-white",
  Offline: "bg-[#facc15] text-[#0b0d11]",
  Hybrid: "bg-amber-400 text-[#0b0d11]",
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
