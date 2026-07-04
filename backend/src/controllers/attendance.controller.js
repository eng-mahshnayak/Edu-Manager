const Attendance = require('../models/attendance.model');
const Employee = require('../models/employee.model');

// @desc    Mark check-in
// @route   POST /api/attendance/checkin
// @access  Private
const checkIn = async (req, res) => {
  try {
    const { employeeId, location, deviceInfo, photo, notes } = req.body;

    // Get employee details
    const employee = await Employee.findOne({ employeeId });
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await Attendance.findOne({
      employee: employee._id,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (existingAttendance && existingAttendance.checkIn.time) {
      return res.status(400).json({
        success: false,
        message: 'Already checked in today'
      });
    }

    // Determine attendance status based on shift timing
    const currentTime = new Date();
    const shiftStart = employee.shiftTiming.start; // "09:00"
    const [hours, minutes] = shiftStart.split(':');
    const shiftStartTime = new Date();
    shiftStartTime.setHours(parseInt(hours), parseInt(minutes), 0);

    let status = 'Present';
    const lateMinutes = Math.floor((currentTime - shiftStartTime) / 60000);

    if (lateMinutes > 15) {
      status = 'Late';
    }

    // Create or update attendance
    let attendance;
    if (existingAttendance) {
      attendance = await Attendance.findByIdAndUpdate(
        existingAttendance._id,
        {
          checkIn: {
            time: currentTime,
            location,
            ipAddress: req.ip,
            deviceInfo,
            photo,
            notes
          },
          status,
          lateComing: {
            isLate: status === 'Late',
            minutesLate: status === 'Late' ? lateMinutes : 0,
            reason: status === 'Late' ? notes : ''
          }
        },
        { new: true }
      );
    } else {
      attendance = await Attendance.create({
        employee: employee._id,
        employeeId: employee.employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        date: today,
        checkIn: {
          time: currentTime,
          location,
          ipAddress: req.ip,
          deviceInfo,
          photo,
          notes
        },
        status,
        lateComing: {
          isLate: status === 'Late',
          minutesLate: status === 'Late' ? lateMinutes : 0,
          reason: status === 'Late' ? notes : ''
        }
      });
    }

    res.status(200).json({
      success: true,
      data: attendance,
      message: 'Check-in successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark check-out
// @route   POST /api/attendance/checkout
// @access  Private
const checkOut = async (req, res) => {
  try {
    const { employeeId, location, deviceInfo, photo, notes } = req.body;

    // Get today's attendance record
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'No check-in record found for today'
      });
    }

    if (attendance.checkOut && attendance.checkOut.time) {
      return res.status(400).json({
        success: false,
        message: 'Already checked out today'
      });
    }

    const checkOutTime = new Date();
    
    // Calculate working hours
    const checkInTime = new Date(attendance.checkIn.time);
    const workingMs = checkOutTime - checkInTime;
    const workingHours = workingMs / (1000 * 60 * 60);

    // Check for early going
    const shiftEnd = await getEmployeeShiftEnd(employeeId);
    const [hours, minutes] = shiftEnd.split(':');
    const shiftEndTime = new Date();
    shiftEndTime.setHours(parseInt(hours), parseInt(minutes), 0);
    
    const earlyMinutes = Math.floor((shiftEndTime - checkOutTime) / 60000);
    const isEarly = earlyMinutes > 15;

    // Update attendance
    attendance.checkOut = {
      time: checkOutTime,
      location,
      ipAddress: req.ip,
      deviceInfo,
      photo,
      notes
    };
    attendance.totalWorkingHours = workingHours;
    attendance.earlyGoing = {
      isEarly,
      minutesEarly: isEarly ? earlyMinutes : 0,
      reason: isEarly ? notes : ''
    };

    // Calculate overtime if applicable
    if (workingHours > 8) {
      attendance.overtime = workingHours - 8;
    }

    await attendance.save();

    res.status(200).json({
      success: true,
      data: attendance,
      message: 'Check-out successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to get employee shift end time
const getEmployeeShiftEnd = async (employeeId) => {
  const employee = await Employee.findOne({ employeeId });
  return employee ? employee.shiftTiming.end : '18:00';
};

// @desc    Get all attendance records with search
// @route   GET /api/attendance
// @access  Private
const getAllAttendance = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      startDate,
      endDate,
      status,
      department,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = {};

    // Search by employee ID or name using regex (case insensitive)
    if (search) {
      query.$or = [
        { employeeId: { $regex: search, $options: 'i' } },
        { employeeName: { $regex: search, $options: 'i' } }
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Department filter (through employee reference)
    if (department) {
      const employees = await Employee.find({ department }).select('_id');
      query.employee = { $in: employees.map(e => e._id) };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with population
    const attendance = await Attendance.find(query)
      .populate('employee', 'firstName lastName department designation')
      .populate('approvedBy', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await Attendance.countDocuments(query);

    // Get summary statistics
    const summary = await Attendance.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalPresent: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
          totalAbsent: { $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] } },
          totalLate: { $sum: { $cond: [{ $eq: ['$status', 'Late'] }, 1, 0] } },
          totalHalfDay: { $sum: { $cond: [{ $eq: ['$status', 'Half Day'] }, 1, 0] } },
          totalWorkingHours: { $sum: '$totalWorkingHours' },
          totalOvertime: { $sum: '$overtime' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: attendance,
      summary: summary[0] || {
        totalPresent: 0,
        totalAbsent: 0,
        totalLate: 0,
        totalHalfDay: 0,
        totalWorkingHours: 0,
        totalOvertime: 0
      },
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

// @desc    Get attendance by employee ID
// @route   GET /api/attendance/employee/:employeeId
// @access  Private
const getAttendanceByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate, limit = 30 } = req.query;

    // Build date filter
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        dateFilter.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.$lte = end;
      }
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateFilter.$gte = thirtyDaysAgo;
    }

    const attendance = await Attendance.find({
      employeeId,
      date: dateFilter
    })
      .populate('employee', 'firstName lastName department designation shiftTiming')
      .sort({ date: -1 })
      .limit(parseInt(limit));

    // Get summary for this employee
    const summary = await Attendance.aggregate([
      {
        $match: {
          employeeId,
          date: dateFilter
        }
      },
      {
        $group: {
          _id: null,
          totalPresent: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
          totalAbsent: { $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] } },
          totalLate: { $sum: { $cond: [{ $eq: ['$status', 'Late'] }, 1, 0] } },
          totalHalfDay: { $sum: { $cond: [{ $eq: ['$status', 'Half Day'] }, 1, 0] } },
          totalWorkingHours: { $sum: '$totalWorkingHours' },
          totalOvertime: { $sum: '$overtime' },
          averageWorkingHours: { $avg: '$totalWorkingHours' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: attendance,
      summary: summary[0] || {
        totalPresent: 0,
        totalAbsent: 0,
        totalLate: 0,
        totalHalfDay: 0,
        totalWorkingHours: 0,
        totalOvertime: 0,
        averageWorkingHours: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get today's attendance status
// @route   GET /api/attendance/today/:employeeId
// @access  Private
const getTodayAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    }).populate('employee', 'firstName lastName shiftTiming');

    res.status(200).json({
      success: true,
      data: attendance || { status: 'Not Checked In' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark bulk attendance
// @route   POST /api/attendance/bulk
// @access  Private
const markBulkAttendance = async (req, res) => {
  try {
    const { date, attendance: attendanceList } = req.body;

    if (!date || !Array.isArray(attendanceList)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide date and attendance list'
      });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const results = {
      success: [],
      failed: []
    };

    for (const item of attendanceList) {
      try {
        const employee = await Employee.findOne({ employeeId: item.employeeId });
        
        if (!employee) {
          results.failed.push({
            employeeId: item.employeeId,
            reason: 'Employee not found'
          });
          continue;
        }

        const attendance = await Attendance.findOneAndUpdate(
          {
            employee: employee._id,
            date: attendanceDate
          },
          {
            employee: employee._id,
            employeeId: employee.employeeId,
            employeeName: `${employee.firstName} ${employee.lastName}`,
            date: attendanceDate,
            status: item.status,
            checkIn: item.checkIn ? { time: item.checkIn } : undefined,
            checkOut: item.checkOut ? { time: item.checkOut } : undefined,
            remarks: item.remarks,
            createdBy: req.user._id
          },
          { upsert: true, new: true }
        );

        results.success.push(attendance);
      } catch (error) {
        results.failed.push({
          employeeId: item.employeeId,
          reason: error.message
        });
      }
    }

    res.status(200).json({
      success: true,
      data: results,
      message: `Processed ${attendanceList.length} records`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private
const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user._id
      },
      { new: true, runValidators: true }
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: attendance,
      message: 'Attendance updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Approve/Reject attendance
// @route   PATCH /api/attendance/:id/approve
// @access  Private
const approveAttendance = async (req, res) => {
  try {
    const { approvalStatus, rejectionReason } = req.body;

    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus,
        rejectionReason: approvalStatus === 'Rejected' ? rejectionReason : undefined,
        approvedBy: req.user._id,
        approvedAt: new Date()
      },
      { new: true }
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: attendance,
      message: `Attendance ${approvalStatus.toLowerCase()} successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get attendance report
// @route   GET /api/attendance/report
// @access  Private
const getAttendanceReport = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    let groupFormat;
    switch (groupBy) {
      case 'month':
        groupFormat = { $dateToString: { format: '%Y-%m', date: '$date' } };
        break;
      case 'week':
        groupFormat = { $dateToString: { format: '%Y-W%V', date: '$date' } };
        break;
      default:
        groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$date' } };
    }

    const report = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end }
        }
      },
      {
        $lookup: {
          from: 'employees',
          localField: 'employee',
          foreignField: '_id',
          as: 'employeeDetails'
        }
      },
      {
        $group: {
          _id: groupFormat,
          totalRecords: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] } },
          late: { $sum: { $cond: [{ $eq: ['$status', 'Late'] }, 1, 0] } },
          halfDay: { $sum: { $cond: [{ $eq: ['$status', 'Half Day'] }, 1, 0] } },
          totalWorkingHours: { $sum: '$totalWorkingHours' },
          totalOvertime: { $sum: '$overtime' },
          averageWorkingHours: { $avg: '$totalWorkingHours' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getAllAttendance,
  getAttendanceByEmployeeId,
  getTodayAttendance,
  markBulkAttendance,
  updateAttendance,
  approveAttendance,
  getAttendanceReport
};