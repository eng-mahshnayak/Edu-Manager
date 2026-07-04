// const SellInvoice = require('../models/sellInvoice.model');

// const generateInvoiceNumber = async () => {

//   // ✅ Financial year calculate (April–March, India standard)
//   const now = new Date();
//   let startYear = now.getFullYear();
//   let endYear = startYear + 1;

//   // if Jan, Feb, Mar → previous FY
//   if (now.getMonth() < 3) {
//     startYear = startYear - 1;
//     endYear = startYear + 1;
//   }

//   const fy = `${startYear}-${String(endYear).slice(2)}`; // 2025-26

//   // ✅ last invoice find karo iss financial year ka
//   const lastInvoice = await SellInvoice.findOne({
//     invoiceNumber: { $regex: `^INV-${fy}-` }
//   })
//   .sort({ invoiceNumber: -1 }) // descending order
//   .lean();

//   let lastNumber = 0;

//   if (lastInvoice?.invoiceNumber) {
//     const parts = lastInvoice.invoiceNumber.split("-");
//     lastNumber = parseInt(parts[parts.length - 1]) || 0;
//   }

//   const nextNumber = lastNumber + 1;

//   const paddedNumber = String(nextNumber).padStart(3, "0");

//   const invoiceNumber = `INV-${fy}-${paddedNumber}`;

//   return {
//     invoiceNumber,
//     lastNumber: nextNumber
//   };
// };

// // =============================
// // COPY SELL INVOICE MIDDLEWARE
// // =============================
// const copySellInvoice = async (req, res, next) => {
//   try {

//     const { invoiceNumber } = await generateInvoiceNumber();

//     // ✅ clone body
//     const newBody = { ...req.body };

//     // ❌ remove old _id
//     delete newBody._id;

//     // ❌ remove subdocument _id also
//     if (Array.isArray(newBody.productDetails)) {
//       newBody.productDetails = newBody.productDetails.map(item => {
//         const newItem = { ...item };
//         delete newItem._id;
//         return newItem;
//       });
//     }

//     // ✅ assign new invoice number
//     newBody.invoiceNumber = invoiceNumber;

//     // ✅ assign back to req.body
//     req.body = newBody;

//     console.log(req.body, "============NEW COPY BODY===========");

//     next();

//   } catch (error) {

//     console.error('Create Sell Invoice Error:', error);

//     if (error.code === 11000) {
//       return res.json({
//         success: false,
//         statusCode: 400,
//         message: 'Invoice number already exists'
//       });
//     }

//     res.json({
//       success: false,
//       statusCode: 500,
//       message: 'Internal server error'
//     });

//   }
// };


// // =============================
// // CREATE SELL INVOICE
// // =============================
// const createSellInvoice = async (req, res) => {
//     try {
//         const invoiceData = {
//         ...req.body
//         };

//         // ✅ convert termsAndConditions object → string
//         if (Array.isArray(invoiceData.termsAndConditions)) {

//         invoiceData.termsAndConditions =
//             invoiceData.termsAndConditions
//             .map(item => {

//                 // if already string
//                 if (typeof item === "string") return item;

//                 // if object
//                 if (item?.description && item.description !== "null")
//                 return item.description;

//                 return null;

//             })
//             .filter(Boolean);

//         }

//         console.log(invoiceData,'=======invoiceData after convert========');

//         const invoice = await SellInvoice.create(invoiceData);

//          console.log('=======invoiceData save========');

//         res.json({
//             success: true,
//             statusCode: 201,
//             message: 'Sell invoice created successfully',
//             data: invoice
//         });

//     } catch (error) {
//         console.error('Create Sell Invoice Error:', error);

//         if (error.code === 11000) {
//             return res.json({
//                 success: false,
//                 statusCode: 400,
//                 message: 'Invoice number already exists'
//             });
//         }

//         if (error.name === 'ValidationError') {
//             const messages = Object.values(error.errors).map(err => err.message);

//             console.log(messages,'=========messages=========');
            
//             return res.json({
//                 success: false,
//                 statusCode: 400,
//                 message:messages[1]|| messages[0],
//                 errors: messages
//             });
//         }

//         res.json({
//             success: false,
//             statusCode: 500,
//             message: 'Internal server error'
//         });
//     }
// };


// // =============================
// // GET ALL SELL INVOICES
// // =============================
// const getAllSellInvoices = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const skip = (page - 1) * limit;

//         const filter = {};

//         if (req.query.status) {
//             filter.status = req.query.status;
//         }

//         if (req.query.customer) {
//             filter.customer = req.query.customer;
//         }

//         if (req.query.search) {
//             filter.$or = [
//                 { invoiceNumber: { $regex: req.query.search, $options: 'i' } },
//                 { customerName: { $regex: req.query.search, $options: 'i' } }
//             ];
//         }

//         const invoices = await SellInvoice.find(filter)
//             .populate('createdBy', 'name email')
//             .skip(skip)
//             .limit(limit)
//             .sort({ invoiceNumber: -1 });

//         const total = await SellInvoice.countDocuments(filter);

//         res.json({
//             success: true,
//             statusCode: 200,
//             count: invoices.length,
//             total,
//             page,
//             pages: Math.ceil(total / limit),
//             data: invoices
//         });

//     } catch (error) {
//         console.error('Get All Sell Invoices Error:', error);

//         res.json({
//             success: false,
//             statusCode: 500,
//             message: 'Internal server error'
//         });
//     }
// };


// // =============================
// // GET SINGLE SELL INVOICE
// // =============================
// const getSellInvoiceById = async (req, res) => {
//     try {
        
//         const invoice = await SellInvoice.findById(req.params.id)

//         if (!invoice) {
//             return res.json({
//                 success: false,
//                 statusCode: 404,
//                 message: 'Sell invoice not found'
//             });
//         }

//         res.json({
//             success: true,
//             statusCode: 200,
//             data: invoice
//         });

//     } catch (error) {
//         console.error('Get Sell Invoice By ID Error:', error);

//         if (error.kind === 'ObjectId') {
//             return res.json({
//                 success: false,
//                 statusCode: 400,
//                 message: 'Invalid invoice ID'
//             });
//         }

//         res.json({
//             success: false,
//             statusCode: 500,
//             message: 'Internal server error'
//         });
//     }
// };


// // =============================
// // UPDATE SELL INVOICE
// // =============================
// const updateSellInvoice = async (req, res) => {
//     try {
//         let invoice = await SellInvoice.findById(req.params.id);

//         if (!invoice) {
//             return res.json({
//                 success: false,
//                 statusCode: 404,
//                 message: 'Sell invoice not found'
//             });
//         }

//         invoice = await SellInvoice.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true }
//         );

//         res.json({
//             success: true,
//             statusCode: 200,
//             message: 'Sell invoice updated successfully',
//             data: invoice
//         });

//     } catch (error) {
//         console.error('Update Sell Invoice Error:', error);

//         if (error.code === 11000) {
//             return res.json({
//                 success: false,
//                 statusCode: 400,
//                 message: 'Invoice number already exists'
//             });
//         }

//         if (error.name === 'ValidationError') {
//             const messages = Object.values(error.errors).map(err => err.message);
//             return res.json({
//                 success: false,
//                 statusCode: 400,
//                 message: 'Validation Error',
//                 errors: messages
//             });
//         }

//         res.json({
//             success: false,
//             statusCode: 500,
//             message: 'Internal server error'
//         });
//     }
// };


// // =============================
// // DELETE SELL INVOICE
// // =============================
// const deleteSellInvoice = async (req, res) => {
//     try {
//         const invoice = await SellInvoice.findById(req.params.id);

//         if (!invoice) {
//             return res.json({
//                 success: false,
//                 statusCode: 404,
//                 message: 'Sell invoice not found'
//             });
//         }

//         await invoice.deleteOne();

//          console.log('done');

//         res.json({
//             success: true,
//             statusCode: 200,
//             message: 'Sell invoice deleted successfully'
//         });

//     } catch (error) {
//         console.error('Delete Sell Invoice Error:', error);

//         if (error.kind === 'ObjectId') {
//             return res.json({
//                 success: false,
//                 statusCode: 400,
//                 message: 'Invalid invoice ID'
//             });
//         }

//         res.json({
//             success: false,
//             statusCode: 500,
//             message: 'Internal server error'
//         });
//     }
// };


// // =============================
// // DELETE ALL Sell INVOICES
// // =============================
// const deleteAllSellInvoices = async (req, res) => {
//     try {

//         await SellInvoice.deleteMany({});
        
//         res.json({
//             success: true,
//             statusCode: 200,
//             message: 'All Sell invoices deleted successfully'
//         });

//     } catch (error) {
//         console.error('Delete All Sell Invoices Error:', error);

//         res.json({
//             success: false,
//             statusCode: 500,
//             message: 'Internal server error'
//         });
//     }
// };



// module.exports = {
//     copySellInvoice,
//     createSellInvoice,
//     getAllSellInvoices,
//     getSellInvoiceById,
//     updateSellInvoice,
//     deleteSellInvoice,
//     deleteAllSellInvoices
// };













// const SellInvoice = require('../models/sellInvoice.model');
// const InventoryStock = require('../models/inventoryStock.model');



// // =============================
// // GET SALES REPORT BY DATE RANGE
// // =============================
// const getSalesReport = async (req, res) => {
//   try {
//     const { fromDate, toDate } = req.query;

//     // Validate dates
//     if (!fromDate || !toDate) {
//       return res.json({
//         success: false,
//         statusCode: 400,
//         message: 'From date and to date are required'
//       });
//     }

//     // Create date range (include full days)
//     const startDate = new Date(fromDate);
//     startDate.setHours(0, 0, 0, 0);
    
//     const endDate = new Date(toDate);
//     endDate.setHours(23, 59, 59, 999);

//     // Fetch sales in date range
//     const sales = await SellInvoice.find({
//       invoiceDate: { $gte: startDate, $lte: endDate }
//     })
//     .sort({ invoiceDate: -1 })
   

//     // Calculate summary
//     const totalSales = sales.length;
//     const totalAmount = sales.reduce((sum, sale) => sum + (sale.grandTotal || 0), 0);
//     const totalItems = sales.reduce((sum, sale) => {
//       const items = sale.productDetails?.length
//       return sum + items;
//     }, 0);
//     const averageSale = totalSales > 0 ? totalAmount / totalSales : 0;

//     // Group by payment method (optional)
//     const paymentMethods = {
//       cash: sales.filter(s => s.paymentMethod === 'cash').length,
//       bank_transfer: sales.filter(s => s.paymentMethod === 'bank_transfer').length,
//       upi: sales.filter(s => s.paymentMethod === 'upi').length,
//       card: sales.filter(s => s.paymentMethod === 'credit_card' || s.paymentMethod === 'debit_card').length
//     };

//     res.json({
//       success: true,
//       statusCode: 200,
//       message: 'Sales report fetched successfully',
//       data: {
//         sales,
//         summary: {
//           totalSales,
//           totalAmount,
//           totalItems,
//           averageSale: Math.round(averageSale)
//         },
//         paymentMethods,
//         dateRange: {
//           from: fromDate,
//           to: toDate
//         }
//       }
//     });

//   } catch (error) {
//     console.error('Get Sales Report Error:', error);
    
//     res.json({
//       success: false,
//       statusCode: 500,
//       message: 'Internal server error'
//     });
//   }
// };

// const generateInvoiceNumber = async () => {

//   // ✅ Financial year calculate (April–March, India standard)
//   const now = new Date();
//   let startYear = now.getFullYear();
//   let endYear = startYear + 1;

//   // if Jan, Feb, Mar → previous FY
//   if (now.getMonth() < 3) {
//     startYear = startYear - 1;
//     endYear = startYear + 1;
//   }

//   const fy = `${startYear}-${String(endYear).slice(2)}`; // 2025-26

//   // ✅ last invoice find karo iss financial year ka
//   const lastInvoice = await SellInvoice.findOne({
//     invoiceNumber: { $regex: `^INV-${fy}-` }
//   })
//   .sort({ invoiceNumber: -1 }) // descending order
//   .lean();

//   let lastNumber = 0;

//   if (lastInvoice?.invoiceNumber) {
//     const parts = lastInvoice.invoiceNumber.split("-");
//     lastNumber = parseInt(parts[parts.length - 1]) || 0;
//   }

//   const nextNumber = lastNumber + 1;

//   const paddedNumber = String(nextNumber).padStart(3, "0");

//   const invoiceNumber = `INV-${fy}-${paddedNumber}`;

//   return {
//     invoiceNumber,
//     lastNumber: nextNumber
//   };
// };

// // =============================
// // COPY SELL INVOICE MIDDLEWARE
// // =============================
// const copySellInvoice = async (req, res, next) => {
//   try {

//     const { invoiceNumber } = await generateInvoiceNumber();

//     // ✅ clone body
//     const newBody = { ...req.body };

//     // ❌ remove old _id
//     delete newBody._id;

//     // ❌ remove subdocument _id also
//     if (Array.isArray(newBody.productDetails)) {
//       newBody.productDetails = newBody.productDetails.map(item => {
//         const newItem = { ...item };
//         delete newItem._id;
//         return newItem;
//       });
//     }

//     // ✅ assign new invoice number
//     newBody.invoiceNumber = invoiceNumber;

//     // ✅ assign back to req.body
//     req.body = newBody;

//     console.log(req.body, "============NEW COPY BODY===========");

//     next();

//   } catch (error) {

//     console.error('Create Sell Invoice Error:', error);

//     if (error.code === 11000) {
//       return res.json({
//         success: false,
//         statusCode: 400,
//         message: 'Invoice number already exists'
//       });
//     }

//     res.json({
//       success: false,
//       statusCode: 500,
//       message: 'Internal server error'
//     });

//   }
// };

// // =============================
// // UPDATE INVENTORY FOR SELL (Helper Function)
// // =============================
// const updateInventoryForSell = async (productDetails, type = 'sell') => {
//   for (const item of productDetails) {
//     if (!item.inventoryId && !item.productName) continue;

//     try {
//       let inventory;

//       if (item.inventoryId) {
//         // If inventoryId exists, find by ID
//         inventory = await InventoryStock.findById(item.inventoryId);
//       } else {
//         // If no inventoryId, find by productName and unit
//         inventory = await InventoryStock.findOne({
//           productName: item.productName,
//           productUnit: item.unit
//         });
//       }

//       if (!inventory) {
//         throw new Error(`Product ${item.productName} not found in inventory`);
//       }

//       if (type === 'sell') {
//         // Check if sufficient stock available
//         if (inventory.currentStock < item.quantity) {
//           throw new Error(`Insufficient stock for ${item.productName}. Available: ${inventory.currentStock}, Requested: ${item.quantity}`);
//         }
        
//         inventory.stockOut += item.quantity;
//         inventory.currentStock -= item.quantity;
//       } else if (type === 'return') {
//         inventory.stockIn += item.quantity;
//         inventory.currentStock += item.quantity;
//       } else if (type === 'remove') {
//         inventory.stockOut -= item.quantity;
//         inventory.currentStock += item.quantity;
//       }
      
//       await inventory.save();
//     } catch (error) {
//       console.error(`Error updating inventory for product ${item.productName}:`, error);
//       throw error;
//     }
//   }
// };

// // =============================
// // UPDATE INVENTORY FOR EDITED SELL INVOICE
// // =============================
// const updateInventoryForEditSell = async (oldInvoice, newInvoice) => {
//   const oldProducts = oldInvoice.productDetails;
//   const newProducts = newInvoice.productDetails;

//   // Create maps for easy comparison
//   const oldProductMap = new Map();
//   oldProducts.forEach(item => {
//     const key = item.inventoryId || `${item.productName}-${item.unit}`;
//     oldProductMap.set(key, item);
//   });

//   const newProductMap = new Map();
//   newProducts.forEach(item => {
//     const key = item.inventoryId || `${item.productName}-${item.unit}`;
//     newProductMap.set(key, item);
//   });

//   // Process removed products (add back to stock)
//   for (const [key, oldItem] of oldProductMap) {
//     if (!newProductMap.has(key)) {
//       // Product removed - add back to inventory
//       const inventory = await InventoryStock.findOne(
//         oldItem.inventoryId 
//           ? { _id: oldItem.inventoryId }
//           : { productName: oldItem.productName, productUnit: oldItem.unit }
//       );
      
//       if (inventory) {
//         inventory.stockOut -= oldItem.quantity;
//         inventory.currentStock += oldItem.quantity;
//         await inventory.save();
//       }
//     }
//   }

//   // Process added and updated products
//   for (const [key, newItem] of newProductMap) {
//     const oldItem = oldProductMap.get(key);
    
//     if (!oldItem) {
//       // New product added - remove from inventory
//       const inventory = await InventoryStock.findOne(
//         newItem.inventoryId 
//           ? { _id: newItem.inventoryId }
//           : { productName: newItem.productName, productUnit: newItem.unit }
//       );
      
//       if (!inventory) {
//         throw new Error(`Product ${newItem.productName} not found in inventory`);
//       }
      
//       if (inventory.currentStock < newItem.quantity) {
//         throw new Error(`Insufficient stock for ${newItem.productName}. Available: ${inventory.currentStock}, Requested: ${newItem.quantity}`);
//       }
      
//       inventory.stockOut += newItem.quantity;
//       inventory.currentStock -= newItem.quantity;
//       await inventory.save();
//     } else if (oldItem.quantity !== newItem.quantity) {
//       // Quantity changed
//       const inventory = await InventoryStock.findOne(
//         newItem.inventoryId 
//           ? { _id: newItem.inventoryId }
//           : { productName: newItem.productName, productUnit: newItem.unit }
//       );
      
//       if (inventory) {
//         const quantityDiff = newItem.quantity - oldItem.quantity;
        
//         if (quantityDiff > 0) {
//           // More quantity sold - check stock
//           if (inventory.currentStock < quantityDiff) {
//             throw new Error(`Insufficient stock for ${newItem.productName}. Available: ${inventory.currentStock}, Additional needed: ${quantityDiff}`);
//           }
//           inventory.stockOut += quantityDiff;
//           inventory.currentStock -= quantityDiff;
//         } else {
//           // Less quantity sold - add back to stock
//           inventory.stockOut += quantityDiff; // quantityDiff is negative
//           inventory.currentStock -= quantityDiff; // subtract negative = add
//         }
        
//         await inventory.save();
//       }
//     }
//   }
// };

// // =============================
// // CREATE SELL INVOICE
// // =============================
// const createSellInvoice = async (req, res) => {
//     try {
//         const invoiceData = {
//         ...req.body
//         };

//         // ✅ convert termsAndConditions object → string
//         if (Array.isArray(invoiceData.termsAndConditions)) {

//         invoiceData.termsAndConditions =
//             invoiceData.termsAndConditions
//             .map(item => {

//                 // if already string
//                 if (typeof item === "string") return item;

//                 // if object
//                 if (item?.description && item.description !== "null")
//                 return item.description;

//                 return null;

//             })
//             .filter(Boolean);

//         }

//         console.log(invoiceData,'=======invoiceData after convert========');

//         // ✅ Check inventory before creating invoice
//         if (invoiceData.productDetails && invoiceData.productDetails.length > 0) {
//             // First check if all products exist and have sufficient stock
//             for (const item of invoiceData.productDetails) {
//                 let inventory;
                
//                 if (item.inventoryId) {
//                     inventory = await InventoryStock.findById(item.inventoryId);
//                 } else {
//                     inventory = await InventoryStock.findOne({
//                         productName: item.productName,
//                         productUnit: item.unit
//                     });
//                 }
                
//                 if (!inventory) {
//                     return res.json({
//                         success: false,
//                         statusCode: 400,
//                         message: `Product ${item.productName} not found in inventory`
//                     });
//                 }
                
//                 if (inventory.currentStock < item.quantity) {
//                     return res.json({
//                         success: false,
//                         statusCode: 400,
//                         message: `Insufficient stock for ${item.productName}. Available: ${inventory.currentStock}, Requested: ${item.quantity}`
//                     });
//                 }
//             }
//         }

//         const invoice = await SellInvoice.create(invoiceData);

//         // ✅ Update inventory after successful invoice creation
//         if (invoice.productDetails && invoice.productDetails.length > 0) {
//             await updateInventoryForSell(invoice.productDetails, 'sell');
//         }

//          console.log('=======invoiceData save========');

//         res.json({
//             success: true,
//             statusCode: 201,
//             message: 'Sell invoice created successfully',
//             data: invoice
//         });

//     } catch (error) {
//         console.error('Create Sell Invoice Error:', error);

//         if (error.code === 11000) {
//             return res.json({
//                 success: false,
//                 statusCode: 400,
//                 message: 'Invoice number already exists'
//             });
//         }

//         if (error.name === 'ValidationError') {
//             const messages = Object.values(error.errors).map(err => err.message);

//             console.log(messages,'=========messages=========');
            
//             return res.json({
//                 success: false,
//                 statusCode: 400,
//                 message:messages[1]|| messages[0],
//                 errors: messages
//             });
//         }

//         res.json({
//             success: false,
//             statusCode: 500,
//             message: 'Internal server error'
//         });
//     }
// };


// // =============================
// // GET ALL SELL INVOICES
// // =============================
// const getAllSellInvoices = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const skip = (page - 1) * limit;

//         const filter = {};

//         if (req.query.status) {
//             filter.status = req.query.status;
//         }

//         if (req.query.customer) {
//             filter.customer = req.query.customer;
//         }

//         if (req.query.search) {
//             filter.$or = [
//                 { invoiceNumber: { $regex: req.query.search, $options: 'i' } },
//                 { customerName: { $regex: req.query.search, $options: 'i' } }
//             ];
//         }

//         const invoices = await SellInvoice.find(filter)
//             .populate('createdBy', 'name email')
//             .skip(skip)
//             .limit(limit)
//             .sort({ invoiceNumber: -1 });

//         const total = await SellInvoice.countDocuments(filter);

//         res.json({
//             success: true,
//             statusCode: 200,
//             count: invoices.length,
//             total,
//             page,
//             pages: Math.ceil(total / limit),
//             data: invoices
//         });

//     } catch (error) {
//         console.error('Get All Sell Invoices Error:', error);

//         res.json({
//             success: false,
//             statusCode: 500,
//             message: 'Internal server error'
//         });
//     }
// };


// // =============================
// // GET SINGLE SELL INVOICE
// // =============================
// const getSellInvoiceById = async (req, res) => {
//     try {
        
//         const invoice = await SellInvoice.findById(req.params.id)

//         if (!invoice) {
//             return res.json({
//                 success: false,
//                 statusCode: 404,
//                 message: 'Sell invoice not found'
//             });
//         }

//         res.json({
//             success: true,
//             statusCode: 200,
//             data: invoice
//         });

//     } catch (error) {
//         console.error('Get Sell Invoice By ID Error:', error);

//         if (error.kind === 'ObjectId') {
//             return res.json({
//                 success: false,
//                 statusCode: 400,
//                 message: 'Invalid invoice ID'
//             });
//         }

//         res.json({
//             success: false,
//             statusCode: 500,
//             message: 'Internal server error'
//         });
//     }
// };


// // =============================
// // UPDATE SELL INVOICE
// // =============================
// const updateSellInvoice = async (req, res) => {
//     try {
//         let invoice = await SellInvoice.findById(req.params.id);

//         if (!invoice) {
//             return res.json({
//                 success: false,
//                 statusCode: 404,
//                 message: 'Sell invoice not found'
//             });
//         }

//         // Store old product details before update
//         const oldProductDetails = invoice.productDetails;

//         invoice = await SellInvoice.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true }
//         );

//         // ✅ Update inventory based on changes
//         if (invoice && oldProductDetails) {
//             await updateInventoryForEditSell(
//                 { productDetails: oldProductDetails },
//                 { productDetails: invoice.productDetails }
//             );
//         }

//         res.json({
//             success: true,
//             statusCode: 200,
//             message: 'Sell invoice updated successfully',
//             data: invoice
//         });

//     } catch (error) {
//         console.error('Update Sell Invoice Error:', error);

//         if (error.code === 11000) {
//             return res.json({
//                 success: false,
//                 statusCode: 400,
//                 message: 'Invoice number already exists'
//             });
//         }

//         if (error.name === 'ValidationError') {
//             const messages = Object.values(error.errors).map(err => err.message);
//             return res.json({
//                 success: false,
//                 statusCode: 400,
//                 message: 'Validation Error',
//                 errors: messages
//             });
//         }

//         if (error.message.includes('Insufficient stock')) {
//             return res.json({
//                 success: false,
//                 statusCode: 400,
//                 message: error.message
//             });
//         }

//         res.json({
//             success: false,
//             statusCode: 500,
//             message: 'Internal server error'
//         });
//     }
// };


// // =============================
// // DELETE SELL INVOICE
// // =============================
// const deleteSellInvoice = async (req, res) => {
//     try {
//         const invoice = await SellInvoice.findById(req.params.id);

//         if (!invoice) {
//             return res.json({
//                 success: false,
//                 statusCode: 404,
//                 message: 'Sell invoice not found'
//             });
//         }

//         // ✅ Add back to inventory before deleting invoice
//         if (invoice.productDetails && invoice.productDetails.length > 0) {
//             await updateInventoryForSell(invoice.productDetails, 'remove');
//         }

//         await invoice.deleteOne();

//          console.log('done');

//         res.json({
//             success: true,
//             statusCode: 200,
//             message: 'Sell invoice deleted successfully'
//         });

//     } catch (error) {
//         console.error('Delete Sell Invoice Error:', error);

//         if (error.kind === 'ObjectId') {
//             return res.json({
//                 success: false,
//                 statusCode: 400,
//                 message: 'Invalid invoice ID'
//             });
//         }

//         res.json({
//             success: false,
//             statusCode: 500,
//             message: 'Internal server error'
//         });
//     }
// };


// // =============================
// // DELETE ALL Sell INVOICES
// // =============================
// const deleteAllSellInvoices = async (req, res) => {
//     try {

//         await SellInvoice.deleteMany({});
        
//         // Note: This will NOT update inventory
//         // You might want to clear inventory separately or add logic here
        
//         res.json({
//             success: true,
//             statusCode: 200,
//             message: 'All Sell invoices deleted successfully'
//         });

//     } catch (error) {
//         console.error('Delete All Sell Invoices Error:', error);

//         res.json({
//             success: false,
//             statusCode: 500,
//             message: 'Internal server error'
//         });
//     }
// };

// // =============================
// // RETURN PRODUCTS (NEW CONTROLLER)
// // =============================
// const returnSellInvoiceProducts = async (req, res) => {
//     try {
//         const { invoiceId, returnItems } = req.body;
        
//         // Validate input
//         if (!invoiceId || !returnItems || !Array.isArray(returnItems) || returnItems.length === 0) {
//             return res.json({
//                 success: false,
//                 statusCode: 400,
//                 message: 'Invoice ID and return items are required'
//             });
//         }

//         // Find the original invoice
//         const invoice = await SellInvoice.findById(invoiceId);
        
//         if (!invoice) {
//             return res.json({
//                 success: false,
//                 statusCode: 404,
//                 message: 'Sell invoice not found'
//             });
//         }

//         // Process each return item
//         const returnProductDetails = [];
        
//         for (const returnItem of returnItems) {
//             const { productName, unit, quantity, reason } = returnItem;
            
//             if (!productName || !unit || !quantity || quantity <= 0) {
//                 return res.json({
//                     success: false,
//                     statusCode: 400,
//                     message: 'Invalid return item data'
//                 });
//             }

//             // Find the product in original invoice
//             const originalProduct = invoice.productDetails.find(
//                 p => p.productName === productName && p.unit === unit
//             );

//             if (!originalProduct) {
//                 return res.json({
//                     success: false,
//                     statusCode: 400,
//                     message: `Product ${productName} not found in original invoice`
//                 });
//             }

//             // Check if return quantity is valid
//             if (quantity > originalProduct.quantity) {
//                 return res.json({
//                     success: false,
//                     statusCode: 400,
//                     message: `Return quantity (${quantity}) exceeds original quantity (${originalProduct.quantity}) for ${productName}`
//                 });
//             }

//             returnProductDetails.push({
//                 inventoryId: originalProduct.inventoryId,
//                 productName,
//                 unit,
//                 quantity,
//                 pricePerUnit: originalProduct.pricePerUnit,
//                 reason: reason || 'Customer return'
//             });
//         }

//         // Update inventory (add back the returned items)
//         await updateInventoryForSell(returnProductDetails, 'return');

//         // Create return record in invoice (you might want to add a returns array to your schema)
//         if (!invoice.returns) {
//             invoice.returns = [];
//         }

//         invoice.returns.push({
//             returnDate: new Date(),
//             items: returnProductDetails,
//             totalAmount: returnProductDetails.reduce((sum, item) => 
//                 sum + (item.quantity * item.pricePerUnit), 0
//             )
//         });

//         await invoice.save();

//         res.json({
//             success: true,
//             statusCode: 200,
//             message: 'Products returned successfully',
//             data: {
//                 invoiceId: invoice._id,
//                 invoiceNumber: invoice.invoiceNumber,
//                 returnedItems: returnProductDetails
//             }
//         });

//     } catch (error) {
//         console.error('Return Products Error:', error);

//         if (error.message.includes('not found in inventory')) {
//             return res.json({
//                 success: false,
//                 statusCode: 400,
//                 message: error.message
//             });
//         }

//         res.json({
//             success: false,
//             statusCode: 500,
//             message: 'Internal server error'
//         });
//     }
// };

// module.exports = {
//     getSalesReport,
//     copySellInvoice,
//     createSellInvoice,
//     getAllSellInvoices,
//     getSellInvoiceById,
//     updateSellInvoice,
//     deleteSellInvoice,
//     deleteAllSellInvoices,
//     returnSellInvoiceProducts // New export
// };









// controllers/sellInvoice.controller.js

const SellInvoice = require('../models/sellInvoice.model');
const InventoryStock = require('../models/inventoryStock.model');

// =============================
// GENERATE INVOICE NUMBER (FY based)
// =============================
const generateInvoiceNumber = async () => {
  const now = new Date();
  let startYear = now.getFullYear();
  let endYear = startYear + 1;

  if (now.getMonth() < 3) {
    startYear = startYear - 1;
    endYear = startYear + 1;
  }

  const fy = `${startYear}-${String(endYear).slice(2)}`;

  const lastInvoice = await SellInvoice.findOne({
    invoiceNumber: { $regex: `^INV-${fy}-` }
  })
  .sort({ invoiceNumber: -1 })
  .lean();

  let lastNumber = 0;

  if (lastInvoice?.invoiceNumber) {
    const parts = lastInvoice.invoiceNumber.split("-");
    lastNumber = parseInt(parts[parts.length - 1]) || 0;
  }

  const nextNumber = lastNumber + 1;
  const paddedNumber = String(nextNumber).padStart(3, "0");
  const invoiceNumber = `INV-${fy}-${paddedNumber}`;

  return {
    invoiceNumber,
    lastNumber: nextNumber
  };
};

// =============================
// COPY SELL INVOICE MIDDLEWARE
// =============================
const copySellInvoice = async (req, res, next) => {
  try {
    const { invoiceNumber } = await generateInvoiceNumber();

    const newBody = { ...req.body };
    delete newBody._id;

    if (Array.isArray(newBody.productDetails)) {
      newBody.productDetails = newBody.productDetails.map(item => {
        const newItem = { ...item };
        delete newItem._id;
        return newItem;
      });
    }

    newBody.invoiceNumber = invoiceNumber;
    req.body = newBody;

    console.log(req.body, "============NEW COPY BODY===========");
    next();

  } catch (error) {
    console.error('Copy Sell Invoice Error:', error);

    if (error.code === 11000) {
      return res.json({
        success: false,
        statusCode: 400,
        message: 'Invoice number already exists'
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
// CALCULATE TAX AMOUNT (Helper Function)
// =============================
const calculateTaxAmount = (price, cgst, sgst, igst) => {
  const taxPercent = (cgst || 0) + (sgst || 0) + (igst || 0);
  return (price * taxPercent) / 100;
};

// =============================
// CALCULATE NEW SELL AVERAGE PRICE
// =============================
const calculateNewSellAverage = (oldAvgPrice, oldQuantity, newPrice, newQuantity) => {
  const totalOldValue = oldAvgPrice * oldQuantity;
  const totalNewValue = newPrice * newQuantity;
  const totalQuantity = oldQuantity + newQuantity;
  
  return totalQuantity > 0 ? (totalOldValue + totalNewValue) / totalQuantity : newPrice;
};

// =============================
// RECALCULATE SELL AVERAGE PRICE
// =============================
const recalculateSellAveragePrice = async (inventoryId) => {
  try {
    const sellInvoices = await SellInvoice.find({
      'productDetails.inventoryId': inventoryId
    }).select('productDetails');
    
    let totalQuantity = 0;
    let totalValue = 0;
    
    for (const invoice of sellInvoices) {
      for (const product of invoice.productDetails) {
        if (product.inventoryId?.toString() === inventoryId.toString()) {
          // Calculate tax amount correctly
          const taxPercent = (product.cgst || 0) + (product.sgst || 0) + (product.igst || 0);
          const taxAmount = (product.pricePerUnit * taxPercent) / 100;
          const priceWithTax = product.pricePerUnit + taxAmount;
          
          totalQuantity += product.quantity;
          totalValue += priceWithTax * product.quantity;
        }
      }
    }
    
    const inventory = await InventoryStock.findById(inventoryId);
    if (inventory) {
      inventory.sellAveragePrice = totalQuantity > 0 ? totalValue / totalQuantity : 0;
      await inventory.save();
    }
  } catch (error) {
    console.error('Error recalculating sell average price:', error);
  }
};

// =============================
// UPDATE INVENTORY FOR SELL (Helper Function)
// =============================
const updateInventoryForSell = async (productDetails, type = 'sell') => {
  for (const item of productDetails) {
    if (!item.inventoryId && !item.productName) continue;

    try {
      let inventory;

      if (item.inventoryId) {
        inventory = await InventoryStock.findById(item.inventoryId);
      } else {
        inventory = await InventoryStock.findOne({
          productName: item.productName,
          productUnit: item.unit
        });
      }

      if (!inventory) {
        throw new Error(`Product ${item.productName} not found in inventory`);
      }

      // ✅ FIX: Calculate tax amount correctly from percentage
      const taxPercent = (item.cgst || 0) + (item.sgst || 0) + (item.igst || 0);
      const taxAmount = (item.pricePerUnit * taxPercent) / 100;
      const sellingPrice = item.pricePerUnit + taxAmount;

      console.log(`Sell - Product: ${item.productName}, Price: ${item.pricePerUnit}, Tax%: ${taxPercent}%, Tax: ${taxAmount.toFixed(2)}, Total: ${sellingPrice.toFixed(2)}`);

      if (type === 'sell') {
        if (inventory.currentStock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.productName}. Available: ${inventory.currentStock}, Requested: ${item.quantity}`);
        }
        
        // Store old values for average calculation
        const oldQuantity = inventory.stockOut;
        const oldAvgPrice = inventory.sellAveragePrice || 0;
        
        inventory.stockOut += item.quantity;
        inventory.currentStock -= item.quantity;
        
        // Update sell average price
        if (oldQuantity > 0) {
          inventory.sellAveragePrice = calculateNewSellAverage(
            oldAvgPrice,
            oldQuantity,
            sellingPrice,
            item.quantity
          );
        } else {
          inventory.sellAveragePrice = sellingPrice;
        }
        
      } else if (type === 'return') {
        // For returns, we add back to stock but don't affect sell average
        inventory.stockIn += item.quantity;
        inventory.currentStock += item.quantity;
        
      } else if (type === 'remove') {
        // When removing a sale, reduce stockOut and increase currentStock
        inventory.stockOut -= item.quantity;
        inventory.currentStock += item.quantity;
        
        // Recalculate sell average
        if (inventory.currentStock > 0) {
          await recalculateSellAveragePrice(inventory._id);
        }
      }
      
      await inventory.save();
    } catch (error) {
      console.error(`Error updating inventory for product ${item.productName}:`, error);
      throw error;
    }
  }
};

// =============================
// UPDATE INVENTORY FOR EDITED SELL INVOICE
// =============================
const updateInventoryForEditSell = async (oldInvoice, newInvoice) => {
  const oldProducts = oldInvoice.productDetails;
  const newProducts = newInvoice.productDetails;

  const oldProductMap = new Map();
  oldProducts.forEach(item => {
    const key = item.inventoryId || `${item.productName}-${item.unit}`;
    oldProductMap.set(key, item);
  });

  const newProductMap = new Map();
  newProducts.forEach(item => {
    const key = item.inventoryId || `${item.productName}-${item.unit}`;
    newProductMap.set(key, item);
  });

  // Process removed products
  for (const [key, oldItem] of oldProductMap) {
    if (!newProductMap.has(key)) {
      const inventory = await InventoryStock.findOne(
        oldItem.inventoryId 
          ? { _id: oldItem.inventoryId }
          : { productName: oldItem.productName, productUnit: oldItem.unit }
      );
      
      if (inventory) {
        inventory.stockOut -= oldItem.quantity;
        inventory.currentStock += oldItem.quantity;
        await inventory.save();
        await recalculateSellAveragePrice(inventory._id);
      }
    }
  }

  // Process added and updated products
  for (const [key, newItem] of newProductMap) {
    const oldItem = oldProductMap.get(key);
    
    if (!oldItem) {
      // New product added
      const inventory = await InventoryStock.findOne(
        newItem.inventoryId 
          ? { _id: newItem.inventoryId }
          : { productName: newItem.productName, productUnit: newItem.unit }
      );
      
      if (!inventory) {
        throw new Error(`Product ${newItem.productName} not found in inventory`);
      }
      
      if (inventory.currentStock < newItem.quantity) {
        throw new Error(`Insufficient stock for ${newItem.productName}. Available: ${inventory.currentStock}, Requested: ${newItem.quantity}`);
      }
      
      // Calculate tax amount
      const taxPercent = (newItem.cgst || 0) + (newItem.sgst || 0) + (newItem.igst || 0);
      const taxAmount = (newItem.pricePerUnit * taxPercent) / 100;
      const sellingPrice = newItem.pricePerUnit + taxAmount;
      
      inventory.stockOut += newItem.quantity;
      inventory.currentStock -= newItem.quantity;
      
      // Update sell average
      const oldAvgPrice = inventory.sellAveragePrice || 0;
      const oldQuantity = inventory.stockOut - newItem.quantity;
      
      if (oldQuantity > 0) {
        inventory.sellAveragePrice = calculateNewSellAverage(
          oldAvgPrice,
          oldQuantity,
          sellingPrice,
          newItem.quantity
        );
      } else {
        inventory.sellAveragePrice = sellingPrice;
      }
      
      await inventory.save();
      
    } else if (oldItem.quantity !== newItem.quantity || 
               oldItem.pricePerUnit !== newItem.pricePerUnit ||
               oldItem.cgst !== newItem.cgst ||
               oldItem.sgst !== newItem.sgst ||
               oldItem.igst !== newItem.igst) {
      
      // Quantity or price or tax changed
      const inventory = await InventoryStock.findOne(
        newItem.inventoryId 
          ? { _id: newItem.inventoryId }
          : { productName: newItem.productName, productUnit: newItem.unit }
      );
      
      if (inventory) {
        const quantityDiff = newItem.quantity - oldItem.quantity;
        
        if (quantityDiff > 0) {
          if (inventory.currentStock < quantityDiff) {
            throw new Error(`Insufficient stock for ${newItem.productName}. Available: ${inventory.currentStock}, Additional needed: ${quantityDiff}`);
          }
          inventory.stockOut += quantityDiff;
          inventory.currentStock -= quantityDiff;
        } else {
          inventory.stockOut += quantityDiff;
          inventory.currentStock -= quantityDiff;
        }
        
        await inventory.save();
        await recalculateSellAveragePrice(inventory._id);
      }
    }
  }
};

// =============================
// CREATE SELL INVOICE
// =============================
const createSellInvoice = async (req, res) => {
    try {
        const invoiceData = { ...req.body };

        // ✅ convert termsAndConditions object → string
        if (Array.isArray(invoiceData.termsAndConditions)) {
          invoiceData.termsAndConditions =
            invoiceData.termsAndConditions
            .map(item => {
                if (typeof item === "string") return item;
                if (item?.description && item.description !== "null")
                return item.description;
                return null;
            })
            .filter(Boolean);
        }

        console.log(invoiceData,'=======invoiceData after convert========');

        // ✅ Check inventory before creating invoice
        if (invoiceData.productDetails && invoiceData.productDetails.length > 0) {
            for (const item of invoiceData.productDetails) {
                let inventory;
                
                if (item.inventoryId) {
                    inventory = await InventoryStock.findById(item.inventoryId);
                } else {
                    inventory = await InventoryStock.findOne({
                        productName: item.productName,
                        productUnit: item.unit
                    });
                }
                
                if (!inventory) {
                    return res.json({
                        success: false,
                        statusCode: 400,
                        message: `Product ${item.productName} not found in inventory`
                    });
                }
                
                if (inventory.currentStock < item.quantity) {
                    return res.json({
                        success: false,
                        statusCode: 400,
                        message: `Insufficient stock for ${item.productName}. Available: ${inventory.currentStock}, Requested: ${item.quantity}`
                    });
                }
            }
        }

        const invoice = await SellInvoice.create(invoiceData);

        // ✅ Update inventory after successful invoice creation
        if (invoice.productDetails && invoice.productDetails.length > 0) {
            await updateInventoryForSell(invoice.productDetails, 'sell');
        }

        console.log('=======Sell invoice saved========');

        res.json({
            success: true,
            statusCode: 201,
            message: 'Sell invoice created successfully',
            data: invoice
        });

    } catch (error) {
        console.error('Create Sell Invoice Error:', error);

        if (error.code === 11000) {
            return res.json({
                success: false,
                statusCode: 400,
                message: 'Invoice number already exists'
            });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            console.log(messages,'=========messages=========');
            
            return res.json({
                success: false,
                statusCode: 400,
                message:messages[1]|| messages[0],
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
// GET ALL SELL INVOICES
// =============================
const getAllSellInvoices = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};

        if (req.query.status) {
            filter.status = req.query.status;
        }

        if (req.query.customer) {
            filter.customerName = { $regex: req.query.customer, $options: 'i' };
        }

        if (req.query.search) {
            filter.$or = [
                { invoiceNumber: { $regex: req.query.search, $options: 'i' } },
                { customerName: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const invoices = await SellInvoice.find(filter)
            .populate('createdBy', 'name email')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await SellInvoice.countDocuments({});

        res.json({
            success: true,
            statusCode: 200,
            count: total,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: invoices
        });

    } catch (error) {
        console.error('Get All Sell Invoices Error:', error);

        res.json({
            success: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

// =============================
// GET SINGLE SELL INVOICE
// =============================
const getSellInvoiceById = async (req, res) => {
    try {
        
        const invoice = await SellInvoice.findById(req.params.id)

        if (!invoice) {
            return res.json({
                success: false,
                statusCode: 404,
                message: 'Sell invoice not found'
            });
        }

        res.json({
            success: true,
            statusCode: 200,
            data: invoice
        });

    } catch (error) {
        console.error('Get Sell Invoice By ID Error:', error);

        if (error.kind === 'ObjectId') {
            return res.json({
                success: false,
                statusCode: 400,
                message: 'Invalid invoice ID'
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
// UPDATE SELL INVOICE
// =============================
const updateSellInvoice = async (req, res) => {
    try {
        let invoice = await SellInvoice.findById(req.params.id);

        if (!invoice) {
            return res.json({
                success: false,
                statusCode: 404,
                message: 'Sell invoice not found'
            });
        }

        // Store old product details before update
        const oldProductDetails = invoice.productDetails;

        invoice = await SellInvoice.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        // ✅ Update inventory based on changes
        if (invoice && oldProductDetails) {
            await updateInventoryForEditSell(
                { productDetails: oldProductDetails },
                { productDetails: invoice.productDetails }
            );
        }

        res.json({
            success: true,
            statusCode: 200,
            message: 'Sell invoice updated successfully',
            data: invoice
        });

    } catch (error) {
        console.error('Update Sell Invoice Error:', error);

        if (error.code === 11000) {
            return res.json({
                success: false,
                statusCode: 400,
                message: 'Invoice number already exists'
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

        if (error.message.includes('Insufficient stock')) {
            return res.json({
                success: false,
                statusCode: 400,
                message: error.message
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
// DELETE SELL INVOICE
// =============================
const deleteSellInvoice = async (req, res) => {
    try {
        const invoice = await SellInvoice.findById(req.params.id);

        if (!invoice) {
            return res.json({
                success: false,
                statusCode: 404,
                message: 'Sell invoice not found'
            });
        }

        // ✅ Add back to inventory before deleting invoice
        if (invoice.productDetails && invoice.productDetails.length > 0) {
            await updateInventoryForSell(invoice.productDetails, 'remove');
        }

        await invoice.deleteOne();

        console.log('Sell invoice deleted successfully');

        res.json({
            success: true,
            statusCode: 200,
            message: 'Sell invoice deleted successfully'
        });

    } catch (error) {
        console.error('Delete Sell Invoice Error:', error);

        if (error.kind === 'ObjectId') {
            return res.json({
                success: false,
                statusCode: 400,
                message: 'Invalid invoice ID'
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
// DELETE ALL SELL INVOICES
// =============================
const deleteAllSellInvoices = async (req, res) => {
    try {
        await SellInvoice.deleteMany({});
        
        res.json({
            success: true,
            statusCode: 200,
            message: 'All Sell invoices deleted successfully'
        });

    } catch (error) {
        console.error('Delete All Sell Invoices Error:', error);

        res.json({
            success: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

// =============================
// RETURN PRODUCTS
// =============================
const returnSellInvoiceProducts = async (req, res) => {
    try {
        const { invoiceId, returnItems } = req.body;
        
        if (!invoiceId || !returnItems || !Array.isArray(returnItems) || returnItems.length === 0) {
            return res.json({
                success: false,
                statusCode: 400,
                message: 'Invoice ID and return items are required'
            });
        }

        const invoice = await SellInvoice.findById(invoiceId);
        
        if (!invoice) {
            return res.json({
                success: false,
                statusCode: 404,
                message: 'Sell invoice not found'
            });
        }

        const returnProductDetails = [];
        
        for (const returnItem of returnItems) {
            const { productName, unit, quantity, reason } = returnItem;
            
            if (!productName || !unit || !quantity || quantity <= 0) {
                return res.json({
                    success: false,
                    statusCode: 400,
                    message: 'Invalid return item data'
                });
            }

            const originalProduct = invoice.productDetails.find(
                p => p.productName === productName && p.unit === unit
            );

            if (!originalProduct) {
                return res.json({
                    success: false,
                    statusCode: 400,
                    message: `Product ${productName} not found in original invoice`
                });
            }

            if (quantity > originalProduct.quantity) {
                return res.json({
                    success: false,
                    statusCode: 400,
                    message: `Return quantity (${quantity}) exceeds original quantity (${originalProduct.quantity}) for ${productName}`
                });
            }

            returnProductDetails.push({
                inventoryId: originalProduct.inventoryId,
                productName,
                unit,
                quantity,
                pricePerUnit: originalProduct.pricePerUnit,
                cgst: originalProduct.cgst,
                sgst: originalProduct.sgst,
                igst: originalProduct.igst,
                reason: reason || 'Customer return'
            });
        }

        await updateInventoryForSell(returnProductDetails, 'return');

        if (!invoice.returns) {
            invoice.returns = [];
        }

        // Calculate total return amount with tax
        const totalReturnAmount = returnProductDetails.reduce((sum, item) => {
          const taxPercent = (item.cgst || 0) + (item.sgst || 0) + (item.igst || 0);
          const taxAmount = (item.pricePerUnit * taxPercent) / 100;
          return sum + ((item.pricePerUnit + taxAmount) * item.quantity);
        }, 0);

        invoice.returns.push({
            returnDate: new Date(),
            items: returnProductDetails,
            totalAmount: totalReturnAmount
        });

        await invoice.save();

        res.json({
            success: true,
            statusCode: 200,
            message: 'Products returned successfully',
            data: {
                invoiceId: invoice._id,
                invoiceNumber: invoice.invoiceNumber,
                returnedItems: returnProductDetails,
                totalReturnAmount
            }
        });

    } catch (error) {
        console.error('Return Products Error:', error);

        if (error.message.includes('not found in inventory')) {
            return res.json({
                success: false,
                statusCode: 400,
                message: error.message
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
// GET SALES REPORT BY DATE RANGE
// =============================
const getSalesReport = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    if (!fromDate || !toDate) {
      return res.json({
        success: false,
        statusCode: 400,
        message: 'From date and to date are required'
      });
    }

    const startDate = new Date(fromDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(toDate);
    endDate.setHours(23, 59, 59, 999);

    const sales = await SellInvoice.find({
      invoiceDate: { $gte: startDate, $lte: endDate }
    })
    .sort({ invoiceDate: -1 });

    const totalSales = sales.length;
    const totalAmount = sales.reduce((sum, sale) => sum + (sale.grandTotal || 0), 0);
    const totalItems = sales.reduce((sum, sale) => {
      const items = sale.productDetails?.reduce((itemSum, p) => itemSum + p.quantity, 0) || 0;
      return sum + items;
    }, 0);
    const averageSale = totalSales > 0 ? totalAmount / totalSales : 0;

    const paymentMethods = {
      cash: sales.filter(s => s.paymentMethod === 'cash').length,
      bank_transfer: sales.filter(s => s.paymentMethod === 'bank_transfer').length,
      upi: sales.filter(s => s.paymentMethod === 'upi').length,
      card: sales.filter(s => s.paymentMethod === 'credit_card' || s.paymentMethod === 'debit_card').length
    };

    res.json({
      success: true,
      statusCode: 200,
      message: 'Sales report fetched successfully',
      data: {
        sales,
        summary: {
          totalSales,
          totalAmount,
          totalItems,
          averageSale: Math.round(averageSale)
        },
        paymentMethods,
        dateRange: {
          from: fromDate,
          to: toDate
        }
      }
    });

  } catch (error) {
    console.error('Get Sales Report Error:', error);
    
    res.json({
      success: false,
      statusCode: 500,
      message: 'Internal server error'
    });
  }
};

module.exports = {
    copySellInvoice,
    createSellInvoice,
    getAllSellInvoices,
    getSellInvoiceById,
    updateSellInvoice,
    deleteSellInvoice,
    deleteAllSellInvoices,
    returnSellInvoiceProducts,
    getSalesReport
};






