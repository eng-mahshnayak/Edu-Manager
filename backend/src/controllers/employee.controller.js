const Employee = require('../models/employee.model');

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private
const createEmployee = async (req, res) => {
  try {
    const { employeeId, email } = req.body;

    // Check if employee with same employeeId or email exists
    const existingEmployee = await Employee.findOne({
      $or: [{ employeeId }, { email }]
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Employee with this ID or email already exists'
      });
    }

    // Generate employee ID if not provided
    if (!employeeId) {
      const count = await Employee.countDocuments();
      req.body.employeeId = `EMP${String(count + 1).padStart(4, '0')}`;
    }

    // Add createdBy
    req.body.createdBy = req.user._id;

    const employee = await Employee.create(req.body);

    res.status(201).json({
      success: true,
      data: employee,
      message: 'Employee created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all employees with pagination and search
// @route   GET /api/employees
// @access  Private
const getAllEmployees = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      department,
      status,
      employeeType,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = {};

    // Search using regex (case insensitive)
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } }
      ];
    }

    // Additional filters
    if (department) query.department = department;
    if (status) query.status = status;
    if (employeeType) query.employeeType = employeeType;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const employees = await Employee.find(query)
      .populate('reportingManager', 'firstName lastName employeeId')
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await Employee.countDocuments(query);

    res.status(200).json({
      success: true,
      data: employees,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('reportingManager', 'firstName lastName employeeId email')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployee = async (req, res) => {
  try {
    // Check if employee exists
    let employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Check email uniqueness if being updated
    if (req.body.email && req.body.email !== employee.email) {
      const emailExists = await Employee.findOne({
        email: req.body.email,
        _id: { $ne: req.params.id }
      });
      
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Add updatedBy
    req.body.updatedBy = req.user._id;

    employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: employee,
      message: 'Employee updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Check if employee has any attendance records
    const Attendance = require('../models/Attendance');
    const attendanceCount = await Attendance.countDocuments({ employee: req.params.id });

    if (attendanceCount > 0) {
      // Soft delete - just mark as inactive
      employee.status = 'Inactive';
      await employee.save();
      
      return res.status(200).json({
        success: true,
        message: 'Employee marked as inactive (has attendance records)'
      });
    }

    // Hard delete if no attendance records
    await employee.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Search employees by name/ID (for dropdowns)
// @route   GET /api/employees/search
// @access  Private
const searchEmployees = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const employees = await Employee.find({
      $or: [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { employeeId: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } }
      ],
      status: 'Active'
    })
      .select('firstName lastName employeeId email phone department designation')
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: employees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get employee by employee ID
// @route   GET /api/employees/employeeId/:empId
// @access  Private
const getEmployeeByEmpId = async (req, res) => {
  try {
    const employee = await Employee.findOne({ employeeId: req.params.empId })
      .populate('reportingManager', 'firstName lastName employeeId');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Bulk import employees
// @route   POST /api/employees/bulk
// @access  Private
const bulkImportEmployees = async (req, res) => {
  try {
    const employees = req.body.employees;

    if (!Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of employees'
      });
    }

    // Add createdBy to all employees
    const employeesWithMeta = employees.map(emp => ({
      ...emp,
      createdBy: req.user._id
    }));

    const createdEmployees = await Employee.insertMany(employeesWithMeta, {
      ordered: false // Continue even if some fail
    });

    res.status(201).json({
      success: true,
      data: createdEmployees,
      message: `${createdEmployees.length} employees imported successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update employee status
// @route   PATCH /api/employees/:id/status
// @access  Private
const updateEmployeeStatus = async (req, res) => {
  try {
    const { status, lastWorkingDay, resignationDate } = req.body;

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        status,
        lastWorkingDay,
        resignationDate,
        updatedBy: req.user._id
      },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
      message: `Employee status updated to ${status}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
  getEmployeeByEmpId,
  bulkImportEmployees,
  updateEmployeeStatus
};