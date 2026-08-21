// QuestionPaperGenerator.tsx

import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  CircularProgress,
  Paper,
  Divider,
  Radio,

  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Download,
  Edit,
  Save,
  Print,

  ContentCopy,
  Quiz,

  School,

  CheckCircle,
} from '@mui/icons-material';

interface QuestionPaper {
  metadata: {
    className: string;
    subject: string;
    chapter: string;
    difficulty: string;
    totalMarks: number;
    generatedDate: string;
  };
  sections: {
    sectionA: {
      title: string;
      marksPerQuestion: number;
      totalQuestions: number;
      totalMarks: number;
      questions: Array<{
        id: number;
        question: string;
        options: string[];
        correctAnswer: string;
        userAnswer?: string;
      }>;
    };
    sectionB: {
      title: string;
      marksPerQuestion: number;
      totalQuestions: number;
      totalMarks: number;
      questions: Array<{
        id: number;
        question: string;
        answer: string;
        userAnswer?: string;
      }>;
    };
    sectionC: {
      title: string;
      marksPerQuestion: number;
      totalQuestions: number;
      totalMarks: number;
      questions: Array<{
        id: number;
        question: string;
        answer: string;
        userAnswer?: string;
      }>;
    };
    sectionD: {
      title: string;
      marksPerQuestion: number;
      totalQuestions: number;
      totalMarks: number;
      questions: Array<{
        id: number;
        question: string;
        answer: string;
        userAnswer?: string;
      }>;
    };
  };
  answerKey: {
    sectionA: string[];
    sectionB: string[];
    sectionC: string[];
    sectionD: string[];
  };
}

const QuestionPaperGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [questionPaper, setQuestionPaper] = useState<QuestionPaper | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [paperTitle, setPaperTitle] = useState('');

  // Form fields
  const [formData, setFormData] = useState({
    className: '10th',
    subject: 'Mathematics',
    chapter: '',
    difficulty: 'Medium',
    totalMarks: 50,
  });

  const classes = ['LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
  const subjects = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const generatePaper = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/aicontent/generate', formData);
      if (response.data.success) {
        setQuestionPaper(response.data.data);
        toast.success('Question paper generated successfully!');
      }
    } catch (error) {
      console.error('Error generating paper:', error);
      toast.error('Failed to generate question paper');
    }
    setLoading(false);
  };

  const handleEditQuestion = (section: string, questionId: number, field: string, value: string) => {
    if (!questionPaper) return;
    
    const updatedPaper = { ...questionPaper };
    const sectionData = updatedPaper.sections[section as keyof typeof updatedPaper.sections];
    const question = sectionData.questions.find(q => q.id === questionId);
    
    if (question) {
      (question as any)[field] = value;
      setQuestionPaper(updatedPaper);
    }
  };

  const handleEditOption = (section: string, questionId: number, optionIndex: number, value: string) => {
    if (!questionPaper) return;
    
    const updatedPaper = { ...questionPaper };
    const sectionData = updatedPaper.sections[section as keyof typeof updatedPaper.sections];
    const question = sectionData.questions.find(q => q.id === questionId);
    
    if (question && 'options' in question) {
      question.options[optionIndex] = value;
      setQuestionPaper(updatedPaper);
    }
  };

  const downloadAsPDF = () => {
    if (!questionPaper) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const content = generatePrintableHTML();
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  const generatePrintableHTML = () => {
    if (!questionPaper) return '';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${questionPaper.metadata.subject} - Question Paper</title>
        <style>
          body {
            font-family: 'Times New Roman', serif;
            margin: 40px;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .header h3 {
            margin: 5px 0;
            color: #666;
          }
          .section {
            margin: 25px 0;
            page-break-inside: avoid;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            background: #f0f0f0;
            padding: 8px;
            margin: 15px 0;
          }
          .question {
            margin: 15px 0;
          }
          .options {
            margin-left: 25px;
          }
          .marks {
            float: right;
            font-weight: bold;
          }
          .answer-key {
            margin-top: 40px;
            border-top: 2px solid #000;
            padding-top: 20px;
          }
          footer {
            text-align: center;
            margin-top: 40px;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body {
              margin: 20px;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${questionPaper.metadata.className} - ${questionPaper.metadata.subject}</h1>
          <h3>Chapter: ${questionPaper.metadata.chapter || 'General'}</h3>
          <h3>Difficulty: ${questionPaper.metadata.difficulty}</h3>
          <h3>Total Marks: ${questionPaper.metadata.totalMarks}</h3>
          <h3>Time: 2 Hours</h3>
          <hr />
          <p><strong>Instructions:</strong> All questions are compulsory. Read each question carefully.</p>
        </div>

        ${Object.entries(questionPaper.sections).map(([key, section]) => `
          <div class="section">
            <div class="section-title">
              ${section.title} (${section.totalMarks} Marks)
            </div>
            ${section.questions.map((q: any, idx: number) => `
              <div class="question">
                <strong>${idx + 1}. </strong> ${q.question}
                <span class="marks">[${section.marksPerQuestion}]</span>
                ${q.options ? `
                  <div class="options">
                    ${q.options.map((opt: string, optIdx: number) => `
                      <div>${String.fromCharCode(65 + optIdx)}. ${opt}</div>
                    `).join('')}
                  </div>
                ` : ''}
                ${key === 'sectionB' ? '<div style="margin-top: 5px;"><em>Answer: _________________</em></div>' : ''}
                ${(key === 'sectionC' || key === 'sectionD') ? '<div style="margin-top: 10px;"><em>Answer: ___________________________________________</em></div>' : ''}
              </div>
            `).join('')}
          </div>
        `).join('')}

        ${showAnswerKey ? `
          <div class="answer-key">
            <div class="section-title">ANSWER KEY</div>
            <h3>Section A (Multiple Choice)</h3>
            ${questionPaper.answerKey.sectionA.map((ans, idx) => `<p>${idx + 1}. ${ans}</p>`).join('')}
            <h3>Section B (Fill in the Blanks)</h3>
            ${questionPaper.answerKey.sectionB.map((ans, idx) => `<p>${idx + 1}. ${ans}</p>`).join('')}
            <h3>Section C (Short Answer)</h3>
            ${questionPaper.answerKey.sectionC.map((ans, idx) => `<p>${idx + 1}. ${ans}</p>`).join('')}
            <h3>Section D (Long Answer)</h3>
            ${questionPaper.answerKey.sectionD.map((ans, idx) => `<p>${idx + 1}. ${ans}</p>`).join('')}
          </div>
        ` : ''}

        <footer>
          Best of Luck! | EduManager School
        </footer>
      </body>
      </html>
    `;
  };

  const copyToClipboard = () => {
    const content = generatePrintableHTML();
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };

  const savePaper = async () => {
    if (!questionPaper) return;
    try {
      await axios.post('http://localhost:5000/api/question-paper/save', { 
        questionPaper,
        title: paperTitle || `${questionPaper.metadata.subject}_${questionPaper.metadata.className}`
      });
      toast.success('Question paper saved successfully!');
      setSaveDialogOpen(false);
    } catch (error) {
      toast.error('Failed to save question paper');
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, md: 3 },
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: "white", mb: 1, display: "flex", alignItems: "center", gap: 2 }}>
            <School sx={{ fontSize: 40 }} />
            AI Question Paper Generator
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.8)" }}>
            Generate customized question papers with AI - 50 marks total (5+5+10+30)
          </Typography>
        </Box>

        {/* Generation Form */}
        {!questionPaper && (
          <Card sx={{ p: 4, borderRadius: 4, background: "white" }}>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Generate New Question Paper
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Class</InputLabel>
                  <Select
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    label="Class"
                  >
                    {classes.map(cls => (
                      <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Subject</InputLabel>
                  <Select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    label="Subject"
                  >
                    {subjects.map(sub => (
                      <MenuItem key={sub} value={sub}>{sub}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  label="Chapter (Optional)"
                  value={formData.chapter}
                  onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    label="Difficulty"
                  >
                    {difficulties.map(diff => (
                      <MenuItem key={diff} value={diff}>{diff}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box mt={3} display="flex" justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={generatePaper}
                disabled={loading}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                  }
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : 'Generate Paper'}
              </Button>
            </Box>
          </Card>
        )}

        {/* Question Paper Display */}
        {questionPaper && (
          <>
            {/* Toolbar */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button variant="contained" onClick={downloadAsPDF} startIcon={<Download />}>
                Download PDF
              </Button>
              <Button variant="outlined" onClick={copyToClipboard} startIcon={<ContentCopy />}>
                Copy
              </Button>
              <Button variant="outlined" onClick={() => window.print()} startIcon={<Print />}>
                Print
              </Button>
              <Button variant="outlined" onClick={() => setEditMode(!editMode)} startIcon={<Edit />}>
                {editMode ? 'View Mode' : 'Edit Mode'}
              </Button>
              <Button variant="outlined" onClick={() => setShowAnswerKey(!showAnswerKey)} startIcon={<CheckCircle />}>
                {showAnswerKey ? 'Hide Answer Key' : 'Show Answer Key'}
              </Button>
              <Button variant="outlined" onClick={() => setSaveDialogOpen(true)} startIcon={<Save />}>
                Save Paper
              </Button>
              <Button variant="outlined" onClick={() => setQuestionPaper(null)} color="error">
                Generate New
              </Button>
            </Paper>

            {/* Tabs */}
            <Tabs value={activeTab} onChange={(_e, v) => setActiveTab(v)} sx={{ mb: 2, bgcolor: 'white', borderRadius: 2 }}>
              <Tab label="Question Paper" icon={<Quiz />} />
              <Tab label="Answer Key" icon={<CheckCircle />} />
            </Tabs>

            {/* Question Paper Content */}
            {activeTab === 0 && (
              <Card sx={{ p: 4, borderRadius: 2 }}>
                {/* Header */}
                <Box textAlign="center" mb={4}>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {questionPaper.metadata.className} - {questionPaper.metadata.subject}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    Chapter: {questionPaper.metadata.chapter || 'General'} | Difficulty: {questionPaper.metadata.difficulty}
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    Total Marks: {questionPaper.metadata.totalMarks} | Time: 2 Hours
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color="textSecondary">
                    <strong>Instructions:</strong> All questions are compulsory. Read each question carefully.
                  </Typography>
                </Box>

                {/* Section A - MCQ */}
                <Box mb={4}>
                  <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                    <Typography variant="h6" fontWeight="bold">
                      SECTION A: Multiple Choice Questions (5 × 1 = 5 Marks)
                    </Typography>
                  </Paper>
                  {questionPaper.sections.sectionA.questions.map((q, idx) => (
                    <Box key={q.id} sx={{ mt: 2, p: 2, borderBottom: '1px solid #e0e0e0' }}>
                      <Typography fontWeight="bold">
                        {idx + 1}. {editMode ? (
                          <TextField
                            fullWidth
                            value={q.question}
                            onChange={(e) => handleEditQuestion('sectionA', q.id, 'question', e.target.value)}
                            variant="standard"
                            size="small"
                          />
                        ) : (
                          q.question
                        )}
                        <span style={{ float: 'right', color: '#666' }}>[1]</span>
                      </Typography>
                      <Box sx={{ ml: 4, mt: 1 }}>
                        {q.options.map((opt, optIdx) => (
                          <Box key={optIdx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Radio disabled={!editMode} />
                            {editMode ? (
                              <TextField
                                size="small"
                                value={opt}
                                onChange={(e) => handleEditOption('sectionA', q.id, optIdx, e.target.value)}
                                variant="standard"
                              />
                            ) : (
                              <Typography>{String.fromCharCode(65 + optIdx)}. {opt}</Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Section B - Fill in Blanks */}
                <Box mb={4}>
                  <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                    <Typography variant="h6" fontWeight="bold">
                      SECTION B: Fill in the Blanks (5 × 1 = 5 Marks)
                    </Typography>
                  </Paper>
                  {questionPaper.sections.sectionB.questions.map((q, idx) => (
                    <Box key={q.id} sx={{ mt: 2, p: 2, borderBottom: '1px solid #e0e0e0' }}>
                      <Typography>
                        {idx + 1}. {editMode ? (
                          <TextField
                            fullWidth
                            value={q.question}
                            onChange={(e) => handleEditQuestion('sectionB', q.id, 'question', e.target.value)}
                            variant="standard"
                            size="small"
                          />
                        ) : (
                          q.question
                        )}
                        <span style={{ float: 'right', color: '#666' }}>[1]</span>
                      </Typography>
                      {!editMode && (
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                          Answer: _________________
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>

                {/* Section C - Short Answer */}
                <Box mb={4}>
                  <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                    <Typography variant="h6" fontWeight="bold">
                      SECTION C: Short Answer Questions (5 × 2 = 10 Marks)
                    </Typography>
                  </Paper>
                  {questionPaper.sections.sectionC.questions.map((q, idx) => (
                    <Box key={q.id} sx={{ mt: 2, p: 2, borderBottom: '1px solid #e0e0e0' }}>
                      <Typography>
                        {idx + 1}. {editMode ? (
                          <TextField
                            fullWidth
                            value={q.question}
                            onChange={(e) => handleEditQuestion('sectionC', q.id, 'question', e.target.value)}
                            variant="standard"
                            size="small"
                          />
                        ) : (
                          q.question
                        )}
                        <span style={{ float: 'right', color: '#666' }}>[2]</span>
                      </Typography>
                      {!editMode && (
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                          Answer in 2-3 lines: ___________________________________________
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>

                {/* Section D - Long Answer */}
                <Box mb={4}>
                  <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                    <Typography variant="h6" fontWeight="bold">
                      SECTION D: Long Answer Questions (6 × 5 = 30 Marks)
                    </Typography>
                  </Paper>
                  {questionPaper.sections.sectionD.questions.map((q, idx) => (
                    <Box key={q.id} sx={{ mt: 2, p: 2, borderBottom: '1px solid #e0e0e0' }}>
                      <Typography>
                        {idx + 1}. {editMode ? (
                          <TextField
                            fullWidth
                            value={q.question}
                            onChange={(e) => handleEditQuestion('sectionD', q.id, 'question', e.target.value)}
                            variant="standard"
                            size="small"
                          />
                        ) : (
                          q.question
                        )}
                        <span style={{ float: 'right', color: '#666' }}>[5]</span>
                      </Typography>
                      {!editMode && (
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                          Write detailed answer: ___________________________________________________
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>

                <Box mt={4} textAlign="center">
                  <Typography variant="body2" color="textSecondary">
                    *** Best of Luck ***
                  </Typography>
                </Box>
              </Card>
            )}

            {/* Answer Key Tab */}
            {activeTab === 1 && (
              <Card sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Answer Key
                </Typography>
                
                <Box mb={3}>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    Section A: Multiple Choice Questions
                  </Typography>
                  {questionPaper.answerKey.sectionA.map((ans, idx) => (
                    <Typography key={idx} sx={{ mt: 1 }}>
                      {idx + 1}. {ans}
                    </Typography>
                  ))}
                </Box>

                <Box mb={3}>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    Section B: Fill in the Blanks
                  </Typography>
                  {questionPaper.answerKey.sectionB.map((ans, idx) => (
                    <Typography key={idx} sx={{ mt: 1 }}>
                      {idx + 1}. {ans}
                    </Typography>
                  ))}
                </Box>

                <Box mb={3}>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    Section C: Short Answer Questions
                  </Typography>
                  {questionPaper.answerKey.sectionC.map((ans, idx) => (
                    <Box key={idx} sx={{ mt: 2 }}>
                      <Typography fontWeight="bold">{idx + 1}.</Typography>
                      <Typography sx={{ ml: 2 }}>{ans}</Typography>
                    </Box>
                  ))}
                </Box>

                <Box mb={3}>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    Section D: Long Answer Questions
                  </Typography>
                  {questionPaper.answerKey.sectionD.map((ans, idx) => (
                    <Box key={idx} sx={{ mt: 2 }}>
                      <Typography fontWeight="bold">{idx + 1}.</Typography>
                      <Typography sx={{ ml: 2 }}>{ans}</Typography>
                    </Box>
                  ))}
                </Box>
              </Card>
            )}
          </>
        )}
      </Box>

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Question Paper</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Paper Title"
            fullWidth
            value={paperTitle}
            onChange={(e) => setPaperTitle(e.target.value)}
            placeholder={`${questionPaper?.metadata.subject} - ${questionPaper?.metadata.className}`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={savePaper} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuestionPaperGenerator;

