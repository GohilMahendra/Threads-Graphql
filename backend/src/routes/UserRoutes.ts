import express from "express";
import { signInUser, signUpUser, updateUser, verifyEmail } from "../controllers/UserController";
import multer from "multer";
import { verifyRequest } from "../middlewares/jwtTokenAuth";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router()

router.post("/login",signInUser)
router.post("/register",signUpUser)
router.post("/verify",verifyEmail)
router.patch("/update_profile",verifyRequest,upload.single("profile_picture"),updateUser)

export default router;