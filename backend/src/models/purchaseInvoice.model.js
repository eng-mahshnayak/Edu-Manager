const mongoose = require('mongoose');


function toTitleCase(str) {
  if (!str) return str;
  return str
    .toLowerCase()
    .trim()
    .split(" ")
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const sellInvoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: [true, 'Invoice number is required'],
        unique: true,
        trim: true
    },
    invoiceDate: {
        type: Date,
        required: [true, 'Invoice date is required'],
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required']
    },
    // Supplier Information (using Party model with partyType supplier/both)
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Party',
        required: [true, 'Supplier ID is required']
    },
    supplierName: {
        type: String,
         set: toTitleCase,
        required: [true, 'Supplier name is required'],
        trim: true
    },
    supplierEmail: String,
    supplierPhone: String,
    supplierGST: String,
    supplierAddress: String,
    
    // Products Array
    productDetails: [{
        productName: {
            type: String,
             set: toTitleCase,
            required: [true, 'Product name is required'],
            trim: true
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Quantity must be at least 1'],
            validate: {
                validator: Number.isInteger,
                message: 'Quantity must be an integer'
            }
        },
        unit: {
            type: String,
             set: toTitleCase,
            default: 'Nos'
        },
        pricePerUnit: {
            type: Number,
            required: [true, 'Price per unit is required'],
            min: [0, 'Price cannot be negative']
        },
        discount: {
            type: Number,
            default: 0,
            min: [0, 'Discount cannot be negative'],
            max: [100, 'Discount cannot exceed 100%']
        },
        cgst: {
            type: Number,
            default: 0
        },
        sgst: {
            type: Number,
            default: 0
        },
        igst: {
            type: Number,
            default: 0
        },
        taxAmount: {
            type: Number,
            default: 0,
            min: [0, 'Tax amount cannot be negative']
        },
        subtotal: {
            type: Number,
            required: true,
            min: [0, 'Subtotal cannot be negative']
        },
        total: {
            type: Number,
            required: true,
            min: [0, 'Total cannot be negative']
        }
    }],
    
    // Invoice Summary
    subtotal: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'Subtotal cannot be negative']
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'fixed'
    },
    discountValue: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative']
    },
    discountAmount: {
        type: Number,
        default: 0,
        min: [0, 'Discount amount cannot be negative']
    },
    taxType: {
        type: String,
        enum: ['gst', 'vat', 'none'],
        default: 'gst'
    },
    totalTax: {
        type: Number,
        default: 0,
        min: [0, 'Total tax cannot be negative']
    },
    shippingCharges: {
        type: Number,
        default: 0,
        min: [0, 'Shipping charges cannot be negative']
    },
    roundOff: {
        type: Number,
        default: 0
    },
    grandTotal: {
        type: Number,
        required: true,
        min: [0, 'Grand total cannot be negative']
    },
    
    // Payment Information
    paymentStatus: {
        type: String,
        // enum: ['pending', 'partial', 'paid', 'overdue'],
        default: 'pending'
    },
    paidAmount: {
        type: Number,
        default: 0,
        min: [0, 'Paid amount cannot be negative']
    },
    paymentMethod: {
        type: String,
        // enum: ['cash', 'bank_transfer', 'cheque', 'credit_card', 'upi'],
        default: 'bank_transfer'
    },
    
    // Invoice Status
    status: {
        type: String,
        // enum: ['draft', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'],
        default: 'draft'
    },
    
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    termsAndConditions: [{
        type: String,
        default: ['1. Goods once sold will not be taken back', '2. Payment due within 30 days', '3. Interest @ 2% per month on overdue payments']
    }],
    
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});


const PurchaseInvoice = mongoose.model('PurchaseInvoice', sellInvoiceSchema);

module.exports = PurchaseInvoice;