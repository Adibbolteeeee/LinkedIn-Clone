import { Router } from "express";
import multer from "multer";
import * as PostController from "../controllers/posts.controller.js";

const router = Router();

// ✅ Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Routes
router.route("/").get(PostController.activeCheck);

router
  .route("/post")
  .post(upload.single("media"), PostController.createPost);

router.route("/posts").get(PostController.getAllPosts);

router.route("/deletePost").post(PostController.deletePost);

router.route("/addComment").post(PostController.commentPost);

router.route("/getComments").get(PostController.getCommentsByPost);

router
  .route("/deleteComment")
  .delete(PostController.deleteCommentOfUser);

router
  .route("/incrementPostLike")
  .post(PostController.incrementLikes);

export default router;