import pkg from "base-64";
import { User } from "../models/index.js";
const { decode } = pkg;

export default async function (req, res, next) {
  // Check the authentication of the incoming request
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Basic ")
  ) {
    // Extract the base64-encoded username and password from the authorization header
    const base64Credentials = req.headers.authorization.split(" ")[1];
    // Decode the base64-encoded string
    const credentials = decode(base64Credentials).split(":");
    const username = credentials[0];
    const access_key = credentials[1];
    const user = await User.findOne({ username, access_key });
    // Check the username and password
    if (user) {
      req.user = user;
      next();
    } else {
      res
        .status(401)
        .json({ value: { error: "unknow error", message: "Unauthorized" } });
    }
  } else {
    res
      .status(401)
      .json({ value: { error: "unknow error", message: "Unauthorized" } });
  }
}
