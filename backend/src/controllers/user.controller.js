const User = require('../models/user.model.js');


// =============================
// GET ALL User
// =============================


const getAllUsers1 = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const skip = (page - 1) * limit;

       
       
        const invoices = await User.find()  
             .skip(skip)
            .limit(limit)
          
        const total = await User.countDocuments({});

        res.json({
            success: true,
            statusCode: 200,
            count: invoices.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: invoices
        });

    } catch (error) {
        console.error('Get All Users Error:', error);

        res.json({
            success: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

// =============================
// GET ALL Users with Pagination & Filters
// =============================
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 25;
        const skip = (page - 1) * limit;


        
        
        
        // Get filter parameters from query
        const { search, role, status } = req.query;
        
        // Build filter object
        let filter = {};
        
        // Search filter (name, email, phone)
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phoneNumber: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Role filter
        if (role && role !== 'all') {
            filter.role = role;
        }
        
        // Status filter
        if (status && status !== 'all') {
            filter.isActive = status === 'active';
        }
        
        // Get users with pagination
        const users = await User.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Latest first
        
        // Get total count for pagination
        const total = await User.countDocuments(filter);

        res.json({
            success: true,
            statusCode: 200,
            count: users.length,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
            data: users
        });

    } catch (error) {
        console.error('Get All Users Error:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};


// =============================
// GET SINGLE User
// =============================
const getUserById = async (req, res) => {
    try {
        const invoice = await User.findById(req.params.id)
         

        if (!invoice) {
            return res.json({
                success: false,
                statusCode: 404,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            statusCode: 200,
            data: invoice
        });

    } catch (error) {
        console.error('Get User By ID Error:', error);

        if (error.kind === 'ObjectId') {
            return res.json({
                success: false,
                statusCode: 400,
                message: 'Invalid User ID'
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
// UPDATE User
// =============================
const updateUser = async (req, res) => {
    try {

        console.log(req.body);
        
        let invoice = await User.findById(req.params.id);

        if (!invoice) {
            return res.json({
                success: false,
                statusCode: 404,
                message: 'User not found'
            });
        }

        invoice = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            statusCode: 200,
            message: 'User updated successfully',
            data: invoice
        });

    } catch (error) {
        console.error('User Invoice Error:', error);

        if (error.code === 11000) {
            return res.json({
                success: false,
                statusCode: 400,
                message: 'User already exists'
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
// DELETE User
// =============================
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.json({
        success: false,
        statusCode: 404,
        message: "User not found"
      });
    }

    // 🔒 Prevent Admin Deletion
    if (user.role === "admin") {
      return res.json({
        success: false,
        statusCode: 403,
        message: "Admin user cannot be deleted. Please contact the super admin."
      });
    }

    await user.deleteOne();

    return res.json({
      success: true,
      statusCode: 200,
      message: "User deleted successfully"
    });

  } catch (error) {
    console.error("Delete User Error:", error);

    if (error.kind === "ObjectId") {
      return res.json({
        success: false,
        statusCode: 400,
        message: "Invalid User ID"
      });
    }

    return res.json({
      success: false,
      statusCode: 500,
      message: "Internal server error"
    });
  }
};


// =============================
// DELETE User
// =============================
const deleteAllUsers = async (req, res) => {
    try {
        const invoice = await User.deleteMany({
             role: { $ne: "admin" }
        });

        if (!invoice) {
            return res.json({
                success: false,
                statusCode: 404,
                message: 'Users not Deleted'
            });
        }

        
        res.json({
            success: true,
            statusCode: 200,
            message: 'Users deleted successfully'
        });

    } catch (error) {
        
        res.json({
            success: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};


module.exports = {
  getAllUsers,
  deleteUser,
  deleteAllUsers,
  updateUser,
  getUserById
};
