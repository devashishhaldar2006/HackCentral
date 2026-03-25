import React from "react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b p-4 flex justify-between">
      <h2 className="text-xl font-black text-primary">HackCentral</h2>

      <nav className="hidden md:flex gap-6">
        <a href="#">Dashboard</a>
        <a href="#">Team Finder</a>
        <a href="#">Profile</a>
      </nav>

      <div className="flex gap-4 items-center">
        <button>🔔</button>
        <div className="w-8 h-8 bg-primary rounded-full" />
      </div>
    </header>
  );
};

export default Header;
