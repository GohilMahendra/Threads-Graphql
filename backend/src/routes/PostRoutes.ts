import express from "express";
import { commentPost, createPost, deletePost, getPosts, likePost, unLikePost } from "../controllers/PostController";
import { upload } from "../middlewares/multer";
import { verifyRequest } from "../middlewares/jwtTokenAuth";

const router = express.Router()

router.post("/",verifyRequest,upload.array("media",4),createPost)
router.get("/",verifyRequest,getPosts)
router.post("/:postId/likes",verifyRequest,likePost)
router.delete("/:postId/likes",verifyRequest,unLikePost)
router.post("/:postId/replies",verifyRequest,commentPost)
router.delete("/:postId",verifyRequest,deletePost)
export default router;