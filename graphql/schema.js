import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLID,
} from "graphql";
import PostType from "./types/PostType.js";
import CommentType from "./types/CommentType.js";
import resolvers from "./resolvers.js";

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    myPosts: {
      type: new GraphQLList(PostType),
      resolve: resolvers.Query.myPosts,
    },
    myComments: {
      type: new GraphQLList(CommentType),
      resolve: resolvers.Query.myComments,
    },
    friendsPosts: {
      type: new GraphQLList(PostType),
      resolve: resolvers.Query.friendsPosts,
    },
    friendsComments: {
      type: new GraphQLList(CommentType),
      resolve: resolvers.Query.friendsComments,
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
});
