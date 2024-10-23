import { DataTypes, Model } from "sequelize";
import { sequelize } from "../data/index.js";
import User from "./User.js";

class Subscription extends Model {}

Subscription.init(
  {
    subscriberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    subscribedToId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Subscription",
  }
);

export default Subscription;
