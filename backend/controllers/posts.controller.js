import { Profile } from "../models/profile.model.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { Post } from "../models/posts.model.js";
import { Comment } from "../models/comments.model.js";

// ✅ Active Check
export const activeCheck = (req, res) => {
  return res.status(200).json({ message: "Server is working properly" });
};

// ✅ Create Post
export const createPost = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file ? req.file.filename : "", // ✅ fixed typo (filenane → filename)
      fileType: req.file ? req.file.mimetype.split("/")[1] : "",
    });

    await post.save();
    return res.status(200).json({ message: "Post created" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Get All Posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "name username email profilePicture"
    );
    return res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Post
export const deletePost = async (req, res) => {
  const { token, postId } = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    if (post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Post.deleteOne({ _id: postId }); // ✅ fixed (deletePost → deleteOne)
    return res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Comment on Post
export const commentPost = async (req, res) => {
  const { token, postId, commentBody } = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    const comment = new Comment({
      userId: user._id,
      postId: post._id,
      body: commentBody,
    });

    await comment.save();
    return res.status(200).json({ message: "Comment Added" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Get Comments by Post
export const getCommentsByPost = async (req, res) => {
  const { postId } = req.query;

  try {
    const comments = await Comment.find({ postId }).populate(
      "userId",
      "name username profilePicture"
    );

    return res.json({ comments: comments.reverse() });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Comment
export const deleteCommentOfUser = async (req, res) => {
  const { token, commentId } = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found!" });
    }

    if (comment.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await comment.deleteOne();
    return res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Increment Likes
export const incrementLikes = async (req, res) => {
  const { postId } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    post.likes += 1;
    await post.save();

    return res.status(200).json({ message: "Like incremented" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};