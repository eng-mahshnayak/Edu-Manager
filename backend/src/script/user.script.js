
const User = require('../models/user.model');

const seedAdmin = async () => {
    try {
       
        // Check if admin exists
        const adminExists = await User.findOne({ role: "admin" });

        if (adminExists) {
            console.log("⚠️ Admin already exists");
            // process.exit();

            return
        }

        // Create admin
        const admin = await User.create({
            name: "Super Admin",
            email: "admin@example.com",
            password: "admin@199797", // production me hash use karein
            phoneNumber: "9999999999",
            role: "admin",
            isActive: true
        });

        console.log("🎉 Admin created successfully");
        console.log(admin);

        // process.exit();

    } catch (error) {
        console.error("❌ Error seeding admin:", error.message);
        // process.exit(1);
    }
};

seedAdmin();