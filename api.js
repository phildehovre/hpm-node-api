const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes/routes.js");

// Configure CORS
// You need to specify the exact origin(s) that are allowed to access your API.
// For local development, you can allow http://localhost:5173.
// For production, you will need to allow your deployed frontend's URL.

const PORT = process.env.PORT || "8080";

const allowedOrigins = [
	"http://localhost:5173",
	// IMPORTANT: Add your deployed frontend URL here!
	// For example: 'https://your-actual-frontend-url.com'
];

const corsOptions = {
	origin: function (origin, callback) {
		console.log("CORS Origin:", origin);
		console.log("Allowed Origins:", allowedOrigins);

		// Explicitly check for null or undefined origins
		// This generally implies a non-browser request or a file system request,
		// which you might want to allow for local development/testing.
		if (origin === null || origin === undefined) {
			console.log("Allowing request with null/undefined origin.");
			return callback(null, true);
		}

		// Check if the requesting origin is in our allowed list
		if (allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			console.error("CORS blocked for origin:", origin);
			callback(new Error("Not allowed by CORS"));
		}
	},
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
	optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1", routes);

app.listen(PORT, "0.0.0.0", () => {
	console.log(`Backend service listening on port ${PORT}`);
});
