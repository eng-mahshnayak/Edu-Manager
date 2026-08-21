const express = require("express");
const router = express.Router();
const multer = require("multer");
const { solveProblem } = require("../controllers/problemSolver.controller");

// Configure multer for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "video/mp4", "video/webm"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images and MP4 videos are allowed"), false);
    }
  },
});

// Route: POST /api/problem-solver/solve
router.post("/solve", upload.array("files", 5), solveProblem);

module.exports = router;