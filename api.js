const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes/routes.js");

// Configure CORS
// You need to specify the exact origin(s) that are allowed to access your API.
// For local development, you can allow http://localhost:5173.
// For production, you will need to allow your deployed frontend's URL.

const allowedOrigins = [
	"http://localhost:5173", // Your frontend local development URL
	// Add your production frontend URL here when you deploy it
	// e.g., 'https://your-frontend-production-url.com',
	// Make sure to use 'https' for production URLs if applicable
];

const corsOptions = {
	origin: function (origin, callback) {
		// Check if the requesting origin is in our allowed list
		if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
			// If the origin is in the allowed list, or it's a non-browser request (like Postman or a server-to-server call where origin might be undefined), allow it.
			callback(null, true);
		} else {
			// If the origin is not allowed, deny it.
			callback(new Error("Not allowed by CORS"));
		}
	},
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow specific HTTP methods
	credentials: true, // Allow cookies to be sent
	optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 200 responses for OPTIONS
};

app.use(cors(corsOptions)); // Apply the CORS middleware with your options

// ... rest of your Express routes and middleware
// e.g., app.use('/api/v1/analyse', analyseRouter);

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
	console.log(`Backend service listening on port ${port}`);
});

const PORT = process.env.PORT || "8080";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1", routes);

app.listen(PORT, () =>
	console.log("server is running on port", process.env.PORT)
);
