import { create} from 'zustand'
import {api} from '../api/axios'
import toast from 'react-hot-toast';
import {io} from 'socket.io-client'
const BASE_URL =  "http://localhost:3005" ;
export const useAuthStore = create((set,get) => ({
  authUser: null,
  isSigningUp: false,
  isLogingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await api.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth", error.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await api.post("/auth/signup", data);
      toast.success("User Created Successfully");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    set({ isSigningUp: true });
    try {
      await api.post("/auth/logout");
      toast.success("User Logout Successfully");
      set({ authUser: null });
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.message);
    }
  },
  login: async (data) => {
    set({ isLogingIn: true });
    try {
      const res = await api.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("User Logged in Successfully");
      get().connectSocket();
      
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isLogingIn: false });
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await api.put("/auth/update-profile", data);
      toast.success("Profile Updated Successfully");
      set({ authUser: res.data });
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket:()=>{
    const { authUser } = get();
    if(!authUser || get().socket?.connected) return;
   const socket= io(BASE_URL,{
    query:{
      userId : authUser._id
    }
   })
   socket.connect()
   set({ socket: socket });
   socket.on("getOnlineUsers",(userIds)=>{
    set({ onlineUsers: userIds })
   })
  },
  disconnectSocket:()=>{
    if(get().socket?.connected) get().socket.disconnect();
  }

}));