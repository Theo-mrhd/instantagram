import express from "express";
import cors from "cors";
import "./data/association.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import dotenv from "dotenv";
import swaggerui from "swagger-ui-express";
import swaggerDoc from "./docs/openapi.json" assert { type: "json" };
import { sequelize } from "./data/index.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/doc-swagger", swaggerui.serve, swaggerui.setup(swaggerDoc));

app.use("/api", userRoutes);
app.use("/api", postRoutes);
app.use("/api", commentRoutes);

// await sequelize.sync({ force: true });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
