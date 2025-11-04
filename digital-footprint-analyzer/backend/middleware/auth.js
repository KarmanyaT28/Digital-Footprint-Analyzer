// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

// Zero Trust: The policy engine. All requests must be verified.
const auth = (req, res, next) => {
    // 1. Check for token in the Authorization header (Bearer Token format)
    const token = req.header('x-auth-token');

    // 2. Failure: Access Denied if no token is present.
    if (!token) {
        return res.status(401).json({ msg: 'Zero Trust Policy Denied: No token, authorization denied' });
    }

    try {
        // 3. Verification: Attempt to verify the token with the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Success: Attach the decoded user payload to the request for use in the route handler
        req.user = decoded.user;
        
        // Move to the next function (the actual route handler)
        next();
    } catch (e) {
        // 5. Failure: Invalid token (expired, tampered, bad signature)
        res.status(401).json({ msg: 'Zero Trust Policy Denied: Token is not valid or expired' });
    }
};

module.exports = auth;