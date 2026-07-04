const DailyCash = require('../models/dailyCash.model.js');


// =============================
// CREATE DAILY CASH ENTRY
// =============================
const createDailyCash = async (req, res) => {
    try {

        const data = req.body;

        const entry = await DailyCash.create({
            date:data.date,
            openingCash:data.formData,
            totalSales:data.total,
        });

        console.log(entry,'entryentryentryentry');

        res.json({
            success: true,
            statusCode: 201,
            message: 'Daily cash entry created successfully',
            data: entry
        });

    } catch (error) {
        console.error('Create Daily Cash Error:', error);

        // Duplicate date error
        if (error.code === 11000) {
            return res.json({
                success: false,
                statusCode: 400,
                message: 'Daily cash entry for this date already exists'
            });
        }

        // Validation errors
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
// GET ALL DAILY CASH ENTRIES
// =============================
const getAllDailyCash = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        console.log(req.query,'req.query');

        const filter = {};

        // Filter by date if provided
        if (req.query.date) {
            const selectedDate = new Date(req.query.date);
            const nextDate = new Date(selectedDate);
            nextDate.setDate(nextDate.getDate() + 1);

            filter.date = {
                $gte: selectedDate,
                $lt: nextDate
            };
        }

        const entries = await DailyCash.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ date: -1 });

        const total = await DailyCash.countDocuments({});

        res.json({
            success: true,
            statusCode: 200,
            count: total,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: entries
        });

    } catch (error) {
        console.error('Get All Daily Cash Error:', error);

        res.json({
            success: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};



// =============================
// GET DAILY CASH BY ID
// =============================
const getDailyCashById = async (req, res) => {
    try {
        const entry = await DailyCash.findById(req.params.id);

        if (!entry) {
            return res.json({
                success: false,
                statusCode: 404,
                message: 'Daily cash entry not found'
            });
        }

        res.json({
            success: true,
            statusCode: 200,
            data: entry
        });

    } catch (error) {
        console.error('Get Daily Cash By ID Error:', error);

        if (error.kind === 'ObjectId') {
            return res.json({
                success: false,
                statusCode: 400,
                message: 'Invalid ID'
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
// UPDATE DAILY CASH ENTRY
// =============================
const updateDailyCash = async (req, res) => {
    try {
        let entry = await DailyCash.findById(req.params.id);

        if (!entry) {
            return res.json({
                success: false,
                statusCode: 404,
                message: 'Daily cash entry not found'
            });
        }

        entry = await DailyCash.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            statusCode: 200,
            message: 'Daily cash entry updated successfully',
            data: entry
        });

    } catch (error) {
        console.error('Update Daily Cash Error:', error);

        if (error.code === 11000) {
            return res.json({
                success: false,
                statusCode: 400,
                message: 'Duplicate date entry not allowed'
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
// DELETE DAILY CASH ENTRY
// =============================
const deleteDailyCash = async (req, res) => {
    try {
        const entry = await DailyCash.findById(req.params.id);

        if (!entry) {
            return res.json({
                success: false,
                statusCode: 404,
                message: 'Daily cash entry not found'
            });
        }

        await entry.deleteOne();

        res.json({
            success: true,
            statusCode: 200,
            message: 'Daily cash entry deleted successfully'
        });

    } catch (error) {
        console.error('Delete Daily Cash Error:', error);

        if (error.kind === 'ObjectId') {
            return res.json({
                success: false,
                statusCode: 400,
                message: 'Invalid ID'
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
    createDailyCash,
    getAllDailyCash,
    getDailyCashById,
    updateDailyCash,
    deleteDailyCash
};
