const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a local PDF file to Cloudinary.
 * @param {string} filePath - Absolute path to the PDF.
 * @param {string} fileName - File name to store on Cloudinary.
 * @returns {Promise<string|null>} - Secure URL of the file.
 */
async function uploadPDF(filePath, fileName = 'report') {
  try {
    console.log("------------------------------------------");
    console.log("☁️ CLOUDINARY UPLOAD START");
    console.log("📄 File:", filePath);

    if (!fs.existsSync(filePath)) {
        throw new Error("File not found at path: " + filePath);
    }

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw", // Required for .pdf / .raw files
      folder: "khudkojano_reports",
      public_id: fileName.replace('.pdf', ''),
    });

    console.log("✅ Cloudinary Upload Success!");
    console.log("🔗 Secure URL:", result.secure_url);
    console.log("------------------------------------------");

    return result.secure_url;

  } catch (err) {
    console.error("❌ CLOUDINARY ERROR:", err.message);
    return null;
  }
}

const fs = require('fs'); // Added for check

module.exports = { uploadPDF };
