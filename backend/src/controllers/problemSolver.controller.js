// const axios = require("axios");

// const solveProblem = async (req, res) => {
//   try {
//     const { problem, type = "text" } = req.body;
//     const files = req.files || [];

//     console.log("📝 Problem:", problem);
//     console.log("📂 Files uploaded:", files.length);

//     const prompt = `
// You are an expert school teacher and problem solver.

// Student's Problem:
// ${problem || "Analyze the uploaded image/video and solve the problem."}

// Give the answer in a way that is easy for school students to understand.

// Rules:
// 1. Understand the question carefully.
// 2. Solve it correctly.
// 3. Explain the solution step-by-step.
// 4. Use very simple language.
// 5. If it is a mathematics problem, show the calculation clearly.
// 6. If it is science, explain the concept with an easy example.
// 7. If it is English, explain the answer clearly.
// 8. If an image is provided, carefully read the question from the image.
// 9. Do not skip important steps.
// 10. Give the final answer clearly.

// Return ONLY valid JSON in this format:

// {
//   "problem": "...",
//   "steps": [
//     "...",
//     "...",
//     "..."
//   ],
//   "finalAnswer": "...",
//   "keyConcept": "...",
//   "additionalTips": "..."
// }
// `;

//     // ===============================
//     // Build Gemini Parts
//     // ===============================

//     const parts = [
//       {
//         text: prompt
//       }
//     ];

//     // Add uploaded images/videos
//     if (files.length > 0) {
//       for (const file of files) {

//         const base64 = file.buffer.toString("base64");

//         let mimeType = file.mimetype;

//         if (!mimeType) {
//           mimeType = "image/jpeg";
//         }

//         parts.push({
//           inline_data: {
//             mime_type: mimeType,
//             data: base64
//           }
//         });
//       }
//     }

//     // ===============================
//     // Gemini API
//     // ===============================

//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             role: "user",
//             parts
//           }
//         ],

//         generationConfig: {
//           responseMimeType: "application/json"
//         }
//       }
//     );

//     // ===============================
//     // Get Gemini Response
//     // ===============================

//     const responseText =
//       response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

//     if (!responseText) {
//       throw new Error("Empty response from Gemini");
//     }

//     console.log("🤖 Gemini Response:", responseText);

//     // ===============================
//     // Parse JSON
//     // ===============================

//     let solution;

//     try {
//       solution = JSON.parse(responseText);
//     } catch (parseError) {

//       console.error("❌ JSON Parse Error:", parseError.message);

//       // Remove markdown if Gemini accidentally adds it
//       const cleaned = responseText
//         .replace(/```json/g, "")
//         .replace(/```/g, "")
//         .trim();

//       try {
//         solution = JSON.parse(cleaned);
//       } catch (error) {
//         solution = {
//           problem: problem || "",
//           steps: [responseText],
//           finalAnswer: "",
//           keyConcept: "",
//           additionalTips: ""
//         };
//       }
//     }

//     // ===============================
//     // Final Response
//     // ===============================

//     return res.json({
//       success: true,

//       data: {
//         problem: solution.problem || problem || "",
//         solution,
//         rawSolution: responseText,
//         type: files.length > 0 ? "multimodal" : "text",
//         fileCount: files.length
//       }
//     });

//   } catch (error) {

//     console.error(
//       "❌ Problem Solver Error:",
//       error.response?.data || error.message
//     );

//     return res.status(500).json({
//       success: false,
//       error: "Failed to solve problem",
//       details:
//         error.response?.data?.error?.message ||
//         error.message
//     });
//   }
// };

// module.exports = {
//   solveProblem
// };


const axios = require("axios");

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const callGemini = async (parts) => {

  const models = [
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash-lite"
  ];

  let lastError;

  for (const model of models) {

    for (let attempt = 1; attempt <= 3; attempt++) {

      try {

        console.log(
          `🤖 Gemini model: ${model}, attempt: ${attempt}`
        );

        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            contents: [
              {
                role: "user",
                parts
              }
            ],

            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.3,
              maxOutputTokens: 4096
            }
          },
          {
            timeout: 60000
          }
        );

        const text =
          response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
          throw new Error("Empty Gemini response");
        }

        console.log(`✅ Gemini success: ${model}`);

        return text;

      } catch (error) {

        lastError = error;

        const status = error.response?.status;

        console.error(
          `❌ Gemini Error | Model: ${model} | Attempt: ${attempt} | Status: ${status}`,
          error.response?.data?.error?.message || error.message
        );

        // Retry only temporary errors
        if (
          status === 503 ||
          status === 429 ||
          status === 500
        ) {

          if (attempt < 3) {

            const waitTime = attempt * 3000;

            console.log(
              `⏳ Retrying after ${waitTime}ms...`
            );

            await sleep(waitTime);

            continue;
          }

          // Try next model
          break;
        }

        // Don't retry invalid request/API key etc.
        throw error;
      }
    }
  }

  throw lastError;
};


const solveProblem = async (req, res) => {

  try {

    const { problem, type = "text" } = req.body;
    const files = req.files || [];

    console.log("📝 Problem:", problem);
    console.log("📂 Files uploaded:", files.length);

    // ==========================================
    // PROMPT
    // ==========================================

    const prompt = `
You are an expert teacher for Class 1 to Class 8 school students.

The student wants the problem solved in a very easy way.

Student's question:
${problem || "Read the uploaded image carefully and solve the question."}

IMPORTANT:

- Carefully read the uploaded image if there is one.
- Identify the exact question from the image.
- Do not invent any question.
- Solve the exact question shown in the image.
- Explain like a school teacher.
- Use very simple language.
- For mathematics, show the calculation step-by-step.
- For word problems, explain what information is given and what we need to find.
- Keep the explanation suitable for children.
- Avoid difficult terminology unless necessary.
- Give the final answer clearly.

Return ONLY valid JSON.

Format:

{
  "problem": "Question from the student/image",
  "steps": [
    "Easy step 1",
    "Easy step 2",
    "Easy step 3"
  ],
  "finalAnswer": "Final answer",
  "keyConcept": "Simple explanation of the main concept",
  "additionalTips": "Simple tip for the student"
}
`;

    // ==========================================
    // GEMINI PARTS
    // ==========================================

    const parts = [
      {
        text: prompt
      }
    ];

    // ==========================================
    // ADD IMAGE / VIDEO
    // ==========================================

    if (files.length > 0) {

      for (const file of files) {

        const base64 = file.buffer.toString("base64");

        let mimeType = file.mimetype;

        if (!mimeType) {
          mimeType = "image/jpeg";
        }

        console.log(
          `📎 File: ${file.originalname} | MIME: ${mimeType}`
        );

        parts.push({
          inline_data: {
            mime_type: mimeType,
            data: base64
          }
        });
      }
    }

    // ==========================================
    // CALL GEMINI
    // ==========================================

    const responseText = await callGemini(parts);

    console.log("🤖 Gemini Response:", responseText);

    // ==========================================
    // PARSE JSON
    // ==========================================

    let solution;

    try {

      solution = JSON.parse(responseText);

    } catch (error) {

      console.log("⚠️ JSON parsing failed, cleaning response");

      const cleaned = responseText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      try {

        solution = JSON.parse(cleaned);

      } catch (parseError) {

        solution = {
          problem: problem || "",
          steps: [responseText],
          finalAnswer: "",
          keyConcept: "",
          additionalTips: ""
        };
      }
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.json({

      success: true,

      data: {

        problem:
          solution.problem ||
          problem ||
          "Image se question analyze kiya gaya.",

        solution,

        rawSolution: responseText,

        type:
          files.length > 0
            ? "multimodal"
            : "text",

        fileCount: files.length
      }
    });

  } catch (error) {

    console.error(
      "❌ Problem Solver Error:",
      error.response?.data || error.message
    );

    const status =
      error.response?.status || 500;

    return res.status(status).json({

      success: false,

      error: "Failed to solve problem",

      details:
        error.response?.data?.error?.message ||
        error.message
    });
  }
};

module.exports = {
  solveProblem
};