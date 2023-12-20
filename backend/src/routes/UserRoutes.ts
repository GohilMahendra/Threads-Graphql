import express from "express";
import UserController  from "../controllers/UserController";
import multer from "multer";
import { verifyRequest } from "../middlewares/jwtTokenAuth";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router()

router.post("/login",UserController.signInUser)
router.post("/register",UserController.signUpUser)
router.post("/verify",UserController.verifyEmail)
router.patch("/user",verifyRequest,upload.single("profile_picture"),UserController.updateUser)
router.get("/users",verifyRequest,UserController.SearchUsers)
export default router;