import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useCommentStore = create((set, get) => ({
  comments: [],
  isLoading: false,
  isPosting: false,
  isDeleting: false,
  newComment: "",

  // Fetch all comments for a problem
  fetchComments: async (problemId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/comments/${problemId}`);
      set({ comments: res.data });
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch comments");
    } finally {
      set({ isLoading: false });
    }
  },

  setNewComment: (content) => set({ newComment: content }),

  // Add a new comment
  addComment: async (problemId) => {
    const content = get().newComment.trim();
    if (!content) return toast.error("Comment cannot be empty");

    set({ isPosting: true });
    try {
      const res = await axiosInstance.post(`/comments/${problemId}`, { content });
      set({ comments: [res.data, ...get().comments], newComment: "" });
      toast.success("Comment posted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to post comment");
    } finally {
      set({ isPosting: false });
    }
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    set({ isDeleting: true });
    try {
      await axiosInstance.delete(`/comments/${commentId}`);
      set({ comments: get().comments.filter((c) => c.id !== commentId) });
      toast.success("Comment deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete comment");
    } finally {
      set({ isDeleting: false });
    }
  },
}));
