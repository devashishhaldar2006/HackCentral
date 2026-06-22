export const PIE_COLORS = [
  "#0d4af2",
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
  "#ef4444",
  "#10b981",
];

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

export const staggerContainerOrganizerDashboard = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

export const TAG_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
];

export const staggerContainerUserDashboard = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};