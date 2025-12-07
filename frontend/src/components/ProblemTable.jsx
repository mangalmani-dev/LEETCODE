import React, { useState, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link } from "react-router-dom";
import { Bookmark, PencilIcon, TrashIcon, Plus } from "lucide-react";
import { useActions } from "../store/useAction.js";
import { usePlaylistStore } from "../store/usePlaylistStore.js";
import { CreatePlaylistModel } from "../components/CreatePlaylistModel.jsx";
import AddToPlaylist from "./AddToPlaylist.jsx";

const ProblemTable = ({ problems }) => {

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const { isDeletingProblem, onDeleteProblem } = useActions();
  const { createPlaylist } = usePlaylistStore();
  const { authUser } = useAuthStore();
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  const handleCreatePlaylist = async (data) => {
    await createPlaylist(data);
  };

  const difficulties = ["EASY", "MEDIUM", "HARD"];

  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const set = new Set();
    problems.forEach((p) => p?.tags?.forEach((t) => set.add(t)));
    return [...set];
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => (difficulty === "ALL" ? true : p.difficulty === difficulty))
      .filter((p) => (selectedTag === "ALL" ? true : p.tags?.includes(selectedTag)));
  }, [problems, search, difficulty, selectedTag]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);

  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProblems, currentPage]);

  const handleDelete = (id) => {
    console.log("Deleting: ", id);
    onDeleteProblem(id);
  };
  const handleAddToPlaylist = (problemId) => {
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModalOpen(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-28">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Problems</h2>

        <button
          className="btn btn-primary gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Create Playlist
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by title"
          className="input input-bordered w-full md:w-1/3 bg-base-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="select select-bordered bg-base-200"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="ALL">All Difficulties</option>
          {difficulties.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          className="select select-bordered bg-base-200"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="ALL">All Tags</option>
          {allTags.map((tag) => (
            <option key={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-md">
        <table className="table table-zebra table-lg bg-base-200 text-base-content">
          <thead className="bg-base-300">
            <tr>
              <th>Solved</th>
              <th>Title</th>
              <th>Tags</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProblems.length > 0 ? (
              paginatedProblems.map((problem) => {
                const id = problem.id || problem._id; // FIXED
                const isSolved = problem.solvedBy?.some(
                  (u) => u.userId === authUser?.id
                );

                return (
                  <tr key={id}>
                    <td>
                      <input type="checkbox" checked={isSolved} readOnly className="checkbox checkbox-sm" />
                    </td>

                    <td>
                      <Link to={`/problem/${id}`} className="font-semibold hover:underline">
                        {problem.title}
                      </Link>
                    </td>

                    <td>
                      <div className="flex flex-wrap gap-1">
                        {(problem.tags || []).map((tag, i) => (
                          <span key={i} className="badge badge-outline badge-warning text-xs font-bold">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td>
                      <span className={`badge text-xs text-white ${problem.difficulty === "EASY" ? "badge-success" :
                          problem.difficulty === "MEDIUM" ? "badge-warning" :
                            "badge-error"
                        }`}>
                        {problem.difficulty}
                      </span>
                    </td>

                    <td>
                      <div className="flex gap-2">

                        {authUser?.role === "ADMIN" && (
                          <>
                            <button
                              onClick={() => handleDelete(id)}
                              className="btn btn-sm btn-error"
                            >
                              <TrashIcon className="w-4 h-4 text-white" />
                            </button>

                            <button className="btn btn-sm btn-warning">
                              <PencilIcon className="w-4 h-4 text-white" />
                            </button>
                          </>
                        )}

                        <button
                          className="btn btn-sm btn-outline flex gap-2"
                          onClick={() => handleAddToPlaylist(id)}
                        >
                          <Bookmark className="w-4 h-4" />
                          Save to Playlist
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No problems found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button className="btn btn-sm" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Prev
        </button>

        <span className="btn btn-ghost btn-sm">
          {currentPage} / {totalPages}
        </span>

        <button className="btn btn-sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          Next
        </button>
      </div>

      {/* Playlist Modal */}
      <CreatePlaylistModel
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
      />

      <AddToPlaylist
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        problemId={selectedProblemId}
      />

    </div>
  );
};

export default ProblemTable;
