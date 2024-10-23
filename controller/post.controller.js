import Comment from "../model/Comment.js";
import Post from "../model/Post.js";
import Subscription from "../model/Subscription.js";
import User from "../model/User.js";

export const allPost = async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    console.error("Error fetching all posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const sqlInjectionPattern =
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE)\b|--|\/\*|\*\/)/i;

    if (sqlInjectionPattern.test(title) || sqlInjectionPattern.test(content)) {
      return res.status(400).json({ message: "Invalid input detected" });
    }

    const userId = req.user.id;
    const newPost = await Post.create({ title, content, userId });

    res.status(201).json({ post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const sqlInjectionPattern =
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE)\b|--|\/\*|\*\/)/i;

    if (sqlInjectionPattern.test(title) || sqlInjectionPattern.test(content)) {
      return res.status(400).json({ message: "Invalid input detected" });
    }

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    post.title = title;
    post.content = content;

    await post.save();

    res.status(200).json({ post });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const posts = await Post.findAll({
      where: { userId },
    });

    if (!posts) {
      return res.status(404).json({ message: "No posts found" });
    }

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching subscribed posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSubscribedPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const subscriptions = await Subscription.findAll({
      where: { subscriberId: userId },
    });

    const subscribedToIds = subscriptions.map(
      (subscription) => subscription.subscribedToId
    );

    const posts = await Post.findAll({
      where: { userId: subscribedToIds },
    });

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching subscribed posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.findAll({
      where: { postId },
      include: {
        model: User,
        attributes: ["id", "firstname", "lastname", "email"],
      },
    });

    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.destroy();

    res.status(204).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
