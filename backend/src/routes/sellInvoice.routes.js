const express = require('express');
const router = express.Router();

const {
    createSellInvoice,
    getAllSellInvoices,
    getSellInvoiceById,
    updateSellInvoice,
    deleteSellInvoice,
    copySellInvoice,
    deleteAllSellInvoices,
    getSalesReport
} = require('../controllers/sell.controller');

// Optional auth middleware
// const { protect } = require('../middlewares/auth.middleware');


router.get('/report', getSalesReport);

// =============================
// CREATE SELL INVOICE
// POST /api/sell-invoices
// =============================
router.post(
    '/invoices',
    // protect,
    copySellInvoice,
    createSellInvoice
);

// =============================
// COPY SELL INVOICE
// POST /api/sell-invoices
// =============================
router.post(
    '/invoices/copy',
    // protect,

    copySellInvoice,
    createSellInvoice
);


// =============================
// GET ALL SELL INVOICES
// GET /api/sell-invoices
// =============================
router.get(
    '/invoices',
    // protect,
    getAllSellInvoices
);


// =============================
// GET SINGLE SELL INVOICE
// GET /api/sell-invoices/:id
// =============================
router.get(
    '/:id',
    // protect,
    getSellInvoiceById
);


// =============================
// UPDATE SELL INVOICE
// PUT /api/sell-invoices/:id
// =============================
router.put(
    '/:id',
    // protect,
    updateSellInvoice
);


// =============================
// DELETE SELL INVOICE
// DELETE /api/sell-invoices/:id
// =============================
router.delete(
    '/invoices/deletebyid/:id',
    // protect,
    deleteSellInvoice
);


router.delete(
    '/invoices/delete',
    // protect,
    deleteAllSellInvoices
);



module.exports = router;
