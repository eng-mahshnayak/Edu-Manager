const express = require('express');
const router = express.Router();

const { createPurchaseInvoice, getAllPurchaseInvoices, getPurchaseInvoiceById, updatePurchaseInvoice, deleteAllPurchaseInvoices, deletePurchaseInvoice, generateFiveDigitRandomNumber } = require('../controllers/purchase.controller');

// Optional auth middleware
// const { protect } = require('../middlewares/auth.middleware');

// =============================
// CREATE PURCHASE INVOICE
// POST /api/purchase
// =============================
router.post(
    '/invoices',
    // protect,
    createPurchaseInvoice
);




// =============================
// COPY PURCHASE INVOICE
// POST /api/purchase
// =============================
router.post(
    '/invoices/copy',
    // protect,
    generateFiveDigitRandomNumber,
    createPurchaseInvoice
);

// =============================
// GET ALL PURCHASE INVOICES
// GET /api/purchase
// =============================
router.get(
    '/invoice',
    // protect,
    getAllPurchaseInvoices
);

// =============================
// GET PURCHASE INVOICE BY ID
// GET /api/purchase/:id
// =============================
router.get(
    '/invoice/:id',
    // protect,
    getPurchaseInvoiceById
);

// =============================
// UPDATE PURCHASE INVOICE
// PUT /api/purchase/:id
// =============================
router.put(
    '/invoice/:id',
    // protect,
    updatePurchaseInvoice
);


// =============================
// DELETE ALL PURCHASE INVOICES
// DELETE /api/purchase/delete-all
// =============================
router.delete(
    '/invoices/delete',
    // protect,
    deleteAllPurchaseInvoices
);

// =============================
// DELETE PURCHASE INVOICE
// DELETE /api/purchase/:id
// =============================
router.delete(
    '/invoices/deletebyid/:id',
    // protect,
    deletePurchaseInvoice
);



// // =============================
// // UPDATE PAYMENT STATUS
// // PATCH /api/purchase/:id/payment
// // =============================
// router.patch(
//     '/:id/payment',
//     // protect,
//     updatePaymentStatus
// );

module.exports = router;