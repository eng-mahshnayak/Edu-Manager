const User = require("../models/user.model");


// Helper: Generate a unique username (uppercase, random 5-digit suffix)
const generateUsername = (name) => {
  const base = name.toUpperCase().replace(/\s/g, "");
  const random = Math.floor(10000 + Math.random() * 90000);
  return `${base}${random}`;
};

// ========== CREATE ==========
exports.createUser = async (req, res) => {
  try {
    const data = req.body;

    // Validate required fields
    if (!data.name || !data.password) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        data: null,
        error: "Name and password are required",
        message: "Name and password are required",
      });
    }

    // Auto‑generate username if not provided
    let username = data.username ? data.username.toUpperCase() : generateUsername(data.name);
    // Ensure uniqueness
    let unique = false;
    let attempts = 0;
    while (!unique && attempts < 10) {
      const exists = await User.findOne({ username });
      if (!exists) {
        unique = true;
        break;
      }
      username = generateUsername(data.name) + Math.floor(Math.random() * 100);
      attempts++;
    }
    if (!unique) {
      return res.status(500).json({
        status: false,
        statusCode: 500,
        data: null,
        error: "Could not generate unique username",
        message: "Could not generate unique username",
      });
    }

    const newUser = new User({
      name: data.name,
      username,
      password: data.password,
      role: data.role || "deliveryboy",
      isActive: data.isActive !== undefined ? data.isActive : true,
    });

    await newUser.save();

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      status: true,
      statusCode: 201,
      data: userResponse,
      error: null,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to create user",
    });
  }
};

// ========== GET ALL (with filters) ==========
exports.getUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    const filter = {};

    if (role && role !== "all") filter.role = role;
    if (status && status !== "all") filter.isActive = status === "active";
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select("-password -resetPasswordOTP -resetPasswordExpires")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      statusCode: 200,
      data: users,
      error: null,
      message: "Users fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to fetch users",
    });
  }
};

// ========== GET BY ID ==========
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -resetPasswordOTP -resetPasswordExpires");
    if (!user) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        data: null,
        error: "User not found",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: true,
      statusCode: 200,
      data: user,
      error: null,
      message: "User fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to fetch user",
    });
  }
};

// ========== UPDATE ==========
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        data: null,
        error: "User not found",
        message: "User not found",
      });
    }

    // Prevent changing username for the default admin (if any)
    if (user.username === "ADMIN" && data.username && data.username.toUpperCase() !== "ADMIN") {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        data: null,
        error: "Cannot change admin username",
        message: "Cannot change admin username",
      });
    }

    // Update fields
    if (data.name) user.name = data.name;
    if (data.username) user.username = data.username.toUpperCase();
    if (data.password) user.password = data.password;
    if (data.role) user.role = data.role;
    if (data.isActive !== undefined) user.isActive = data.isActive;

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.resetPasswordOTP;
    delete userResponse.resetPasswordExpires;

    res.status(200).json({
      status: true,
      statusCode: 200,
      data: userResponse,
      error: null,
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to update user",
    });
  }
};

// ========== DELETE ==========
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        data: null,
        error: "User not found",
        message: "User not found",
      });
    }
    // Prevent deleting the main admin (if you have a specific guard)
    // For simplicity, we allow deletion of any user.
    await user.deleteOne();
    res.status(200).json({
      status: true,
      statusCode: 200,
      data: null,
      error: null,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to delete user",
    });
  }
};

// ========== RESET PASSWORD ==========
exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        data: null,
        error: "New password must be at least 6 characters",
        message: "Invalid password",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        data: null,
        error: "User not found",
        message: "User not found",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: true,
      statusCode: 200,
      data: null,
      error: null,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to reset password",
    });
  }
};