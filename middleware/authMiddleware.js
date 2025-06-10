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

const verifyRequestWithHMAC = () => {
	const crypto = require("crypto");
	const express = require("express");
	const app = express();

	app.use(express.json());

	const SHARED_SECRET = process.env.WORDPRESS_WEBHOOK_SECRET;

	app.post("/endpoint", (req, res) => {
		const payload = JSON.stringify(req.body);
		const signature = req.headers["x-signature"];

		const expectedSignature = crypto
			.createHmac("sha256", SHARED_SECRET)
			.update(payload)
			.digest("hex");

		if (signature !== expectedSignature) {
			console.warn("Invalid signature");
			return res.status(403).send("Unauthorized");
		}

		// Signature is valid
		console.log("Valid request:", req.body);
		res.status(200).send("OK");
	});
};

module.exports = { requireAuth, verifyRequestWithHMAC };

// $secret = 'your_shared_secret_key';
// $payload = json_encode($data); // or whatever you're POSTing
// $signature = hash_hmac('sha256', $payload, $secret);

// $response = wp_remote_post('https://your-node-api.com/endpoint', [
// 	'body' => $payload,
// 	'headers' => [
// 		'X-Signature' => $signature,
// 		'Content-Type' => 'application/json',
// 	],
// ]);
