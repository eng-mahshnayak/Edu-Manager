const express = require('express');
const router = express.Router();
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
  getEmployeeByEmpId,
  bulkImportEmployees,
  updateEmployeeStatus
} = require('../controllers/employee.controller');

const { protect, authorize } = require('../middleware/authMiddleware');

// // All routes are protected
// router.use(protect);

// Search route (should be before /:id to avoid conflicts)
router.get('/search', searchEmployees);

// Bulk import route
router.post('/bulk', authorize('admin', 'hr'), bulkImportEmployees);

// Get by employee ID
router.get('/employeeId/:empId', getEmployeeByEmpId);

// CRUD routes
router.route('/')
  .get(getAllEmployees)
  .post(authorize('admin', 'hr'), createEmployee);

router.route('/:id')
  .get(getEmployeeById)
  .put(authorize('admin', 'hr'), updateEmployee)
  .delete(authorize('admin'), deleteEmployee);

// Update status
router.patch('/:id/status', authorize('admin', 'hr'), updateEmployeeStatus);




// Report route
router.get('/attendance/report', authorize('admin', 'hr', 'manager'), getAttendanceReport);

// Check-in/Check-out routes
router.post('/attendance/checkin', checkIn);
router.post('/attendance/checkout', checkOut);

// Bulk attendance
router.post('/attendance/bulk', authorize('admin', 'hr'), markBulkAttendance);

// Get today's attendance for an employee
router.get('/attendance/today/:employeeId', getTodayAttendance);

// Get attendance by employee ID
router.get('/attendance/employee/:employeeId', getAttendanceByEmployeeId);

// CRUD routes
router.route('/attendance/')
  .get(authorize('admin', 'hr', 'manager'), getAllAttendance);

router.route('/attendance/:id')
  .put(authorize('admin', 'hr'), updateAttendance);

// Approve/Reject attendance
router.patch('/attendance/:id/approve', authorize('admin', 'hr', 'manager'), approveAttendance);

module.exports = router;