import React from 'react'
import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"


export const useSubmissionStore = create((set) => ({
    isLoading: false,
    submissions: [],
    submission: null,
    submissionCount: null,

    getAllSubmission: async () => {
        try {
            set({ isLoading: true })
            const res = await axiosInstance.get("/submission/get-all-submissions")
            set({ submissions: res.data.submissions })
            toast.success(res.data.message)
        } catch (error) {
            console.log("Error is getallsubmssion", error)
            toast.success("Error in getting submissions")
        }
        finally {
            set({ isLoading: false })
        }
    },


    getSubmissionForProblem: async (problemId) => {

        try {
            const res = await axiosInstance.get(`/submission/get-submission/${problemId}`)

            set({ submission: res.data.submissions })
            toast.success(res.data.message || "submitted problem fetched successfully")
        } catch (error) {
            console.log("Error getting submssion for problems", error);
            toast.error("Error in getting submission for problems")
        }

    },

    getSubmissionCountForProblem: async (problemId) => {
        try {
            const res = await axiosInstance.get(
                `/submission/get-submissions-count/${problemId}`
            );

            set({ submissionCount: res.data.count });
        } catch (error) {
            console.log("Error getting submission count for problem", error);
            toast.error("Error getting submission count for problem");
        }



    }
}))