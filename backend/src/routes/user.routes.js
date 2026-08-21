const express = require('express');
const { signup, signin, forgotPassword, verifyOTP, resetPassword, signupMain } = require('../controllers/auth.controller');

const {  createRole, getRoleById, getAllRoles } = require('../controllers/permission.controller');
const {  getFruits } = require('../controllers/aiContent.controller');
const router = express.Router();




// =========== PUBLIC ROUTES (No Authentication Required) ===========
router.post('/main/signup', signupMain);
router.post('/signup', signup);


router.post('/signup', signup);
// router.post('/draw', getFruits);


router.post('/signin', signin);
router.post('/forgotpassword', forgotPassword);
router.post('/verifyotp', verifyOTP);
router.post('/reset-password', resetPassword);






router.get('/permissions/rolesbyid/:id',getRoleById);

router.get('/permissions/roles',getAllRoles);

router.post('/permissions/roles',createRole)





module.exports = router;