import express from "express";
import { createPost } from "../controllers/PostController";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router()

router.post("/create_post",upload.array("media",4),createPost)

export default router;