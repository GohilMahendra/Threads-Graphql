import express from "express";
// import { commentPost, createPost, deletePost, getComments, getPosts, likePost, unLikePost } from "../controllers/PostController";
import PostController from "../controllers/PostController";
import { upload } from "../middlewares/multer";
import { verifyRequest } from "../middlewares/jwtTokenAuth";

const router = express.Router()

router.post("/",verifyRequest,upload.array("media",4),PostController.createPost)
router.get("/",verifyRequest,PostController.getPosts)
router.get("/:userId",verifyRequest,PostController.getPostsByUser)
router.post("/:postId/likes",verifyRequest,PostController.likePost)
router.delete("/:postId/likes",verifyRequest,PostController.unLikePost)
router.post("/:postId/replies",verifyRequest,PostController.commentPost)
router.get("/:postId/replies",verifyRequest,PostController.getComments)
router.delete("/:postId",verifyRequest,PostController.deletePost)
export default router;