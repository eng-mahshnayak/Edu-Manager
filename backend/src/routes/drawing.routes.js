const express = require("express");
const router = express.Router();
const Drawing = require("../models/Drawing");

// Save drawing
router.post("/save", async (req, res) => {
  try {
    const { name, data } = req.body;
    if (!name || !data) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }
    const drawing = new Drawing({ name, data });
    await drawing.save();
    res.status(201).json({ success: true, data: drawing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all drawings (list)
router.get("/list", async (req, res) => {
  try {
    const drawings = await Drawing.find().sort({ createdAt: -1 });
    res.json({ success: true, data: drawings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single drawing by ID
router.get("/:id", async (req, res) => {
  try {
    const drawing = await Drawing.findById(req.params.id);
    if (!drawing) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true, data: drawing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;