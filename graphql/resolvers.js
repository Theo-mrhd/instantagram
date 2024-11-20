import Post from "../model/Post.js";
import User from "../model/User.js";
import Comment from "../model/Comment.js";
import Subscription from "../model/Subscription.js";

const resolvers = {
  Query: {
    myPosts: async (_, __, { user }) => {
      if (!user) {
        throw new Error("Authentication required");
      }

      return await Post.findAll({
        where: { userId: user.id },
        include: {
          model: User,
        },
      });
    },
    myComments: async (_, __, { user }) => {
      if (!user) {
        throw new Error("Authentication required");
      }

      return await Comment.findAll({
        where: { userId: user.id },
        include: [
          {
            model: User,
          },
          {
            model: Post,
          },
        ],
      });
    },
    friendsPosts: async (_, __, { user }) => {
      if (!user) {
        throw new Error("Authentication required");
      }

      const subscriptions = await Subscription.findAll({
        where: { subscriberId: user.id },
      });

      const subscribedToIds = subscriptions.map(
        (subscription) => subscription.subscribedToId
      );

      return await Post.findAll({
        where: {
          userId: subscribedToIds,
        },
        include: {
          model: User,
        },
      });
    },
    friendsComments: async (_, __, { user }) => {
      if (!user) {
        throw new Error("Authentication required");
      }

      const subscriptions = await Subscription.findAll({
        where: { subscriberId: user.id },
      });

      const subscribedToIds = subscriptions.map(
        (subscription) => subscription.subscribedToId
      );

      return await Comment.findAll({
        where: {
          userId: subscribedToIds,
        },
        include: [
          {
            model: User,
          },
          {
            model: Post,
          },
        ],
      });
    },
  },
  Post: {
    user: async (post) => {
      return await User.findByPk(post.userId);
    },
  },
  Comment: {
    user: async (comment) => {
      return await User.findByPk(comment.userId);
    },
    post: async (comment) => {
      return await Post.findByPk(comment.postId);
    },
  },
};

export default resolvers;
