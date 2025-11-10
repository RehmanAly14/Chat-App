import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import cloudinary from "../config/cloudinary.js";
import { getRecieverSocketId, io } from "../config/socket.js";


export const getUser = async (req, res) => {
    try {
       const loggedInUserId = req.user._id;
       const filterUser = await User.find({_id: {$ne: loggedInUserId}}).select("-password");
       res.status(200).json(filterUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMessages = async (req, res) => {
    try {
       const {id: userToChatId} = req.params;
       const senderId = req.user._id;

       const messages = await Message.find({
         $or: [
           { senderId: senderId, receiverId: userToChatId },
           { senderId: userToChatId, receiverId: senderId },
         ],
       });
       res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const sendMessages = async (req, res) => {
    try {
       const {text,image} =req.body;
       const {id: receiverId} = req.params;
       const senderId = req.user._id;

       let imageUrl ;
       if(image){
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
       }

       const newMessage = await Message.create({
         text,
         image:imageUrl,
         senderId,
         receiverId,
       });

       await newMessage.save();

       //todo: REALTIME FUNCTIONALITY =>SOCKET.IO
      
       const receiverSocketId = getRecieverSocketId(receiverId)
       if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage",newMessage)
       }

       res.status(201).json(newMessage);
    } catch (error) {
      console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ message: error.message });
    }
};