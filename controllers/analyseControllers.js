const {GoogleGenAI, createUserContent, createPartFromUri} = require('@google/genai')
const { GoogleAuth } = require('google-auth-library');


const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'); // Handle newline format

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

const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });


async function uploadAndAnalyzeVideo(fileBuffer, mimeType) {
  const fileSize = fileBuffer.length;
  console.log('File Size (inside function):', fileSize);

  if (!fileSize) {
    throw new Error('File size could not be determined.');
  }

  const uploadParams = {
    file: fileBuffer,
    sizeBytes: fileSize,
    config: {
      mimeType: mimeType 
    }
  };

  console.log('Upload Parameters:', uploadParams);

   const myfile = await ai.files.upload(uploadParams)


const response = await ai.models.generateContent({
  model: "gemini-2.0-flash",
  contents: createUserContent([
    createPartFromUri(myfile.uri, mimeType), 
    process.env.PROMPT,
  ]),
});

  return response.text;
}

module.exports.analyse = async (req, res) => {
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