import pkg from "base-64";
const { decode } = pkg;

export default function(req, res, next) {
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
    const password = credentials[1];

    // Check the username and password
    if (username === "username" && password === "password") {
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  } else {
    res.status(401).send("Unauthorized");
  }
};
