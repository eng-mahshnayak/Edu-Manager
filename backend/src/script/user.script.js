
const User = require('../models/user.model');
const Basicknowledge = require('../models/basicknowledge.model');

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
            username: "MA123",
            password: "Admin@1234", // production me hash use karein
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

// seedAdmin();



const animalImages = {
  Lion: "https://images.unsplash.com/photo-1546182990-dffeafbe841d",
  Elephant: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46",
  Giraffe: "https://images.unsplash.com/photo-1547721064-da6cfb341d50",
  Zebra: "https://images.unsplash.com/photo-1504457047772-27faf1c00561",
  Tiger: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5",
  Kangaroo: "https://images.unsplash.com/photo-1552728089-57bdde30beb3",
  Panda: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7",
  Penguin: "https://images.unsplash.com/photo-1551986782-d0169b3f8fa7",
  Dolphin: "https://images.unsplash.com/photo-1607153333879-c174d265f1d2",
  Bear: "https://images.unsplash.com/photo-1529958030586-3aae4ca485ff",
  Wolf: "https://images.unsplash.com/photo-1546182990-dffeafbe841d",
  Fox: "https://images.unsplash.com/photo-1474511320723-9a56873867b5",
  Rabbit: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308",
  Owl: "https://images.unsplash.com/photo-1553267751-1c148a7280a1",
  Monkey: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9",
  Hippopotamus: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44",
  Rhinoceros: "https://images.unsplash.com/photo-1535338454770-8be927b5a00b",
  Cheetah: "https://images.unsplash.com/photo-1549366021-9f761d450615",
  Crocodile: "https://images.unsplash.com/photo-1568402102990-bc541580b59f",
  Gorilla: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44",
};

async function updateImages() {
  try {
    const data = await Basicknowledge.find({
      category: "animals",
    });

    console.log(`Found ${data.length} animals`);

    for (const animal of data) {
      const imageURL = animalImages[animal.name];

      if (!imageURL) {
        console.log(`⚠️ Image not found for: ${animal.name}`);
        continue;
      }

      await Basicknowledge.updateOne(
        {
          _id: animal._id,
          category: "animals",
          name: animal.name,
        },
        {
          $set: {
            imageURL: imageURL,
          },
        }
      );

      console.log(`✅ ${animal.name} → image updated`);
    }

    console.log("\n🎉 All animal images updated successfully!");

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// updateImages();