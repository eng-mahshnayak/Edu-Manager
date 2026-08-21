// controllers/basicKnowledge.controller.js
const axios = require("axios");
const BasicKnowledge = require('../models/basicknowledge.model');

// Generic function to get or generate items
const getOrGenerate = (category, promptKey, label) => async (req, res) => {
  try {
    // 1. Check DB
    let items = await BasicKnowledge.find({ category });
    if (items.length > 0) {

         console.log(category,'==========category=========');

      return res.json({ [category]: items.map((item, idx) => ({ id: idx + 1, name: item.name,imageURL:item.imageURL })) });
    }

    // 2. Generate via Gemini

    // const response = await axios.post(
    //   `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    //   {
    //     contents: [{
    //       role: "user",
    //       parts: [{
    //         text: `Give me 20 ${label} names. Return ONLY valid JSON: { "${category}": [{"id":1,"name":"..."}] }`
    //       }]
    //     }],
    //     generationConfig: { responseMimeType: "application/json" }
    //   }
    // );

    const response = await axios.post(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Give me 20 ${label} names.

Return ONLY valid JSON in this format:

{
  "${category}": [
    {
      "id": 1,
      "name": "..."
    }
  ]
}

Rules:
- Give exactly 20 ${label} names
- Every item must be different
- Use common English names
- Do not add markdown
- Do not add explanation
- Return ONLY valid JSON`,
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
    },
  }
);
    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty response");
    const parsed = JSON.parse(text);
    const names = parsed[category]?.map(item => item.name) || [];

    // 3. Store in DB
    const docs = names.map(name => ({ name, category }));
    await BasicKnowledge.insertMany(docs);



    console.log(category,'==========category=========');
    

    // 4. Return same format
    res.json({ [category]: names.map((name, i) => ({ id: i + 1, name })) });
  } catch (err) {

    console.log(err.response.data,'==========err=========');

    res.status(500).json({ error: err.message });
  }
};

// Export each route
exports.getFruits = getOrGenerate('fruits', 'fruits', 'fruit');
exports.getAnimals = getOrGenerate('animals', 'animals', 'animal');
exports.getFlowers = getOrGenerate('flowers', 'flowers', 'flower');
exports.getVegetables = getOrGenerate('vegetables', 'vegetables', 'vegetable');
exports.getTrees = getOrGenerate('trees', 'trees', 'tree');
exports.getPlants = getOrGenerate('plants', 'plants', 'plant');
exports.getBirds = getOrGenerate('birds', 'birds', 'bird');



// ---------- New Categories ----------
exports.getCountries   = getOrGenerate('countries', 'countries', 'country');
exports.getIndianStates = getOrGenerate('states', 'states', 'state of India');
exports.getFamousPlaces = getOrGenerate('places', 'places', 'famous place in India');
exports.getCitiesMP    = getOrGenerate('cities', 'citiesMP', 'city of Madhya Pradesh');
exports.getMonuments = getOrGenerate('monuments', 'monuments', 'monument');
exports.getMountains = getOrGenerate('mountains', 'mountains', 'mountain');
exports.getRivers    = getOrGenerate('rivers', 'rivers', 'river');
exports.getOceans    = getOrGenerate('oceans', 'oceans', 'ocean');
exports.getIslands   = getOrGenerate('islands', 'islands', 'island');
exports.getVolcanoes = getOrGenerate('volcanoes', 'volcanoes', 'volcano');

// ---------- New Categories ----------
exports.getThings    = getOrGenerate('things', 'things', 'thing');
exports.getTransport = getOrGenerate('transport', 'transport', 'mode of transport');
exports.getPeople    = getOrGenerate('people', 'people', 'person');
exports.getRelations = getOrGenerate('relations', 'relations', 'family relation');




async function updateImageUrl() {
  try {
    const fruits = await BasicKnowledge.find({
      category: "fruits",
    });

    console.log("Total fruits:", fruits.length);

    const imageMap = {
      Apple: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6",
      Banana: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e",
      Orange: "https://images.unsplash.com/photo-1547514701-42782101795e",
      Grape: "https://images.unsplash.com/photo-1537640538966-79f369143f8f",
      Mango: "https://images.unsplash.com/photo-1553279768-865429fa0078",
      Strawberry: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6",
      Blueberry: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e",
      Raspberry: "https://images.unsplash.com/photo-1577069861033-55d04cec4a5d",
      Pineapple: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba",
      Watermelon: "https://images.unsplash.com/photo-1563114773-84221bd62daa",
      Kiwi: "https://images.unsplash.com/photo-1585059895524-72359e06133a",
      Peach: "https://images.unsplash.com/photo-1629828874514-9e9c5c3b8c4c",
      Pear: "https://images.unsplash.com/photo-1514756331096-242fdeb70d4a",
      Cherry: "https://images.unsplash.com/photo-1528825871115-3581a5387919",
      Plum: "https://images.unsplash.com/photo-1593436572190-9f8a3f9c1d4a",
      Lemon: "https://images.unsplash.com/photo-1590502593747-42a996133562",
      Lime: "https://images.unsplash.com/photo-1587334206596-c0f9f7dccbe6",
      Avocado: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578",
      Pomegranate: "https://images.unsplash.com/photo-1541344999736-83eca272f6fc",
      Fig: "https://images.unsplash.com/photo-1601379760883-1bb497c558c1",
    };

    for (const fruit of fruits) {
      const imageURL = imageMap[fruit.name];

      if (!imageURL) {
        console.log(`❌ Image not found for: ${fruit.name}`);
        continue;
      }

      await BasicKnowledge.updateOne(
        { _id: fruit._id },
        {
          $set: {
            imageURL: imageURL,
          },
        }
      );

      console.log(`✅ Updated: ${fruit.name}`);
    }

    console.log("🎉 All image URLs updated");

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// updateImageUrl();







// const axios = require("axios");
// const BasicKnowledge = require('../models/basicknowledge.model');

// const { GoogleGenerativeAI } = require("@google/generative-ai");


// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



// const getFruits = async (req, res) => {
//   try {
//     console.log("=================================");
//     console.log("🚀 CHECKPOINT 1: Function started");
//     console.log("⏰ Time:", new Date().toISOString());

//     console.log("🔑 CHECKPOINT 2: API Key exists:", !!process.env.GEMINI_API_KEY);

//     console.log("📡 CHECKPOINT 3: Sending request to Gemini...");

//     const startTime = Date.now();

//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             role: "user",
//             parts: [
//               {
//                 text: `
// Give me 20 fruit names.

// Return ONLY valid JSON in this format:

// {
//   "fruits": [
//     {
//       "id": 1,
//       "name": "Apple"
//     },
//     {
//       "id": 2,
//       "name": "Banana"
//     }
//   ]
// }

// Do not add markdown.
// Do not add any explanation.
// `,
//               },
//             ],
//           },
//         ],
//         generationConfig: {
//           responseMimeType: "application/json",
//         },
//       }
//     );

//     const geminiTime = Date.now() - startTime;

//     console.log("✅ CHECKPOINT 4: Gemini response received");
//     console.log("⏱️ Gemini response time:", geminiTime, "ms");

//     console.log(
//       "📦 CHECKPOINT 5: Response received:",
//       !!response.data
//     );

//     const text =
//       response.data.candidates?.[0]?.content?.parts?.[0]?.text;

//     console.log("📝 CHECKPOINT 6: Text received:", !!text);

//     if (!text) {
//       console.log("❌ CHECKPOINT 7: Gemini returned empty text");

//       return res.status(500).json({
//         error: "Gemini returned empty response",
//       });
//     }

//     console.log("📏 Response length:", text.length);

//     console.log("🔄 CHECKPOINT 8: Parsing JSON...");

//     const parseStart = Date.now();

//     const fruits = JSON.parse(text);

//     console.log(
//       "✅ CHECKPOINT 9: JSON parsed successfully"
//     );

//     console.log(
//       "⏱️ JSON parse time:",
//       Date.now() - parseStart,
//       "ms"
//     );

//     console.log(
//       "🍎 Number of fruits:",
//       fruits?.fruits?.length
//     );

//     console.log("📤 CHECKPOINT 10: Sending response to client");

//     res.json(fruits);

//     console.log("✅ CHECKPOINT 11: Response sent");
//     console.log("=================================");

//   } catch (err) {

//     console.error("❌ ERROR OCCURRED");

//     console.error(
//       "Gemini Error:",
//       err.response?.data || err.message
//     );

//     res.status(500).json({
//       error: err.message,
//     });
//   }
// };

// const getAnimals = async (req, res) => {
//   try {
//     console.log("=================================");
//     console.log("🚀 CHECKPOINT 1: Function started");
//     console.log("⏰ Time:", new Date().toISOString());

//     console.log(
//       "🔑 CHECKPOINT 2: API Key exists:",
//       !!process.env.GEMINI_API_KEY
//     );

//     console.log("📡 CHECKPOINT 3: Sending request to Gemini...");

//     const startTime = Date.now();

//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             role: "user",
//             parts: [
//               {
//                 text: `
// Give me 20 animal names.

// Return ONLY valid JSON in this format:

// {
//   "animals": [
//     {
//       "id": 1,
//       "name": "Lion"
//     },
//     {
//       "id": 2,
//       "name": "Tiger"
//     }
//   ]
// }

// Rules:
// - Give exactly 20 animals.
// - Every animal must be different.
// - Use common English animal names.
// - Do not add duplicate animals.
// - Do not add markdown.
// - Do not add any explanation.
// - Return ONLY valid JSON.
// `,
//               },
//             ],
//           },
//         ],
//         generationConfig: {
//           responseMimeType: "application/json",
//         },
//       }
//     );

//     const geminiTime = Date.now() - startTime;

//     console.log("✅ CHECKPOINT 4: Gemini response received");
//     console.log("⏱️ Gemini response time:", geminiTime, "ms");

//     console.log(
//       "📦 CHECKPOINT 5: Response received:",
//       !!response.data
//     );

//     const text =
//       response.data.candidates?.[0]?.content?.parts?.[0]?.text;

//     console.log("📝 CHECKPOINT 6: Text received:", !!text);

//     if (!text) {
//       console.log(
//         "❌ CHECKPOINT 7: Gemini returned empty text"
//       );

//       return res.status(500).json({
//         error: "Gemini returned empty response",
//       });
//     }

//     console.log("📏 Response length:", text.length);

//     console.log("🔄 CHECKPOINT 8: Parsing JSON...");

//     const parseStart = Date.now();

//     const animals = JSON.parse(text);

//     console.log(
//       "✅ CHECKPOINT 9: JSON parsed successfully"
//     );

//     console.log(
//       "⏱️ JSON parse time:",
//       Date.now() - parseStart,
//       "ms"
//     );

//     console.log(
//       "🐶 Number of animals:",
//       animals?.animals?.length
//     );

//     console.log(
//       "📤 CHECKPOINT 10: Sending response to client"
//     );

//     res.json(animals);

//     console.log("✅ CHECKPOINT 11: Response sent");
//     console.log("=================================");

//   } catch (err) {
//     console.error("❌ ERROR OCCURRED");

//     console.error(
//       "Gemini Error:",
//       err.response?.data || err.message
//     );

//     res.status(500).json({
//       error: err.message,
//     });
//   }
// };

// const getFlowers = async (req, res) => {
//   try {
//     console.log("=================================");
//     console.log("🚀 CHECKPOINT 1: Function started");
//     console.log("⏰ Time:", new Date().toISOString());

//     console.log(
//       "🔑 CHECKPOINT 2: API Key exists:",
//       !!process.env.GEMINI_API_KEY
//     );

//     console.log("📡 CHECKPOINT 3: Sending request to Gemini...");

//     const startTime = Date.now();

//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             role: "user",
//             parts: [
//               {
//                 text: `
// Give me 20 flower names.

// Return ONLY valid JSON in this format:

// {
//   "flowers": [
//     {
//       "id": 1,
//       "name": "Rose"
//     },
//     {
//       "id": 2,
//       "name": "Lotus"
//     }
//   ]
// }

// Rules:

// - Give exactly 20 flowers.
// - Every flower must be different.
// - Use common English flower names.
// - Do not add duplicate flowers.
// - Do not add markdown.
// - Do not add any explanation.
// - Return ONLY valid JSON.
// `,
//               },
//             ],
//           },
//         ],
//         generationConfig: {
//           responseMimeType: "application/json",
//         },
//       }
//     );

//     const geminiTime = Date.now() - startTime;

//     console.log("✅ CHECKPOINT 4: Gemini response received");
//     console.log("⏱️ Gemini response time:", geminiTime, "ms");

//     console.log(
//       "📦 CHECKPOINT 5: Response received:",
//       !!response.data
//     );

//     const text =
//       response.data.candidates?.[0]?.content?.parts?.[0]?.text;

//     console.log("📝 CHECKPOINT 6: Text received:", !!text);

//     if (!text) {
//       console.log(
//         "❌ CHECKPOINT 7: Gemini returned empty text"
//       );

//       return res.status(500).json({
//         error: "Gemini returned empty response",
//       });
//     }

//     console.log("📏 Response length:", text.length);

//     console.log("🔄 CHECKPOINT 8: Parsing JSON...");

//     const parseStart = Date.now();

//     const flowers = JSON.parse(text);

//     console.log(
//       "✅ CHECKPOINT 9: JSON parsed successfully"
//     );

//     console.log(
//       "⏱️ JSON parse time:",
//       Date.now() - parseStart,
//       "ms"
//     );

//     console.log(
//       "🌸 Number of flowers:",
//       flowers?.flowers?.length
//     );

//     console.log(
//       "📤 CHECKPOINT 10: Sending response to client"
//     );

//     res.json(flowers);

//     console.log("✅ CHECKPOINT 11: Response sent");
//     console.log("=================================");

//   } catch (err) {
//     console.error("❌ ERROR OCCURRED");

//     console.error(
//       "Gemini Error:",
//       err.response?.data || err.message
//     );

//     res.status(500).json({
//       error: err.message,
//     });
//   }
// };

// const getVegetables = async (req, res) => {
//   try {
//     console.log("=================================");
//     console.log("🚀 CHECKPOINT 1: Function started");
//     console.log("⏰ Time:", new Date().toISOString());

//     console.log(
//       "🔑 CHECKPOINT 2: API Key exists:",
//       !!process.env.GEMINI_API_KEY
//     );

//     console.log("📡 CHECKPOINT 3: Sending request to Gemini...");

//     const startTime = Date.now();

//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             role: "user",
//             parts: [
//               {
//                 text: `
// Give me 20 vegetable names.

// Return ONLY valid JSON in this format:

// {
//   "vegetables": [
//     {
//       "id": 1,
//       "name": "Potato"
//     },
//     {
//       "id": 2,
//       "name": "Tomato"
//     }
//   ]
// }

// Rules:

// - Give exactly 20 vegetables.
// - Every vegetable must be different.
// - Use common English vegetable names.
// - Do not add duplicate vegetables.
// - Do not add markdown.
// - Do not add any explanation.
// - Return ONLY valid JSON.
// `,
//               },
//             ],
//           },
//         ],
//         generationConfig: {
//           responseMimeType: "application/json",
//         },
//       }
//     );

//     const geminiTime = Date.now() - startTime;

//     console.log("✅ CHECKPOINT 4: Gemini response received");
//     console.log("⏱️ Gemini response time:", geminiTime, "ms");

//     console.log(
//       "📦 CHECKPOINT 5: Response received:",
//       !!response.data
//     );

//     const text =
//       response.data.candidates?.[0]?.content?.parts?.[0]?.text;

//     console.log("📝 CHECKPOINT 6: Text received:", !!text);

//     if (!text) {
//       console.log(
//         "❌ CHECKPOINT 7: Gemini returned empty text"
//       );

//       return res.status(500).json({
//         error: "Gemini returned empty response",
//       });
//     }

//     console.log("📏 Response length:", text.length);

//     console.log("🔄 CHECKPOINT 8: Parsing JSON...");

//     const parseStart = Date.now();

//     const vegetables = JSON.parse(text);

//     console.log(
//       "✅ CHECKPOINT 9: JSON parsed successfully"
//     );

//     console.log(
//       "⏱️ JSON parse time:",
//       Date.now() - parseStart,
//       "ms"
//     );

//     console.log(
//       "🥕 Number of vegetables:",
//       vegetables?.vegetables?.length
//     );

//     console.log(
//       "📤 CHECKPOINT 10: Sending response to client"
//     );

//     res.json(vegetables);

//     console.log("✅ CHECKPOINT 11: Response sent");
//     console.log("=================================");

//   } catch (err) {
//     console.error("❌ ERROR OCCURRED");

//     console.error(
//       "Gemini Error:",
//       err.response?.data || err.message
//     );

//     res.status(500).json({
//       error: err.message,
//     });
//   }
// };

// const getTrees = async (req, res) => {
//   try {
//     console.log("=================================");
//     console.log("🚀 CHECKPOINT 1: Function started");
//     console.log("⏰ Time:", new Date().toISOString());

//     console.log(
//       "🔑 CHECKPOINT 2: API Key exists:",
//       !!process.env.GEMINI_API_KEY
//     );

//     console.log("📡 CHECKPOINT 3: Sending request to Gemini...");

//     const startTime = Date.now();

//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             role: "user",
//             parts: [
//               {
//                 text: `
// Give me 20 tree names.

// Return ONLY valid JSON in this format:

// {
//   "trees": [
//     {
//       "id": 1,
//       "name": "Mango Tree"
//     },
//     {
//       "id": 2,
//       "name": "Neem Tree"
//     }
//   ]
// }

// Rules:

// - Give exactly 20 trees.
// - Every tree must be different.
// - Use common English tree names.
// - Do not add duplicate trees.
// - Do not add markdown.
// - Do not add any explanation.
// - Return ONLY valid JSON.
// `,
//               },
//             ],
//           },
//         ],
//         generationConfig: {
//           responseMimeType: "application/json",
//         },
//       }
//     );

//     const geminiTime = Date.now() - startTime;

//     console.log("✅ CHECKPOINT 4: Gemini response received");
//     console.log("⏱️ Gemini response time:", geminiTime, "ms");

//     console.log(
//       "📦 CHECKPOINT 5: Response received:",
//       !!response.data
//     );

//     const text =
//       response.data.candidates?.[0]?.content?.parts?.[0]?.text;

//     console.log("📝 CHECKPOINT 6: Text received:", !!text);

//     if (!text) {
//       console.log(
//         "❌ CHECKPOINT 7: Gemini returned empty text"
//       );

//       return res.status(500).json({
//         error: "Gemini returned empty response",
//       });
//     }

//     console.log("📏 Response length:", text.length);

//     console.log("🔄 CHECKPOINT 8: Parsing JSON...");

//     const parseStart = Date.now();

//     const trees = JSON.parse(text);

//     console.log("✅ CHECKPOINT 9: JSON parsed successfully");

//     console.log(
//       "⏱️ JSON parse time:",
//       Date.now() - parseStart,
//       "ms"
//     );

//     console.log(
//       "🌳 Number of trees:",
//       trees?.trees?.length
//     );

//     console.log("📤 CHECKPOINT 10: Sending response to client");

//     res.json(trees);

//     console.log("✅ CHECKPOINT 11: Response sent");
//     console.log("=================================");

//   } catch (err) {
//     console.error("❌ ERROR OCCURRED");

//     console.error(
//       "Gemini Error:",
//       err.response?.data || err.message
//     );

//     res.status(500).json({
//       error: err.message,
//     });
//   }
// };

// const getBirds = async (req, res) => {
//   try {
//     console.log("=================================");
//     console.log("🚀 CHECKPOINT 1: Function started");
//     console.log("⏰ Time:", new Date().toISOString());

//     console.log(
//       "🔑 CHECKPOINT 2: API Key exists:",
//       !!process.env.GEMINI_API_KEY
//     );

//     console.log("📡 CHECKPOINT 3: Sending request to Gemini...");

//     const startTime = Date.now();

//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             role: "user",
//             parts: [
//               {
//                 text: `
// Give me 20 bird names.

// Return ONLY valid JSON in this format:

// {
//   "birds": [
//     {
//       "id": 1,
//       "name": "Parrot"
//     },
//     {
//       "id": 2,
//       "name": "Peacock"
//     }
//   ]
// }

// Rules:

// - Give exactly 20 birds.
// - Every bird must be different.
// - Use common English bird names.
// - Do not add duplicate birds.
// - Do not add markdown.
// - Do not add any explanation.
// - Return ONLY valid JSON.
// `,
//               },
//             ],
//           },
//         ],
//         generationConfig: {
//           responseMimeType: "application/json",
//         },
//       }
//     );

//     const geminiTime = Date.now() - startTime;

//     console.log("✅ CHECKPOINT 4: Gemini response received");
//     console.log("⏱️ Gemini response time:", geminiTime, "ms");

//     console.log(
//       "📦 CHECKPOINT 5: Response received:",
//       !!response.data
//     );

//     const text =
//       response.data.candidates?.[0]?.content?.parts?.[0]?.text;

//     console.log("📝 CHECKPOINT 6: Text received:", !!text);

//     if (!text) {
//       console.log(
//         "❌ CHECKPOINT 7: Gemini returned empty text"
//       );

//       return res.status(500).json({
//         error: "Gemini returned empty response",
//       });
//     }

//     console.log("📏 Response length:", text.length);

//     console.log("🔄 CHECKPOINT 8: Parsing JSON...");

//     const parseStart = Date.now();

//     const birds = JSON.parse(text);

//     console.log(
//       "✅ CHECKPOINT 9: JSON parsed successfully"
//     );

//     console.log(
//       "⏱️ JSON parse time:",
//       Date.now() - parseStart,
//       "ms"
//     );

//     console.log(
//       "🐦 Number of birds:",
//       birds?.birds?.length
//     );

//     console.log(
//       "📤 CHECKPOINT 10: Sending response to client"
//     );

//     res.json(birds);

//     console.log("✅ CHECKPOINT 11: Response sent");
//     console.log("=================================");

//   } catch (err) {
//     console.error("❌ ERROR OCCURRED");

//     console.error(
//       "Gemini Error:",
//       err.response?.data || err.message
//     );

//     res.status(500).json({
//       error: err.message,
//     });
//   }
// };

// const getPlants = async (req, res) => {
//   try {
//     console.log("=================================");
//     console.log("🚀 CHECKPOINT 1: Function started");
//     console.log("⏰ Time:", new Date().toISOString());

//     console.log(
//       "🔑 CHECKPOINT 2: API Key exists:",
//       !!process.env.GEMINI_API_KEY
//     );

//     console.log("📡 CHECKPOINT 3: Sending request to Gemini...");

//     const startTime = Date.now();

//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             role: "user",
//             parts: [
//               {
//                 text: `
// Give me 20 plant names.

// Return ONLY valid JSON in this format:

// {
//   "plants": [
//     {
//       "id": 1,
//       "name": "Aloe Vera"
//     },
//     {
//       "id": 2,
//       "name": "Tulsi"
//     }
//   ]
// }

// Rules:

// - Give exactly 20 plants.
// - Every plant must be different.
// - Use common English plant names.
// - Do not add duplicate plants.
// - Do not add markdown.
// - Do not add any explanation.
// - Return ONLY valid JSON.
// `,
//               },
//             ],
//           },
//         ],
//         generationConfig: {
//           responseMimeType: "application/json",
//         },
//       }
//     );

//     const geminiTime = Date.now() - startTime;

//     console.log("✅ CHECKPOINT 4: Gemini response received");
//     console.log("⏱️ Gemini response time:", geminiTime, "ms");

//     console.log(
//       "📦 CHECKPOINT 5: Response received:",
//       !!response.data
//     );

//     const text =
//       response.data.candidates?.[0]?.content?.parts?.[0]?.text;

//     console.log("📝 CHECKPOINT 6: Text received:", !!text);

//     if (!text) {
//       console.log(
//         "❌ CHECKPOINT 7: Gemini returned empty text"
//       );

//       return res.status(500).json({
//         error: "Gemini returned empty response",
//       });
//     }

//     console.log("📏 Response length:", text.length);

//     console.log("🔄 CHECKPOINT 8: Parsing JSON...");

//     const parseStart = Date.now();

//     const plants = JSON.parse(text);

//     console.log("✅ CHECKPOINT 9: JSON parsed successfully");

//     console.log(
//       "⏱️ JSON parse time:",
//       Date.now() - parseStart,
//       "ms"
//     );

//     console.log(
//       "🌱 Number of plants:",
//       plants?.plants?.length
//     );

//     console.log("📤 CHECKPOINT 10: Sending response to client");

//     res.json(plants);

//     console.log("✅ CHECKPOINT 11: Response sent");
//     console.log("=================================");

//   } catch (err) {
//     console.error("❌ ERROR OCCURRED");

//     console.error(
//       "Gemini Error:",
//       err.response?.data || err.message
//     );

//     res.status(500).json({
//       error: err.message,
//     });
//   }
// };


// module.exports = { 
//   getFruits,
//   getAnimals,
//   getFlowers,
//   getVegetables,
//   getTrees,
//   getPlants,
//   getBirds,
// };
