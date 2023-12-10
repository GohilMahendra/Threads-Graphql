import express from "express";
import { signInUser, signUpUser, verifyEmail } from "../controllers/UserController";

const router = express.Router()

router.post("/login",signInUser)
router.post("/register",signUpUser)
router.post("/verify/:token",verifyEmail)

export default router;