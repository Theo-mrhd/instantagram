import User from "../model/User.js";
import Post from "../model/Post.js";
import Comment from "../model/Comment.js";
import Subscription from "../model/Subscription.js";

User.hasMany(Post, { foreignKey: "userId", onDelete: "CASCADE" });
Post.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Comment, { foreignKey: "userId", onDelete: "CASCADE" });
Comment.belongsTo(User, { foreignKey: "userId" });

Post.hasMany(Comment, { foreignKey: "postId", onDelete: "CASCADE" });
Comment.belongsTo(Post, { foreignKey: "postId" });

User.belongsToMany(User, {
  through: Subscription,
  as: "SubscribedTo",
  foreignKey: "subscriberId",
  otherKey: "subscribedToId",
});

User.belongsToMany(User, {
  through: Subscription,
  as: "Subscribers",
  foreignKey: "subscribedToId",
  otherKey: "subscriberId",
});
