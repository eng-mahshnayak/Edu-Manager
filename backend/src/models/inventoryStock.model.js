const mongoose = require("mongoose");

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

const inventoryStockSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required"],
      set: toTitleCase,
      trim: true,
    },

    productUnit: {
      type: String,
      index: true,
      set: toTitleCase,
      trim: true,
    },
    stockIn: {
      type: Number,
      default: 0,
      min: 0,
    },

    stockOut: {
      type: Number,
      default: 0,
      min: 0,
    },

    currentStock: {
      type: Number,
      default: 0,
      min: 0,
    },

     buyAveragePrice: {
      type: Number,
      default: 0,
      min: 0,
    },
     sellAveragePrice: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// Compound index for faster search
inventoryStockSchema.index({ productName: 1, productUnit: 1 });

const InventoryStockModel = mongoose.model(
  "InventoryStock",
  inventoryStockSchema
);

module.exports = InventoryStockModel;