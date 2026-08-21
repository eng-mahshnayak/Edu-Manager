const express = require("express");
const router = express.Router();

const {createStudent, getStudents,getStudentById, updateStudent, deleteStudent, payFee,} = require("../controllers/student.controller");
const { createStaff,getStaff, getStaffById, updateStaff,deleteStaff,} = require("../controllers/staff.controller");
const {createAssignment,getAssignments,getAssignmentById,updateAssignment, deleteAssignment, getClassTimetable,} = require("../controllers/classAssignment.controller");
const {createExpense,getExpenses,getExpenseById,updateExpense,deleteExpense,getExpenseSummary,} = require("../controllers/expense.controller");
const {createUser,getUsers,getUserById,updateUser,deleteUser,resetPassword,} = require("../controllers/user.controller");
const {getAttendance,bulkSaveAttendance,getSummary, getMonthlyReport,} = require("../controllers/attendance.controller");





const {createAdmitCard,getAdmitCards,getAdmitCardById,updateAdmitCard,deleteAdmitCard,} = require("../controllers/examAdmitCard.controller");

router.post("/exam-admit-cards/", createAdmitCard);
router.get("/exam-admit-cards/", getAdmitCards);
router.get("/exam-admit-cards/:id", getAdmitCardById);
router.put("/exam-admit-cards/:id", updateAdmitCard);
router.delete("/exam-admit-cards/:id", deleteAdmitCard);





router.get("/attendance/", getAttendance);
router.post("/attendance/bulk", bulkSaveAttendance);
router.get("/attendance/summary", getSummary);
router.get("/attendance/monthly-report", getMonthlyReport);




router.post("/users/", createUser);
router.get("/users/", getUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/reset-password", resetPassword);



router.post("/expenses/", createExpense);
router.get("/expenses/", getExpenses);
router.get("/expenses/summary", getExpenseSummary);
router.get("/expenses/:id", getExpenseById);
router.put("/expenses/:id", updateExpense);
router.delete("/expenses/:id", deleteExpense);



router.post("/students/", createStudent);
router.get("/students/", getStudents);
router.get("/students/:id", getStudentById);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);
router.patch("/students/:studentId/pay-fee", payFee);



router.post("/staff/", createStaff);
router.get("/staff/", getStaff);
router.get("/staff/:id", getStaffById);
router.put("/staff/:id", updateStaff);
router.delete("/staff/:id", deleteStaff);



router.post("/class-assignments/", createAssignment);
router.get("/class-assignments/", getAssignments);
router.get("/class-assignments/timetable/:className", getClassTimetable);
router.get("/class-assignments/:id", getAssignmentById);
router.put("/class-assignments/:id", updateAssignment);
router.delete("/class-assignments/:id", deleteAssignment);

module.exports = router;