const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes/routes.js");

const PORT = process.env.PORT || "8080";

const allowedOrigins = [
	"http://localhost:5173", // Your frontend local development URL
	// IMPORTANT: Add your deployed frontend URL(s) here!
	// Example: 'https://your-frontend-app.com',
];

const corsOptions = {
	origin: function (origin, callback) {
		// EXTREME LOGGING FOR DEBUGGING
		console.log("DEBUG: --- CORS ORIGIN START ---");
		console.log("DEBUG: Type of origin:", typeof origin);
		console.log("DEBUG: Value of origin (raw):", origin);
		console.log("DEBUG: origin === null:", origin === null);
		console.log("DEBUG: origin === undefined:", origin === undefined);
		console.log("DEBUG: !origin:", !origin); // Should be true if null or undefined
		console.log("DEBUG: Allowed Origins Configured:", allowedOrigins);
		console.log("DEBUG: --- CORS ORIGIN END ---");

		// Explicitly allow requests with 'null' or 'undefined' origin
		if (origin === null || origin === undefined) {
			console.log("ACTION: Allowing request with null/undefined origin.");
			return callback(null, true);
		}

		// Check if the requesting origin is in our explicitly allowed list
		if (allowedOrigins.indexOf(origin) !== -1) {
			console.log(`ACTION: Allowing request from origin: ${origin}`);
			callback(null, true);
		} else {
			// If origin is not in allowed list, block it
			console.error(`ACTION: CORS blocked for unauthorized origin: ${origin}`);
			callback(new Error("Not allowed by CORS")); // This is the line that's still being hit
		}
	},
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
	optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", routes);

app.listen(PORT, "0.0.0.0", () => {
	console.log(`Backend service listening on port ${PORT}`);
});
