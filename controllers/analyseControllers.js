const {createUserContent, createPartFromUri, Part} = require('@google/genai')
const { GoogleAuth } = require('google-auth-library');
const genAI = require('../services/genAI.js')


const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'); 

if (!GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Error: GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.');
}

const auth = new GoogleAuth({
  credentials: {
    client_email: GOOGLE_CLIENT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY,
  },
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});


async function uploadAndAnalyzeVideo(fileBuffer, mimeType) {
  const fileSize = fileBuffer.length;

  if (!fileSize) {
    throw new Error('File size could not be determined.');
  }

  const uploadParams = {
    file: fileBuffer,
    size_bytes: fileSize,
    config: {
      mimeType: mimeType 
    }
  };


   const myfile = await genAI.files.upload(uploadParams)


const response = await genAI.models.generateContent({
  model: "gemini-2.0-flash",
  contents: createUserContent([
    createPartFromUri(myfile.uri, mimeType), 
    process.env.PROMPT,
  ]),
});

  return response.text;
}

module.exports.analyse = async (req, res) => {
  console.log(req.file)
    try {
        const fileBuffer = req.file.buffer;
        const mimeType = req.file.mimetype;

        const adcClient = await auth.getClient();
        const credentials = await adcClient.getAccessToken();
        console.log('Application Default Credentials loaded');
    
        const analysisResult = await uploadAndAnalyzeVideo(fileBuffer, mimeType);
    
        res.status(200).json({ analysis: analysisResult });
      } catch (error) {
        res.status(500).json({ error: "Error processing video file.", details: error.message });
      }
}

// Get an instance of the generative model

// List of approved descriptive keywords (ideally fetched from a database or config)
const approvedKeywords = ["action", "comedy", "nature", "animals", "sports", "cooking", "travel", "animation"];

exports.analyseVideo = async (req, res) => {
  console.log(req.file);
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No video file uploaded.' });
        }
        const videoBuffer = req.file.buffer;
        const mimeType = req.file.mimetype;

        const promptText = `Describe the content of this video using only the following keywords: ${approvedKeywords.join(', ')}. Be concise.`;

        const videoPart = {
            inlineData: {
                data: videoBuffer.toString('base64'),
                mimeType: mimeType
            }
        };

        const response = await genAI.models.generateContent({
            model: "gemini-2.0-flash", // Or a model that supports vision
            contents: createUserContent([
                videoPart, // Pass the object directly into createUserContent
                promptText,
            ]),
        });

        const analysis = response.candidates[0].content.parts[0].text;
        console.log(response)

        res.status(200).json({ analysis: analysis });

    } catch (error) {
        console.error('Error analyzing video:', error);
        res.status(500).json({ error: 'Failed to analyze video.', details: error.message });
    }
};