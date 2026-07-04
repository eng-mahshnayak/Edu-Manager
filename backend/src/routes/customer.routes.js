const express = require('express');
const router = express.Router();

const {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    searchCustomers
} = require('../controllers/party.controller.js');



// =============================
// SEARCH CUSTOMERS (Advanced search with regex)
// GET /api/customers/search?query=term&type=wholesale&status=active
// =============================
router.get(
    '/search',
    // protect,
    searchCustomers
);


// POST /api/customers - Create new customer
// GET /api/customers - Get all customers
router.route('/')
    .post(createCustomer)
    .get(getAllCustomers);

// GET /api/customers/:id - Get single customer
// PUT /api/customers/:id - Update customer
// DELETE /api/customers/:id - Delete customer
router.route('/:id')
    .get(getCustomerById)
    .put(updateCustomer)
    .delete(deleteCustomer);

module.exports = router;