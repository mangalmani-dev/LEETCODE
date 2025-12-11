import { useProfileStore } from "../store/useProfileStore";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";

export default function RecentSubmissions() {
  const { profile, loading } = useProfileStore();

  if (loading)
    return (
      <div className="w-full flex justify-center py-10">
        <Loader className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );

  if (!profile || profile.recentSubmissions.length === 0)
    return (
      <div className="bg-white p-6 rounded-xl shadow text-center text-gray-600">
        No submissions yet.
      </div>
    );

  const { recentSubmissions } = profile;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Recent Submissions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentSubmissions.map((sub) => (
          <Link
            to={`/problem/${sub.problem?.id}`}
            key={sub.id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            <h3 className="font-semibold text-lg text-blue-600 mb-1">
              {sub.problem?.title}
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              Difficulty:{" "}
              <span
                className={`font-medium ${
                  sub.problem?.difficulty === "EASY"
                    ? "text-green-600"
                    : sub.problem?.difficulty === "MEDIUM"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {sub.problem?.difficulty}
              </span>
            </p>
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              <span>📝 {sub.language}</span>
              <span>⏱ {JSON.parse(sub.time)[0]}</span>
              <span>💾 {JSON.parse(sub.memory)[0]}</span>
              <span>📅 {new Date(sub.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="mt-2">
              <StatusBadge status={sub.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  let color = "bg-gray-200 text-gray-700";

  if (status === "Accepted") color = "bg-green-100 text-green-700";
  else if (status === "Wrong Answer") color = "bg-red-100 text-red-700";
  else if (status === "Time Limit Exceeded") color = "bg-yellow-100 text-yellow-700";
  else if (status === "Compilation Error") color = "bg-blue-100 text-blue-700";

  return (
    <span className={`px-3 py-1 text-xs rounded-full font-medium ${color}`}>
      {status}
    </span>
  );
}
