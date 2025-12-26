// backend/utils/resumeParser.js
const axios = require("axios");
const pdfLib = require("pdf-parse");

const parseResumeFromUrl = async (resumeUrl) => {
  try {
    console.log("🔍 Attempting to download:", resumeUrl);

    // 1. Download the PDF file as a binary buffer
    const response = await axios.get(resumeUrl, { responseType: "arraybuffer" });
    const buffer = response.data;

    console.log("✅ Download success. Buffer size:", buffer.length);

    // 2. 🎯 FIX: Safely extract the parsing function
    // Sometimes the library is exported as 'default', sometimes directly.
    // We check both to be 100% sure.
    const pdfParser = pdfLib.default || pdfLib;


    // 3. Parse the PDF
    const data = await pdfLib.PDFParse(buffer);
    
    // 4. Clean up the text (remove newlines and extra spaces)
    // This makes it easier for the AI to read.
    const cleanText = data.text.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
    
    console.log("✅ PDF Parsed. Text length:", cleanText.length);
    
    return cleanText;

  } catch (err) {
    console.error("❌ PARSER ERROR:", err.message);
    // If the error has a response (like 404 from Cloudinary), log it
    if (err.response) {
      console.error("   - Status:", err.response.status);
    }
    throw new Error("Failed to parse resume PDF");
  }
};

module.exports = parseResumeFromUrl;