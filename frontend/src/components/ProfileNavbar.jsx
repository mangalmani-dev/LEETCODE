import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProfileStore } from "../store/useProfileStore";

export default function ProfileHeader() {
  const { profile, loading, fetchProfile } = useProfileStore();

  useEffect(() => {
    if (!profile) fetchProfile();
  }, [profile, fetchProfile]);

  if (loading || !profile) return null;

  const { user, stats } = profile;
  return (
    <div className="fixed top-0 left-0 w-screen z-50 shadow-lg">
      <div className="relative bg-gradient-to-r from-black via-teal-900 to-cyan-700 p-8 flex flex-col md:flex-row items-center gap-6">

        {/* 🔥 TOP-RIGHT BUTTONS */}
        <div className="absolute top-4 right-6 flex gap-4">
          {/* Home */}
          <Link
            to="/home"
            className="
              px-5 py-2 rounded-xl font-semibold text-base
              bg-gradient-to-r from-purple-500 via-pink-600 to-red-500
              shadow-[0_0_12px_rgba(255,0,128,0.8)]
              hover:shadow-[0_0_20px_rgba(255,0,128,1)]
              hover:scale-105 transition-all duration-300
              text-white
            "
          >
            ⬅ Home
          </Link>
        </div>

        {/* Avatar */}
        <div className="relative">
          <img
            src={user.image || "/profile.jpg"}
            alt="Avatar"
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
          />
        </div>

        {/* User Info */}
        <div className="flex-1 text-white">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{user.name || "Anonymous"}</h1>
            <span className="px-3 py-1 bg-pink-500 rounded-full text-sm font-semibold">
              {user.role}
            </span>
          </div>

          <p className="text-gray-200 mt-1">
            <span className="text-2xl">📧</span> {user.email}
          </p>

          {/* Key Stats */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="bg-black/30 px-4 py-2 rounded-xl flex items-center gap-2">
              <span>🔥</span> <span>Strike: {stats.strike}</span>
            </div>
            <div className="bg-black/30 px-4 py-2 rounded-xl flex items-center gap-2">
              <span>🏆</span> <span>Rank: {stats.rank}</span>
            </div>
            <div className="bg-black/30 px-4 py-2 rounded-xl flex items-center gap-2">
              <span>🎯</span> <span>Success Rate: {stats.successRate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
