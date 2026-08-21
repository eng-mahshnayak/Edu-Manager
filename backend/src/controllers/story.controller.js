
// const axios = require("axios");
// const Story = require("../models/Story");

// const generateAIStory = async ({
//   lineCount,
//   language,
//   category,
// }) => {
//   const languageName = language === "hi" ? "Hindi" : "English";

//   const prompt = `
// You are an educational story writer for school children.

// Generate ONE simple, meaningful and knowledgeable story.

// Target:
// - School children
// - Age appropriate
// - Easy language
// - Positive values
// - Educational
// - No violence
// - No scary content
// - No adult content
// - No political content

// Language: ${languageName}
// Number of lines: EXACTLY ${lineCount}
// Category: ${category}

// The story should preferably teach one or more of these values:
// - Respect parents and family
// - Respect teachers
// - Helping others
// - Kindness
// - Honesty
// - Discipline
// - Hard work
// - Cleanliness
// - Saving water
// - Protecting nature
// - Friendship
// - Sharing
// - Good manners
// - Self confidence
// - Knowledge and learning

// Also include a short "Subh Vichar" / thought for the day.

// Return ONLY valid JSON.
// Do NOT use markdown.
// Do NOT use \`\`\`json.
// Do NOT add explanation.

// JSON format:

// {
//   "title": "Story title",
//   "lines": [
//     {
//       "id": 1,
//       "text": "Story line",
//       "emoji": "😊"
//     }
//   ],
//   "moral": "What children learn from the story",
//   "subhVichar": "Short positive thought",
//   "vocabulary": ["word1", "word2", "word3"],
//   "funFact": "One simple educational fact",
//   "category": "${category}"
// }

// Rules:
// - lines array must contain EXACTLY ${lineCount} items.
// - Keep sentences short.
// - Make the story interesting for children.
// - The story must have a clear beginning, middle and ending.
// - Moral must be practical.
// - SubhVichar must be short and memorable.
// `;
  
//   const API_URL =
//     `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`;

//   const response = await axios.post(
//     API_URL,
//     {
//       contents: [
//         {
//           role: "user",
//           parts: [{ text: prompt }],
//         },
//       ],
//       generationConfig: {
//         maxOutputTokens: 4096,
//       },
//     },
//     {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       timeout: 60000,
//     }
//   );

//   const text =
//     response.data.candidates?.[0]?.content?.parts?.[0]?.text;

//   if (!text) {
//     throw new Error("Empty AI response");
//   }

//   // Remove markdown code fences if AI adds them
//   let cleanText = text
//     .replace(/^```json\s*/i, "")
//     .replace(/^```\s*/i, "")
//     .replace(/\s*```$/i, "")
//     .trim();

//   // Extract JSON
//   const firstBrace = cleanText.indexOf("{");
//   const lastBrace = cleanText.lastIndexOf("}");

//   if (firstBrace === -1 || lastBrace === -1) {
//     throw new Error("AI returned invalid JSON");
//   }

//   cleanText = cleanText.substring(
//     firstBrace,
//     lastBrace + 1
//   );

//   const story = JSON.parse(cleanText);

//   // Safety validation
//   if (!Array.isArray(story.lines)) {
//     throw new Error("AI story lines are invalid");
//   }

//   if (story.lines.length !== lineCount) {
//     throw new Error(
//       `Expected ${lineCount} lines but AI returned ${story.lines.length}`
//     );
//   }

//   return story;
// };


// exports.getStory = async (req, res) => {
//   try {
//     const {
//       lines = 4,
//       language = "en",
//       category = "General",
//     } = req.query;

//     console.log(
//       req.query,
//       "========== STORY REQUEST ============"
//     );

//     const lineCount = parseInt(lines, 10);

//     const validCounts = [4, 8, 12];

//     const count = validCounts.includes(lineCount)
//       ? lineCount
//       : 4;

//     const lang = language === "hi" ? "hi" : "en";

//     // ----------------------------------
//     // 1. Check existing stories
//     // ----------------------------------

//     const existingStories = await Story.find({
//       language: lang,
//       lineCount: count,
//       category: category,
//     });

//     // Random existing story
//     if (existingStories.length > 0) {
//       const randomIndex = Math.floor(
//         Math.random() * existingStories.length
//       );

//       return res.status(200).json({
//         success: true,
//         source: "database",
//         data: existingStories[randomIndex],
//       });
//     }

//     // ----------------------------------
//     // 2. Generate new story using AI
//     // ----------------------------------

//     const aiStory = await generateAIStory({
//       lineCount: count,
//       language: lang,
//       category,
//     });

//     // ----------------------------------
//     // 3. Save AI story to MongoDB
//     // ----------------------------------

//     const savedStory = await Story.create({
//       title: aiStory.title,

//       language: lang,

//       lineCount: count,

//       lines: aiStory.lines,

//       moral: aiStory.moral,

//       subhVichar: aiStory.subhVichar,

//       vocabulary: aiStory.vocabulary || [],

//       funFact: aiStory.funFact || "",

//       category: aiStory.category || category,
//     });

//     // ----------------------------------
//     // 4. Return story
//     // ----------------------------------

//     return res.status(200).json({
//       success: true,
//       source: "ai",
//       data: savedStory,
//     });

//   } catch (error) {

//     console.error(
//       "❌ Error fetching story:",
//       error.response?.data || error.message
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Failed to generate story",
//       error:
//         error.response?.data?.error?.message ||
//         error.message,
//     });
//   }
// };



const axios = require("axios");
const Story = require("../models/Story");

// ===== AI Story Generator with Category & Theme =====
const generateAIStory = async ({
  lineCount,
  language,
  category,
  theme,
}) => {
  const languageName = language === "hi" ? "Hindi" : "English";

  const prompt = `
You are an educational story writer for school children.

Generate ONE simple, meaningful and knowledgeable story.

Target: School children, age appropriate, easy language, positive values, educational, no violence/scary/adult/political content.

Language: ${languageName}
Number of lines: EXACTLY ${lineCount}
Category: ${category || "General"}
${theme ? `Theme / Moral focus: ${theme}` : ""}

The story should teach one or more of these values:
- Respect parents, family, teachers
- Helping others, kindness, honesty, discipline, hard work
- Cleanliness, saving water, protecting nature
- Friendship, sharing, good manners, self‑confidence, learning

Include a short "Subh Vichar" / thought for the day.

Return ONLY valid JSON. Do NOT use markdown or code blocks.

JSON format:
{
  "title": "Story title",
  "lines": [
    {"id": 1, "text": "Story line", "emoji": "😊"}
  ],
  "moral": "What children learn from the story",
  "subhVichar": "Short positive thought",
  "vocabulary": ["word1", "word2", "word3"],
  "funFact": "One simple educational fact",
  "category": "${category || "General"}",
  "theme": "${theme || ""}"
}

Rules:
- lines array must contain EXACTLY ${lineCount} items.
- Keep sentences short and interesting.
- Clear beginning, middle, ending.
- Moral must be practical and SubhVichar memorable.
`;

  const API_URL =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const response = await axios.post(
    API_URL,
    {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 4096 },
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 60000,
    }
  );

  const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty AI response");

  let cleanText = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace = cleanText.indexOf("{");
  const lastBrace = cleanText.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) throw new Error("Invalid JSON");
  cleanText = cleanText.substring(firstBrace, lastBrace + 1);

  const story = JSON.parse(cleanText);
  if (!Array.isArray(story.lines) || story.lines.length !== lineCount) {
    throw new Error(`Expected ${lineCount} lines, got ${story.lines?.length}`);
  }
  return story;
};

// ===== GET Story with optional filters =====
exports.getStory = async (req, res) => {
  try {
    const {
      lines = 4,
      language = "en",
      category = "General",
      theme = "",
    } = req.query;

    const lineCount = parseInt(lines, 10);
    const validCounts = [4, 8, 12];
    const count = validCounts.includes(lineCount) ? lineCount : 4;
    const lang = language === "hi" ? "hi" : "en";

    // 1. Look for existing stories matching filters
    const filter = { language: lang, lineCount: count };
    if (category && category !== "General") filter.category = category;
    if (theme) filter.theme = { $regex: new RegExp(theme, "i") };

    const existingStories = await Story.find(filter);
    if (existingStories.length > 0) {
      const randomIndex = Math.floor(Math.random() * existingStories.length);
      return res.status(200).json({
        success: true,
        source: "database",
        data: existingStories[randomIndex],
      });
    }

    // 2. Generate with AI
    const aiStory = await generateAIStory({
      lineCount: count,
      language: lang,
      category,
      theme,
    });

    // 3. Save to DB
    const savedStory = await Story.create({
      title: aiStory.title,
      language: lang,
      lineCount: count,
      lines: aiStory.lines,
      moral: aiStory.moral,
      subhVichar: aiStory.subhVichar || "",
      vocabulary: aiStory.vocabulary || [],
      funFact: aiStory.funFact || "",
      category: aiStory.category || category,
      theme: aiStory.theme || theme,
    });

    return res.status(200).json({
      success: true,
      source: "ai",
      data: savedStory,
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate story",
      error: error.message,
    });
  }
};

// ===== TRANSLATE Story (New Endpoint) =====
exports.translateStory = async (req, res) => {
  try {
    const { story, targetLanguage } = req.body; // targetLanguage: 'en' or 'hi'
    if (!story || !targetLanguage) {
      return res.status(400).json({ success: false, message: "Missing story or targetLanguage" });
    }

    const sourceLang = story.language === "hi" ? "Hindi" : "English";
    const targetLang = targetLanguage === "hi" ? "Hindi" : "English";

    // Build translation prompt
    const prompt = `
Translate the following children's story from ${sourceLang} to ${targetLang}.

Keep the translation:
- Simple and natural
- Age‑appropriate
- Preserve the meaning, moral, and Subh Vichar
- Keep emojis as they are

Story JSON:
${JSON.stringify(story, null, 2)}

Return ONLY the translated story in the SAME JSON structure (including all fields).
Do NOT add any extra text or markdown.
`;

    const API_URL =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await axios.post(
      API_URL,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 4096 },
      },
      { headers: { "Content-Type": "application/json" }, timeout: 60000 }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty translation response");

    let cleanText = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const firstBrace = cleanText.indexOf("{");
    const lastBrace = cleanText.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1) throw new Error("Invalid JSON");
    cleanText = cleanText.substring(firstBrace, lastBrace + 1);

    const translatedStory = JSON.parse(cleanText);
    translatedStory.language = targetLanguage; // update language field

    res.status(200).json({ success: true, data: translatedStory });
  } catch (error) {
    console.error("❌ Translation error:", error.message);
    res.status(500).json({ success: false, message: "Translation failed", error: error.message });
  }
};