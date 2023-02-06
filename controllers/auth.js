import bcrypt from "bcrypt";
import { User } from "../models/index.js";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error creating user" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.cookie('jwt',token,{ httpOnly: true });
    res.status(200).json({ message: "User logged in successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user" });
  }
};
const logout = (_, res)=>{
    res.clearCookie();
    res.json({message:"Logged Out!"})
}
const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.reset_password_expires = Date.now() + 3600000;
    user.reset_password_token = resetToken;
    await user.update();
    // send reset token to user's email
    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
};
const setPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (token !== user.reset_password_token) {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (Date.now() > user.reset_password_expires) {
      return res.status(401).json({ message: "Token expired" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.reset_password_expires = null;
    user.reset_password_token = null;
    await user.update();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
};
export { register, login,logout, resetPassword, setPassword };
