import { DataTypes, Model } from "sequelize";
import { sequelize } from "../data/index.js";

class Comment extends Model {}

Comment.init(
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Comment",
  }
);

export default Comment;
