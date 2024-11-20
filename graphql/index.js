import { graphqlHTTP } from "express-graphql";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import schema from "./schema.js";
import User from "../model/User.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const graphqlMiddleware = graphqlHTTP(async (req) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  let user = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      user = await User.findByPk(decoded.id);
    } catch (error) {
      console.error("Authentication error:", error);
    }
  }

  return {
    schema,
    graphiql: true,
    context: { user },
  };
});
