import React from "react";

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse bg-slate-100 rounded-xl ${className}`}
      {...props}
    />
  );
};

export const EventCardSkeleton = () => {
  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm h-full p-4 gap-4">
      <Skeleton className="w-full h-48 rounded-xl bg-slate-100" />
      <div className="flex flex-col gap-2">
        <Skeleton className="w-3/4 h-6 bg-slate-100" />
        <Skeleton className="w-1/2 h-4 bg-slate-100" />
      </div>
      <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100">
        <Skeleton className="w-24 h-8 rounded-lg bg-yellow-100/60" />
        <Skeleton className="w-8 h-8 rounded-full bg-slate-100" />
      </div>
    </div>
  );
};
