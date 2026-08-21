const Student = require("../models/student.model");
const mongoose = require("mongoose");

const generateStudentId = async () => {
  const lastStudent = await Student.findOne().sort({ studentId: -1 });
  if (!lastStudent) return "S20250001";
  const num = parseInt(lastStudent.studentId.slice(1)) + 1;
  return "S" + String(num).padStart(8, "0");
};

// ========== CREATE ==========
exports.createStudent = async (req, res) => {
  try {
    const data = req.body;

    const requiredFields = [
      "name", "fatherName", "motherName", "dateOfBirth", "gender",
      "class", "section", "rollNumber", "admissionType",
      "phone", "email", "address", "city", "state", "pincode"
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return res.status(400).json({
          status: false, statusCode: 400, data: null,
          error: `${field} is required`, message: `${field} is required`,
        });
      }
    }

    const studentId = await generateStudentId();

    const monthlyFees = (data.feeStructure?.monthlyFees || []).map((fee) => ({
      month: fee.month,
      amount: fee.amount,
      dueDate: fee.dueDate,
      paid: fee.paid || false,
      paidDate: fee.paidDate || null,
    }));

    const studentData = {
      ...data,
      studentId,
      feeStructure: {
        admissionFee: data.feeStructure?.admissionFee || 5000,
        feeStatus: data.feeStructure?.feeStatus || false,
        admissionPaidDate: data.feeStructure?.admissionPaidDate || null,
        monthlyFees,
      },
      status: data.status || "active",
    };

    const student = new Student(studentData);
    await student.save();

    res.status(201).json({
      status: true, statusCode: 201, data: student,
      error: null, message: "Student admitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false, statusCode: 500, data: null,
      error: error.message, message: "Failed to admit student",
    });
  }
};

// ========== GET ALL ==========
exports.getStudents = async (req, res) => {
  try {
    const { class: cls, section, search, status } = req.query;
    const filter = {};
    if (cls && cls !== "all") filter.class = cls;
    if (section) filter.section = section;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const students = await Student.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      status: true, statusCode: 200, data: students,
      error: null, message: "Students fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false, statusCode: 500, data: null,
      error: error.message, message: "Failed to fetch students",
    });
  }
};

// ========== GET BY ID ==========
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        status: false, statusCode: 404, data: null,
        error: "Student not found", message: "Student not found",
      });
    }
    res.status(200).json({
      status: true, statusCode: 200, data: student,
      error: null, message: "Student fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false, statusCode: 500, data: null,
      error: error.message, message: "Failed to fetch student",
    });
  }
};

// ========== UPDATE ==========
exports.updateStudent = async (req, res) => {
  try {

    const { id } = req.params;

    console.log("=================================");
    console.log("🆔 Student Update ID:", id);
    console.log("📦 Request Body:", req.body);
    console.log("=================================");

    // ID missing
    if (!id) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        data: null,
        error: "Student ID is missing",
        message: "Student ID is required",
      });
    }

    // Invalid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        data: null,
        error: "Invalid Student ID",
        message: "Invalid Student ID",
      });
    }

    const data = { ...req.body };

    // Monthly fees
    if (data.feeStructure?.monthlyFees) {

      data.feeStructure.monthlyFees =
        data.feeStructure.monthlyFees.map((fee) => ({
          month: fee.month,
          amount: fee.amount,
          dueDate: fee.dueDate,
          paid: fee.paid || false,
          paidDate: fee.paidDate || null,
        }));

    }

    // Update
    const student = await Student.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true
      }
    );

    if (!student) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        data: null,
        error: "Student not found",
        message: "Student not found",
      });
    }

    return res.status(200).json({
      status: true,
      statusCode: 200,
      data: student,
      error: null,
      message: "Student updated successfully",
    });

  } catch (error) {

    console.error("❌ Update Student Error:", error);

    return res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to update student",
    });
  }
};

// ========== DELETE ==========
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({
        status: false, statusCode: 404, data: null,
        error: "Student not found", message: "Student not found",
      });
    }
    res.status(200).json({
      status: true, statusCode: 200, data: student,
      error: null, message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false, statusCode: 500, data: null,
      error: error.message, message: "Failed to delete student",
    });
  }
};

// ========== PAY FEE ==========
exports.payFee = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { type, month } = req.body;

    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({
        status: false, statusCode: 404, data: null,
        error: "Student not found", message: "Student not found",
      });
    }

    if (type === "admission") {
      student.feeStructure.feeStatus = true;
      student.feeStructure.admissionPaidDate = new Date();
      await student.save();
      return res.status(200).json({
        status: true, statusCode: 200, data: student,
        error: null, message: "Admission fee paid successfully",
      });
    }

    if (type === "monthly") {
      if (!month) {
        return res.status(400).json({
          status: false, statusCode: 400, data: null,
          error: "Month is required", message: "Month is required for monthly fee payment",
        });
      }

      const fee = student.feeStructure.monthlyFees.find((f) => f.month === month);
      if (!fee) {
        return res.status(404).json({
          status: false, statusCode: 404, data: null,
          error: `Fee for ${month} not found`, message: `Fee for ${month} not found`,
        });
      }

      fee.paid = true;
      fee.paidDate = new Date();
      await student.save();

      return res.status(200).json({
        status: true, statusCode: 200, data: student,
        error: null, message: `₹${fee.amount} fee for ${month} paid successfully`,
      });
    }

    res.status(400).json({
      status: false, statusCode: 400, data: null,
      error: "Invalid fee type", message: "Invalid fee type. Use 'admission' or 'monthly'",
    });
  } catch (error) {
    res.status(500).json({
      status: false, statusCode: 500, data: null,
      error: error.message, message: "Failed to process fee payment",
    });
  }
};