import { motion } from "framer-motion";
import { fadeUp } from "../../lib/dashboardUtils";

// ── Stat Card ──
export const StatCard = ({ icon, label, value, color, delay }) => (
  <motion.div
    custom={delay}
    variants={fadeUp}
    className="bg-white dark:bg-[#161d2f] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-lg hover:shadow-slate-200/30 dark:hover:shadow-black/20 transition-shadow duration-300"
  >
    <div className="flex items-center gap-3 mb-3">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
      >
        <span className="material-symbols-outlined text-xl text-white">
          {icon}
        </span>
      </div>
      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        {label}
      </span>
    </div>
    <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums dashboard-stat-enter">
      {value}
    </p>
  </motion.div>
);

// ── Section wrapper ──
export const Section = ({ title, icon, children, delay = 0, className = "" }) => (
  <motion.div
    custom={delay}
    variants={fadeUp}
    className={`bg-white dark:bg-[#161d2f] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 ${className}`}
  >
    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2.5">
      <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      </span>
      {title}
    </h2>
    {children}
  </motion.div>
);

// ── Custom Recharts Tooltip ──
export const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-[#1c2438] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 shadow-lg">
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-0.5">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-800 dark:text-white">
          {payload[0].value} {payload[0].value === 1 ? "activity" : "activities"}
        </p>
      </div>
    );
  }
  return null;
};

// ── Empty state helper ──
export const EmptyState = ({ text, icon, action }) => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
      <span className="material-symbols-outlined text-2xl text-slate-400 dark:text-slate-600">
        {icon || "inbox"}
      </span>
    </div>
    <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
      {text}
    </p>
    {action && <div className="mt-2">{action}</div>}
  </div>
);
