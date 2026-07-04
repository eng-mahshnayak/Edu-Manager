const express = require('express');
const router = express.Router();

const {
    createDailyCash,
    getAllDailyCash,
    getDailyCashById,
    updateDailyCash,
    deleteDailyCash
} = require('../controllers/dailyCash.controller');
const { verifyToken } = require('../middleware/jwtTokenVerify.middleware');




// =============================
// CREATE DAILY CASH
// POST /api/daily-cash
// =============================
router.post(
    '/',
    verifyToken,
    createDailyCash
);


// =============================
// GET ALL DAILY CASH
// GET /api/daily-cash
// =============================
router.get(
    '/',
    // protect,
    getAllDailyCash
);


// =============================
// GET SINGLE DAILY CASH
// GET /api/daily-cash/:id
// =============================
router.get(
    '/:id',
    // protect,
    getDailyCashById
);


// =============================
// UPDATE DAILY CASH
// PUT /api/daily-cash/:id
// =============================
router.put(
    '/:id',
    // protect,
    updateDailyCash
);


// =============================
// DELETE DAILY CASH
// DELETE /api/daily-cash/:id
// =============================
router.delete(
    '/:id',
    // protect,
    deleteDailyCash
);


module.exports = router;
