import express from "express";
import { protect } from "../middleware/auth.js";
import { getMessages, getUser, sendMessages } from "../controllers/messageController.js";

const messageRouter = express.Router();


messageRouter.get("/user",protect,getUser );
messageRouter.get("/:id",protect,getMessages );

messageRouter.post("/send/:id",protect,sendMessages)






export default messageRouter;