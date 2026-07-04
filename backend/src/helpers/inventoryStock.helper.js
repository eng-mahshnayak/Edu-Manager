// helpers/inventoryStock.helper.js
const InventoryStock = require('../models/inventoryStock.model.js');

/**
 * Find or create inventory stock item
 * @param {Object} item - Purchase invoice item
 * @param {string} productId - Optional product ID
 * @returns {Promise<Object>} - Inventory stock document
 */
const findOrCreateInventoryStock = async (item, productId = null) => {
    try {
        let stockItem = null;
        let query = {};

        // Agar productId di gayi hai to pehle usse search karein
        if (productId && productId !== `temp-${item.index}`) {
            query = { productId };
            stockItem = await InventoryStock.findOne(query);
        }

        // Agar productId se nahi mila to productName + productUnit se search karein
        if (!stockItem) {
            query = {
                productName: item.productName,
                productUnit: item.unit
            };
            stockItem = await InventoryStock.findOne(query);
        }

        // Agar stock item nahi mila to naya create karein
        if (!stockItem) {
            stockItem = new InventoryStock({
                productName: item.productName,
                productUnit: item.unit,
                stockIn: 0,
                stockOut: 0,
                currentStock: 0
            });
        }

        return stockItem;
    } catch (error) {
        console.error("Error in findOrCreateInventoryStock:", error);
        throw error;
    }
};

/**
 * Update inventory stock for purchase invoice
 * @param {Array} items - Purchase invoice items
 * @returns {Promise<Array>} - Updated inventory items
 */
const updateInventoryStockForPurchase = async (items) => {
    try {
        const updatedItems = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const quantity = Number(item.quantity) || 0;
            
            if (quantity <= 0) continue;

            // Find or create inventory stock
            const stockItem = await findOrCreateInventoryStock(item, item.productId);
            
            // Update stock
            stockItem.stockIn += quantity;
            stockItem.currentStock += quantity;
            
            // Save to database
            await stockItem.save();
            
            updatedItems.push({
                ...stockItem.toObject(),
                updatedQuantity: quantity
            });
        }

        return updatedItems;
    } catch (error) {
        console.error("Error in updateInventoryStockForPurchase:", error);
        throw error;
    }
};

module.exports = {
    findOrCreateInventoryStock,
    updateInventoryStockForPurchase
};