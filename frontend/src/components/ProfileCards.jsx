// components/ProfileStats.jsx
import { useProfileStore } from "../store/useProfileStore";

export default function ProfileStats() {
  const { profile, loading } = useProfileStore();

  if (loading || !profile) return null;

  const { stats, user } = profile;

  // Build stat items dynamically
  const statItems = [
    ...(user.role === "ADMIN"
      ? [{ label: "Problems Created", value: stats.totalProblemsCreated, icon: "📝" }]
      : []),
    { label: "Problems Solved", value: stats.totalSolved, icon: "✅" },
    { label: "Submissions", value: stats.totalSubmissions, icon: "📤" },
    { label: "Playlists", value: stats.totalPlaylists, icon: "🎵" },
  ];

  // Dynamic columns (safe for Tailwind)
  const colClass =
    statItems.length === 1
      ? "lg:grid-cols-1"
      : statItems.length === 2
      ? "lg:grid-cols-2"
      : statItems.length === 3
      ? "lg:grid-cols-3"
      : "lg:grid-cols-4";

  return (
    <div className="w-full mt-6">
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${colClass} gap-4 w-full`}>
        {statItems.map((stat, idx) => (
          <div
            key={idx}
            className="
              flex items-center gap-4 p-5 rounded-2xl shadow-lg
              bg-white/70 dark:bg-slate-900/60
              backdrop-blur-xl
              border border-slate-200/60 dark:border-slate-700/50
              transition-all duration-300
              hover:scale-[1.03] hover:shadow-xl
            "
          >
            <span className="text-3xl sm:text-4xl">{stat.icon}</span>

            <div className="text-slate-900 dark:text-slate-100">
              <p className="text-xl sm:text-2xl font-bold">
                {stat.value}
              </p>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
