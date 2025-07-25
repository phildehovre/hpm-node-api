const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes/routes.js");

const PORT = process.env.PORT || "8080";

const allowedOrigins = [
	"http://localhost:5173",
	"https://hpm-vite-client-git-master-phildehovres-projects.vercel.app",
	"https://hpm-vite-client.vercel.app",
	"https://staging.humanproductionmusic.com",
	"null",
	// "*",
];

const corsOptions = {
	origin: function (origin, callback) {
		console.log("DEBUG: --- CORS ORIGIN START ---");
		console.log("DEBUG: Type of origin:", typeof origin);
		console.log("DEBUG: Value of origin (raw):", origin);
		console.log("DEBUG: origin === null:", origin === null);
		console.log("DEBUG: origin === undefined:", origin === undefined);
		console.log("DEBUG: !origin:", !origin);
		console.log("DEBUG: Allowed Origins Configured:", allowedOrigins);
		console.log("DEBUG: --- CORS ORIGIN END ---");

		if (!origin || allowedOrigins.indexOf(origin) !== -1) {
			console.log(`ACTION: Allowing request from origin: ${origin}`);
			callback(null, true);
		} else {
			console.error(`ACTION: CORS blocked for unauthorized origin: ${origin}`);
			callback(new Error("Not allowed by CORS"));
		}
	},
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
	optionsSuccessStatus: 204,
	allowedHeaders: ["Authorization", "Content-Type"], // DEBUG: Maybe this will block something..
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", routes);

app.listen(PORT, "0.0.0.0", () => {
	console.log(`Backend service listening on port ${PORT}`);
});
