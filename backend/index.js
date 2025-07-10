import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

import { fileURLToPath } from 'url';
// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());


// Google Drive setup
const SUBMISSION_FOLDER_ID = '1MAUJsUBS71CUntnSR2QQBsZHxv_tDhhf';
const CERTIFICATE_FOLDER_ID = '1QhWeyRoMq_JELxtcGrkJShqND-FFTFEs';


// Service account credentials from env
const serviceAccount = {
  type: process.env.GC_TYPE,
  project_id: process.env.GC_PROJECT_ID,
  private_key_id: process.env.GC_PRIVATE_KEY_ID,
  private_key: process.env.GC_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.GC_CLIENT_EMAIL,
  client_id: process.env.GC_CLIENT_ID,
  auth_uri: process.env.GC_AUTH_URI,
  token_uri: process.env.GC_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GC_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.GC_CLIENT_X509_CERT_URL,
};

console.log('Loaded serviceAccount credentials:', serviceAccount);


const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Multer parses file, but not text fields by default. For text fields, use req.body
    const folderType = req.body.folderType;
    let folderId = SUBMISSION_FOLDER_ID; // default
    if (folderType === 'certificate') {
      folderId = CERTIFICATE_FOLDER_ID;
    }
    const fileMetadata = {
      name: req.file.originalname,
      parents: [folderId],
    };
    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };
    const file = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'id',
    });
    fs.unlinkSync(req.file.path); // Clean up local file
    res.json({ success: true, fileId: file.data.id });
  } catch (error) {
    console.error('Upload error:', error);
    if (error && error.stack) {
      console.error('Stack trace:', error.stack);
    }
    res.status(500).json({ success: false, error: error.message, details: error });
  }
});

app.listen(5001, () => {
  console.log('Backend server running on http://localhost:5001');
});
