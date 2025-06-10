import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001"
export const useAuthStore = create((set,get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
  try {
    const res = await axiosInstance.get("/auth/check");

    if (res && res.data) {
      set({ authUser: res.data });
      get().connectSocket(); // Connect to socket after setting user
    } else {
      set({ authUser: null });
    }
  } catch (err) {
    console.error("Error in checkAuth:", err);
    set({ authUser: null });
  } finally {
    set({ isCheckingAuth: false });
  }
},

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
  try {
    await axiosInstance.post("/auth/logout");
    set({ authUser: null });
    get().disconnectSocket(); 
    toast.success("Logged out successfully");
  } catch (error) {
    toast.error("Logout failed");
  }
},

updateProfile: async (data) => {
  set({ isUpdatingProfile: true });
  try {
    const res = await axiosInstance.put("/auth/update-profile", data);

    if (res && res.data) {
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } else {
      toast.error("Unexpected response from server");
      console.error("No response data:", res);
    }

  } catch (error) {
    console.log("error in update profile:", error);

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Profile update failed";

    toast.error(message);
  } finally {
    set({ isUpdatingProfile: false });
  }
},
connectSocket: () => {
  const { authUser } = get();
  const existingSocket = get().socket;

  if (!authUser || existingSocket?.connected) return;

  const socket = io(BASE_URL);
  set({ socket });

  socket.connect();
},

disconnectSocket: () =>{
  if(get().socket?.connected){ get().socket.disconnect();}
}
}));
