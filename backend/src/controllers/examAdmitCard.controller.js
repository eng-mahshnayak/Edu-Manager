const ExamAdmitCard = require("../models/ExamAdmitCard");

// ========== CREATE ==========
exports.createAdmitCard = async (req, res) => {
  try {
    const data = req.body;
    const newCard = new ExamAdmitCard(data);
    await newCard.save();
    res.status(201).json({
      status: true,
      statusCode: 201,
      data: newCard,
      error: null,
      message: "Admit card created successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to create admit card",
    });
  }
};

// ========== GET ALL (with filters) ==========
exports.getAdmitCards = async (req, res) => {
  try {
    const { className, examName, search } = req.query;
    const filter = {};
    if (className && className !== "all") filter.className = className;
    if (examName && examName !== "all") filter.examName = examName;
    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: "i" } },
        { rollNo: { $regex: search, $options: "i" } },
        { enrollmentNo: { $regex: search, $options: "i" } },
      ];
    }
    const cards = await ExamAdmitCard.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      statusCode: 200,
      data: cards,
      error: null,
      message: "Admit cards fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to fetch admit cards",
    });
  }
};

// ========== GET BY ID ==========
exports.getAdmitCardById = async (req, res) => {
  try {
    const card = await ExamAdmitCard.findById(req.params.id);
    if (!card) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        data: null,
        error: "Admit card not found",
        message: "Admit card not found",
      });
    }
    res.status(200).json({
      status: true,
      statusCode: 200,
      data: card,
      error: null,
      message: "Admit card fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to fetch admit card",
    });
  }
};

// ========== UPDATE ==========
exports.updateAdmitCard = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const card = await ExamAdmitCard.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!card) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        data: null,
        error: "Admit card not found",
        message: "Admit card not found",
      });
    }
    res.status(200).json({
      status: true,
      statusCode: 200,
      data: card,
      error: null,
      message: "Admit card updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to update admit card",
    });
  }
};

// ========== DELETE ==========
exports.deleteAdmitCard = async (req, res) => {
  try {
    const card = await ExamAdmitCard.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        data: null,
        error: "Admit card not found",
        message: "Admit card not found",
      });
    }
    res.status(200).json({
      status: true,
      statusCode: 200,
      data: card,
      error: null,
      message: "Admit card deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to delete admit card",
    });
  }
};