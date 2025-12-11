import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const LandingNavbar = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-200 px-10 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">

      {/* LEFT - LOGO */}
      <div className="flex items-center gap-3">
        <img src="/leetlab.svg" alt="Logo" className="h-12 w-auto" />
        <span className="text-xl font-bold text-gray-900">CodeMani</span>
      </div>

      {/* CENTER MENU */}
      <div className="hidden md:flex items-center gap-10 text-[17px] font-medium">

        <Link to="/" className="text-orange-600 font-semibold">
          Home
        </Link>

        <Link to="/practice" className="text-gray-700 hover:text-black">
          Practice
        </Link>

        <button className="flex items-center gap-1 text-gray-700 hover:text-black">
          Discover <ChevronDown size={18} />
        </button>

        <button className="flex items-center gap-1 text-gray-700 hover:text-black">
          Resources <ChevronDown size={18} />
        </button>

        <Link to="/pricing" className="text-gray-700 hover:text-black">
          Pricing
        </Link>

      </div>

      {/* RIGHT BUTTONS */}
      <div className="flex items-center gap-4">

        <Link
          to="/login"
          className="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100"
        >
          Log In
        </Link>

        <Link
          to="/signup"
          className="px-6 py-2 rounded-xl font-semibold text-white bg-gradient-to-b from-neutral-900 to-black shadow-[0_3px_10px_rgba(0,0,0,0.35)] hover:scale-[1.02] transition"
        >
          Join For Free
        </Link>

      </div>

    </nav>
  );
};

export default LandingNavbar;
