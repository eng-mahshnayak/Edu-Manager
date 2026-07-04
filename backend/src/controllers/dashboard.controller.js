// controllers/dashboard.controller.js

const SellInvoice = require('../models/sellInvoice.model');
const PurchaseInvoice = require('../models/purchaseInvoice.model');
const Customer = require('../models/parties.mode');
const User = require('../models/user.model');
const NoteSummery = require('../models/dailyCash.model');
const InventoryStock = require('../models/inventoryStock.model');



// =============================
// GET ALL SELL INVOICES
// =============================
const getAllInventoryStock = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 1000;
        const skip = (page - 1) * limit;

        const invoices = await InventoryStock.find({})
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });


             // =============================
        // CALCULATE SUMMARY
        // =============================

        let totalPurchaseValue = 0;
        let totalSellValue = 0;
        let totalStockValue = 0;

        invoices.forEach(item => {

            const stock = Number(item.currentStock) || 0;
            const buyPrice = Number(item.buyAveragePrice) || 0;
            const sellPrice = Number(item.sellAveragePrice) || 0;
            
            totalPurchaseValue = buyPrice*item.stockIn
            totalSellValue =    sellPrice*item.stockOut
            totalStockValue = sellPrice*stock

        });


        res.json({
            success: true,
            statusCode: 200,
            summery:{
              totalItems:invoices.length,
              potentialProfit:totalPurchaseValue,
              totalSellingValue:totalSellValue,
              totalStockValue:totalStockValue
            },
            data: invoices
        });

    } catch (error) {
        

        res.json({
            success: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};



// =============================
// DASHBOARD STATS CONTROLLER
// =============================
const getDashboardStats = async (req, res) => {
    try {
       

        // 1. TOTAL SELL INVOICES
        const totalSellInvoices = await SellInvoice.countDocuments();
        
      
        // 2. TOTAL PURCHASE INVOICES
        const totalPurchaseInvoices = await PurchaseInvoice.countDocuments();
        

        // 3. TOTAL ACTIVE CUSTOMERS
        const totalCustomers = await Customer.countDocuments({ status: 'active' });
        

        // 4. TOTAL SYSTEM USERS
        const totalUsers = await User.countDocuments({  });


        // 5. TOTAL NOTE SUMMARY
        const totalNoteSummer = await NoteSummery.countDocuments({});

        // 6. RECENT SELLS
        const recentSells = await SellInvoice.find()
            .sort({ createdAt: -1 })
            .limit(5)
          

        // 7. TOP 5 STOCKS (सिर्फ schema के fields के साथ)
        const topStocks = await InventoryStock.find()
            .sort({ currentStock: -1 })
            .limit(5)
           

        // 8. FORMAT TOP STOCKS (सिर्फ schema के fields)
        const topStocksFormatted = topStocks.map(stock => ({
            productName: stock.productName,
            productUnit: stock.productUnit,
            currentStock: stock.currentStock,
            stockIn: stock.stockIn,
            stockOut: stock.stockOut
        }));

        // 9. STOCK SUMMARY (कुल स्टॉक का sum)
        const stockSummary = await InventoryStock.aggregate([
            {
                $group: {
                    _id: null,
                    totalStockIn: { $sum: '$stockIn' },
                    totalStockOut: { $sum: '$stockOut' },
                    totalCurrentStock: { $sum: '$currentStock' },
                    totalProducts: { $sum: 1 }
                }
            }
        ]);

        // 10. CHART DATA के लिए - productName के according group करें
        const stockForChart = await InventoryStock.find()
            .sort({ currentStock: -1 })
            .limit(5)
            .select('productName currentStock');

        // Chart data prepare करें
        const chartData = {
            labels: stockForChart.map(item => item.productName),
            datasets: [{
                label: 'Current Stock',
                data: stockForChart.map(item => item.currentStock),
                backgroundColor: [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6'
                ]
            }]
        };

        // Prepare response data - सिर्फ schema के fields
        const dashboardData = {
            statistics: {
                totalSellInvoices: totalSellInvoices,
                totalPurchaseInvoices: totalPurchaseInvoices,
                totalCustomers: totalCustomers,
                totalUsers: totalUsers,
                totalNote: totalNoteSummer,
                totalProducts: stockSummary[0]?.totalProducts || 0,
                totalCurrentStock: stockSummary[0]?.totalCurrentStock || 0,
                totalStockIn: stockSummary[0]?.totalStockIn || 0,
                totalStockOut: stockSummary[0]?.totalStockOut || 0
            },
            
            recentSells: recentSells,
            
            chartData: chartData,
            
            topStocks: topStocksFormatted
        };

        res.json({
            success: true,
            statusCode: 200,
            message: 'Dashboard stats fetched successfully',
            data: dashboardData
        });

    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        
        res.json({
            success: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    getDashboardStats,
    getAllInventoryStock
};