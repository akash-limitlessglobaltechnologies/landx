const { verifyToken } = require("../Config/generateToken");

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer token
    if (!token) {
        return res.status(401).json({ message: "No token provided, authorization denied." });
    }
    
    try {
        const decoded = verifyToken(token);
        req.user = decoded; // Attach the user info (phone number) to the request
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token is not valid." });
    }
};

module.exports = authMiddleware;
