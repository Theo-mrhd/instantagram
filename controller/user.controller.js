import User from "../model/User.js";
import Post from "../model/Post.js";
import Subscription from "../model/Subscription.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByPk(userId, {
      include: Post,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.Posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const signup = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const sqlInjectionRegex =
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE)\b|--|'|"|;|\/\*|\*\/)/i;

    if (
      sqlInjectionRegex.test(firstname) ||
      sqlInjectionRegex.test(lastname) ||
      sqlInjectionRegex.test(email) ||
      sqlInjectionRegex.test(password)
    ) {
      return res.status(400).json({ message: "Invalid characters in input" });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error("Error during user registration: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const sqlInjectionRegex =
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE)\b|--|'|"|;|\/\*|\*\/)/i;

    if (sqlInjectionRegex.test(email) || sqlInjectionRegex.test(password)) {
      return res.status(400).json({ message: "Invalid characters in input" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error("Error during user login: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = req.user;
    const { firstname, lastname, email, password } = req.body;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sqlInjectionPattern =
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE)\b|--|\/\*|\*\/)/i;

    if (
      sqlInjectionPattern.test(firstname) ||
      sqlInjectionPattern.test(lastname) ||
      sqlInjectionPattern.test(email) ||
      (password && sqlInjectionPattern.test(password))
    ) {
      return res.status(400).json({ message: "Invalid input detected" });
    }

    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    res.status(200).json({ message: "User deleted successfuly" });
  } catch (error) {
    console.error("[UserController.deleteUser] - Erreur: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const subscribeUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const subscriberId = req.body.id;

    if (userId == subscriberId) {
      return res.status(400).json({ message: "Cannot subscribe to yourself" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const subscription = await Subscription.create({
      subscriberId,
      subscribedToId: userId,
    });

    res.status(201).json({ message: "Subscribed successfully", subscription });
  } catch (error) {
    console.error("Error subscribing to user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
