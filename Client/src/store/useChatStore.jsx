import { create } from "zustand";
import toast from "react-hot-toast";
import { api } from "../api/axios";
import { useAuthStore } from "./auth";


export const useChatStore = create((set,get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,


  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await api.get("/message/user");
      set({ users: response.data });
    } catch (error) {
        toast.error(error.message);
    }finally{
        set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await api.get(`/message/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      toast.error(error.message);
    }finally{
        set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const {selectedUser,messages} = get();
    try {
      const response = await api.post(`/message/send/${selectedUser._id}`,messageData);
      set({ messages: [...messages, response.data] });
     
    } catch (error) {
      toast.error(error.message);
    }

  },
  subscribeToMessages: ()=>{
    const {selectedUser} = get();
    if(!selectedUser) return;
    
    const socket = useAuthStore.getState().socket;
  
  
    socket.on("newMessage",(newMessage)=>{
      if(newMessage.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, newMessage] });
    })

  },
  unsubscribeFromMessages: ()=>{
    
    
    const socket = useAuthStore.getState().socket;
  
    //todo
    socket.off("newMessage")

  },



  setSelectedUser: (selectedUser) => set({selectedUser})

}));