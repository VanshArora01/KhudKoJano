const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

/**
 * Uploads a file to Google Drive and makes it publicly accessible.
 * @param {string} filePath - Absolute path to the file to upload.
 * @param {string} fileName - Name to give the file on Google Drive.
 * @returns {Promise<string|null>} - The public sharing link or null if upload fails.
 */
async function uploadToDrive(filePath, fileName) {
  try {
    console.log("------------------------------------------");
    console.log("🚀 GOOGLE DRIVE UPLOAD START");
    console.log("------------------------------------------");

    // 1. Configuration Validation
    const KEYFILEPATH = path.join(process.cwd(), 'service-account.json');
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID?.trim() || '1HAaG1eZfXrWk-iJrtZSgJk9Rw6VbT-OD';
    
    console.log("🔑 Key Path:", KEYFILEPATH);
    console.log("📁 Target Folder ID:", folderId);

    // 2. Authentication
    console.log("🔐 Initializing Google Auth...");
    const auth = new google.auth.GoogleAuth({
      keyFile: KEYFILEPATH,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // 3. Verify File Exists
    console.log("📄 Checking file:", filePath);
    const exists = fs.existsSync(filePath);
    console.log("Exists:", exists);

    if (!exists) {
      console.error("❌ ERROR: Source file not found for upload.");
      return null;
    }

    // 4. Upload File
    console.log("🚀 Uploading to Drive...");
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    const media = {
      mimeType: 'application/pdf',
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });

    // 5. Validate File ID
    console.log("📦 Upload response:", response.data);
    if (!response.data || !response.data.id) {
      throw new Error("Drive upload failed: No file ID returned");
    }

    const fileId = response.data.id;
    console.log("✅ Drive File ID:", fileId);

    // 6. Permissions Step
    console.log("🔓 Setting public permissions...");
    try {
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
      console.log("✅ Permissions set to Public");
    } catch (permErr) {
      console.error("❌ Permission error (continuing anyway...):", permErr.message);
    }

    // 7. Generate Link
    const driveLink = `https://drive.google.com/file/d/${fileId}/view`;
    console.log("🔗 Generated link:", driveLink);

    console.log("------------------------------------------");
    console.log("✅ DRIVE UPLOAD COMPLETE");
    console.log("------------------------------------------");

    return driveLink;

  } catch (err) {
    console.error("❌ DRIVE ERROR FULL:", err.message);
    if (err.response && err.response.data) {
        console.error("Details:", JSON.stringify(err.response.data));
    }
    return null;
  }
}

module.exports = { uploadToDrive };
