const jwt = require("jsonwebtoken");
// Middleware to verify if the user is authenticated
const verifyToken = (req, res, next) => {
  // Issue: No JWT verification here yet
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send({ message: "Un-authorized" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded) {
    req.role = decoded.role;
    next(); // Should check JWT here
  } else {
    return res.status(401).send({ message: "Un-authorized" });
  }
};

// Middleware to verify if the user is an admin
const isAdmin = (req, res, next) => {
  // Issue: Should check for the role of the user (admin or user)
  const role = req.role;
  if (!role) {
    return res.status(401).send({ message: "Un-authorized" });
  }
  if (role && role == "admin") {
    next(); // Should check role and decide if allowed
  } else {
    return res.status(401).send({ message: "Un-authorized" });
  }
};

module.exports = { verifyToken, isAdmin };
