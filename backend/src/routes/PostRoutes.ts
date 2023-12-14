import express from "express";
import { createPost, getPosts } from "../controllers/PostController";
import { upload } from "../middlewares/multer";
import { verifyRequest } from "../middlewares/jwtTokenAuth";

const router = express.Router()

router.post("/",verifyRequest,upload.array("media",4),createPost)
router.get("/",verifyRequest,getPosts)
export default router;