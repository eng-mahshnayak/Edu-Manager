const { faker } = require("@faker-js/faker");
const DailyCash = require("../models/dailyCash.model");
const Party = require("../models/parties.mode");
const User = require("../models/user.model");






// Main seed function
const seedUsers = async (totalUsers = 20) => {
  console.log(`🚀 Seeding ${totalUsers} users...\n`);

  // Generate phone number
const generatePhone = () => faker.string.numeric(10);

// Generate single user
const generateUser = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  
  return {
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    password: 'password123', // Fixed password for all users (easy testing)
    phoneNumber: generatePhone(),
    role: faker.helpers.arrayElement(['admin', 'deliveryboy', 'sellman']),
    isActive: faker.datatype.boolean(0.9), // 90% active
    resetPasswordOTP: null,
    resetPasswordExpires: null
  };
};
  
  try {
    const records = [];
    
    // Generate random users
    for (let i = 0; i < totalUsers; i++) {
      records.push(generateUser());
    }

    // Add test users (always include these)
    const testUsers = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        phoneNumber: '1111111111',
        role: 'admin',
        isActive: true
      },
      {
        name: 'Sellman User',
        email: 'sellman@example.com',
        password: 'sellman123',
        phoneNumber: '2222222222',
        role: 'sellman',
        isActive: true
      },
      {
        name: 'Delivery Boy',
        email: 'delivery@example.com',
        password: 'delivery123',
        phoneNumber: '3333333333',
        role: 'deliveryboy',
        isActive: true
      }
    ];

    records.push(...testUsers);

    // Check for existing emails
    const allEmails = records.map(r => r.email);
    const existingUsers = await User.find({ email: { $in: allEmails } }).select('email');
    const existingEmails = new Set(existingUsers.map(u => u.email));
    
    // Filter out existing users
    const newRecords = records.filter(r => !existingEmails.has(r.email));
    
    console.log(`📊 Total records: ${records.length}`);
    console.log(`📊 Duplicates skipped: ${records.length - newRecords.length}`);
    
    if (newRecords.length === 0) {
      console.log('⚠️ No new users to insert (all emails already exist)');
      return;
    }

    // Insert new users
    const inserted = await User.insertMany(newRecords, { 
      runValidators: true 
    });

    console.log(`✅ Successfully inserted ${inserted.length} users`);

    // Show sample
    console.log('\n📝 Sample User:');
    console.log({
      name: newRecords[0].name,
      email: newRecords[0].email,
      password: newRecords[0].password,
      role: newRecords[0].role,
      phone: newRecords[0].phoneNumber,
      isActive: newRecords[0].isActive
    });

    // Statistics
    const stats = {
      total: inserted.length,
      admin: inserted.filter(u => u.role === 'admin').length,
      sellman: inserted.filter(u => u.role === 'sellman').length,
      deliveryboy: inserted.filter(u => u.role === 'deliveryboy').length,
      active: inserted.filter(u => u.isActive).length,
      inactive: inserted.filter(u => !u.isActive).length
    };
    
    console.log('\n📊 User Statistics:');
    console.table(stats);
    
    console.log('\n🔑 Test Credentials:');
    console.log('Admin    - admin@example.com / admin123');
    console.log('Sellman  - sellman@example.com / sellman123');
    console.log('Delivery - delivery@example.com / delivery123');

  } catch (error) {
    console.error('❌ Error seeding users:', error);
    
    if (error.code === 11000) {
      console.log('⚠️ Duplicate email error. Some users already exist.');
    }
    
    if (error.name === 'ValidationError') {
      console.log('⚠️ Validation Error:', error.message);
    }
  }
};


// seedUsers(10000); // Change number as needed

// ---------------- SEED FUNCTION ----------------
const seedPartyData = async () => {

    try {


// ---------------- GST Generator ----------------
function generateGST() {

    const stateCode = "23";

    const pan = faker.string.alphanumeric(10).toUpperCase();

    const entity = faker.number.int({ min: 1, max: 9 });

    const alphabet = faker.string.alpha({ length: 1 }).toUpperCase();

    const checksum = faker.string.alphanumeric(1).toUpperCase();

    return `${stateCode}${pan}${entity}${alphabet}${checksum}`;
}


// ---------------- IFSC Generator ----------------
function generateIFSC() {

    const bank = faker.string.alpha({ length: 4 }).toUpperCase();

    const number = faker.string.numeric(6);

    return `${bank}0${number}`;
}


// ---------------- Phone Generator ----------------
function generatePhone() {

    return faker.string.numeric(10);
}


// ---------------- Bank Details Generator ----------------
function generateBankDetails(companyName) {

    const accountNumber = faker.string.numeric({
        length: { min: 10, max: 16 }
    });

    return {

        accountHolderName: companyName,

        bankName: faker.company.name(),

        accountNumber: String(accountNumber),

        // confirmAccountNumber: String(accountNumber), // must be same string

        ifscCode: generateIFSC(),

        branchName: faker.location.city(),

        accountType: "current",

        upiId: faker.internet.userName().toLowerCase() + "@upi",

        isPrimary: true
    };
}


// ---------------- Address Generator ----------------
function generateAddress() {

    return {

        attention: faker.person.fullName(),

        addressLine1: faker.location.streetAddress(),

        addressLine2: faker.location.secondaryAddress(),

        city: faker.location.city(),

        state: "Madhya Pradesh",

        stateCode: 23,

        country: "India",

        zipCode: faker.string.numeric(6),

        landmark: faker.location.street()
    };
}


// ---------------- Party Generator ----------------
function generateParty() {

    const companyName = faker.company.name();

    return {

        partyType: "customer",

        customerType: faker.helpers.arrayElement([
            "regular",
            "wholesale",
            "retail",
            "vip"
        ]),

        companyName: companyName + faker.number.int(10000), // avoid duplicate unique error

        companyGST: generateGST(),

        displayName: companyName,

        email: faker.internet.email(),

        phone: generatePhone(),

        alternatePhone: generatePhone(),

        billingAddress: generateAddress(),

        shippingAddress: {
            sameAsBilling: true
        },

        bankDetails: generateBankDetails(companyName),

        status: "active",

        notes: faker.lorem.sentence()
    };
}


        const TOTAL = 10000;

        const records = [];

        for (let i = 0; i < TOTAL; i++) {

            records.push(generateParty());

        }

        console.log("Sample Record:");
        console.log(records[0]);


        await Party.insertMany(records, {

            // ordered: false,

            runValidators: true // 🔥 VERY IMPORTANT FIX

        });


        console.log(`🎉 ${TOTAL} Customers Inserted Successfully`);

    }
    catch (error) {

        console.error("❌ Insert Error:");
        console.error(error.message);
    }

};


// Run
// seedPartyData();


// ==========================================
// ===============daily Cash entry===============
// =========================================


// Insert faker data
const seedDataCashNote = async () => {
    try {

       
       // Generate random cash object
const generateCash = () => {
         return {
                note500: faker.number.int({ min: 0, max: 50 }),
                note200: faker.number.int({ min: 0, max: 50 }),
                note100: faker.number.int({ min: 0, max: 50 }),
                note50: faker.number.int({ min: 0, max: 50 }),
                note20: faker.number.int({ min: 0, max: 50 }),
                note10: faker.number.int({ min: 0, max: 50 }),
                coins: faker.number.int({ min: 0, max: 200 }),
                online: faker.number.int({ min: 0, max: 50000 }),
            };
        };


        // Generate single DailyCash document
        const generateDailyCash = () => {
            return {
                date: faker.date.recent({ days: 30 }),
                openingCash: generateCash(),
                totalSales: faker.number.int({ min: 1000, max: 100000 }),
            };
        };

        // generate 50 records
        const records = [];

        for (let i = 0; i < 10000; i++) {
            records.push(generateDailyCash());
        }

        console.log(records[90]);
        
        await DailyCash.insertMany(records);

        console.log("50 Faker records inserted successfully 🎉");

        // process.exit();

    } catch (error) {
        console.error(error);
        // process.exit(1);
    }
};

// seedDataCashNote();


