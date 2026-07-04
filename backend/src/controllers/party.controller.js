const Party = require('../models/parties.mode.js')




// =============================
// SEARCH CUSTOMERS (For dropdown/autocomplete)
// =============================
const searchCustomers = async (req, res) => {
    try {
        const { query, type = 'customer', limit = 20 } = req.query;
        
        // Build search filter
        const filter = { 
            // partyType: { $in: ['customer', 'both'] } 
        };
        
        // Add regex search if query is provided
        if (query && query.trim() !== '') {
            const searchRegex = new RegExp(query.trim(), 'i');
            
            filter.$or = [
                { companyName: { $regex: searchRegex } },
                { displayName: { $regex: searchRegex } },
                { email: { $regex: searchRegex } },
                { phone: { $regex: searchRegex } },
                { 'billingAddress.city': { $regex: searchRegex } },
                { 'billingAddress.state': { $regex: searchRegex } }
            ];
        }
        
        // Execute search
        const customers = await Party.find(filter)
            .limit(parseInt(limit))
            .sort({ companyName: 1 });

            console.log(customers,'customers');
            
        
        res.json({
            success: true,
            statusCode: 200,
            count: customers.length,
            data: customers
        });
        
    } catch (error) {
        console.error('Search Customers Error:', error);
        
        res.json({
            success: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

// =============================
// CREATE CUSTOMER
// =============================
const createCustomer = async (req, res) => {
    try {
   
        const customerData = {
            ...req.body,
        };

        const customer = await Party.create(customerData);

        res.json({
            success: true,
            statusCode: 201,
            message: 'Customer created successfully',
            data: customer
        });

    } catch (error) {
        console.error('Create Customer Error:', error);

        if (error.code === 11000) {
            return res.json({
                success: false,
                statusCode: 400,
                message: 'Company name already exists'
            });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.json({
                success: false,
                statusCode: 400,
                message: 'Validation Error',
                errors: messages
            });
        }

        res.json({
            success: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};


// =============================
// GET ALL CUSTOMERS WITH PAGINATION
// =============================
const getAllCustomers1 = async (req, res) => {
    try {
      

        const customers = await Party.find({})
          
        const total = await Party.countDocuments();

        res.json({
            success: true,
            statusCode: 200,
            count: customers.length,
            total,
            data: customers
        });

    } catch (error) {
        console.error('Get All Customers Error:', error);

        res.json({
            success: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

// =============================
// GET ALL Customers with Pagination & Filters
// =============================
const getAllCustomers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Get filter parameters from query
        const { search, status, customerType } = req.query;
        
        // Build filter object
        let filter = {};
        
        // Search filter (name, email, phone, company)
        if (search) {
            filter.$or = [
                { displayName: { $regex: search, $options: 'i' } },
                { companyName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { alternatePhone: { $regex: search, $options: 'i' } },
                { gstNumber: { $regex: search, $options: 'i' } },
                { panNumber: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Status filter
        if (status && status !== 'all') {
            filter.status = status;
        }
        
        // Customer type filter
        if (customerType && customerType !== 'all') {
            filter.customerType = customerType;
        }
        
        // Get customers with pagination
        const customers = await Party.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Latest first
        
        // Get total count for pagination
        const total = await Party.countDocuments(filter);

        res.json({
            success: true,
            statusCode: 200,
            count: customers.length,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
            data: customers
        });

    } catch (error) {
        console.error('Get All Customers Error:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};




// =============================
// GET CUSTOMER BY ID
// =============================
const getCustomerById = async (req, res) => {
    try {
        const customer = await Party.findOne({
            _id: req.params.id,
            partyType: { $in: ['customer', 'both'] }
        }).populate('createdBy', 'name email');

        if (!customer) {
            return res.json({
                success: false,
                statusCode: 404,
                message: 'Customer not found'
            });
        }

        res.json({
            success: true,
            statusCode: 200,
            data: customer
        });

    } catch (error) {
        console.error('Get Customer By ID Error:', error);

        if (error.kind === 'ObjectId') {
            return res.json({
                success: false,
                statusCode: 400,
                message: 'Invalid customer ID'
            });
        }

        res.json({
            success: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};


// =============================
// UPDATE CUSTOMER
// =============================
const updateCustomer = async (req, res) => {
    try {
        let customer = await Party.findOne({
            _id: req.params.id,
            partyType: { $in: ['customer', 'both'] }
        });

        if (!customer) {
            return res.json({
                success: false,
                statusCode: 404,
                message: 'Customer not found'
            });
        }

        customer = await Party.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            statusCode: 200,
            message: 'Customer updated successfully',
            data: customer
        });

    } catch (error) {
        console.error('Update Customer Error:', error);

        if (error.code === 11000) {
            return res.json({
                success: false,
                statusCode: 400,
                message: 'Company name already exists'
            });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.json({
                success: false,
                statusCode: 400,
                message: 'Validation Error',
                errors: messages
            });
        }

        res.json({
            success: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};


// =============================
// DELETE CUSTOMER
// =============================
const deleteCustomer = async (req, res) => {
    try {
        const customer = await Party.findOne({
            _id: req.params.id,
            partyType: { $in: ['customer', 'both'] }
        });

        if (!customer) {
            return res.json({
                success: false,
                statusCode: 404,
                message: 'Customer not found'
            });
        }

        await customer.deleteOne();

        res.json({
            success: true,
            statusCode: 200,
            message: 'Customer deleted successfully'
        });

    } catch (error) {
        console.error('Delete Customer Error:', error);

        if (error.kind === 'ObjectId') {
            return res.json({
                success: false,
                statusCode: 400,
                message: 'Invalid customer ID'
            });
        }

        res.json({
            success: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};


module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    searchCustomers
};
