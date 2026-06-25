import React from "react";

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-md ${className}`}
      {...props}
    />
  );
};

export const EventCardSkeleton = () => {
  return (
    <div className="flex flex-col bg-white dark:bg-[#111827] rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/60 shadow-sm h-full p-4 gap-4">
      <Skeleton className="w-full h-48 rounded-xl" />
      <div className="flex flex-col gap-2">
        <Skeleton className="w-3/4 h-6" />
        <Skeleton className="w-1/2 h-4" />
      </div>
      <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800/60">
        <Skeleton className="w-24 h-8 rounded-lg" />
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
    </div>
  );
};
