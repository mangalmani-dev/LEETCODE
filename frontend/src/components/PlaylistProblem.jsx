import { Link } from "react-router-dom";

export default function PlaylistProblems({ playlists }) {
  if (!playlists || playlists.length === 0)
    return (
      <div className="bg-white p-6 rounded-xl shadow text-center text-gray-600">
        No playlists found.
      </div>
    );

  return (
    <div className="space-y-10">
      {playlists.map((playlist) => (
        <div key={playlist.id} className="space-y-6">
          {/* Playlist Title */}
          <h2 className="text-2xl font-bold text-gray-800">{playlist.name}</h2>

          {/* Problems grid */}
          {playlist.problems.length === 0 ? (
            <p className="text-gray-400 text-sm">No problems added yet</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlist.problems.map((p) =>
                p.problem ? (
                  <Link
                    key={p.problem.id}
                    to={`/problem/${p.problem.id}`}
                    className="bg-white p-5 rounded-xl shadow hover:shadow-2xl 
                               transition transform hover:-translate-y-1"
                  >
                    {/* Problem Title */}
                    <h3 className="font-semibold text-lg text-blue-600 mb-1">
                      {p.problem.title}
                    </h3>

                    {/* Difficulty */}
                    <p className="text-sm text-gray-500 mb-2">
                      Difficulty:{" "}
                      <span
                        className={`font-medium ${
                          p.problem.difficulty === "EASY"
                            ? "text-green-600"
                            : p.problem.difficulty === "MEDIUM"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {p.problem.difficulty}
                      </span>
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {p.problem.tags?.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ) : null
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
