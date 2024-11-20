import { GraphQLObjectType, GraphQLString, GraphQLID } from "graphql";
import UserType from "./UserType.js";
import User from "../../model/User.js";

const PostType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findByPk(parent.userId);
      },
    },
  }),
});

export default PostType;
