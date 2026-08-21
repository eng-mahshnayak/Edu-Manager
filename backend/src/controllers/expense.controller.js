const Expense = require("../models/Expense");

// ========== Helper: Generate expense ID ==========
const generateExpenseId = async () => {
  const last = await Expense.findOne().sort({ expenseId: -1 });
  if (!last) return "EXP001";
  const num = parseInt(last.expenseId.slice(3)) + 1;
  return "EXP" + String(num).padStart(3, "0");
};

// ========== CREATE ==========
exports.createExpense = async (req, res) => {
  try {
    const data = req.body;

    // Validate required fields
    const requiredFields = [
      "date", "category", "amount", "description",
      "paymentMethod", "paymentStatus"
    ];
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

    const expenseId = await generateExpenseId();

    const newExpense = new Expense({
      expenseId,
      date: data.date,
      category: data.category,
      subCategory: data.subCategory || "",
      amount: data.amount,
      description: data.description,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus || "paid",
      billNumber: data.billNumber || "",
      vendorName: data.vendorName || "",
      vendorPhone: data.vendorPhone || "",
      attachment: data.attachment || "",
      approvedBy: data.approvedBy || "",
      remarks: data.remarks || "",
    });

    await newExpense.save();

    res.status(201).json({
      status: true,
      statusCode: 201,
      data: newExpense,
      error: null,
      message: "Expense added successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to add expense",
    });
  }
};

// ========== GET ALL (with filters) ==========
exports.getExpenses = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      category,
      paymentMethod,
      paymentStatus,
      search,
      minAmount,
      maxAmount,
    } = req.query;

    const filter = {};

    // Date range
    if (startDate) {
      filter.date = { ...filter.date, $gte: new Date(startDate) };
    }
    if (endDate) {
      filter.date = { ...filter.date, $lte: new Date(endDate) };
    }

    if (category && category !== "all") filter.category = category;
    if (paymentMethod && paymentMethod !== "all") filter.paymentMethod = paymentMethod;
    if (paymentStatus && paymentStatus !== "all") filter.paymentStatus = paymentStatus;

    if (minAmount) filter.amount = { ...filter.amount, $gte: parseFloat(minAmount) };
    if (maxAmount) filter.amount = { ...filter.amount, $lte: parseFloat(maxAmount) };

    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: "i" } },
        { vendorName: { $regex: search, $options: "i" } },
        { billNumber: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });

    res.status(200).json({
      status: true,
      statusCode: 200,
      data: expenses,
      error: null,
      message: "Expenses fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to fetch expenses",
    });
  }
};

// ========== GET BY ID ==========
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        data: null,
        error: "Expense not found",
        message: "Expense not found",
      });
    }
    res.status(200).json({
      status: true,
      statusCode: 200,
      data: expense,
      error: null,
      message: "Expense fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to fetch expense",
    });
  }
};

// ========== UPDATE ==========
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const expense = await Expense.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!expense) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        data: null,
        error: "Expense not found",
        message: "Expense not found",
      });
    }

    res.status(200).json({
      status: true,
      statusCode: 200,
      data: expense,
      error: null,
      message: "Expense updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to update expense",
    });
  }
};

// ========== DELETE ==========
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        data: null,
        error: "Expense not found",
        message: "Expense not found",
      });
    }
    res.status(200).json({
      status: true,
      statusCode: 200,
      data: expense,
      error: null,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to delete expense",
    });
  }
};

// ========== EXPENSE SUMMARY (for dashboard) ==========
exports.getExpenseSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};
    if (startDate) filter.date = { $gte: new Date(startDate) };
    if (endDate) filter.date = { ...filter.date, $lte: new Date(endDate) };

    const expenses = await Expense.find(filter);

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const paid = expenses.filter(e => e.paymentStatus === "paid").reduce((sum, e) => sum + e.amount, 0);
    const pending = expenses.filter(e => e.paymentStatus === "pending").reduce((sum, e) => sum + e.amount, 0);
    const partial = expenses.filter(e => e.paymentStatus === "partial").reduce((sum, e) => sum + e.amount, 0);

    // Category breakdown
    const categories = {};
    expenses.forEach(e => {
      if (!categories[e.category]) categories[e.category] = 0;
      categories[e.category] += e.amount;
    });

    res.status(200).json({
      status: true,
      statusCode: 200,
      data: {
        total,
        paid,
        pending,
        partial,
        categories,
        count: expenses.length,
      },
      error: null,
      message: "Summary fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to fetch summary",
    });
  }
};