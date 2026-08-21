const express = require('express');

const axios = require('axios');
const cors = require('cors'); 


// Add this import
const userRoutes = require('./src/routes/user.routes.js')
const problemSolverRoutes = require("./src/routes/problemSolver.routes");
const drawingRoutes = require('./src/routes/drawing.routes.js')
const aiContent = require('./src/routes/aiContent.routes.js')
const aitest = require('./src/routes/aiTest.routes.js')
const common = require('./src/routes/common.routes.js')

require('./src/database/mongodb.connection.js')
require('./src/script/user.script.js')
require('dotenv').config(); // Environment variables ke liye



const app = express();

// CORS Configuration - Add this before other middleware
const corsOptions = {
    origin: "*", 
   
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware
app.use(express.json()); // JSON data parse karne ke liye
app.use(express.urlencoded({ extended: true })); // URL encoded data parse karne ke liye





// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Server is running successfully!' });
});

// API routes yahan define karein
app.use('/api/users', userRoutes);

app.use('/api', common);


app.use("/api/problem-solver", problemSolverRoutes);


app.use('/api/aicontent', aiContent);
app.use("/api/drawing", drawingRoutes);


app.use('/api/description', aitest);


// ===============sketch type image===========================


// app.post('/api/generate-sketch', async (req, res) => {
//   try {
//     const { description } = req.body;

//     if (!description) {
//       return res.status(400).json({ success: false, error: 'Description is required' });
//     }

//     const sketchPrompt = `clean black and white pencil sketch, detailed line art drawing, monochrome, no colors, of ${description.trim()}`;
//     const encodedPrompt = encodeURIComponent(sketchPrompt);

//     // Correct Image Direct Endpoint
//     const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=800&nologo=true&seed=${Math.floor(Math.random() * 100000)}`;

//     // Axios request with Headers to get raw image
//     const response = await axios.get(imageUrl, {
//       responseType: 'arraybuffer',
//       headers: {
//         'Accept': 'image/*',
//       }
//     });

//     // Content-type check (Ensure it's an image)
//     const contentType = response.headers['content-type'] || 'image/jpeg';

//     if (contentType.includes('html')) {
//       throw new Error('API returned HTML page instead of image');
//     }

//     // Convert Image Buffer to Base64
//     const base64Image = Buffer.from(response.data, 'binary').toString('base64');
//     const imageSrc = `data:${contentType};base64,${base64Image}`;

//     return res.json({
//       success: true,
//       imageUrl: imageSrc,
//     });
//   } catch (error) {
//     console.error('Error fetching image:', error.message);
//     return res.status(500).json({
//       success: false,
//       error: 'Failed to generate sketch. Please try again.',
//     });
//   }
// });

// app.use('/api/products', productRoutes);




// Server configuration


// ===============color image===========================

// app.post('/api/generate-sketch', async (req, res) => {
//   try {
//     const { description } = req.body;

//     if (!description) {
//       return res.status(400).json({ success: false, error: 'Description is required' });
//     }

//     // 🎨 Colorful image ke liye prompt update kiya gaya hai
//     const colorPrompt = `vibrant colorful illustration, vivid rich colors, highly detailed, beautiful lighting, digital art of ${description.trim()}`;
//     const encodedPrompt = encodeURIComponent(colorPrompt);

//     // Correct Image Direct Endpoint
//     const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=800&nologo=true&seed=${Math.floor(Math.random() * 100000)}`;

//     // Axios request with Headers to get raw image
//     const response = await axios.get(imageUrl, {
//       responseType: 'arraybuffer',
//       headers: {
//         'Accept': 'image/*',
//       }
//     });

//     // Content-type check (Ensure it's an image)
//     const contentType = response.headers['content-type'] || 'image/jpeg';

//     if (contentType.includes('html')) {
//       throw new Error('API returned HTML page instead of image');
//     }

//     // Convert Image Buffer to Base64
//     const base64Image = Buffer.from(response.data, 'binary').toString('base64');
//     const imageSrc = `data:${contentType};base64,${base64Image}`;

//     return res.json({
//       success: true,
//       imageUrl: imageSrc,
//     });
//   } catch (error) {
//     console.error('Error fetching image:', error.message);
//     return res.status(500).json({
//       success: false,
//       error: 'Failed to generate image. Please try again.',
//     });
//   }
// });




// ===============multiple image===========================

// app.post('/api/generate-sketch', (req, res) => {
//   try {
//     const { description } = req.body;


//     console.log(description);
    

//     if (!description) {
//       return res.status(400).json({ success: false, error: 'Description is required' });
//     }

//     // 🧹 Clean Text: Extra symbols, '+' aur line-breaks (\n) ko saaf karein
//     const cleanDescription = description
//       .replace(/[\r\n+]/g, ' ')
//       .replace(/\s+/g, ' ')
//       .trim()
//       .slice(0, 150);

// const sceneSuffixes = [
//   "Scene 1: A cute dog playing in the garden",
//   "Scene 2: The dog finds a small ball",
//   "Scene 3: The dog chases a butterfly",
//   "Scene 4: The dog returns home happily",
//   "Scene 5: The dog sleeps peacefully with its family"
// ];

//     const imageUrls = sceneSuffixes.map((suffix, index) => {
//       const storyPrompt = `vibrant colorful illustration, vivid rich colors, storybook style, digital art, ${suffix}, featuring ${cleanDescription}`;
//       const encodedPrompt = encodeURIComponent(storyPrompt);
//       const seed = Math.floor(Math.random() * 900000) + (index + 1) * 1234;

//       return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${seed}`;
//     });

//     return res.json({
//       success: true,
//       images: imageUrls,
//     });
//   } catch (error) {
//     console.error('Server error:', error.message);
//     return res.status(500).json({ success: false, error: 'Failed to generate story images.' });
//   }
// });


// app.post('/api/generate-sketch', (req, res) => {
//   try {
//     const { scenes, description } = req.body;


//     console.log(req.body,'==============req.body===================');

//     // Use provided scenes or create default ones
//     let sceneDescriptions = scenes || [
//       "A cute puppy playing in a garden",
//       "The puppy finds a ball",
//       "The puppy chases a butterfly",
//       "The puppy discovers a treasure",
//       "The puppy returns home happily"
//     ];

//     // Ensure we have exactly 5 scenes
//     while (sceneDescriptions.length < 5) {
//       sceneDescriptions.push(`Beautiful scene ${sceneDescriptions.length + 1}`);
//     }

//     // Take first 5 scenes
//     const finalScenes = sceneDescriptions.slice(0, 5);

//     // Generate image for each scene
//     const imageUrls = finalScenes.map((sceneText, index) => {
//       // Clean the scene text
//       const cleanScene = sceneText
//         .replace(/[\r\n+]/g, ' ')
//         .replace(/\s+/g, ' ')
//         .trim()
//         .slice(0, 150);

//       // Create a detailed prompt for each scene
//       const storyPrompt = `beautiful vibrant colorful illustration, children's storybook style, digital art, scene ${index + 1}: ${cleanScene}, vivid colors, cartoon style, detailed background`;
      
//       const encodedPrompt = encodeURIComponent(storyPrompt);
//       const seed = Math.floor(Math.random() * 900000) + (index + 1) * 12345;

//       // Try different image generation URLs
//       return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${seed}`;
//     });

//     return res.json({
//       success: true,
//       images: imageUrls,
//       scenes: finalScenes,
//     });

//   } catch (error) {
//     console.error('Server error:', error.message);
//     return res.status(500).json({ 
//       success: false, 
//       error: 'Failed to generate story images.' 
//     });
//   }
// });



app.post('/api/generate-sketch121', (req, res) => {
  try {
    const { category, scenes } = req.body;

    console.log(req.body, '==============req.body===================');

    // Default scenes for unicorn or custom input
    const topic = category || "cute unicorn";
    let sceneDescriptions = scenes || [
      `${topic} flying among stars`,
      `${topic} standing near a rainbow`,
      `${topic} playing with a butterfly`,
      `${topic} sitting on a cloud`,
      `${topic} with cute flowers`
    ];

    // Ensure at least 5 scenes
    while (sceneDescriptions.length < 5) {
      sceneDescriptions.push(`${topic} scene ${sceneDescriptions.length + 1}`);
    }

    const finalScenes = sceneDescriptions.slice(0, 5);

    // Generate coloring outline with tiny colorful hints/highlights
    const imageUrls = finalScenes.map((sceneText, index) => {
      const cleanScene = sceneText
        .replace(/[\r\n+]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 150);

      // Prompt optimized for kids online coloring layout (bold outlines + minor color accents)
      const kidsColoringPrompt = `cute kids online coloring page style, clean bold black line art, vector illustration, plain white background, uncolored body, simple shapes, cute cartoon character, scene: ${cleanScene}, with tiny subtle vibrant colored accents on small elements like stars or horn`;
      
      const encodedPrompt = encodeURIComponent(kidsColoringPrompt);
      const seed = Math.floor(Math.random() * 900000) + (index + 1) * 789;

      return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${seed}`;
    });

    return res.json({
      success: true,
      images: imageUrls,
      scenes: finalScenes,
    });

  } catch (error) {
    console.error('Server error:', error.message);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to generate kids coloring pages.' 
    });
  }
});


app.post('/api/generate-sketch678', async (req, res) => {
  try {
    const { category, scenes } = req.body;

    console.log(
      req.body,
      '============== req.body ================'
    );

    const topic = category || "cute unicorn";

    let sceneDescriptions = scenes || [
      `${topic} flying among stars`,
      `${topic} standing near a rainbow`,
      `${topic} playing with a butterfly`,
      `${topic} sitting on a cloud`,
      `${topic} with cute flowers`
    ];

    // At least 5 scenes
    while (sceneDescriptions.length < 5) {
      sceneDescriptions.push(
        `${topic} scene ${sceneDescriptions.length + 1}`
      );
    }

    const finalScenes = sceneDescriptions.slice(0, 5);

    const imageUrls = finalScenes.map((sceneText, index) => {

      const cleanScene = sceneText
        .replace(/[\r\n+]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 180);

      const kidsImagePrompt = `
Create a beautiful high-quality children's educational illustration.

Subject:
${cleanScene}

Style:
- colorful 3D cartoon illustration
- cute and friendly character
- bright vibrant colors
- soft lighting
- smooth clean details
- polished professional children's animation style
- adorable expressive face
- colorful environment
- visually attractive for children
- high detail
- clean composition
- centered subject
- premium children's storybook illustration
- no text
- no letters
- no watermark
- no logo
- no scary elements
- no dark background
`;

      const encodedPrompt = encodeURIComponent(
        kidsImagePrompt
      );

      const seed =
        Math.floor(Math.random() * 900000) +
        (index + 1) * 789;

      return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}`;
    });

    return res.json({
      success: true,
      images: imageUrls,
      scenes: finalScenes
    });

  } catch (error) {

    console.error(
      '❌ Server error:',
      error.message
    );

    return res.status(500).json({
      success: false,
      error: 'Failed to generate kids images.'
    });
  }
});



app.post('/api/generate-sketch', async (req, res) => {
  try {
    const { category, scenes, description } = req.body;

    console.log(
      req.body,
      "============== req.body ================"
    );

    let sceneDescriptions = [];

    // ----------------------------------------
    // 1. If scenes are provided
    // ----------------------------------------

    if (Array.isArray(scenes) && scenes.length > 0) {
      sceneDescriptions = scenes;
    }

    // ----------------------------------------
    // 2. If only description is provided
    // ----------------------------------------

    else if (description && description.trim()) {
      sceneDescriptions = [
        description.trim()
      ];
    }

    // ----------------------------------------
    // 3. Default scene
    // ----------------------------------------

    else {
      const topic = category || "cute children's story";

      sceneDescriptions = [
        `${topic} in a beautiful environment`,
        `${topic} doing a fun activity`,
        `${topic} exploring something interesting`,
        `${topic} learning something new`,
        `${topic} happily completing the activity`
      ];
    }

    // ----------------------------------------
    // Generate images
    // ----------------------------------------

    const imageUrls = sceneDescriptions.map(
      (sceneText, index) => {

        const cleanScene = String(sceneText)
          .replace(/[\r\n+]/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 500);

        /*
        IMPORTANT:

        User can type ANYTHING.

        The model must understand the meaning
        and convert it into a visual scene.
        */

        const imagePrompt = `
Create a high-quality children's educational illustration
based EXACTLY on the following user description.

USER DESCRIPTION:
"${cleanScene}"

IMPORTANT INSTRUCTIONS:

1. Understand the meaning of the user description.

2. Convert the description into a clear visual scene.

3. The generated image MUST visually represent
   the action, objects, people, animals, places,
   environment and situation described by the user.

4. Do NOT generate an unrelated image.

5. Do NOT ignore the main action.

6. If the user describes a person doing an activity,
   clearly show that person performing the activity.

7. If the user describes an animal,
   clearly show that animal.

8. If the user describes a place,
   clearly show that place.

9. If the user describes multiple objects,
   include the important objects.

10. If the user describes an action,
    make the action visually obvious.

11. If the description contains "I", "me" or "my",
    interpret it as a child/person performing the action.

12. If the description is grammatically incorrect,
    understand the intended meaning instead of copying
    the grammar literally.

13. If the description contains multiple actions,
    create ONE coherent scene that represents the
    main/current action.

14. Do not add unrelated characters, objects or activities.

15. Do not add text, captions, letters or words
    inside the image.

STYLE:

- beautiful children's educational illustration
- colorful 3D cartoon style
- premium children's animation style
- bright vibrant colors
- cute friendly characters
- expressive faces
- soft lighting
- clean detailed environment
- professional storybook illustration
- attractive composition
- clear storytelling
- child-friendly
- high detail
- high quality
- polished rendering
- colorful background
- visually appealing
- no scary elements
- no violence
- no dark atmosphere
- no watermark
- no logo
- no text
- no letters
- no captions

MOST IMPORTANT:
The user's description is the source of truth.
The image must be directly related to it.

Generate ONE complete illustration.
`;

        const encodedPrompt =
          encodeURIComponent(imagePrompt);

        const seed =
          Math.floor(Math.random() * 900000) +
          (index + 1) * 789;

        return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}`;
      }
    );

    return res.json({
      success: true,
      images: imageUrls,
      scenes: sceneDescriptions
    });

  } catch (error) {

    console.error(
      "❌ Server error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      error: "Failed to generate kids images."
    });
  }
});




// ==================== Memory Games Module Start ==================


// // ---------- Game Logic ----------
// function generateNumber(digits) {
//   if (digits < 1) return '0';
//   let num = '';
//   for (let i = 0; i < digits; i++) {
//     num += Math.floor(Math.random() * 10);
//   }
//   return num;
// }

// // ---------- Routes ----------
// // 1. Level के हिसाब से नंबर दें
// app.get('/api/level/:level', (req, res) => {
//   const level = parseInt(req.params.level);
//   if (isNaN(level) || level < 1) {
//     return res.status(400).json({ error: 'Invalid level' });
//   }
//   const digits = 4 + (level - 1) * 2; // 4, 6, 8, 10, ...
//   const number = generateNumber(digits);
//   res.json({ level, number });
// });

// // 2. Verify करें
// app.post('/api/verify', (req, res) => {
//   const { level, input, number } = req.body;
//   if (!input || !number) {
//     return res.status(400).json({ error: 'Missing data' });
//   }
//   const correct = input.trim() === number;
//   res.json({ correct });
// });





// // ---------- Game Logic ----------
// function generateNumber(digits) {
//   if (digits < 1) return '0';
//   let num = '';
//   for (let i = 0; i < digits; i++) {
//     num += Math.floor(Math.random() * 10);
//   }
//   return num;
// }

// // ---------- Routes ----------
// // 1. दिए गए digits के अनुसार रैंडम नंबर जनरेट करें
// app.get('/api/number/:digits', (req, res) => {
//   const digits = parseInt(req.params.digits);
//   if (isNaN(digits) || digits < 1 || digits > 10) {
//     return res.status(400).json({ error: 'Invalid digit count' });
//   }
//   const number = generateNumber(digits);
//   res.json({ digits, number });
// });

// // 2. Verify करें (number और input मिलान करें)
// app.post('/api/verify', (req, res) => {
//   const { number, input } = req.body;
//   if (!number || !input) {
//     return res.status(400).json({ error: 'Missing data' });
//   }
//   const correct = input.trim() === number;
//   res.json({ correct });
// });







// ---------- Helpers ----------
function generateNumber(digits) {
  if (digits < 1) return '0';
  let num = '';
  for (let i = 0; i < digits; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
}

function generateLetters(count) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < count; i++) {
    result += letters[Math.floor(Math.random() * 26)];
  }
  return result;
}

const animalPool = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🐣','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🪲','🪰','🪱','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧','🐘','🦛','🦏','🐪','🐫','🦒','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🦮','🐕‍🦺','🐈','🐈‍⬛','🐓','🦃','🦤','🦚','🦜','🦢','🦩','🕊️','🐇','🦝','🦨','🦡','🦫','🦦','🦥','🐁','🐀','🐿️','🦔'];

function getRandomAnimals(count) {
  const shuffled = animalPool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ---------- Routes ----------
// 1. Number Memory
app.get('/api/number/:digits', (req, res) => {
  const digits = parseInt(req.params.digits);
  if (isNaN(digits) || digits < 1 || digits > 12) {
    return res.status(400).json({ error: 'Invalid digits' });
  }
  const number = generateNumber(digits);
  res.json({ digits, number });
});

// 2. Alphabet Memory
app.get('/api/alphabet/:length', (req, res) => {
  const length = parseInt(req.params.length);
  if (isNaN(length) || length < 1 || length > 20) {
    return res.status(400).json({ error: 'Invalid length' });
  }
  const letters = generateLetters(length);
  res.json({ length, letters });
});

// 3. Animal Memory
app.get('/api/animals/:count', (req, res) => {
  const count = parseInt(req.params.count);
  if (isNaN(count) || count < 1 || count > 15) {
    return res.status(400).json({ error: 'Invalid count' });
  }
  const animals = getRandomAnimals(count);
  res.json({ count, animals });
});

// 4. Verify (common for number and alphabet)
app.post('/api/verify', (req, res) => {
  const { number, input } = req.body;
  if (!number || !input) {
    return res.status(400).json({ error: 'Missing data' });
  }
  const correct = input.trim() === number;
  res.json({ correct });
});


// ==================== Memory Games Module End  ==================






// ---------- Mock Quiz Generation (for demonstration) ----------
function generateMockQuiz(title, count) {
  const questionPool = [
    {
      id: '1',
      type: 'mcq',
      question: 'What is the capital of France?',
      options: ['London', 'Paris', 'Berlin', 'Madrid'],
      correctAnswer: 'Paris',
      explanation: 'Paris is the capital and most populous city of France.',
    },
    {
      id: '2',
      type: 'mcq',
      question: 'Which planet is known as the Red Planet?',
      options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
      correctAnswer: 'Mars',
      explanation: 'Mars appears red due to iron oxide on its surface.',
    },
    {
      id: '3',
      type: 'truefalse',
      question: 'The sun is a star.',
      correctAnswer: 'True',
      explanation: 'The sun is a yellow dwarf star at the center of our solar system.',
    },
    {
      id: '4',
      type: 'truefalse',
      question: 'Water has a chemical formula H2O.',
      correctAnswer: 'True',
      explanation: 'Water is composed of two hydrogen atoms and one oxygen atom.',
    },
    {
      id: '5',
      type: 'fillblank',
      question: 'The process by which plants make their food is called __________.',
      correctAnswer: 'photosynthesis',
      explanation: 'Photosynthesis is the process by which green plants convert sunlight into energy.',
    },
    {
      id: '6',
      type: 'mcq',
      question: 'What is the largest mammal?',
      options: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'],
      correctAnswer: 'Blue Whale',
      explanation: 'The blue whale is the largest animal ever known to have existed.',
    },
    {
      id: '7',
      type: 'fillblank',
      question: 'The Earth revolves around the __________.',
      correctAnswer: 'Sun',
      explanation: 'Earth orbits the Sun once every 365.25 days.',
    },
  ];

  // Shuffle and pick random questions
  const shuffled = [...questionPool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count).map((q, idx) => ({ ...q, id: `q${idx}` }));
  return {
    id: `quiz_${Date.now()}`,
    title: title,
    questions: selected,
    timeLimit: 300, // default 5 min
  };
}

// ---------- Routes ----------
// 1. Topic-based Quiz
app.post('/api/quiz/topic', (req, res) => {
  const { topic, numQuestions, timeLimit } = req.body;
  if (!topic) return res.status(400).json({ error: 'Topic is required' });
  const quiz = generateMockQuiz(`Quiz on ${topic}`, numQuestions || 5);
  // Override timeLimit if provided
  if (timeLimit) quiz.timeLimit = timeLimit;
  res.json(quiz);
});

// 2. Image-based Quiz (mock OCR)
app.post('/api/quiz/image',  (req, res) => {
  // Simulate OCR and AI processing
  const numQuestions = parseInt(req.body.numQuestions) || 5;
  const timeLimit = parseInt(req.body.timeLimit) || 300;
  const quiz = generateMockQuiz('Image Quiz', numQuestions);
  quiz.timeLimit = timeLimit;
  res.json(quiz);
});

// 3. PDF-based Quiz
app.post('/api/quiz/pdf', (req, res) => {
  const numQuestions = parseInt(req.body.numQuestions) || 5;
  const timeLimit = parseInt(req.body.timeLimit) || 300;
  const quiz = generateMockQuiz('PDF Quiz', numQuestions);
  quiz.timeLimit = timeLimit;
  res.json(quiz);
});

// 4. Class-wise Quiz
app.post('/api/quiz/class', (req, res) => {
  const { class: cls, subject, chapter, numQuestions, timeLimit } = req.body;
  if (!cls || !subject || !chapter) {
    return res.status(400).json({ error: 'Class, subject, and chapter required' });
  }
  const title = `Class ${cls} ${subject} - ${chapter}`;
  const quiz = generateMockQuiz(title, numQuestions || 5);
  quiz.timeLimit = timeLimit || 300;
  res.json(quiz);
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if(err) {
    console.log(`Serverissss  not running on port: ${err}`);
    }else{
    console.log(`Server issss running on port ${PORT}`);
    }
});