const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes/routes.js");

const PORT = process.env.PORT || "8080";

// --- START: SECURE CORS CONFIGURATION ---
const allowedOrigins = [
	"http://localhost:5173", // Your frontend local development URL
	// IMPORTANT: Add your deployed frontend URL(s) here!
	// Example: 'https://your-frontend-app.com',
	// Example: 'https://another-subdomain.your-frontend-app.com',
];

const corsOptions = {
	origin: function (origin, callback) {
		// Log the origin for debugging (can remove in production)
		console.log("CORS Origin Received:", origin);
		console.log("Allowed Origins Configured:", allowedOrigins);

		// Explicitly allow requests with 'null' or 'undefined' origin
		// This is crucial for local development, especially with some browser behaviors.
		if (origin === null || origin === undefined) {
			console.log("Allowing request with null/undefined origin.");
			return callback(null, true);
		}

		// Check if the requesting origin is in our explicitly allowed list
		if (allowedOrigins.indexOf(origin) !== -1) {
			console.log(`Allowing request from origin: ${origin}`);
			callback(null, true);
		} else {
			// If origin is not in allowed list, block it
			console.error(`CORS blocked for unauthorized origin: ${origin}`);
			callback(new Error("Not allowed by CORS"));
		}
	},
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Specify allowed HTTP methods
	credentials: true, // Allow cookies, authorization headers, etc.
	optionsSuccessStatus: 204, // Recommended for preflight OPTIONS requests
};

app.use(cors(corsOptions));
// --- END: SECURE CORS CONFIGURATION ---

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Essential if your backend expects JSON in request bodies
app.use(cookieParser());

app.use("/api/v1", routes);

app.listen(PORT, "0.0.0.0", () => {
	console.log(`Backend service listening on port ${PORT}`);
});
