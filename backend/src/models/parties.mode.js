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

// Customer Schema (Parties) - COMPLETE SINGLE SCHEMA
const partySchema = new mongoose.Schema({
    // Basic Information
    partyType: {
        type: String,
        // enum: ['customer', 'supplier', 'both'],
        required: [true, 'Party type is required'],
        default: 'customer',
        set: toTitleCase,
    },
    
    customerType: {
        type: String,
        set: toTitleCase,
        // enum: ['regular', 'wholesale', 'retail', 'vip'],
        default: 'regular'
    },
    
    // Company/Business Information
    companyName: {
        type: String,
        set: toTitleCase,
        required: [true, 'Company/Business name is required'],
        trim: true,
        unique: true
    },
    companyGST: {
        type: String,
        uppercase:true,
        required: [true, 'companyGST name is required'],
        trim: true,
        unique: true
    },
    
    displayName: {
        type: String,
        set: toTitleCase,
        trim: true
    },
    
    // Contact Information
    email: {
        type: String,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address'
        ]
    },
    
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        validate: {
            validator: function(v) {
                return /\d{10}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    alternatePhone: String,
    // Address Information
    billingAddress: {
        attention: String,
        addressLine1: {
            type: String,
            required: [true, 'Billing address line 1 is required']
        },
        addressLine2: {
            type: String,
            set: toTitleCase,
        },
        city: {
            type: String,
             set: toTitleCase,
            required: [true, 'City is required']
        },
        state: {
            type: String,
            set: toTitleCase,
            required: [true, 'State is required']
        },
        stateCode: {
            type: Number,
            default:23,
            required: [true, 'StateCode is required']
        },
        country: {
            type: String,
             set: toTitleCase,
            default: 'India'
        },
        zipCode: {
            type: String,
            required: [true, 'Zip code is required']
        },
        landmark: {
            type:String,
            set: toTitleCase,
        }
    },
    
    shippingAddress: {
        sameAsBilling: {
            type: Boolean,
            default: true
        },
        attention: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        country: String,
        zipCode: String,
        landmark: String
    },
    // Bank Details (Array of Objects)
    bankDetails: {
        accountHolderName: {
            type: String,
             set: toTitleCase,
            required: [true, 'Account holder name is required'],
            trim: true
        },
        bankName: {
            type: String,
             set: toTitleCase,
            trim: true
        },
        accountNumber: {
            type: String,
            trim: true
        },
        confirmAccountNumber: {
            type: String,
            validate: {
                validator: function(v) {
                    return v === this.accountNumber;
                },
                message: 'Account numbers do not match'
            }
        },
        ifscCode: {
            type: String,
            uppercase: true,
            match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please provide a valid IFSC code']
        },
        branchName: {
            type:String,
             set: toTitleCase,
        },
        accountType: {
            type: String,
            //  set: toTitleCase,
            // enum: ['savings', 'current', 'credit'],
            default: 'current'
        },
        upiId: String,
        isPrimary: {
            type: Boolean,
            default: false
        }
    },
    // Status and Classification
    status: {
        type: String,
        // enum: ['active', 'inactive', 'blocked', 'pending'],
        default: 'active'
    },
    // Notes and Tags
    notes: {
        type: String,
         set: toTitleCase,
        maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },
}, {
    timestamps: true
});

const Party = mongoose.model('Party', partySchema);

module.exports = Party;