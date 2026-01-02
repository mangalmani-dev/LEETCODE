import React, { useState, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link } from "react-router-dom";
import { Bookmark, PencilIcon, TrashIcon, Plus } from "lucide-react";
import { useActions } from "../store/useAction.js";
import { usePlaylistStore } from "../store/usePlaylistStore.js";
import { CreatePlaylistModel } from "../components/CreatePlaylistModel.jsx";
import AddToPlaylist from "./AddToPlaylist.jsx";
import { useProblemStore } from "../store/useProblemStore";

const ProblemTable = ({ problems }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProblem, setEditProblem] = useState(null);

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const { isDeletingProblem, onDeleteProblem } = useActions();
  const { createPlaylist } = usePlaylistStore();
  const { authUser } = useAuthStore();
  const { updateProblem, isUpdatingProblem } = useProblemStore();

  const [selectedProblemId, setSelectedProblemId] = useState(null);

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

  const handleDelete = (id) => onDeleteProblem(id);
  const handleAddToPlaylist = (problemId) => {
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModalOpen(true);
  };
  const handleCreatePlaylist = async (data) => await createPlaylist(data);

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 relative">

      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by title"
          className="input input-bordered w-full md:w-1/3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="select select-bordered bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="ALL">All Difficulties</option>
          {difficulties.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          className="select select-bordered bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="ALL">All Tags</option>
          {allTags.map((tag) => (
            <option key={tag}>{tag}</option>
          ))}
        </select>

        <button
          className="btn btn-primary gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4" /> Create Playlist
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-md">
        <table className="table table-zebra table-lg bg-white dark:bg-slate-900">
          <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
            <tr>
              <th>Solved</th>
              <th>Title</th>
              <th>Tags</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProblems.length ? (
              paginatedProblems.map((problem) => {
                const id = problem.id || problem._id;
                const isSolved = problem.solvedBy?.some(
                  (u) => u.userId === authUser?.id
                );

                return (
                  <tr key={id} className="hover:bg-slate-100 dark:hover:bg-slate-800">
                    <td>
                      <input
                        type="checkbox"
                        checked={isSolved}
                        readOnly
                        className="checkbox checkbox-sm"
                      />
                    </td>

                    <td>
                      <Link
                        to={`/problem/${id}`}
                        className="font-semibold hover:underline text-slate-900 dark:text-slate-100"
                      >
                        {problem.title}
                      </Link>
                    </td>

                    <td>
                      <div className="flex flex-wrap gap-1">
                        {(problem.tags || []).map((tag, i) => (
                          <span key={i} className="badge badge-warning badge-outline text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td>
                      <span className={`badge text-white ${
                        problem.difficulty === "EASY"
                          ? "badge-success"
                          : problem.difficulty === "MEDIUM"
                          ? "badge-warning"
                          : "badge-error"
                      }`}>
                        {problem.difficulty}
                      </span>
                    </td>

                    <td>
                      <div className="flex gap-2">
                        {authUser?.role === "ADMIN" && (
                          <>
                            <button
                              className="btn btn-sm btn-error"
                              onClick={() => handleDelete(id)}
                              disabled={isDeletingProblem}
                            >
                              <TrashIcon className="w-4 h-4 text-white" />
                            </button>

                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => {
                                setEditProblem({ ...problem });
                                setIsEditModalOpen(true);
                              }}
                            >
                              <PencilIcon className="w-4 h-4 text-white" />
                            </button>
                          </>
                        )}

                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleAddToPlaylist(id)}
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-slate-600 dark:text-slate-400">
                  No problems found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          className="btn btn-sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>

        <span className="btn btn-ghost btn-sm">
          {currentPage} / {totalPages}
        </span>

        <button
          className="btn btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editProblem && (
        <div className="modal modal-open">
          <div className="modal-box bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
            <h3 className="font-bold text-lg">Edit Problem</h3>

            <input
              className="input input-bordered w-full mt-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              value={editProblem.title}
              onChange={(e) =>
                setEditProblem({ ...editProblem, title: e.target.value })
              }
            />

            <textarea
              className="textarea textarea-bordered w-full mt-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              value={editProblem.description}
              onChange={(e) =>
                setEditProblem({ ...editProblem, description: e.target.value })
              }
            />

            <select
              className="select select-bordered w-full mt-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              value={editProblem.difficulty}
              onChange={(e) =>
                setEditProblem({ ...editProblem, difficulty: e.target.value })
              }
            >
              <option>EASY</option>
              <option>MEDIUM</option>
              <option>HARD</option>
            </select>

            <input
              className="input input-bordered w-full mt-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              value={(editProblem.tags || []).join(",")}
              onChange={(e) =>
                setEditProblem({
                  ...editProblem,
                  tags: e.target.value.split(",").map((t) => t.trim()),
                })
              }
            />

            <div className="modal-action">
              <button
                className="btn btn-primary"
                disabled={isUpdatingProblem}
                onClick={async () => {
                  await updateProblem(editProblem.id, editProblem);
                  setIsEditModalOpen(false);
                }}
              >
                {isUpdatingProblem ? "Updating..." : "Update"}
              </button>

              <button className="btn" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Playlist Modals */}
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
