import express from "express";
import { verifyRequest } from "../middlewares/jwtTokenAuth";
import FollowController from "../controllers/FollowController";
const router = express()

router.post("/:userId",verifyRequest,FollowController.followUser)
router.get("/",verifyRequest,FollowController.getCurrentUserFollowing)
router.get("/:userId",verifyRequest,FollowController.getUserFollowings)
router.delete("/:userId",verifyRequest,FollowController.unFollowUser)
export default router;