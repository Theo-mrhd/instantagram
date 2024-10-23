import { DataTypes, Model } from "sequelize";
import { sequelize } from "../data/index.js";

class User extends Model {}

User.init(
  {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
    },
    photo: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    hooks: {
      beforeCreate: (user) => {
        if (!user.photo) {
          const initials = `${user.firstname[0]}${user.lastname[0]}`;
          user.photo = `https://ui-avatars.com/api/?name=${initials}&background=random`;
        }
      },
    },
  }
);

export default User;
