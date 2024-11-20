import { GraphQLObjectType, GraphQLString, GraphQLID } from "graphql";

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    firstname: { type: GraphQLString },
    lastname: { type: GraphQLString },
    email: { type: GraphQLString },
    photo: { type: GraphQLString },
  }),
});

export default UserType;
