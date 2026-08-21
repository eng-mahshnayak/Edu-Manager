const ClassAssignment = require("../models/ClassAssignment");

// ========== CREATE ==========
exports.createAssignment = async (req, res) => {
  try {
    const data = req.body;

    // Validate required fields
    const required = [
      "className", "section", "staffId", "staffName", "subject",
      "timings", "daysOfWeek", "roomNumber", "academicYear"
    ];
    for (const field of required) {
      if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) {
        return res.status(400).json({
          status: false,
          statusCode: 400,
          data: null,
          error: `${field} is required`,
          message: `${field} is required`,
        });
      }
    }

    const assignment = new ClassAssignment(data);
    await assignment.save();

    res.status(201).json({
      status: true,
      statusCode: 201,
      data: assignment,
      error: null,
      message: "Class assignment created successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to create assignment",
    });
  }
};

// ========== GET ALL (with filters) ==========
exports.getAssignments = async (req, res) => {
  try {
    const { className, section, staffId, subject, isActive, search } = req.query;
    const filter = {};

    if (className) filter.className = className;
    if (section) filter.section = section;
    if (staffId) filter.staffId = staffId;
    if (subject) filter.subject = { $regex: subject, $options: "i" };
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (search) {
      filter.$or = [
        { className: { $regex: search, $options: "i" } },
        { section: { $regex: search, $options: "i" } },
        { staffName: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { roomNumber: { $regex: search, $options: "i" } },
      ];
    }

    const assignments = await ClassAssignment.find(filter).sort({ className: 1, section: 1 });
    res.status(200).json({
      status: true,
      statusCode: 200,
      data: assignments,
      error: null,
      message: "Assignments fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to fetch assignments",
    });
  }
};

// ========== GET BY ID ==========
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await ClassAssignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        data: null,
        error: "Assignment not found",
        message: "Assignment not found",
      });
    }
    res.status(200).json({
      status: true,
      statusCode: 200,
      data: assignment,
      error: null,
      message: "Assignment fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to fetch assignment",
    });
  }
};

// ========== UPDATE ==========
exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const assignment = await ClassAssignment.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!assignment) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        data: null,
        error: "Assignment not found",
        message: "Assignment not found",
      });
    }

    res.status(200).json({
      status: true,
      statusCode: 200,
      data: assignment,
      error: null,
      message: "Assignment updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to update assignment",
    });
  }
};

// ========== DELETE ==========
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await ClassAssignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        data: null,
        error: "Assignment not found",
        message: "Assignment not found",
      });
    }
    res.status(200).json({
      status: true,
      statusCode: 200,
      data: assignment,
      error: null,
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to delete assignment",
    });
  }
};

// ========== GET TIMETABLE FOR A CLASS ==========
exports.getClassTimetable = async (req, res) => {
  try {
    const { className } = req.params;
    const assignments = await ClassAssignment.find({
      className,
      isActive: true,
    }).sort({ section: 1 });

    // Group by section
    const timetable = {};
    assignments.forEach((a) => {
      if (!timetable[a.section]) timetable[a.section] = [];
      timetable[a.section].push({
        staffName: a.staffName,
        subject: a.subject,
        startTime: a.timings.startTime,
        endTime: a.timings.endTime,
        daysOfWeek: a.daysOfWeek,
        roomNumber: a.roomNumber,
      });
    });

    res.status(200).json({
      status: true,
      statusCode: 200,
      data: { className, timetable },
      error: null,
      message: "Timetable fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to fetch timetable",
    });
  }
};