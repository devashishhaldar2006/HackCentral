const Logo = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Left Vertical Pillar */}
    <rect x="3" y="3" width="3.5" height="18" rx="1.2" fill={color} />
    {/* Right Vertical Pillar */}
    <rect x="17.5" y="3" width="3.5" height="18" rx="1.2" fill={color} />
    {/* Central Crossbar */}
    <rect x="6.5" y="9.5" width="11" height="5" rx="1.2" fill={color} />
    {/* Central Spark/Diamond Portal Accent */}
    <polygon points="12,8 14.5,12 12,16 9.5,12" fill="#FACC15" />
  </svg>
);

export default Logo;
