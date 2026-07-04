const Role = require("../models/permission.model"); // Adjust path as needed

// 🔹 CREATE Role
const createRole = async (req, res) => {
    try {
        const { name, description, permissions, isActive, createdBy } = req.body;

        // 🔴 DEBUG: Check karein ki request body mein kya aa raha hai
        console.log("Request Body:", JSON.stringify(req.body, null, 2));

        // Check if role with same name already exists
        const existingRole = await Role.findOne({ name });

        if (existingRole) {
            return res.json({
                success: false,
                statusCode: 400,
                message: "Role with this name already exists"
            });
        }

        // 🔴 DEBUG: Permissions ko properly log karein
        console.log("Permissions received:", JSON.stringify(permissions, null, 2));

        const newRole = new Role({
            name,
            description,
            permissions: permissions || {},  // permissions object bhej rahe hain
            isActive: isActive !== undefined ? isActive : true,
            createdBy
        });

        await newRole.save();

        // Convert to object to properly show permissions
        const roleObject = newRole.toObject();
        
        // 🔴 DEBUG: Saved role ko check karein
        console.log("Saved Role:", JSON.stringify(roleObject, null, 2));

      
        res.json({
            success: true,
            statusCode: 201,
            message: "Role created successfully",
            data: roleObject  // 👈 roleObject bhejein, newRole nahi
        });

    } catch (error) {
        console.error('Create Role Error:', error);
        res.json({
            success: false,
            statusCode: 500,
            message: error.message || "Internal server error"
        });
    }
};

// 🔹 GET ALL Roles with Pagination
// 🔹 GET ALL ROLES (Pagination)
const getAllRoles =  async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const total = await Role.countDocuments();
    const roles = await Role.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Roles fetched successfully",
      data: {
        roles,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllRoles1 = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const isActive = req.query.isActive;
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

        const skip = (page - 1) * limit;

        // Build filter
        let filter = {};
        
        // Search by name or description
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        // Filter by active status
        if (isActive !== undefined) {
            filter.isActive = isActive === "true";
        }

        // Get total count
        const total = await Role.countDocuments(filter);

        // Get paginated roles
        const roles = await Role.find(filter)
            .populate("createdBy", "name email") // Populate createdBy user details
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit);

        res.json({
            success: true,
            statusCode: 200,
            message: "Roles fetched successfully",
            data: {
                roles,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: limit,
                    hasNextPage: page < Math.ceil(total / limit),
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get All Roles Error:', error);
        res.json({
            success: false,
            statusCode: 500,
            message: error.message || "Internal server error"
        });
    }
};

// 🔹 GET Role by ID
const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;

        // const role = await Role.findById(id).populate("createdBy", "name email");
        const role = await Role.findById(id)

        if (!role) {
            return res.json({
                success: false,
                statusCode: 404,
                message: "Role not found"
            });
        }

        res.json({
            success: true,
            statusCode: 200,
            message: "Role fetched successfully",
            data: role
        });

    } catch (error) {
        console.error('Get Role By ID Error:', error);
        
        // Handle invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.json({
                success: false,
                statusCode: 400,
                message: "Invalid role ID format"
            });
        }

        res.json({
            success: false,
            statusCode: 500,
            message: error.message || "Internal server error"
        });
    }
};

// 🔹 UPDATE Role
const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Check if role exists
        const existingRole = await Role.findById(id);
        if (!existingRole) {
            return res.json({
                success: false,
                statusCode: 404,
                message: "Role not found"
            });
        }

        // If updating name, check for uniqueness
        if (updates.name && updates.name !== existingRole.name) {
            const nameExists = await Role.findOne({ 
                name: updates.name, 
                _id: { $ne: id } 
            });
            
            if (nameExists) {
                return res.json({
                    success: false,
                    statusCode: 400,
                    message: "Role with this name already exists"
                });
            }
        }

        // Update role
        const updatedRole = await Role.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).populate("createdBy", "name email");

        res.json({
            success: true,
            statusCode: 200,
            message: "Role updated successfully",
            data: updatedRole
        });

    } catch (error) {
        console.error('Update Role Error:', error);
        
        if (error.kind === 'ObjectId') {
            return res.json({
                success: false,
                statusCode: 400,
                message: "Invalid role ID format"
            });
        }

        res.json({
            success: false,
            statusCode: 500,
            message: error.message || "Internal server error"
        });
    }
};

// 🔹 DELETE Role (Single)
const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if role exists
        const role = await Role.findById(id);
        if (!role) {
            return res.json({
                success: false,
                statusCode: 404,
                message: "Role not found"
            });
        }

        // Optional: Prevent deletion of default/protected roles
        if (role.name === "admin" || role.name === "super-admin") {
            return res.status(403).json({
                success: false,
                statusCode: 403,
                message: "Cannot delete protected role"
            });
        }

        await Role.findByIdAndDelete(id);

        res.json({
            success: true,
            statusCode: 200,
            message: "Role deleted successfully"
        });

    } catch (error) {
        console.error('Delete Role Error:', error);
        
        if (error.kind === 'ObjectId') {
            return res.json({
                success: false,
                statusCode: 400,
                message: "Invalid role ID format"
            });
        }

        res.json({
            success: false,
            statusCode: 500,
            message: error.message || "Internal server error"
        });
    }
};

// 🔹 DELETE Multiple Roles (Bulk Delete)
const deleteMultipleRoles = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.json({
                success: false,
                statusCode: 400,
                message: "Please provide an array of role IDs to delete"
            });
        }

        // Optional: Prevent deletion of protected roles
        const protectedRoles = await Role.find({
            _id: { $in: ids },
            name: { $in: ["admin", "super-admin"] }
        });

        if (protectedRoles.length > 0) {
            return res.status(403).json({
                success: false,
                statusCode: 403,
                message: "Cannot delete protected roles (admin/super-admin)"
            });
        }

        // Delete multiple roles
        const result = await Role.deleteMany({ _id: { $in: ids } });

        res.json({
            success: true,
            statusCode: 200,
            message: `${result.deletedCount} role(s) deleted successfully`,
            data: {
                deletedCount: result.deletedCount
            }
        });

    } catch (error) {
        console.error('Delete Multiple Roles Error:', error);
        res.json({
            success: false,
            statusCode: 500,
            message: error.message || "Internal server error"
        });
    }
};

// 🔹 UPDATE Role Status (Activate/Deactivate)
const updateRoleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== 'boolean') {
            return res.json({
                success: false,
                statusCode: 400,
                message: "isActive must be a boolean value"
            });
        }

        // Check if role exists
        const role = await Role.findById(id);
        if (!role) {
            return res.json({
                success: false,
                statusCode: 404,
                message: "Role not found"
            });
        }

        // Update status
        const updatedRole = await Role.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        ).populate("createdBy", "name email");

        res.json({
            success: true,
            statusCode: 200,
            message: `Role ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: updatedRole
        });

    } catch (error) {
        console.error('Update Role Status Error:', error);
        
        if (error.kind === 'ObjectId') {
            return res.json({
                success: false,
                statusCode: 400,
                message: "Invalid role ID format"
            });
        }

        res.json({
            success: false,
            statusCode: 500,
            message: error.message || "Internal server error"
        });
    }
};

// 🔹 GET Role Permissions
const getRolePermissions = async (req, res) => {
    try {
        const { id } = req.params;

        const role = await Role.findById(id).select("name permissions");

        if (!role) {
            return res.json({
                success: false,
                statusCode: 404,
                message: "Role not found"
            });
        }

        res.json({
            success: true,
            statusCode: 200,
            message: "Role permissions fetched successfully",
            data: {
                roleId: role._id,
                roleName: role.name,
                permissions: role.permissions
            }
        });

    } catch (error) {
        console.error('Get Role Permissions Error:', error);
        
        if (error.kind === 'ObjectId') {
            return res.json({
                success: false,
                statusCode: 400,
                message: "Invalid role ID format"
            });
        }

        res.json({
            success: false,
            statusCode: 500,
            message: error.message || "Internal server error"
        });
    }
};

// 🔹 UPDATE Role Permissions
const updateRolePermissions = async (req, res) => {
    try {
        const { id } = req.params;
        const { permissions } = req.body;

        if (!permissions || typeof permissions !== 'object') {
            return res.json({
                success: false,
                statusCode: 400,
                message: "Valid permissions object is required"
            });
        }

        // Check if role exists
        const role = await Role.findById(id);
        if (!role) {
            return res.json({
                success: false,
                statusCode: 404,
                message: "Role not found"
            });
        }

        // Update permissions
        const updatedRole = await Role.findByIdAndUpdate(
            id,
            { permissions },
            { new: true, runValidators: true }
        ).select("name permissions");

        res.json({
            success: true,
            statusCode: 200,
            message: "Role permissions updated successfully",
            data: updatedRole
        });

    } catch (error) {
        console.error('Update Role Permissions Error:', error);
        
        if (error.kind === 'ObjectId') {
            return res.json({
                success: false,
                statusCode: 400,
                message: "Invalid role ID format"
            });
        }

        res.json({
            success: false,
            statusCode: 500,
            message: error.message || "Internal server error"
        });
    }
};

module.exports = {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole,
    deleteMultipleRoles,
    updateRoleStatus,
    getRolePermissions,
    updateRolePermissions
};