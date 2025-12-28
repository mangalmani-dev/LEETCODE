import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useProblemStore = create((set, get) => ({
  // STATE
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,
  isUpdatingProblem: false,

  // GET ALL PROBLEMS
  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });

      const res = await axiosInstance.get("/problems/get-all-problems");
      set({ problems: res.data.problems });
    } catch (error) {
      console.error("Error getting all problems", error);
      toast.error("Error fetching problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  // GET PROBLEM BY ID
  getProblemById: async (id) => {
    try {
      set({ isProblemLoading: true });

      const res = await axiosInstance.get(`/problems/get-problem/${id}`);
      set({ problem: res.data.problem });
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error getting problem", error);
      toast.error("Error fetching problem");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  // GET SOLVED PROBLEMS
  getSolvedProblemByUser: async () => {
    try {
      const res = await axiosInstance.get("/problems/get-solved-problem");
      set({ solvedProblems: res.data.problems });
    } catch (error) {
      console.error("Error getting solved problems", error);
      toast.error("Error fetching solved problems");
    }
  },

  // ✅ UPDATE PROBLEM
  updateProblem: async (id, data) => {
    try {
      set({ isUpdatingProblem: true });

      const res = await axiosInstance.put(
        `/problems/update-problem/${id}`,
        data
      );

      // Update problem list
      const updatedProblems = get().problems.map((p) =>
        p.id === id ? res.data : p
      );

      set({
        problems: updatedProblems,
        problem: res.data,
      });

      toast.success("Problem updated successfully");
    } catch (error) {
      console.error("Error updating problem", error);
      toast.error("Failed to update problem");
    } finally {
      set({ isUpdatingProblem: false });
    }
  },
}));
