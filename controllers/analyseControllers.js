const { createUserContent } = require("@google/genai");
const genAI = require("../services/genAI.js");

const approvedKeywords = [
	"Horror",
	"Action",
	"Science Fiction",
	"Drama",
	"Comedy",
	"Thriller",
	"Western",
	"Documentary",
	"Romance",
	"Crime",
	"Adventure",
	"Fantasy",
	"Animation",
	"Mystery",
	"Noir",
	"Musical",
	"Experimental",
	"Romantic",
	"History",
	"Epic",
	"Children's",
	"War",
	"Disaster",
	"Anime",
	"Family",
	"World",
	"Retro",
	"News",
	"Gaming",
	"Christmas",
	"Reality TV",
	"Daytime TV",
	"Advertisement",
	"Sport",
];

exports.analyseVideo = async (req, res) => {
	console.log(req.file);
	try {
		if (!req.file) {
			return res.status(400).json({ error: "No video file uploaded." });
		}
		const videoBuffer = req.file.buffer;
		let mimeType = req.file.mimetype;

		if (mimeType == "application/octet-stream") {
			mimeType = "video/mov";
		}

		const promptText =
			process.env.PROMPT + ` Keywords: ${approvedKeywords.join(",")}`;

		const videoPart = {
			inlineData: {
				data: videoBuffer.toString("base64"),
				mimeType: mimeType,
			},
		};

		const response = await genAI.models.generateContent({
			model: "gemini-2.0-flash",
			contents: createUserContent([videoPart, promptText]),
		});

		const analysis = response.candidates[0].content.parts[0].text;
		console.log(response);

		res.status(200).json({ origin: [...req.file], analysis: analysis });
	} catch (error) {
		console.error("Error analyzing video:", error);
		res
			.status(500)
			.json({ error: "Failed to analyze video.", details: error.message });
	}
};
