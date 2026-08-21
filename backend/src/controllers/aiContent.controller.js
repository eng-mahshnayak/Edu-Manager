const axios = require("axios");
const QuestionPaper = require('../models/questionPaper.model');


const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);





const generateQuestionPaper = async (req, res) => {
  try {

  const { className, subject, chapter, difficulty, totalMarks } = req.body;


  console.log(req.body,'==============req.body================');
  

    // Validation
    if (!className || !subject || !totalMarks) {
      return res.status(400).json({
        success: false,
        error: "className, subject, totalMarks are required",
      });
    }

    // Fixed structure – 50 marks (or adjust as per prompt)
    const prompt = `
Generate a question paper for ${className} class ${subject} subject.
Chapter: ${chapter || "General"}
Difficulty Level: ${difficulty || "Medium"}
Total Marks: ${totalMarks || 50}

Strictly return valid JSON only in the following format:

{
  "metadata": {
    "className": "${className}",
    "subject": "${subject}",
    "chapter": "${chapter || "General"}",
    "difficulty": "${difficulty || "Medium"}",
    "totalMarks": ${totalMarks || 50},
    "generatedDate": "${new Date().toISOString().split("T")[0]}"
  },
  "sections": {
    "sectionA": {
      "title": "Multiple Choice Questions",
      "marksPerQuestion": 1,
      "totalQuestions": 5,
      "totalMarks": 5,
      "questions": [
        {"id": 1, "question": "Question text", "options": ["A", "B", "C", "D"], "correctAnswer": "A"}
        // ... 5 questions
      ]
    },
    "sectionB": {
      "title": "True / False Questions",
      "marksPerQuestion": 1,
      "totalQuestions": 5,
      "totalMarks": 5,
      "questions": [
        {"id": 1, "question": "Statement to judge", "answer": "True"}
        // ... 5 questions
      ]
    },
    "sectionC": {
      "title": "Short Answer Questions",
      "marksPerQuestion": 2,
      "totalQuestions": 10,
      "totalMarks": 20,
      "questions": [
        {"id": 1, "question": "Question text", "answer": "Sample answer"}
        // ... 10 questions
      ]
    },
    "sectionD": {
      "title": "Long Answer Questions",
      "marksPerQuestion": 5,
      "totalQuestions": 5,
      "totalMarks": 25,
      "questions": [
        {"id": 1, "question": "Question text", "answer": "Detailed answer"}
        // ... 5 questions
      ]
    }
  },
  "answerKey": {
    "sectionA": ["A", "B", "C", "D", "A"],
    "sectionB": ["True", "False", "True", "False", "True"],
    "sectionC": ["Answer1", "Answer2", ...10],
    "sectionD": ["Answer1", "Answer2", ...5]
  }
}

Generate real educational questions appropriate for the class and subject.
Make sure the question paper is balanced and covers the chapter if given.
`;

    // Use stable model
   // const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await axios.post(
      API_URL,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 60000,
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty response from AI");

    const questionPaper = JSON.parse(text);


    console.log(questionPaper,'===========questionPaper===========');
    




    return res.json({
      success: true,
      data: questionPaper,
      model: "gemini-1.5-flash",
    });

  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    const errorMessage = err.response?.data?.error?.message || err.message;
    return res.status(500).json({
      success: false,
      error: "Failed to generate question paper",
      details: errorMessage,
    });
  }
};




const generateQuestionPaper121 = async (req, res) => {
  try {

  const { className, subject, chapter, difficulty, totalMarks } = req.body;


  console.log(req.body,'==============req.body================');
  

//     // Validation
//     if (!className || !subject || !totalMarks) {
//       return res.status(400).json({
//         success: false,
//         error: "className, subject, totalMarks are required",
//       });
//     }

//     // Fixed structure – 50 marks (or adjust as per prompt)
//     const prompt = `
// Generate a question paper for ${className} class ${subject} subject.
// Chapter: ${chapter || "General"}
// Difficulty Level: ${difficulty || "Medium"}
// Total Marks: ${totalMarks || 50}

// Strictly return valid JSON only in the following format:

// {
//   "metadata": {
//     "className": "${className}",
//     "subject": "${subject}",
//     "chapter": "${chapter || "General"}",
//     "difficulty": "${difficulty || "Medium"}",
//     "totalMarks": ${totalMarks || 50},
//     "generatedDate": "${new Date().toISOString().split("T")[0]}"
//   },
//   "sections": {
//     "sectionA": {
//       "title": "Multiple Choice Questions",
//       "marksPerQuestion": 1,
//       "totalQuestions": 5,
//       "totalMarks": 5,
//       "questions": [
//         {"id": 1, "question": "Question text", "options": ["A", "B", "C", "D"], "correctAnswer": "A"}
//         // ... 5 questions
//       ]
//     },
//     "sectionB": {
//       "title": "True / False Questions",
//       "marksPerQuestion": 1,
//       "totalQuestions": 5,
//       "totalMarks": 5,
//       "questions": [
//         {"id": 1, "question": "Statement to judge", "answer": "True"}
//         // ... 5 questions
//       ]
//     },
//     "sectionC": {
//       "title": "Short Answer Questions",
//       "marksPerQuestion": 2,
//       "totalQuestions": 10,
//       "totalMarks": 20,
//       "questions": [
//         {"id": 1, "question": "Question text", "answer": "Sample answer"}
//         // ... 10 questions
//       ]
//     },
//     "sectionD": {
//       "title": "Long Answer Questions",
//       "marksPerQuestion": 5,
//       "totalQuestions": 5,
//       "totalMarks": 25,
//       "questions": [
//         {"id": 1, "question": "Question text", "answer": "Detailed answer"}
//         // ... 5 questions
//       ]
//     }
//   },
//   "answerKey": {
//     "sectionA": ["A", "B", "C", "D", "A"],
//     "sectionB": ["True", "False", "True", "False", "True"],
//     "sectionC": ["Answer1", "Answer2", ...10],
//     "sectionD": ["Answer1", "Answer2", ...5]
//   }
// }

// Generate real educational questions appropriate for the class and subject.
// Make sure the question paper is balanced and covers the chapter if given.
// `;

//     // Use stable model
//    // const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
//     const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`;

//     const response = await axios.post(
//       API_URL,
//       {
//         contents: [{ role: "user", parts: [{ text: prompt }] }],
//         generationConfig: {
//           temperature: 0.7,
//           maxOutputTokens: 8192,
//         },
//       },
//       {
//         headers: { "Content-Type": "application/json" },
//         timeout: 60000,
//       }
//     );

//     const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
//     if (!text) throw new Error("Empty response from AI");

//     const questionPaper = JSON.parse(text);


//     console.log(questionPaper,'===========questionPaper===========');
    


let questionPaper = {
        "metadata": {
            "className": "5th",
            "subject": "Hindi",
            "chapter": "General",
            "difficulty": "Medium",
            "totalMarks": 50,
            "generatedDate": "2026-08-13"
        },
        "sections": {
            "sectionA": {
                "title": "Multiple Choice Questions",
                "marksPerQuestion": 1,
                "totalQuestions": 5,
                "totalMarks": 5,
                "questions": [
                    {
                        "id": 1,
                        "question": "इनमें से कौन सा शब्द 'पुस्तकालय' का सही संधि-विच्छेद है?",
                        "options": [
                            "पुस्तक + आलय",
                            "पुस्त + कालय",
                            "पुस्तका + लय",
                            "पुस्त + आलय"
                        ],
                        "correctAnswer": "पुस्तक + आलय"
                    },
                    {
                        "id": 2,
                        "question": "हिंदी वर्णमाला में कुल कितने स्वर होते हैं?",
                        "options": [
                            "11",
                            "13",
                            "33",
                            "52"
                        ],
                        "correctAnswer": "11"
                    },
                    {
                        "id": 3,
                        "question": "'सुंदर' शब्द का भाववाचक संज्ञा रूप क्या होगा?",
                        "options": [
                            "सुंदरी",
                            "सुंदरता",
                            "सौंदर्य",
                            "दोनों (ख) और (ग)"
                        ],
                        "correctAnswer": "दोनों (ख) और (ग)"
                    },
                    {
                        "id": 4,
                        "question": "'सूरज' शब्द का पर्यायवाची शब्द इनमें से कौन सा नहीं है?",
                        "options": [
                            "भानु",
                            "दिनकर",
                            "शशिकांत",
                            "रवि"
                        ],
                        "correctAnswer": "शशिकांत"
                    },
                    {
                        "id": 5,
                        "question": "'वर्षा हो रही है' वाक्य में काल (Tense) पहचानिए।",
                        "options": [
                            "भूतकाल",
                            "वर्तमान काल",
                            "भविष्यत् काल",
                            "इनमें से कोई नहीं"
                        ],
                        "correctAnswer": "वर्तमान काल"
                    }
                ]
            },
            "sectionB": {
                "title": "True / False Questions",
                "marksPerQuestion": 1,
                "totalQuestions": 5,
                "totalMarks": 5,
                "questions": [
                    {
                        "id": 1,
                        "question": "'हिमालय' एक जातिवाचक संज्ञा है।",
                        "answer": "False"
                    },
                    {
                        "id": 2,
                        "question": "हिंदी हमारी राष्ट्रभाषा और राजभाषा के रूप में जानी जाती है।",
                        "answer": "True"
                    },
                    {
                        "id": 3,
                        "question": "'छोटा' शब्द का विलोम शब्द 'बड़ा' होता है।",
                        "answer": "True"
                    },
                    {
                        "id": 4,
                        "question": "सर्वनाम वे शब्द होते हैं जो संज्ञा के स्थान पर प्रयोग किए जाते हैं।",
                        "answer": "True"
                    },
                    {
                        "id": 5,
                        "question": "'मित्र' शब्द का बहुवचन 'मित्रों' नहीं होता है।",
                        "answer": "False"
                    }
                ]
            },
            "sectionC": {
                "title": "Short Answer Questions",
                "marksPerQuestion": 2,
                "totalQuestions": 10,
                "totalMarks": 20,
                "questions": [
                    {
                        "id": 1,
                        "question": "संज्ञा किसे कहते हैं? उदाहरण दीजिए।",
                        "answer": "किसी व्यक्ति, वस्तु, स्थान या भाव के नाम को संज्ञा कहते हैं; जैसे- राम, दिल्ली, आम।"
                    },
                    {
                        "id": 2,
                        "question": "वचन किसे कहते हैं? इसके कितने भेद होते हैं?",
                        "answer": "शब्द के जिस रूप से उसके एक या अनेक होने का बोध हो, उसे वचन कहते हैं। इसके दो भेद हैं - एकवचन और बहुवचन।"
                    },
                    {
                        "id": 3,
                        "question": "सर्वनाम की परिभाषा लिखिए और दो उदाहरण दीजिए।",
                        "answer": "जो शब्द संज्ञा के स्थान पर प्रयोग किए जाते हैं, उन्हें सर्वनाम कहते हैं; जैसे- मैं, तुम।"
                    },
                    {
                        "id": 4,
                        "question": "विशेषण किसे कहते हैं? एक उदाहरण दीजिए।",
                        "answer": "संज्ञा या सर्वनाम की विशेषता बताने वाले शब्दों को विशेषण कहते हैं; जैसे- मीठा आम।"
                    },
                    {
                        "id": 5,
                        "question": "लिंग किसे कहते हैं? हिंदी में लिंग के कितने भेद हैं?",
                        "answer": "जिस शब्द से पुरुष या स्त्री जाति का बोध हो, उसे लिंग कहते हैं। हिंदी में इसके दो भेद हैं - पुल्लिंग और स्त्रीलिंग।"
                    },
                    {
                        "id": 6,
                        "question": "पर्यायवाची शब्द का क्या अर्थ है? 'पानी' के दो पर्यायवाची लिखिए।",
                        "answer": "समान अर्थ प्रकट करने वाले शब्दों को पर्यायवाची कहते हैं। पानी के दो पर्यायवाची जल और नीर हैं।"
                    },
                    {
                        "id": 7,
                        "question": "विलोम शब्द किसे कहते हैं? 'रात' का विलोम लिखिए।",
                        "answer": "एक-दूसरे का उल्टा या विपरीत अर्थ देने वाले शब्दों को विलोम शब्द कहते हैं। रात का विलोम दिन है।"
                    },
                    {
                        "id": 8,
                        "question": "अनेक शब्दों के लिए एक शब्द लिखिए: 'जो कभी ना मरे' और 'जो चित्र बनाता हो'।",
                        "answer": "जो कभी ना मरे - अमर; जो चित्र बनाता हो - चित्रकार।"
                    },
                    {
                        "id": 9,
                        "question": "मुंहावरे का क्या अर्थ है? '9-2 11 होना' मुँहावरे का अर्थ लिखिए।",
                        "answer": "मुंहावरा ऐसा वाक्यांश है जो विशेष अर्थ प्रकट करता है। '9-2 11 होना' का अर्थ भाग जाना है।"
                    },
                    {
                        "id": 10,
                        "question": "काल (Tense) के कितने मुख्य भेद होते हैं? उनके नाम लिखिए।",
                        "answer": "काल के तीन मुख्य भेद होते हैं: 1. भूतकाल 2. वर्तमान काल 3. भविष्यत् काल।"
                    }
                ]
            },
            "sectionD": {
                "title": "Long Answer Questions",
                "marksPerQuestion": 5,
                "totalQuestions": 5,
                "totalMarks": 25,
                "questions": [
                    {
                        "id": 1,
                        "question": "भाषा किसे कहते हैं? मौखिक और लिखित भाषा में अंतर स्पष्ट कीजिए।",
                        "answer": "भाषा वह साधन है जिसके द्वारा हम अपने विचारों और भावों का आदान-प्रदान करते हैं। मौखिक भाषा में बोलकर विचार प्रकट किए जाते हैं और सुनकर समझे जाते हैं (जैसे बातचीत), जबकि लिखित भाषा में लिखकर विचार प्रकट किए जाते हैं और पढ़कर समझे जाते हैं (जैसे पत्र, पुस्तक)।"
                    },
                    {
                        "id": 2,
                        "question": "संज्ञा और उसके भेदों का उदाहरण सहित वर्णन कीजिए।",
                        "answer": "किसी व्यक्ति, वस्तु, स्थान या भाव के नाम को संज्ञा कहते हैं। इसके मुख्य तीन भेद हैं: 1. व्यक्तिवाचक संज्ञा (विशेष व्यक्ति/स्थान, जैसे- ताजमहल), 2. जातिवाचक संज्ञा (पूरी जाति का बोध, जैसे- नदी), 3. भाववाचक संज्ञा (गुण/दशा का बोध, जैसे- बुढ़ापा)।"
                    },
                    {
                        "id": 3,
                        "question": "पत्र लेखन का महत्व बताते हुए अपने प्रधानाचार्य को बीमारी के अवकाश के लिए प्रार्थना पत्र लिखिए।",
                        "answer": "पत्र लेखन विचारों के आदान-प्रदान का एक माध्यम है। (प्रार्थना पत्र का प्रारूप: सेवा में, श्रीमान प्रधानाचार्य जी, स्कूल का नाम, विषय: बीमारी के कारण अवकाश, महोदय, सविनय निवेदन है कि मुझे कल रात से तेज बुखार है, अतः मैं विद्यालय आने में असमर्थ हूँ। कृपया मुझे 2 दिन का अवकाश प्रदान करने की कृपा करें। आपका आज्ञाकारी शिष्य, नाम, कक्षा)।"
                    },
                    {
                        "id": 4,
                        "question": "निम्नलिखित विषयों में से किसी एक पर लगभग 100 शब्दों में अनुच्छेद लिखिए: 'मेरा विद्यालय' या 'पुस्तकालय का महत्व'।",
                        "answer": "मेरा विद्यालय मेरे घर के पास है। इसका भवन बहुत बड़ा और सुंदर है। विद्यालय में एक बड़ा खेल का मैदान, एक विज्ञान प्रयोगशाला और एक सुंदर पुस्तकालय है। हमारे अध्यापक बहुत प्यार से पढ़ाते हैं और हमें अच्छे संस्कार देते हैं। मुझे मेरा विद्यालय बहुत प्रिय है।"
                    },
                    {
                        "id": 5,
                        "question": "अपठित गद्यांश को पढ़कर नीचे दिए गए प्रश्नों के उत्तर दीजिए: 'परिश्रम ही सफलता की कुंजी है। जो व्यक्ति मेहनत करता है, वह जीवन में कभी असफल नहीं होता। आलस्य मनुष्य का सबसे बड़ा शत्रु है। इसलिए हमें हमेशा समय का सदुपयोग करना चाहिए और अपने कर्तव्यों का पालन करना चाहिए।' - प्रश्न: (क) सफलता की कुंजी क्या है? (ख) मनुष्य का सबसे बड़ा शत्रु कौन है? (ग) हमें क्या करना चाहिए?",
                        "answer": "(क) सफलता की कुंजी परिश्रम (मेहनत) है। (ख) मनुष्य का सबसे बड़ा शत्रु आलस्य है। (ग) हमें हमेशा समय का सदुपयोग करना चाहिए और अपने कर्तव्यों का पालन करना चाहिए।"
                    }
                ]
            }
        },
        "answerKey": {
            "sectionA": [
                "पुस्तक + आलय",
                "11",
                "दोनों (ख) और (ग)",
                "शशिकांत",
                "वर्तमान काल"
            ],
            "sectionB": [
                "False",
                "True",
                "True",
                "True",
                "False"
            ],
            "sectionC": [
                "किसी व्यक्ति, वस्तु, स्थान या भाव के नाम को संज्ञा कहते हैं; जैसे- राम, दिल्ली, आम।",
                "शब्द के जिस रूप से उसके एक या अनेक होने का बोध हो, उसे वचन कहते हैं। इसके दो भेद हैं - एकवचन और बहुवचन।",
                "जो शब्द संज्ञा के स्थान पर प्रयोग किए जाते हैं, उन्हें सर्वनाम कहते हैं; जैसे- मैं, तुम।",
                "संज्ञा या सर्वनाम की विशेषता बताने वाले शब्दों को विशेषण कहते हैं; जैसे- मीठा आम।",
                "जिस शब्द से पुरुष या स्त्री जाति का बोध हो, उसे लिंग कहते हैं। हिंदी में इसके दो भेद हैं - पुल्लिंग और स्त्रीलिंग।",
                "समान अर्थ प्रकट करने वाले शब्दों को पर्यायवाची कहते हैं। पानी के दो पर्यायवाची जल और नीर हैं।",
                "एक-दूसरे का उल्टा या विपरीत अर्थ देने वाले शब्दों को विलोम शब्द कहते हैं। रात का विलोम दिन है।",
                "जो कभी ना मरे - अमर; जो चित्र बनाता हो - चित्रकार।",
                "मुंहावरा ऐसा वाक्यांश है जो विशेष अर्थ प्रकट करता है। '9-2 11 होना' का अर्थ भाग जाना है।",
                "काल के तीन मुख्य भेद होते हैं: 1. भूतकाल 2. वर्तमान काल 3. भविष्यत् काल।"
            ],
            "sectionD": [
                "भाषा वह साधन है जिसके द्वारा हम अपने विचारों और भावों का आदान-प्रदान करते हैं। मौखिक भाषा में बोलकर विचार प्रकट किए जाते हैं और सुनकर समझे जाते हैं, जबकि लिखित भाषा में लिखकर विचार प्रकट किए जाते हैं और पढ़कर समझे जाते हैं।",
                "किसी व्यक्ति, वस्तु, स्थान या भाव के नाम को संज्ञा कहते हैं। इसके मुख्य तीन भेद हैं: व्यक्तिवाचक संज्ञा, जातिवाचक संज्ञा और भाववाचक संज्ञा।",
                "प्रार्थना पत्र: सेवा में, श्रीमान प्रधानाचार्य जी... (बीमारी के कारण 2 दिन के अवकाश हेतु विधिवत प्रार्थना पत्र)।",
                "अनुच्छेद: 'मेरा विद्यालय' पर छात्र द्वारा लिखा गया लगभग 100 शब्दों का सुंदर निबंध।",
                "(क) परिश्रम (ख) आलस्य (ग) समय का सदुपयोग और कर्तव्यों का पालन।"
            ]
        }
    }

    return res.json({
      success: true,
      data: questionPaper,
      model: "gemini-1.5-flash",
    });

  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    const errorMessage = err.response?.data?.error?.message || err.message;
    return res.status(500).json({
      success: false,
      error: "Failed to generate question paper",
      details: errorMessage,
    });
  }
};

const generateQuestionPaperHindiEnglish = async (req, res) => {
  try {
    const {
      className,
      subject,
      chapter,
      difficulty,
      totalMarks,
      language = "english",
    } = req.body;

    console.log(req.body, "========== req.body ================");

    if (!className || !subject || !totalMarks) {
      return res.status(400).json({
        success: false,
        error: "className, subject, totalMarks are required",
      });
    }

    const langPrompt =
      language === "hindi"
        ? "Generate the question paper in Hindi language."
        : "Generate the question paper in English language.";

    const prompt = `
Generate a question paper for ${className} class ${subject} subject.

Chapter: ${chapter || "General"}
Difficulty Level: ${difficulty || "Medium"}
Total Marks: ${totalMarks}

${langPrompt}

Return ONLY valid JSON.

Do NOT use markdown.
Do NOT use \`\`\`json.
Do NOT add any explanation before or after the JSON.

Use this structure:

{
  "metadata": {
    "className": "${className}",
    "subject": "${subject}",
    "chapter": "${chapter || "General"}",
    "difficulty": "${difficulty || "Medium"}",
    "totalMarks": ${totalMarks},
    "language": "${language}",
    "generatedDate": "${new Date().toISOString().split("T")[0]}"
  },
  "sections": {
    "sectionA": {
      "title": "Multiple Choice Questions",
      "marksPerQuestion": 1,
      "totalQuestions": 5,
      "totalMarks": 5,
      "questions": [
        {
          "id": 1,
          "question": "Question text",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "A"
        }
      ]
    }
  },
  "answerKey": {}
}

Generate real educational questions appropriate for the given class and subject.

Make sure questions are appropriate for the student's age,
cover the given chapter,
and follow the requested difficulty level.

Make sure the total marks equal exactly ${totalMarks}.
`;

    const API_URL =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`;

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

    console.log("========== AI RESPONSE RECEIVED ================");

    const text =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("AI RAW RESPONSE:", text);

    if (!text) {
      throw new Error("Empty response from AI");
    }

    // ==========================================
    // CLEAN AI JSON RESPONSE
    // ==========================================

    let cleanText = text.trim();

    // Remove ```json
    cleanText = cleanText.replace(/^```json\s*/i, "");

    // Remove ```
    cleanText = cleanText.replace(/^```\s*/i, "");

    // Remove ending ```
    cleanText = cleanText.replace(/\s*```$/i, "");

    cleanText = cleanText.trim();

    // ==========================================
    // EXTRACT JSON
    // ==========================================

    const firstBrace = cleanText.indexOf("{");
    const lastBrace = cleanText.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("AI response does not contain valid JSON");
    }

    cleanText = cleanText.substring(firstBrace, lastBrace + 1);

    // ==========================================
    // PARSE JSON
    // ==========================================

    let questionPaper;

    try {
      questionPaper = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("❌ JSON PARSE ERROR");
      console.error("RAW AI RESPONSE:", text);
      console.error("CLEAN RESPONSE:", cleanText);

      throw new Error("AI returned invalid JSON");
    }

    console.log("========== QUESTION PAPER GENERATED ================");

    return res.json({
      success: true,
      data: questionPaper,
      model: "gemini-3.5-flash-lite",
    });

  } catch (err) {
    console.error(err, "========== err ================");

    const errorMessage =
      err.response?.data?.error?.message ||
      err.message ||
      "Unknown error";

    return res.status(500).json({
      success: false,
      error: "Failed to generate question paper",
      details: errorMessage,
    });
  }
};
// controllers/questionPaper.controller.js
const savePaper = async (req, res) => {
  try {
    const { questionPaper, title, language } = req.body;
    if (!questionPaper) {
      return res.status(400).json({ success: false, error: "Question paper data is required" });
    }

    const newPaper = new QuestionPaper({
      title: title || `${questionPaper.metadata.subject}_${questionPaper.metadata.className}`,
      language: language || "english",
      metadata: questionPaper.metadata,
      sections: questionPaper.sections,
      answerKey: questionPaper.answerKey,
    });

    await newPaper.save();
    res.status(201).json({ success: true, data: newPaper });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// List saved papers (optional)
const getSavedPapers = async (req, res) => {
  try {
    const papers = await QuestionPaper.find().sort({ createdAt: -1 });
    res.json({ success: true, data: papers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};




const generateQuestionPaper131 = async (req, res) => {
  try {

  const { className, subject, chapter, difficulty, totalMarks } = req.body;


  console.log(req.body,'==============req.body================');
  

    // Validation
    if (!className || !subject || !totalMarks) {
      return res.status(400).json({
        success: false,
        error: "className, subject, totalMarks are required",
      });
    }

    // Fixed structure – 50 marks (or adjust as per prompt)
    const prompt = `
Generate a question paper for ${className} class ${subject} subject.
Chapter: ${chapter || "General"}
Difficulty Level: ${difficulty || "Medium"}
Total Marks: ${totalMarks || 50}

Strictly return valid JSON only in the following format:

{
  "metadata": {
    "className": "${className}",
    "subject": "${subject}",
    "chapter": "${chapter || "General"}",
    "difficulty": "${difficulty || "Medium"}",
    "totalMarks": ${totalMarks || 50},
    "generatedDate": "${new Date().toISOString().split("T")[0]}"
  },
  "sections": {
    "sectionA": {
      "title": "Multiple Choice Questions",
      "marksPerQuestion": 1,
      "totalQuestions": 5,
      "totalMarks": 5,
      "questions": [
        {"id": 1, "question": "Question text", "options": ["A", "B", "C", "D"], "correctAnswer": "A"}
        // ... 5 questions
      ]
    },
    "sectionB": {
      "title": "True / False Questions",
      "marksPerQuestion": 1,
      "totalQuestions": 5,
      "totalMarks": 5,
      "questions": [
        {"id": 1, "question": "Statement to judge", "answer": "True"}
        // ... 5 questions
      ]
    },
    "sectionC": {
      "title": "Short Answer Questions",
      "marksPerQuestion": 2,
      "totalQuestions": 10,
      "totalMarks": 20,
      "questions": [
        {"id": 1, "question": "Question text", "answer": "Sample answer"}
        // ... 10 questions
      ]
    },
    "sectionD": {
      "title": "Long Answer Questions",
      "marksPerQuestion": 5,
      "totalQuestions": 5,
      "totalMarks": 25,
      "questions": [
        {"id": 1, "question": "Question text", "answer": "Detailed answer"}
        // ... 5 questions
      ]
    }
  },
  "answerKey": {
    "sectionA": ["A", "B", "C", "D", "A"],
    "sectionB": ["True", "False", "True", "False", "True"],
    "sectionC": ["Answer1", "Answer2", ...10],
    "sectionD": ["Answer1", "Answer2", ...5]
  }
}

Generate real educational questions appropriate for the class and subject.
Make sure the question paper is balanced and covers the chapter if given.
`;

    // Use stable model
   // const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await axios.post(
      API_URL,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 60000,
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty response from AI");

    const questionPaper = JSON.parse(text);


    console.log(questionPaper,'===========questionPaper===========');
    




    return res.json({
      success: true,
      data: questionPaper,
      model: "gemini-1.5-flash",
    });

  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    const errorMessage = err.response?.data?.error?.message || err.message;
    return res.status(500).json({
      success: false,
      error: "Failed to generate question paper",
      details: errorMessage,
    });
  }
};


module.exports = { 
  generateQuestionPaper,
  savePaper,
  getSavedPapers
};