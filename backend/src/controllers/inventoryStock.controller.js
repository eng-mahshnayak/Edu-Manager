const InventoryStock = require('../models/inventoryStock.model.js')




// =============================
// SEARCH CUSTOMERS (For dropdown/autocomplete)
// =============================
const searchInventoryStocks = async (req, res) => {
    try {
        const { query,  limit = 20 } = req.query;

       console.log(query,'query');
       
        
        
        // Build search filter
        const filter = { 
            // partyType: { $in: ['customer', 'both'] } 
        };
        
        // Add regex search if query is provided
        if (query && query.trim() !== '') {
            const searchRegex = new RegExp(query.trim(), 'i');
            
            filter.$or = [
                { productName: { $regex: searchRegex } },
               
            ];
        }
        
        // Execute search
        const inventorystocks = await InventoryStock.find(filter)
            .limit(parseInt(limit))
            .sort({ productName: 1 });

          
             console.log(inventorystocks,'inventorystocks');
        
        res.json({
            success: true,
            statusCode: 200,
            count: inventorystocks.length,
            data: inventorystocks
        });
        
    } catch (error) {
        console.error('Search inventorystocks Error:', error);
        
        res.json({
            success: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

module.exports = {
   searchInventoryStocks
};