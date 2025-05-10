const {GoogleGenAI} = require('@google/genai')
const ai = new GoogleGenAI({ apiKey: "GOOGLE_API_KEY" });

module.exports = ai