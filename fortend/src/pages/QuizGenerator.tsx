// QuizGenerator.tsx
import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';



type QuizMethod = 'topic' | 'image' | 'pdf' | 'class';
type QuestionType = 'mcq' | 'truefalse' | 'fillblank';

interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  image?: string; // for image quiz
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  timeLimit: number; // in seconds
}

const QuizGenerator: React.FC = () => {
  // ---------- State ----------
  const [method, setMethod] = useState<QuizMethod>('topic');
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number; correct: number; wrong: number; feedback: string } | null>(null);
  const timerRef = useRef<number | null>(null);

  // ----- Form states for each method -----
  const [topic, setTopic] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [selectedClass, setSelectedClass] = useState('5');
  const [selectedSubject, setSelectedSubject] = useState('Science');
  const [selectedChapter, setSelectedChapter] = useState('Plants');
  const [numQuestions, setNumQuestions] = useState(5);
  const [timeLimit, setTimeLimit] = useState(300); // 5 minutes default

  // Classes, subjects, chapters mock data
  const classOptions = ['1','2','3','4','5','6','7','8','9','10','11','12'];
  const subjectOptions = ['Math', 'Science', 'English', 'History', 'Geography', 'Computer'];
  const chapterOptions: { [key: string]: string[] } = {
    'Science': ['Plants', 'Animals', 'Human Body', 'Solar System', 'Matter', 'Energy'],
    'Math': ['Algebra', 'Geometry', 'Fractions', 'Decimals', 'Statistics'],
    'English': ['Grammar', 'Literature', 'Vocabulary', 'Writing'],
    'History': ['Ancient India', 'World War', 'Mughal Empire', 'Freedom Struggle'],
    'Geography': ['India', 'World Map', 'Climate', 'Rivers'],
    'Computer': ['Hardware', 'Software', 'Internet', 'Programming'],
  };

  // ----- Quiz Generation Functions (mock) -----
  const generateMockQuiz = (title: string, count: number) => {
    const questionPool: Question[] = [
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

    // Select random questions
    const shuffled = [...questionPool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count).map((q, idx) => ({ ...q, id: `q${idx}` }));
    return {
      id: `quiz_${Date.now()}`,
      title: title,
      questions: selected,
      timeLimit: timeLimit,
    };
  };

  // ----- API calls (mock) -----
  const generateQuizFromTopic = async (topic: string) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const quizData = generateMockQuiz(`Quiz on ${topic}`, numQuestions);
      setQuiz(quizData);
      toast.success('Quiz generated successfully!');
    } catch (error) {
      toast.error('Failed to generate quiz.');
    } finally {
      setLoading(false);
    }
  };

  const generateQuizFromImage = async (file: File) => {
    setLoading(true);
    try {

      console.log(file);
      
      // Simulate OCR & AI
      await new Promise(resolve => setTimeout(resolve, 2000));
      const quizData = generateMockQuiz('Image Quiz', numQuestions);
      setQuiz(quizData);
      toast.success('Quiz generated from image!');
    } catch (error) {
      toast.error('Failed to process image.');
    } finally {
      setLoading(false);
    }
  };

  const generateQuizFromPDF = async (file: File) => {
    setLoading(true);
    try {

      console.log(file);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      const quizData = generateMockQuiz('PDF Quiz', numQuestions);
      setQuiz(quizData);
      toast.success('Quiz generated from PDF!');
    } catch (error) {
      toast.error('Failed to process PDF.');
    } finally {
      setLoading(false);
    }
  };

  const generateQuizFromClass = async (cls: string, subject: string, chapter: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const quizData = generateMockQuiz(`Class ${cls} ${subject} - ${chapter}`, numQuestions);
      setQuiz(quizData);
      toast.success('Quiz generated from class!');
    } catch (error) {
      toast.error('Failed to generate quiz.');
    } finally {
      setLoading(false);
    }
  };

  // ----- Start Quiz -----
  const startQuiz = () => {
    if (!quiz) return;
    setQuizStarted(true);
    setTimeLeft(quiz.timeLimit);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizFinished(false);
    setResult(null);
    // Start timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ----- Handle Answer Selection -----
  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  // ----- Go to next question -----
  const nextQuestion = () => {
    if (currentQuestionIndex < quiz!.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // ----- Previous question -----
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // ----- Submit Quiz (finish) -----
  const finishQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!quiz) return;
    // Calculate score
    let correct = 0;
    const total = quiz.questions.length;
    quiz.questions.forEach(q => {
      const userAnswer = answers[q.id];
      if (userAnswer && userAnswer.trim().toLowerCase() === q.correctAnswer.toLowerCase()) {
        correct++;
      }
    });
    const score = Math.round((correct / total) * 100);
    // Mock AI feedback
    let feedback = '';
    if (score >= 80) feedback = 'Excellent! You have a strong grasp of the subject.';
    else if (score >= 60) feedback = 'Good job! Keep practicing to improve further.';
    else if (score >= 40) feedback = 'You need more practice. Focus on the topics you got wrong.';
    else feedback = 'Revise the material thoroughly and try again.';
    setResult({ score, total, correct, wrong: total - correct, feedback });
    setQuizFinished(true);
    toast.success('Quiz completed!');
  };

  // ----- Reset -----
  const resetQuiz = () => {
    setQuiz(null);
    setQuizStarted(false);
    setQuizFinished(false);
    setResult(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // ----- Render Helpers -----
  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'mcq':
        return (
          <div className="space-y-2">
            {question.options?.map((opt, idx) => (
              <label key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer transition">
                <input
                  type="radio"
                  name={`question_${question.id}`}
                  value={opt}
                  checked={answers[question.id] === opt}
                  onChange={() => handleAnswer(question.id, opt)}
                  className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-200">{String.fromCharCode(65 + idx)}. {opt}</span>
              </label>
            ))}
          </div>
        );
      case 'truefalse':
        return (
          <div className="flex gap-4">
            {['True', 'False'].map(val => (
              <label key={val} className="flex items-center gap-2 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer transition flex-1 justify-center">
                <input
                  type="radio"
                  name={`question_${question.id}`}
                  value={val}
                  checked={answers[question.id] === val}
                  onChange={() => handleAnswer(question.id, val)}
                  className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-200">{val}</span>
              </label>
            ))}
          </div>
        );
      case 'fillblank':
        return (
          <input
            type="text"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder="Type your answer..."
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none"
          />
        );
      default:
        return null;
    }
  };

  // ----- Timer display -----
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl shadow-indigo-500/10">
          <h1 className="text-4xl font-extrabold text-center text-white mb-6 flex items-center justify-center gap-3">
            <span className="text-blue-400">🤖</span>
            <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">AI Quiz Generator</span>
          </h1>

          {/* Not in quiz mode: show generation UI */}
          {!quizStarted && !quizFinished && (
            <div>
              {/* Method Tabs */}
              <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-3">
                {(['topic', 'image', 'pdf', 'class'] as QuizMethod[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`px-4 py-2 rounded-xl font-medium transition ${
                      method === m
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {m === 'topic' && '📝 Topic'}
                    {m === 'image' && '📷 Image'}
                    {m === 'pdf' && '📄 PDF'}
                    {m === 'class' && '🏫 Class Wise'}
                  </button>
                ))}
              </div>

              {/* Generation Form */}
              <div className="space-y-4">
                {method === 'topic' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Enter Topic</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. Photosynthesis, Solar System"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none"
                    />
                  </div>
                )}

                {method === 'image' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Upload Chapter Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    />
                  </div>
                )}

                {method === 'pdf' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Upload PDF</label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                      className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    />
                  </div>
                )}

                {method === 'class' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Class</label>
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none"
                      >
                        {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none"
                      >
                        {subjectOptions.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Chapter</label>
                      <select
                        value={selectedChapter}
                        onChange={(e) => setSelectedChapter(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none"
                      >
                        {(chapterOptions[selectedSubject] || []).map(ch => <option key={ch} value={ch}>{ch}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {/* Common settings */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Number of Questions</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Time Limit (seconds)</label>
                    <input
                      type="number"
                      min={30}
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={async () => {
                    if (method === 'topic' && !topic.trim()) {
                      toast.error('Please enter a topic.');
                      return;
                    }
                    if (method === 'image' && !imageFile) {
                      toast.error('Please upload an image.');
                      return;
                    }
                    if (method === 'pdf' && !pdfFile) {
                      toast.error('Please upload a PDF.');
                      return;
                    }
                    if (method === 'topic') await generateQuizFromTopic(topic);
                    else if (method === 'image') await generateQuizFromImage(imageFile!);
                    else if (method === 'pdf') await generateQuizFromPDF(pdfFile!);
                    else if (method === 'class') await generateQuizFromClass(selectedClass, selectedSubject, selectedChapter);
                  }}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                  {loading ? 'Generating...' : '🚀 Generate Quiz'}
                </button>
              </div>

              {/* Show generated quiz preview */}
              {quiz && !quizStarted && (
                <div className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-2">Quiz Ready!</h3>
                  <p className="text-gray-300">Title: {quiz.title}</p>
                  <p className="text-gray-300">Questions: {quiz.questions.length}</p>
                  <p className="text-gray-300">Time: {Math.floor(quiz.timeLimit/60)} min</p>
                  <button
                    onClick={startQuiz}
                    className="mt-3 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition shadow-lg shadow-green-600/20"
                  >
                    ▶️ Start Quiz
                  </button>
                  <button
                    onClick={resetQuiz}
                    className="mt-3 ml-3 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition"
                  >
                    🔄 Regenerate
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quiz Taking Mode */}
          {quizStarted && !quizFinished && quiz && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">{quiz.title}</h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-300">⏱️ {formatTime(timeLeft)}</span>
                  <span className="text-sm text-gray-300">{currentQuestionIndex+1}/{quiz.questions.length}</span>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
                <p className="text-white text-lg font-medium mb-3">{quiz.questions[currentQuestionIndex].question}</p>
                {renderQuestion(quiz.questions[currentQuestionIndex])}
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition"
                >
                  ⬅️ Previous
                </button>
                {currentQuestionIndex === quiz.questions.length - 1 ? (
                  <button
                    onClick={finishQuiz}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition shadow-lg shadow-green-600/20"
                  >
                    📊 Submit Quiz
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-lg shadow-blue-600/20"
                  >
                    Next ➡️
                  </button>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-700 rounded-full h-1.5 mt-4">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all"
                  style={{ width: `${((currentQuestionIndex+1)/quiz.questions.length)*100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Result Mode */}
          {quizFinished && result && quiz && (
            <div>
              <h2 className="text-2xl font-bold text-center text-white mb-4">🏆 Quiz Completed!</h2>
              <div className="bg-gray-800/50 rounded-xl p-6 text-center">
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {result.score}%
                </div>
                <div className="text-gray-300 mt-2">
                  {result.correct} Correct / {result.wrong} Wrong
                </div>
                <div className="mt-4 p-3 bg-gray-700/50 rounded-lg text-gray-200">
                  {result.feedback}
                </div>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-sm">+{result.correct*5} Coins</span>
                  {result.score >= 80 && <span className="px-3 py-1 bg-yellow-900/50 text-yellow-300 rounded-full text-sm">🏅 Quiz Champion</span>}
                </div>
              </div>

              {/* AI Explanation for wrong answers (mock) */}
              <div className="mt-4 bg-gray-800/50 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-2">📚 Review & Explanations</h3>
                {quiz.questions.map((q, idx) => {
                  const userAns = answers[q.id] || 'Not answered';
                  const isCorrect = userAns.trim().toLowerCase() === q.correctAnswer.toLowerCase();
                  return (
                    <div key={q.id} className={`p-2 mb-2 rounded-lg ${isCorrect ? 'bg-green-900/20 border border-green-500/30' : 'bg-red-900/20 border border-red-500/30'}`}>
                      <p className="text-sm text-gray-300"><span className="font-bold">{idx+1}.</span> {q.question}</p>
                      <p className="text-xs text-gray-400">Your answer: <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>{userAns}</span></p>
                      {!isCorrect && <p className="text-xs text-blue-300 mt-1">✅ Correct: {q.correctAnswer}</p>}
                      {q.explanation && <p className="text-xs text-gray-400 mt-1">💡 {q.explanation}</p>}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-lg shadow-blue-600/20"
                >
                  🔄 New Quiz
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition"
                >
                  📄 Download Result
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizGenerator;