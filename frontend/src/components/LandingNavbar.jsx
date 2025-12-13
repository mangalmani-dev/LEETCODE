import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const LandingNavbar = () => {
  const location = useLocation();

  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false); // NEW STATE

  const isActive = (path) =>
    location.pathname === path
      ? "text-black font-semibold relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[3px] after:bg-orange-500 after:rounded-full"
      : "text-gray-600 hover:text-black transition";

  return (
    <nav className="w-full backdrop-blur-md bg-white/70 border-b border-gray-200 px-10 py-4 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.05)] sticky top-0 z-50">

      {/* LEFT LOGO */}
      <div className="flex items-center gap-3">
        <img src="/leetlab.svg" alt="Logo" className="h-12 w-auto" />
        <span className="text-2xl font-extrabold bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent tracking-tight">
          CodeMani
        </span>
      </div>

      {/* CENTER MENU */}
      <div className="hidden md:flex items-center gap-10 text-[17px] font-medium">

        <Link to="/" className={`relative pb-1 ${isActive("/")}`}>
          Home
        </Link>
<Link to="/login" className={`relative pb-1 ${isActive("/login")}`}>
  Practice
</Link>

        {/* DISCOVER */}
        <div
          className="relative cursor-pointer"
          onMouseEnter={() => setDiscoverOpen(true)}
          onMouseLeave={() => setDiscoverOpen(false)}
        >
          <button className="flex items-center gap-1 text-gray-600 hover:text-black transition">
            Discover <ChevronDown size={17} />
          </button>

          {discoverOpen && (
            <div className="absolute top-full mt-3 w-56 bg-white/90 backdrop-blur-lg shadow-xl border border-gray-200 rounded-2xl p-2 animate-fade-in">
              <DropdownItem to="/discover/explore">🚀 Explore</DropdownItem>
              <DropdownItem to="/discover/categories">📂 Categories</DropdownItem>
              <DropdownItem to="/discover/tags">🏷️ Tags</DropdownItem>
            </div>
          )}
        </div>

        {/* RESOURCES */}
        <div
          className="relative cursor-pointer"
          onMouseEnter={() => setResourcesOpen(true)}
          onMouseLeave={() => setResourcesOpen(false)}
        >
          <button className="flex items-center gap-1 text-gray-600 hover:text-black transition">
            Resources <ChevronDown size={17} />
          </button>

          {resourcesOpen && (
            <div className="absolute top-full mt-3 w-56 bg-white/90 backdrop-blur-lg shadow-xl border border-gray-200 rounded-2xl p-2 animate-fade-in">
              <DropdownItem to="/resources/blogs">📝 Blogs</DropdownItem>
              <DropdownItem to="/resources/guides">📘 Guides</DropdownItem>
              <DropdownItem to="/resources/youtube">🎥 YouTube</DropdownItem>
            </div>
          )}
        </div>

        {/* PRICING DROPDOWN (New) */}
        <div
          className="relative cursor-pointer"
          onMouseEnter={() => setPricingOpen(true)}
          onMouseLeave={() => setPricingOpen(false)}
        >
          <button className="flex items-center gap-1 text-gray-600 hover:text-black transition">
            Pricing <ChevronDown size={17} />
          </button>

          {pricingOpen && (
            <div className="absolute top-full mt-3 w-56 bg-white/90 backdrop-blur-lg shadow-xl border border-gray-200 rounded-2xl p-2 animate-fade-in">
              <DropdownItem to="/pricing/free">🆓 Free Plan</DropdownItem>
              <DropdownItem to="/pricing/pro">⚡ Pro Plan</DropdownItem>
              <DropdownItem to="/pricing/premium">🚀 Premium Plan</DropdownItem>
            </div>
          )}
        </div>

      </div>

      {/* RIGHT BUTTONS */}
      <div className="flex items-center gap-4">

        <Link
          to="/login"
          className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition shadow-sm hover:shadow"
        >
          Log In
        </Link>

        <Link
          to="/signup"
          className="px-6 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-gray-900 to-black shadow-lg hover:shadow-xl hover:scale-[1.04] transition-transform"
        >
          Join For Free
        </Link>

      </div>

    </nav>
  );
};

const DropdownItem = ({ children, to }) => (
  <Link
    to={to}
    className="flex px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition font-medium text-[15px]"
  >
    {children}
  </Link>
);

export default LandingNavbar;
