import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useCallStore = create((set) => ({
  callHistory: [],
  isLoggingCall: false,
  isFetchingHistory: false,

  logCall: async ({ caller, receiver, startTime, endTime, status = "completed" }) => {
    set({ isLoggingCall: true });
    try {
      const res = await axiosInstance.post("/calls/log/audio", {
        caller,
        receiver,
        startTime,
        endTime,
        status,
      });
      toast.success("Audio call logged successfully 📞");
      console.log("📥 Log Response:", res.data);
    } catch (error) {
      console.error("❌ Failed to log audio call:", error.response?.data || error.message);
      toast.error("Failed to log audio call");
    } finally {
      set({ isLoggingCall: false });
    }
  },

  fetchCallHistory: async (userId) => {
    set({ isFetchingHistory: true });
    try {
      const res = await axiosInstance.get(`/calls/history/${userId}`);
      set({ callHistory: res.data });
    } catch (error) {
      console.error("❌ Error fetching call history:", error);
      toast.error("Error fetching call history");
    } finally {
      set({ isFetchingHistory: false });
    }
  },
}));

