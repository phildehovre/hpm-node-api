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
	"http://localhost:5173",
	// IMPORTANT: Add your deployed frontend URL here!
	// For example: 'https://your-actual-frontend-url.com'
];

const corsOptions = {
	origin: function (origin, callback) {
		console.log("CORS Origin:", origin); // <--- ADD THIS LOG
		console.log("Allowed Origins:", allowedOrigins); // <--- AND THIS LOG
		if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			console.error("CORS blocked for origin:", origin); // <--- ADD THIS LOG
			callback(new Error("Not allowed by CORS"));
		}
	},
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
	optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

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
