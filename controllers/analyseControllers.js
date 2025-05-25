const { createUserContent } = require("@google/genai");
const genAI = require("../services/genAI.js");

exports.analyseVideo = async (req, res) => {
	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Cache-Control", "no-cache");
	res.setHeader("Connection", "keep-alive");
	res.flushHeaders();

	const files = req.files;

	if (!files || files.length === 0) {
		res.write(
			`event: error\ndata: ${JSON.stringify({
				error: "No video files uploaded.",
			})}\n\n`
		);
		return res.end();
	}

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

	for (const file of files) {
		try {
			let mimeType = file.mimetype;
			if (mimeType === "application/octet-stream") {
				mimeType = "video/mov";
			}

			const promptText =
				process.env.PROMPT + ` Keywords: ${approvedKeywords.join(",")}`;
			const videoPart = {
				inlineData: {
					data: file.buffer.toString("base64"),
					mimeType: mimeType,
				},
			};

			const response = await genAI.models.generateContent({
				model: "gemini-2.0-flash",
				contents: createUserContent([videoPart, promptText]),
			});

			let rawText = response.candidates[0].content.parts[0].text.trim();
			let keywords = [];

			try {
				const match = rawText.match(/```json\s*([\s\S]*?)\s*```/i);
				const jsonString = match ? match[1] : rawText;
				keywords = JSON.parse(jsonString);
			} catch (parseErr) {
				console.error("Failed to parse keywords JSON:", parseErr);
				keywords = [rawText];
			}

			const result = {
				filename: file.originalname,
				analysis: keywords,
			};

			res.write(
				`data: ${JSON.stringify({
					...result,
				})}\n\n`
			);
		} catch (err) {
			res.write(
				`event: error\ndata: ${JSON.stringify({
					file: file.originalname,
					error: err.message,
				})}\n\n`
			);
		}
	}

	res.write("event: done\ndata: complete\n\n");
	res.end();
};
