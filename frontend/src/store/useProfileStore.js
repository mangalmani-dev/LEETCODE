// store/useProfileStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useProfileStore = create((set) => ({
  profile: null,
  loading: false,

  fetchProfile: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/profile/me"); // <— your backend
      set({ profile: res.data }); // includes profile.stats now
    } catch (error) {
      console.log("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      set({ loading: false });
    }
  },
}));
