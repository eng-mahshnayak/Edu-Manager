// models/dailyCash.model.js

const mongoose = require('mongoose');

// Daily Cash Schema - COMPLETE SINGLE SCHEMA
const dailyCashSchema = new mongoose.Schema({
    // Date of cash entry
    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now,
    },
    
    // OPENING CASH - Exact match with frontend CashForm interface
    openingCash: {
        note500: {
            type: Number,
            default: 0,
            min: [0, 'Note count cannot be negative']
        },
        note200: {
            type: Number,
            default: 0,
            min: [0, 'Note count cannot be negative']
        },
        note100: {
            type: Number,
            default: 0,
            min: [0, 'Note count cannot be negative']
        },
        note50: {
            type: Number,
            default: 0,
            min: [0, 'Note count cannot be negative']
        },
        note20: {
            type: Number,
            default: 0,
            min: [0, 'Note count cannot be negative']
        },
        note10: {
            type: Number,
            default: 0,
            min: [0, 'Note count cannot be negative']
        },
        coins: {
            type: Number,
            default: 0,
            min: [0, 'Coins count cannot be negative']
        },
        online: {
            type: Number,
            default: 0,
            min: [0, 'Online amount cannot be negative']
        }
    },
    totalSales: {
        type: Number,
        default: 0,
        min: [0, 'Total sales cannot be negative']
    },

}, {
    timestamps: true
});


const DailyCash = mongoose.model('DailyCash', dailyCashSchema);

module.exports = DailyCash;