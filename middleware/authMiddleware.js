const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
	let token;

	// 1. Check Authorization header first
	const authHeader = req.headers.authorization;
	if (authHeader && authHeader.startsWith("Bearer ")) {
		token = authHeader.split(" ")[1];
	}

	// 2. If not in header, check cookies
	if (!token && req.cookies && req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	// 3. If still no token, deny access
	if (!token) {
		return res.status(403).json({ error: "No token provided" });
	}

	// 4. Verify token
	jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
		if (err) {
			const message =
				err.name === "TokenExpiredError"
					? "Token has expired"
					: "Invalid token: " + err.message;
			return res.status(403).json({ error: message });
		}

		req.user = decodedToken; // Make decoded info available to routes
		next();
	});
};

module.exports = { requireAuth };
