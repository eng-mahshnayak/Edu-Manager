const express = require ('express');
const { searchInventoryStocks } = require('../controllers/inventoryStock.controller');
const { getDashboardStats, getAllInventoryStock } = require('../controllers/dashboard.controller');

const router = express.Router();

router.get(
    '/search',
    // protect,
    searchInventoryStocks
);






router.get('/dashboard',getDashboardStats)

router.get('/report',getAllInventoryStock)

module.exports = router;