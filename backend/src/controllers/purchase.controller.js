// const PurchaseInvoice = require('../models/purchaseInvoice.model');
// const inventoryStock = require('../models/inventoryStock.model');

// const generateFiveDigitRandomNumber = async (req, res,next) => {
//   try {
//     // 10000 se 99999 ke beech random number
//     const randomNumber = Math.floor(10000 + Math.random() * 90000);

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
//     newBody.invoiceNumber = randomNumber;

//     // ✅ assign back to req.body
//     req.body = newBody;

//     next();

//   } catch (error) {
//     return res.json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // =============================
// // CREATE Purchase INVOICE
// // =============================
// const createPurchaseInvoice = async (req, res) => {
//     try {
//         const invoiceData = {
//         ...req.body
//         };

//         console.log(invoiceData,'===========invoiceData========');
        

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

//         const invoice = await PurchaseInvoice.create(invoiceData);

//          console.log('=======invoiceData save========');

//         res.json({
//             success: true,
//             statusCode: 201,
//             message: 'Purchase invoice created successfully',
//             data: invoice
//         });

//     } catch (error) {
//         console.error('Create Purchase Invoice Error:', error);

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
// // GET ALL Purchase INVOICES
// // =============================
// const getAllPurchaseInvoices = async (req, res) => {
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

//         const invoices = await PurchaseInvoice.find(filter)
//             .populate('createdBy', 'name email')
//             .skip(skip)
//             .limit(limit)
//             .sort({ invoiceNumber: -1 });

//         const total = await PurchaseInvoice.countDocuments(filter);

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
//         console.error('Get All Purchase Invoices Error:', error);

//         res.json({
//             success: false,
//             statusCode: 500,
//             message: 'Internal server error'
//         });
//     }
// };


// // =============================
// // GET SINGLE Purchase INVOICE
// // =============================
// const getPurchaseInvoiceById = async (req, res) => {
//     try {
        
//         const invoice = await PurchaseInvoice.findById(req.params.id)

//         if (!invoice) {
//             return res.json({
//                 success: false,
//                 statusCode: 404,
//                 message: 'Purchase invoice not found'
//             });
//         }

//         res.json({
//             success: true,
//             statusCode: 200,
//             data: invoice
//         });

//     } catch (error) {
//         console.error('Get Purchase Invoice By ID Error:', error);

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
// // UPDATE Purchase INVOICE
// // =============================
// const updatePurchaseInvoice = async (req, res) => {
//     try {
//         let invoice = await PurchaseInvoice.findById(req.params.id);

//         if (!invoice) {
//             return res.json({
//                 success: false,
//                 statusCode: 404,
//                 message: 'Purchase invoice not found'
//             });
//         }

//         invoice = await PurchaseInvoice.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true }
//         );

//         res.json({
//             success: true,
//             statusCode: 200,
//             message: 'Purchase invoice updated successfully',
//             data: invoice
//         });

//     } catch (error) {
//         console.error('Update Purchase Invoice Error:', error);

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
// // DELETE Purchase INVOICE
// // =============================
// const deletePurchaseInvoice = async (req, res) => {
//     try {
//         const invoice = await PurchaseInvoice.findById(req.params.id);

//         if (!invoice) {
//             return res.json({
//                 success: false,
//                 statusCode: 404,
//                 message: 'Purchase invoice not found'
//             });
//         }

//         await invoice.deleteOne();

//          console.log('done');

//         res.json({
//             success: true,
//             statusCode: 200,
//             message: 'Purchase invoice deleted successfully'
//         });

//     } catch (error) {
//         console.error('Delete Purchase Invoice Error:', error);

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
// // DELETE ALL Purchase INVOICES
// // =============================
// const deleteAllPurchaseInvoices = async (req, res) => {
//     try {

//         await PurchaseInvoice.deleteMany({});
        
//         res.json({
//             success: true,
//             statusCode: 200,
//             message: 'All Purchase invoices deleted successfully'
//         });

//     } catch (error) {
//         console.error('Delete All Purchase Invoices Error:', error);

//         res.json({
//             success: false,
//             statusCode: 500,
//             message: 'Internal server error'
//         });
//     }
// };



// module.exports = {
//     generateFiveDigitRandomNumber,
//     createPurchaseInvoice,
//     getAllPurchaseInvoices,
//     getPurchaseInvoiceById,
//     updatePurchaseInvoice,
//     deletePurchaseInvoice,
//     deleteAllPurchaseInvoices
// };




// const PurchaseInvoice = require('../models/purchaseInvoice.model');
// const InventoryStock = require('../models/inventoryStock.model');

// const generateFiveDigitRandomNumber = async (req, res,next) => {
//   try {
//     // 10000 se 99999 ke beech random number
//     const randomNumber = Math.floor(10000 + Math.random() * 90000);

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
//     newBody.invoiceNumber = randomNumber;

//     // ✅ assign back to req.body
//     req.body = newBody;

//     next();

//   } catch (error) {
//     return res.json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // =============================
// // UPDATE INVENTORY STOCK (Helper Function)
// // =============================
// const updateInventoryForPurchase = async (productDetails, type = 'add') => {
//   for (const item of productDetails) {
//     if (!item.inventoryId && !item.productName) continue;

//     try {
//       let inventory;

//       if (item.inventoryId) {
//         // If inventoryId exists, find by ID
//         inventory = await InventoryStock.findById(item.inventoryId);
//       } else {
//         // If no inventoryId, find or create by productName and unit
//         inventory = await InventoryStock.findOne({
//           productName: item.productName,
//           productUnit: item.unit
//         });
//       }

//       if (inventory) {
//         // Update existing inventory
//         if (type === 'add') {
//           inventory.stockIn += item.quantity;
//           inventory.currentStock += item.quantity;
//         } else if (type === 'remove') {
//           inventory.stockIn -= item.quantity;
//           inventory.currentStock -= item.quantity;
//         } else if (type === 'update') {
//           // For update, we'll handle separately
//           continue;
//         }
        
//         await inventory.save();
//       } else if (type === 'add') {
//         // Create new inventory only when adding
//         await InventoryStock.create({
//           productName: item.productName,
//           productUnit: item.unit,
//           stockIn: item.quantity,
//           stockOut: 0,
//           currentStock: item.quantity
//         });
//       }
//     } catch (error) {
//       console.error(`Error updating inventory for product ${item.productName}:`, error);
//       throw error;
//     }
//   }
// };

// // =============================
// // UPDATE INVENTORY FOR EDITED INVOICE
// // =============================
// const updateInventoryForEdit = async (oldInvoice, newInvoice) => {
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

//   // Process removed products
//   for (const [key, oldItem] of oldProductMap) {
//     if (!newProductMap.has(key)) {
//       // Product removed - decrease inventory
//       const inventory = await InventoryStock.findOne(
//         oldItem.inventoryId 
//           ? { _id: oldItem.inventoryId }
//           : { productName: oldItem.productName, productUnit: oldItem.unit }
//       );
      
//       if (inventory) {
//         inventory.stockIn -= oldItem.quantity;
//         inventory.currentStock -= oldItem.quantity;
//         await inventory.save();
//       }
//     }
//   }

//   // Process added and updated products
//   for (const [key, newItem] of newProductMap) {
//     const oldItem = oldProductMap.get(key);
    
//     if (!oldItem) {
//       // New product added
//       await updateInventoryForPurchase([newItem], 'add');
//     } else if (oldItem.quantity !== newItem.quantity) {
//       // Quantity changed
//       const inventory = await InventoryStock.findOne(
//         newItem.inventoryId 
//           ? { _id: newItem.inventoryId }
//           : { productName: newItem.productName, productUnit: newItem.unit }
//       );
      
//       if (inventory) {
//         const quantityDiff = newItem.quantity - oldItem.quantity;
//         inventory.stockIn += quantityDiff;
//         inventory.currentStock += quantityDiff;
//         await inventory.save();
//       }
//     }
//   }
// };

// // =============================
// // CREATE Purchase INVOICE
// // =============================
// const createPurchaseInvoice = async (req, res) => {
//     try {
//         const invoiceData = {
//         ...req.body
//         };

//         console.log(invoiceData,'===========invoiceData========');
        

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

//         const invoice = await PurchaseInvoice.create(invoiceData);

//         // ✅ Update inventory for new purchase
//         if (invoice.productDetails && invoice.productDetails.length > 0) {
//             await updateInventoryForPurchase(invoice.productDetails, 'add');
//         }

//          console.log('=======invoiceData save========');

//         res.json({
//             success: true,
//             statusCode: 201,
//             message: 'Purchase invoice created successfully',
//             data: invoice
//         });

//     } catch (error) {
//         console.error('Create Purchase Invoice Error:', error);

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
// // GET ALL Purchase INVOICES
// // =============================
// const getAllPurchaseInvoices = async (req, res) => {
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

//         const invoices = await PurchaseInvoice.find(filter)
//             .populate('createdBy', 'name email')
//             .skip(skip)
//             .limit(limit)
//             .sort({ invoiceNumber: -1 });

//         const total = await PurchaseInvoice.countDocuments(filter);

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
//         console.error('Get All Purchase Invoices Error:', error);

//         res.json({
//             success: false,
//             statusCode: 500,
//             message: 'Internal server error'
//         });
//     }
// };


// // =============================
// // GET SINGLE Purchase INVOICE
// // =============================
// const getPurchaseInvoiceById = async (req, res) => {
//     try {
        
//         const invoice = await PurchaseInvoice.findById(req.params.id)

//         if (!invoice) {
//             return res.json({
//                 success: false,
//                 statusCode: 404,
//                 message: 'Purchase invoice not found'
//             });
//         }

//         res.json({
//             success: true,
//             statusCode: 200,
//             data: invoice
//         });

//     } catch (error) {
//         console.error('Get Purchase Invoice By ID Error:', error);

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
// // UPDATE Purchase INVOICE
// // =============================
// const updatePurchaseInvoice = async (req, res) => {
//     try {
//         let invoice = await PurchaseInvoice.findById(req.params.id);

//         if (!invoice) {
//             return res.json({
//                 success: false,
//                 statusCode: 404,
//                 message: 'Purchase invoice not found'
//             });
//         }

//         // Store old product details before update
//         const oldProductDetails = invoice.productDetails;

//         invoice = await PurchaseInvoice.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true }
//         );

//         // ✅ Update inventory based on changes
//         if (invoice && oldProductDetails) {
//             await updateInventoryForEdit(
//                 { productDetails: oldProductDetails },
//                 { productDetails: invoice.productDetails }
//             );
//         }

//         res.json({
//             success: true,
//             statusCode: 200,
//             message: 'Purchase invoice updated successfully',
//             data: invoice
//         });

//     } catch (error) {
//         console.error('Update Purchase Invoice Error:', error);

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
// // DELETE Purchase INVOICE
// // =============================
// const deletePurchaseInvoice = async (req, res) => {
//     try {
//         const invoice = await PurchaseInvoice.findById(req.params.id);

//         if (!invoice) {
//             return res.json({
//                 success: false,
//                 statusCode: 404,
//                 message: 'Purchase invoice not found'
//             });
//         }

//         // ✅ Remove from inventory before deleting invoice
//         if (invoice.productDetails && invoice.productDetails.length > 0) {
//             await updateInventoryForPurchase(invoice.productDetails, 'remove');
//         }

//         await invoice.deleteOne();

//          console.log('done');

//         res.json({
//             success: true,
//             statusCode: 200,
//             message: 'Purchase invoice deleted successfully'
//         });

//     } catch (error) {
//         console.error('Delete Purchase Invoice Error:', error);

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
// // DELETE ALL Purchase INVOICES
// // =============================
// const deleteAllPurchaseInvoices = async (req, res) => {
//     try {

//         await PurchaseInvoice.deleteMany({});
        
//         // Note: This will NOT update inventory
//         // You might want to clear inventory separately or add logic here
        
//         res.json({
//             success: true,
//             statusCode: 200,
//             message: 'All Purchase invoices deleted successfully'
//         });

//     } catch (error) {
//         console.error('Delete All Purchase Invoices Error:', error);

//         res.json({
//             success: false,
//             statusCode: 500,
//             message: 'Internal server error'
//         });
//     }
// };

// module.exports = {
//     generateFiveDigitRandomNumber,
//     createPurchaseInvoice,
//     getAllPurchaseInvoices,
//     getPurchaseInvoiceById,
//     updatePurchaseInvoice,
//     deletePurchaseInvoice,
//     deleteAllPurchaseInvoices
// };








// controllers/purchaseInvoice.controller.js

const PurchaseInvoice = require('../models/purchaseInvoice.model');
const InventoryStock = require('../models/inventoryStock.model');

// =============================
// GENERATE RANDOM INVOICE NUMBER
// =============================
const generateFiveDigitRandomNumber = async (req, res,next) => {
  try {
    // 10000 se 99999 ke beech random number
    const randomNumber = Math.floor(10000 + Math.random() * 90000);

    // ✅ clone body
    const newBody = { ...req.body };

    // ❌ remove old _id
    delete newBody._id;

    // ❌ remove subdocument _id also
    if (Array.isArray(newBody.productDetails)) {
      newBody.productDetails = newBody.productDetails.map(item => {
        const newItem = { ...item };
        delete newItem._id;
        return newItem;
      });
    }

    // ✅ assign new invoice number
    newBody.invoiceNumber = randomNumber;

    // ✅ assign back to req.body
    req.body = newBody;

    next();

  } catch (error) {
    return res.json({
      success: false,
      message: error.message
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
// CALCULATE NEW BUY AVERAGE PRICE
// =============================
const calculateNewBuyAverage = (oldAvgPrice, oldQuantity, newPrice, newQuantity) => {
  const totalOldValue = oldAvgPrice * oldQuantity;
  const totalNewValue = newPrice * newQuantity;
  const totalQuantity = oldQuantity + newQuantity;
  
  return totalQuantity > 0 ? (totalOldValue + totalNewValue) / totalQuantity : newPrice;
};

// =============================
// RECALCULATE BUY AVERAGE PRICE
// =============================
const recalculateBuyAveragePrice = async (inventoryId) => {
  try {
    // Find all purchase invoices containing this product
    const purchaseInvoices = await PurchaseInvoice.find({
      'productDetails.inventoryId': inventoryId
    }).select('productDetails');
    
    let totalQuantity = 0;
    let totalValue = 0;
    
    for (const invoice of purchaseInvoices) {
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
      inventory.buyAveragePrice = totalQuantity > 0 ? totalValue / totalQuantity : 0;
      await inventory.save();
    }
  } catch (error) {
    console.error('Error recalculating average price:', error);
  }
};

// =============================
// UPDATE INVENTORY STOCK (Helper Function)
// =============================
const updateInventoryForPurchase = async (productDetails, type = 'add') => {
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

      // ✅ FIX: Calculate tax amount correctly from percentage
      const taxPercent = (item.cgst || 0) + (item.sgst || 0) + (item.igst || 0);
      const taxAmount = (item.pricePerUnit * taxPercent) / 100;
      const priceWithTax = item.pricePerUnit + taxAmount;

      console.log(`Purchase - Product: ${item.productName}, Price: ${item.pricePerUnit}, Tax%: ${taxPercent}%, Tax: ${taxAmount.toFixed(2)}, Total: ${priceWithTax.toFixed(2)}`);

      if (inventory) {
        if (type === 'add') {
          // Store old values for average calculation
          const oldQuantity = inventory.currentStock;
          const oldAvgPrice = inventory.buyAveragePrice || 0;
          
          // Update stock
          inventory.stockIn += item.quantity;
          inventory.currentStock += item.quantity;
          
          // Calculate new average price
          if (oldQuantity > 0) {
            inventory.buyAveragePrice = calculateNewBuyAverage(
              oldAvgPrice, 
              oldQuantity, 
              priceWithTax, 
              item.quantity
            );
          } else {
            inventory.buyAveragePrice = priceWithTax;
          }
          
        } else if (type === 'remove') {
          // When removing, only reduce stock, don't change average
          inventory.stockIn -= item.quantity;
          inventory.currentStock -= item.quantity;
          
          // If stock becomes zero, reset average to 0
          if (inventory.currentStock <= 0) {
            inventory.buyAveragePrice = 0;
          } else {
            // Recalculate average based on remaining stock
            await recalculateBuyAveragePrice(inventory._id);
          }
        }
        
        await inventory.save();
        
      } else if (type === 'add') {
        // Create new inventory with buy average price
        await InventoryStock.create({
          productName: item.productName,
          productUnit: item.unit,
          category: item.category || 'Uncategorized',
          type: item.type || 'General',
          stockIn: item.quantity,
          stockOut: 0,
          currentStock: item.quantity,
          buyAveragePrice: priceWithTax,
          sellAveragePrice: 0
        });
      }
    } catch (error) {
      console.error(`Error updating inventory for product ${item.productName}:`, error);
      throw error;
    }
  }
};

// =============================
// UPDATE INVENTORY FOR EDITED INVOICE
// =============================
const updateInventoryForEdit = async (oldInvoice, newInvoice) => {
  const oldProducts = oldInvoice.productDetails;
  const newProducts = newInvoice.productDetails;

  // Create maps for easy comparison
  const oldProductMap = new Map();
  oldProducts.forEach(item => {
    const key = item.inventoryId || `${item.productName}-${item.unit}`;
    oldProductMap.set(key, { ...item });
  });

  const newProductMap = new Map();
  newProducts.forEach(item => {
    const key = item.inventoryId || `${item.productName}-${item.unit}`;
    newProductMap.set(key, { ...item });
  });

  // Process removed products
  for (const [key, oldItem] of oldProductMap) {
    if (!newProductMap.has(key)) {
      // Product removed - decrease inventory
      const inventory = await InventoryStock.findOne(
        oldItem.inventoryId 
          ? { _id: oldItem.inventoryId }
          : { productName: oldItem.productName, productUnit: oldItem.unit }
      );
      
      if (inventory) {
        inventory.stockIn -= oldItem.quantity;
        inventory.currentStock -= oldItem.quantity;
        
        // Recalculate average if needed
        if (inventory.currentStock <= 0) {
          inventory.buyAveragePrice = 0;
        } else {
          await recalculateBuyAveragePrice(inventory._id);
        }
        
        await inventory.save();
      }
    }
  }

  // Process added and updated products
  for (const [key, newItem] of newProductMap) {
    const oldItem = oldProductMap.get(key);
    
    if (!oldItem) {
      // New product added
      await updateInventoryForPurchase([newItem], 'add');
      
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
        // First remove old stock effect
        inventory.stockIn -= oldItem.quantity;
        inventory.currentStock -= oldItem.quantity;
        
        // Then add new stock
        inventory.stockIn += newItem.quantity;
        inventory.currentStock += newItem.quantity;
        
        // Recalculate average price based on all purchases
        await recalculateBuyAveragePrice(inventory._id);
        
        await inventory.save();
      }
    }
  }
};

// =============================
// CREATE Purchase INVOICE
// =============================
const createPurchaseInvoice = async (req, res) => {
    try {
        const invoiceData = {
        ...req.body
        };

        console.log(invoiceData,'===========invoiceData========');

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

        const invoice = await PurchaseInvoice.create(invoiceData);

        // ✅ Update inventory for new purchase
        if (invoice.productDetails && invoice.productDetails.length > 0) {
            await updateInventoryForPurchase(invoice.productDetails, 'add');
        }

        console.log('=======Purchase invoice saved========');

        res.json({
            success: true,
            statusCode: 201,
            message: 'Purchase invoice created successfully',
            data: invoice
        });

    } catch (error) {
        console.error('Create Purchase Invoice Error:', error);

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
// GET ALL Purchase INVOICES
// =============================
const getAllPurchaseInvoices = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};

        if (req.query.status) {
            filter.status = req.query.status;
        }

        if (req.query.supplier) {
            filter.supplierName = { $regex: req.query.supplier, $options: 'i' };
        }

        if (req.query.search) {
            filter.$or = [
                { invoiceNumber: { $regex: req.query.search, $options: 'i' } },
                { supplierName: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const invoices = await PurchaseInvoice.find(filter)
            .populate('createdBy', 'name email')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await PurchaseInvoice.countDocuments(filter);

        res.json({
            success: true,
            statusCode: 200,
            count: invoices.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: invoices
        });

    } catch (error) {
        console.error('Get All Purchase Invoices Error:', error);

        res.json({
            success: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

// =============================
// GET SINGLE Purchase INVOICE
// =============================
const getPurchaseInvoiceById = async (req, res) => {
    try {
        
        const invoice = await PurchaseInvoice.findById(req.params.id)

        if (!invoice) {
            return res.json({
                success: false,
                statusCode: 404,
                message: 'Purchase invoice not found'
            });
        }

        res.json({
            success: true,
            statusCode: 200,
            data: invoice
        });

    } catch (error) {
        console.error('Get Purchase Invoice By ID Error:', error);

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
// UPDATE Purchase INVOICE
// =============================
const updatePurchaseInvoice = async (req, res) => {
    try {
        let invoice = await PurchaseInvoice.findById(req.params.id);

        if (!invoice) {
            return res.json({
                success: false,
                statusCode: 404,
                message: 'Purchase invoice not found'
            });
        }

        // Store old product details before update
        const oldProductDetails = invoice.productDetails;

        invoice = await PurchaseInvoice.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        // ✅ Update inventory based on changes
        if (invoice && oldProductDetails) {
            await updateInventoryForEdit(
                { productDetails: oldProductDetails },
                { productDetails: invoice.productDetails }
            );
        }

        res.json({
            success: true,
            statusCode: 200,
            message: 'Purchase invoice updated successfully',
            data: invoice
        });

    } catch (error) {
        console.error('Update Purchase Invoice Error:', error);

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

        res.json({
            success: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

// =============================
// DELETE Purchase INVOICE
// =============================
const deletePurchaseInvoice = async (req, res) => {
    try {
        const invoice = await PurchaseInvoice.findById(req.params.id);

        if (!invoice) {
            return res.json({
                success: false,
                statusCode: 404,
                message: 'Purchase invoice not found'
            });
        }

        // ✅ Remove from inventory before deleting invoice
        if (invoice.productDetails && invoice.productDetails.length > 0) {
            await updateInventoryForPurchase(invoice.productDetails, 'remove');
        }

        await invoice.deleteOne();

        console.log('Purchase invoice deleted successfully');

        res.json({
            success: true,
            statusCode: 200,
            message: 'Purchase invoice deleted successfully'
        });

    } catch (error) {
        console.error('Delete Purchase Invoice Error:', error);

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
// DELETE ALL Purchase INVOICES
// =============================
const deleteAllPurchaseInvoices = async (req, res) => {
    try {

        await PurchaseInvoice.deleteMany({});
        
        res.json({
            success: true,
            statusCode: 200,
            message: 'All Purchase invoices deleted successfully'
        });

    } catch (error) {
        console.error('Delete All Purchase Invoices Error:', error);

        res.json({
            success: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

// =============================
// GET PURCHASE REPORT BY DATE RANGE
// =============================
const getPurchaseReport = async (req, res) => {
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

    const purchases = await PurchaseInvoice.find({
      invoiceDate: { $gte: startDate, $lte: endDate }
    })
    .sort({ invoiceDate: -1 });

    const totalPurchases = purchases.length;
    const totalAmount = purchases.reduce((sum, purchase) => sum + (purchase.grandTotal || 0), 0);
    const totalItems = purchases.reduce((sum, purchase) => {
      const items = purchase.productDetails?.reduce((itemSum, p) => itemSum + p.quantity, 0) || 0;
      return sum + items;
    }, 0);
    const averagePurchase = totalPurchases > 0 ? totalAmount / totalPurchases : 0;

    res.json({
      success: true,
      statusCode: 200,
      message: 'Purchase report fetched successfully',
      data: {
        purchases,
        summary: {
          totalPurchases,
          totalAmount,
          totalItems,
          averagePurchase: Math.round(averagePurchase)
        },
        dateRange: {
          from: fromDate,
          to: toDate
        }
      }
    });

  } catch (error) {
    console.error('Get Purchase Report Error:', error);
    
    res.json({
      success: false,
      statusCode: 500,
      message: 'Internal server error'
    });
  }
};

module.exports = {
    generateFiveDigitRandomNumber,
    createPurchaseInvoice,
    getAllPurchaseInvoices,
    getPurchaseInvoiceById,
    updatePurchaseInvoice,
    deletePurchaseInvoice,
    deleteAllPurchaseInvoices,
    getPurchaseReport
};



