


const jwt = require("jsonwebtoken");

// Secret key (isko .env me rakhna best practice hai)
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";


// ===============================
// GENERATE TOKEN FUNCTION
// ===============================
const generateToken = (payload, expiresIn = "1d") => {
    try {
        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: expiresIn
        });

        return token;

    } catch (error) {
        console.error("Token generation error:", error.message);
        throw error;
    }
};



// ===============================
// VERIFY TOKEN MIDDLEWARE
// ===============================
const verifyToken = (req, res, next) => {
    try {

        // Authorization header format: Bearer token
        const authHeader = req.headers["authorization"];

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Token not provided"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // decoded data req me store kar do
        req.user = decoded;

        if(decoded.role==='admin') {

            next();

        }else{

        return res.json({
            success: false,
            statusCode:404,
            message: "only admin use this routes",
            error: error.message
        });

    }
        
    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
            error: error.message
        });

    }
};



// ===============================
// EXPORT
// ===============================
module.exports = {
    generateToken,
    verifyToken
};

