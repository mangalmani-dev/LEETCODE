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

  // Determine number of columns based on number of cards
  const colClass = `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${statItems.length}`;

  return (
    <div className="w-full mt-6">
      <div className={`grid ${colClass} gap-4 w-full`}>
        {statItems.map((stat, idx) => (
          <div
            key={idx}
            className="
              flex items-center gap-4 p-5 text-white shadow-xl rounded-2xl
              bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700
              transition-transform transform hover:scale-105 hover:shadow-2xl
            "
          >
            <span className="text-3xl sm:text-4xl">{stat.icon}</span>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
              <p className="text-sm sm:text-base opacity-80">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
