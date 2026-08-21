const Attendance = require("../models/Attendance");
const Staff = require("../models/staff.model");

// ========== GET ATTENDANCE FOR A DATE ==========
exports.getAttendance = async (req, res) => {
  try {
    const { date, role } = req.query;
    if (!date) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        data: null,
        error: "Date is required",
        message: "Date is required",
      });
    }

    // Parse date to start of day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Fetch all active staff (with optional role filter)
    const staffFilter = { isActive: true };
    if (role && role !== "all") staffFilter.role = role;
    const staffList = await Staff.find(staffFilter).select("_id name role department staffId");

    // Fetch attendance for the date
    const attendanceRecords = await Attendance.find({
      date: { $gte: startDate, $lte: endDate },
    });

    // Build response: for each staff, get attendance or default absent
    const result = staffList.map((staff) => {
      const record = attendanceRecords.find((r) => r.staffId === staff.staffId);
      return {
        staffId: staff.staffId,
        staffName: staff.name,
        role: staff.role,
        department: staff.department || "",
        status: record ? record.status : "absent",
        checkInTime: record?.checkInTime || "",
        checkOutTime: record?.checkOutTime || "",
        remarks: record?.remarks || "",
        _id: record?._id || null,
      };
    });

    res.status(200).json({
      status: true,
      statusCode: 200,
      data: result,
      error: null,
      message: "Attendance fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to fetch attendance",
    });
  }
};

// ========== BULK SAVE ATTENDANCE ==========
exports.bulkSaveAttendance = async (req, res) => {
  try {
    const { date, records } = req.body;
    if (!date || !records || !Array.isArray(records)) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        data: null,
        error: "Invalid request",
        message: "Date and records array are required",
      });
    }

    // Parse date
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const bulkOps = records.map((record) => ({
      updateOne: {
        filter: { staffId: record.staffId, date: attendanceDate },
        update: {
          $set: {
            staffName: record.staffName,
            status: record.status,
            checkInTime: record.checkInTime || "",
            checkOutTime: record.checkOutTime || "",
            remarks: record.remarks || "",
          },
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(bulkOps);

    res.status(200).json({
      status: true,
      statusCode: 200,
      data: null,
      error: null,
      message: "Attendance saved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to save attendance",
    });
  }
};

// ========== GET SUMMARY FOR A DATE ==========
exports.getSummary = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        data: null,
        error: "Date is required",
        message: "Date is required",
      });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const allStaff = await Staff.find({ isActive: true });
    const totalStaff = allStaff.length;

    const attendanceRecords = await Attendance.find({
      date: { $gte: startDate, $lte: endDate },
    });

    const present = attendanceRecords.filter((r) => r.status === "present").length;
    const absent = attendanceRecords.filter((r) => r.status === "absent").length;
    const late = attendanceRecords.filter((r) => r.status === "late").length;
    const halfDay = attendanceRecords.filter((r) => r.status === "half-day").length;

    // Handle staff with no record (treated as absent)
    const recordedStaffIds = attendanceRecords.map((r) => r.staffId);
    const unrecordedCount = allStaff.filter((s) => !recordedStaffIds.includes(s.staffId)).length;
    const totalAbsent = absent + unrecordedCount;

    res.status(200).json({
      status: true,
      statusCode: 200,
      data: {
        total: totalStaff,
        present,
        absent: totalAbsent,
        late,
        halfDay,
        percentage: totalStaff > 0 ? ((present + late + halfDay) / totalStaff) * 100 : 0,
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



// ========== MONTHLY REPORT (with salary) ==========
exports.getMonthlyReport = async (req, res) => {
  try {
    const { month } = req.query; // expected format: "2024-01"
    if (!month) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        data: null,
        error: "Month is required (YYYY-MM)",
        message: "Month is required",
      });
    }

    // Parse month to start and end dates
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0); // last day of month
    const totalWorkingDays = endDate.getDate(); // assuming all days are working days (or we can exclude weekends if needed)

    // Fetch all active staff
    const staffList = await Staff.find({ isActive: true }).select(
      "_id staffId name role department salaryType salary"
    );

    // Fetch all attendance records for the month
    const attendanceRecords = await Attendance.find({
      date: { $gte: startDate, $lte: endDate },
    });

    // Build summary per staff
    const report = staffList.map((staff) => {
      const staffRecords = attendanceRecords.filter((r) => r.staffId === staff.staffId);
      let present = 0,
        absent = 0,
        late = 0,
        halfDay = 0;
      staffRecords.forEach((rec) => {
        switch (rec.status) {
          case "present":
            present++;
            break;
          case "absent":
            absent++;
            break;
          case "late":
            late++;
            break;
          case "half-day":
            halfDay++;
            break;
        }
      });

      // Staff with no records are considered absent for all days
      const recordedDays = staffRecords.length;
      const unrecorded = totalWorkingDays - recordedDays;
      absent += unrecorded;

      // Salary calculation
      let basicSalary = staff.salary || 0;
      let earnedSalary = 0;
      let deductions = 0;
      let dailyRate = 0;

      if (staff.salaryType === "MONTHLY") {
        dailyRate = basicSalary / totalWorkingDays;
        deductions = dailyRate * absent;
        earnedSalary = basicSalary - deductions;
        // For half-day, we can deduct half day's salary (optional)
        // deductions += dailyRate * 0.5 * halfDay;
        // earnedSalary = basicSalary - deductions;
      } else if (staff.salaryType === "DAILY") {
        dailyRate = basicSalary;
        earnedSalary = dailyRate * present;
        deductions = 0;
      } else if (staff.salaryType === "HOURLY") {
        // Assume 8 hours per day
        const hourlyRate = basicSalary;
        const dailyHours = 8;
        earnedSalary = hourlyRate * dailyHours * present;
        deductions = 0;
      }

      // Round to 2 decimals
      earnedSalary = Math.round(earnedSalary * 100) / 100;
      deductions = Math.round(deductions * 100) / 100;

      return {
        staffId: staff.staffId,
        staffName: staff.name,
        role: staff.role,
        department: staff.department || "",
        present,
        absent,
        late,
        halfDay,
        totalDays: totalWorkingDays,
        percentage: totalWorkingDays > 0 ? ((present + late + halfDay) / totalWorkingDays) * 100 : 0,
        salaryType: staff.salaryType,
        basicSalary,
        earnedSalary,
        deductions,
      };
    });

    res.status(200).json({
      status: true,
      statusCode: 200,
      data: report,
      error: null,
      message: "Monthly report generated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      statusCode: 500,
      data: null,
      error: error.message,
      message: "Failed to generate monthly report",
    });
  }
};