import { GraphQLObjectType, GraphQLString, GraphQLID } from "graphql";
import UserType from "./UserType.js";
import PostType from "./PostType.js";
import User from "../../model/User.js";
import Post from "../../model/Post.js";

const CommentType = new GraphQLObjectType({
  name: "Comment",
  fields: () => ({
    id: { type: GraphQLID },
    content: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findByPk(parent.userId);
      },
    },
    post: {
      type: PostType,
      resolve(parent, args) {
        return Post.findByPk(parent.postId);
      },
    },
  }),
});

export default CommentType;
