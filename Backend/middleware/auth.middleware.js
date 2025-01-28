const jwt = require("jsonwebtoken");

// Middleware to authenticate user requests
exports.isAuthenticate = async (req, res, next) => {
  try {
    // Extracting JWT from request cookies, body or header
    const token = req.cookies.token || req.header("Authorization").replace("Bearer ", "");

    // If JWT is missing, return 401 Unauthorized response
    if (!token) {
      return res.status(401).json({ success: false, message: "Token Missing" });
    }

    try {
      // Verifying the JWT using the secret key stored in environment variables
      const payload = jwt.verify(token, process.env.JWT_SECRETE_KEY);

      // Storing the decoded JWT payload in the request object for further use
      req.user = payload;
    } catch (error) {
      // If JWT verification fails, return 401 Unauthorized response
      console.error(error);
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // If JWT is valid, move on to the next middleware or request handler
    next();
  } catch (error) {
    // If there is an error during the authentication process, return 401 Unauthorized response
    return res.status(401).json({ success: false, message: "Something went wrong while validating the token" });
  }
};

// Middleware to check if user is an admin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role === "ADMIN") {
      next();
    } else {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "User Role Can't be Verified" });
  }
};

// Middleware to check if user is an instructor
exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.role === "INSTRUCTOR") {
      next();
    } else {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "User Role Can't be Verified" });
  }
};

// Middleware to check if user is a student
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.userRole === "STUDENT") {
      next();
    } else {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "User Role Can't be Verified" });
  }
};
