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
      <div className="relative bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 dark:from-slate-900 dark:via-slate-950 dark:to-slate-800 p-8 flex flex-col md:flex-row items-center gap-6 transition-colors duration-300">

        {/* 🔥 TOP-RIGHT BUTTONS */}
        <div className="absolute top-4 right-6 flex gap-4">
          <Link
            to="/home"
            className="
              px-5 py-2 rounded-xl font-semibold text-base
              bg-slate-900 text-white
              dark:bg-slate-100 dark:text-slate-900
              hover:scale-105 transition-all duration-300
              shadow-md
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
            className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-700 shadow-lg"
          />
        </div>

        {/* User Info */}
        <div className="flex-1 text-slate-900 dark:text-slate-100">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold">
              {user.name || "Anonymous"}
            </h1>
            <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm font-semibold">
              {user.role}
            </span>
          </div>

          <p className="text-slate-700 dark:text-slate-300 mt-1">
            <span className="text-xl">📧</span> {user.email}
          </p>

          {/* Key Stats */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="bg-white/60 dark:bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 shadow">
              <span>🔥</span>
              <span>Strike: {stats.strike}</span>
            </div>

            <div className="bg-white/60 dark:bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 shadow">
              <span>🏆</span>
              <span>Rank: {stats.rank}</span>
            </div>

            <div className="bg-white/60 dark:bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 shadow">
              <span>🎯</span>
              <span>Success Rate: {stats.successRate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
