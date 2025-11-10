import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const authRouter = express.Router();


authRouter.post("/signup",signup );
authRouter.post("/login",login )
authRouter.post("/logout",logout)
authRouter.put('/update-profile',protect,updateProfile)

authRouter.get('/check',protect,checkAuth)





export default authRouter;