const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const genAI = new GoogleGenAI(GOOGLE_API_KEY);

module.exports = genAI;