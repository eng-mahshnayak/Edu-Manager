const Staff = require("../models/staff.model");

// ========== Helper: Generate Staff ID ==========
const generateStaffId = async () => {
  const lastStaff = await Staff.findOne().sort({ staffId: -1 });
  if (!lastStaff) return "STF001";
  const num = parseInt(lastStaff.staffId.slice(3)) + 1;
  return "STF" + String(num).padStart(3, "0");
};

// ========== CREATE ==========
exports.createStaff = async (req, res) => {
  try {
    const data = req.body;

    // Validate required fields
    const requiredFields = ["name", "phone", "role", "joiningDate", "salaryType", "salary"];
    for (const field of requiredFields) {
      if (!data[field]) {
        return res.status(400).json({
          status: false,
          statusCode: 400,
          data: null,
          error: `${field} is required`,
          message: `${field} is required`,
        });
      }
    }

    // Validate role
    const allowedRoles = ["TEACHER", "DRIVER", "MAID", "LABOUR"];
    if (!allowedRoles.includes(data.role)) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        data: null,
        error: "Invalid role",
        message: "Role must be one of: TEACHER, DRIVER, MAID, LABOUR",
      });
    }

    // If role is TEACHER, department is required
    if (data.role === "TEACHER" && !data.department) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        data: null,
        error: "Department is required for TEACHER role",
        message: "Department is required for TEACHER role",
      });
    }

    // Generate staff ID
    const staffId = await generateStaffId();

    const newStaff = new Staff({
      staffId,
      name: data.name,
      phone: data.phone,
      email: data.email || "",
      role: data.role,
      department: data.department,
      joiningDate: data.joiningDate,
      salaryType: data.salaryType,
      salary: data.salary,
      isActive: data.isActive !== undefined ? data.isActive : true,
    });

    await newStaff.save();

    res.status(201).json({
      status: true,
      statusCode: 201,
      data: newStaff,
      error: null,
      message: "Staff member added successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to add staff",
    });
  }
};

// ========== GET ALL (with filters) ==========
exports.getStaff = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    const filter = {};

    if (role && role !== "all") filter.role = role;
    if (status) filter.isActive = status === "active";
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { staffId: { $regex: search, $options: "i" } },
      ];
    }

    const staff = await Staff.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      statusCode: 200,
      data: staff,
      error: null,
      message: "Staff fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to fetch staff",
    });
  }
};

// ========== GET BY ID ==========
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        data: null,
        error: "Staff not found",
        message: "Staff not found",
      });
    }
    res.status(200).json({
      status: true,
      statusCode: 200,
      data: staff,
      error: null,
      message: "Staff fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to fetch staff",
    });
  }
};

// ========== UPDATE ==========
exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Validate role if provided
    if (data.role) {
      const allowedRoles = ["TEACHER", "DRIVER", "MAID", "LABOUR"];
      if (!allowedRoles.includes(data.role)) {
        return res.status(400).json({
          status: false,
          statusCode: 400,
          data: null,
          error: "Invalid role",
          message: "Role must be one of: TEACHER, DRIVER, MAID, LABOUR",
        });
      }
      if (data.role === "TEACHER" && !data.department) {
        return res.status(400).json({
          status: false,
          statusCode: 400,
          data: null,
          error: "Department is required for TEACHER role",
          message: "Department is required for TEACHER role",
        });
      }
    }

    const staff = await Staff.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!staff) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        data: null,
        error: "Staff not found",
        message: "Staff not found",
      });
    }

    res.status(200).json({
      status: true,
      statusCode: 200,
      data: staff,
      error: null,
      message: "Staff updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to update staff",
    });
  }
};

// ========== DELETE ==========
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        data: null,
        error: "Staff not found",
        message: "Staff not found",
      });
    }
    res.status(200).json({
      status: true,
      statusCode: 200,
      data: staff,
      error: null,
      message: "Staff deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to delete staff",
    });
  }
};