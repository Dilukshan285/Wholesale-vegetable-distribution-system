const authMiddleware = async (req, res, next) => {
    // Skipping token check to always proceed
    const { token } = req.headers;

    if (!token) {
        console.log("No token provided, but allowing access");
        req.body.userId = "66f413a6402ab5f8a34a6700"; 
        return next(); // Allow the request to proceed
    } try {
        console.log("Token provided, bypassing check");
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode?.id || "defaultUserId"; // Default userId if token fails
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        next(); // Allow the request to proceed despite the error
    }
}

module.exports = authMiddleware;