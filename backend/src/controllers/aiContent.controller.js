const axios = require("axios");


const getFruits = async (req, res) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: "Give 10 fruit names" }],
          },
        ],
      }
    );

    const text =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({ fruits: text });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getAnimals = async (req, res) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: "Give 10 animal names" }],
          },
        ],
      }
    );

    const text =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({ animals: text });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





 const generateQuestionPaper = async (req, res) => {
  try {
    const { className, subject, chapter, difficulty, totalMarks } = req.body;

    // 🔹 Validation
    if (!className || !subject || !totalMarks) {
      return res.status(400).json({
        success: false,
        error: "className, subject, totalMarks are required",
      });
    }

    // 🔹 Prompt
    const prompt = `
Generate a ${totalMarks}-mark question paper for ${className} class ${subject} subject.
Chapter: ${chapter || "General"}
Difficulty Level: ${difficulty || "Medium"}

STRICTLY return valid JSON only.

Use this structure:
{
  "metadata": {
    "className": "${className}",
    "subject": "${subject}",
    "chapter": "${chapter || "General"}",
    "difficulty": "${difficulty || "Medium"}",
    "totalMarks": ${totalMarks},
    "generatedDate": "${new Date().toISOString().split("T")[0]}"
  },
  "sections": {
    "sectionA": {
      "title": "Multiple Choice Questions",
      "marksPerQuestion": 1,
      "totalQuestions": 5,
      "totalMarks": 5,
      "questions": []
    },
    "sectionB": {
      "title": "Fill in the Blanks",
      "marksPerQuestion": 1,
      "totalQuestions": 5,
      "totalMarks": 5,
      "questions": []
    },
    "sectionC": {
      "title": "Short Answer Questions",
      "marksPerQuestion": 2,
      "totalQuestions": 5,
      "totalMarks": 10,
      "questions": []
    },
    "sectionD": {
      "title": "Long Answer Questions",
      "marksPerQuestion": 5,
      "totalQuestions": 6,
      "totalMarks": 30,
      "questions": []
    }
  },
  "answerKey": {
    "sectionA": [],
    "sectionB": [],
    "sectionC": [],
    "sectionD": []
  }
}

Generate real educational questions.
`;

    // 🔥 Latest working model
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await axios.post(
      API_URL,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 60000,
      }
    );

    // 🔹 Direct JSON parse (no cleaning needed)
    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Empty response from AI");
    }

    const questionPaper = JSON.parse(text);

    return res.json({
      success: true,
      data: questionPaper,
      model: "gemini-2.0-flash",
    });

  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);

    const errorMessage = err.response?.data?.error?.message || err.message;

    if (errorMessage?.includes("API key")) {
      return res.status(403).json({
        success: false,
        error: "Invalid API key",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to generate question paper",
      details: errorMessage,
    });
  }
};


 const saveQuestionPaper = async (req, res) => {
  try {
    const { questionPaper } = req.body;
    
    // In a real app, save to database
    // For now, just return success
    res.json({ 
      success: true, 
      message: 'Question paper saved successfully',
      id: Date.now().toString()
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

module.exports = { generateQuestionPaper ,getFruits,getAnimals};