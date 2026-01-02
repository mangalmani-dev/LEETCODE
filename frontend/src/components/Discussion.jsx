import React, { useEffect } from "react";
import { useCommentStore } from "../store/useCommentStore.js";
import { useAuthStore } from "../store/useAuthStore.js";

const Discussion = ({ problemId }) => {
  const currentUser = useAuthStore((state) => state.authUser);

  const {
    comments,
    newComment,
    isLoading,
    isPosting,
    setNewComment,
    addComment,
    deleteComment,
    fetchComments,
  } = useCommentStore();

  useEffect(() => {
    fetchComments(problemId);
  }, [problemId]);

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">Discussion</h3>

      {/* Input box */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Write a comment..."
          className="input input-bordered flex-1"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addComment(problemId)}
          disabled={isPosting}
        />
        <button
          className="btn btn-primary"
          onClick={() => addComment(problemId)}
          disabled={isPosting}
        >
          {isPosting ? "Posting..." : "Post"}
        </button>
      </div>

      {/* Comments list */}
      {isLoading ? (
        <div>Loading comments...</div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((c) => (
            <div
              key={c.id}
              className="bg-base-200 p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <div className="font-semibold">{c.user.name}</div>
                <div className="text-base-content/80">{c.content}</div>
              </div>
              {c.user.id === currentUser?.id && (
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => deleteComment(c.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-base-content/70">
          No discussions yet. Be the first to comment!
        </div>
      )}
    </div>
  );
};

export default Discussion;
