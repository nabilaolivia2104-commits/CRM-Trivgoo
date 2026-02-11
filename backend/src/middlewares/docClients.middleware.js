const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Folder tujuan upload
const uploadDir = path.join(__dirname, "../src/upload/clients");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // nama file unik: timestamp + originalname
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Hanya menerima file doc / txt / pdf
const fileFilter = (req, file, cb) => {
  const allowedTypes = /txt|pdf|doc|docx/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Hanya menerima file doc, docx, pdf, txt"));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
