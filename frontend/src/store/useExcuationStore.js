import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useExecutionStore = create((set) => ({
  isExecuting: false,
  submission: null,
  runResult: null,

  // 🔵 RUN CODE (no submission saved)
  runCode: async (source_code, language_id, stdin) => {
    try {
      set({ isExecuting: true });

      const res = await axiosInstance.post("/execute-code/run", {
        source_code,
        language_id,
        stdin,
      });

      set({ runResult: res.data.results }); // store the run result
      toast.success("Code run successfully!"); // ✅ success toast

      return res.data;
    } catch (error) {
      console.log("Run Code Error:", error);
      toast.error("Error running code"); // ✅ only show on failure
    } finally {
      set({ isExecuting: false });
    }
  },

  // 🟢 SUBMIT CODE (submission saved in DB)
  submitCode: async (source_code, language_id, stdin, expected_outputs, problemId) => {
    try {
      set({ isExecuting: true });

      const res = await axiosInstance.post("/execute-code", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
      });

      set({ submission: res.data.submission });
      toast.success(res.data.message);

      return res.data;
    } catch (error) {
      console.log("Submit Error:", error);
      toast.error("Submission failed");
    } finally {
      set({ isExecuting: false });
    }
  },
}));
