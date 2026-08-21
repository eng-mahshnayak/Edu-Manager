import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Box, Card, Typography, Grid, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, Avatar, Dialog,
  DialogTitle, DialogContent, TextField, Select, MenuItem, FormControl,
  InputLabel, Tooltip, Divider, Button, Autocomplete,
} from '@mui/material';
import {
  Print, Visibility, Edit, Delete, Close, Search, EventNote, Assignment, Add,
} from '@mui/icons-material';

// ==================== Types ====================
interface Subject {
  name: string;
  date: string;
  time: string;
  duration: string;
}

interface ExamAdmitCard {
  _id: string;
  admitCardId: string;
  studentId: string;
  studentName: string;
  fatherName: string;
  className: string;
  section: string;
  rollNo: string;
  enrollmentNo: string;
  examName: string;
  examYear: string;
  examDates: { startDate: string; endDate: string };
  examCenter: { name: string; address: string; roomNo: string };
  subjects: Subject[];
  instructions: string[];
  generatedDate: string;
}

// ==================== Main Component ====================
const ExamAdmitCard: React.FC = () => {
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const [cards, setCards] = useState<ExamAdmitCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ExamAdmitCard | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCard, setEditingCard] = useState<ExamAdmitCard | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterExam, setFilterExam] = useState<string>('all');
  const [printLoading, setPrintLoading] = useState(false);

  // ----- Student search for form -----
  const [studentOptions, setStudentOptions] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [examName, setExamName] = useState<string>('');
  const [examYear, setExamYear] = useState<string>(new Date().getFullYear() + '-' + (new Date().getFullYear() + 1).toString().slice(2));

  // ----- Constants -----
  const classes = ['8th', '9th', '10th', '11th', '12th'];
  const examOptions = ['Half-Yearly Examination', 'Final Examination', 'Unit Test', 'Annual Examination'];
  const years = ['2023-24', '2024-25', '2025-26'];

  // Subject auto‑fill mapping (based on exam name)
  const defaultSubjects: Record<string, Subject[]> = {
    'Half-Yearly Examination': [
      { name: 'Mathematics', date: '', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
      { name: 'Science', date: '', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
      { name: 'English', date: '', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
      { name: 'Hindi', date: '', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
      { name: 'Social Studies', date: '', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
    ],
    'Final Examination': [
      { name: 'Mathematics', date: '', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
      { name: 'Science', date: '', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
      { name: 'English', date: '', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
      { name: 'Hindi', date: '', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
      { name: 'Social Studies', date: '', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
      { name: 'Computer Science', date: '', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
    ],
    'Unit Test': [
      { name: 'Mathematics', date: '', time: '09:00 AM - 11:00 AM', duration: '2 Hours' },
      { name: 'Science', date: '', time: '09:00 AM - 11:00 AM', duration: '2 Hours' },
      { name: 'English', date: '', time: '09:00 AM - 11:00 AM', duration: '2 Hours' },
    ],
    'Annual Examination': [
      { name: 'Mathematics', date: '', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
      { name: 'Science', date: '', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
      { name: 'English', date: '', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
      { name: 'Hindi', date: '', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
      { name: 'Social Studies', date: '', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
    ],
  };

  // ----- API Functions -----
  const fetchCards = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filterClass !== 'all') params.className = filterClass;
      if (filterExam !== 'all') params.examName = filterExam;
      if (searchTerm) params.search = searchTerm;

      const res = await axios.get(`${API_BASE}/exam-admit-cards`, { params });
      if (res.data.status) {
        setCards(res.data.data);
      } else {
        toast.error(res.data.message || 'Failed to fetch');
      }
    } catch (error) {
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchCards(), 500);
    return () => clearTimeout(timer);
  }, [searchTerm, filterClass, filterExam]);

  // Search students for Autocomplete
  const searchStudents = async (input: string) => {
    if (!input || input.length < 2) return;
    try {
      const res = await axios.get(`${API_BASE}/students`, { params: { search: input, limit: 10 } });
      if (res.data.status) {
        setStudentOptions(res.data.data);
      }
    } catch (error) {
      // ignore
    }
  };

  // On exam selection, auto‑fill subjects
  useEffect(() => {
    if (examName && defaultSubjects[examName]) {
      // Pre‑fill subjects only if not editing and subjects are empty
      if (!editingCard) {
        setSubjects(defaultSubjects[examName]);
      }
    }
  }, [examName]);

  // ----- Form state -----
  const [formStudentId, setFormStudentId] = useState('');
  const [formStudentName, setFormStudentName] = useState('');
  const [formFatherName, setFormFatherName] = useState('');
  const [formClassName, setFormClassName] = useState('');
  const [formSection, setFormSection] = useState('');
  const [formRollNo, setFormRollNo] = useState('');
  const [formEnrollmentNo, setFormEnrollmentNo] = useState('');
  const [formExamName, setFormExamName] = useState('');
  const [formExamYear, setFormExamYear] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formCenterName, setFormCenterName] = useState('');
  const [formCenterAddress, setFormCenterAddress] = useState('');
  const [formRoomNo, setFormRoomNo] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [instructions, setInstructions] = useState('');

  const resetForm = () => {
    setFormStudentId('');
    setFormStudentName('');
    setFormFatherName('');
    setFormClassName('');
    setFormSection('');
    setFormRollNo('');
    setFormEnrollmentNo('');
    setFormExamName('');
    setFormExamYear('');
    setFormStartDate('');
    setFormEndDate('');
    setFormCenterName('');
    setFormCenterAddress('');
    setFormRoomNo('');
    setSubjects([]);
    setInstructions('');
    setSelectedStudent(null);
    setEditingCard(null);
  };

  const openCreateForm = (student?: any) => {
    if (student) {
      // Pre‑fill from student data
      setFormStudentId(student._id);
      setFormStudentName(student.name);
      setFormFatherName(student.fatherName || '');
      setFormClassName(student.class || '');
      setFormSection(student.section || '');
      setFormRollNo(student.rollNumber || '');
      setFormEnrollmentNo(student.enrollmentNo || '');
      setSelectedStudent(student);
    }
    setShowFormModal(true);
  };

  const openEditForm = (card: ExamAdmitCard) => {
    setEditingCard(card);
    setFormStudentId(card.studentId);
    setFormStudentName(card.studentName);
    setFormFatherName(card.fatherName);
    setFormClassName(card.className);
    setFormSection(card.section);
    setFormRollNo(card.rollNo);
    setFormEnrollmentNo(card.enrollmentNo);
    setFormExamName(card.examName);
    setFormExamYear(card.examYear);
    setFormStartDate(card.examDates.startDate);
    setFormEndDate(card.examDates.endDate);
    setFormCenterName(card.examCenter.name);
    setFormCenterAddress(card.examCenter.address);
    setFormRoomNo(card.examCenter.roomNo);
    setSubjects(card.subjects);
    setInstructions(card.instructions.join('\n'));
    setShowFormModal(true);
  };

  // ----- Form Submit -----
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStudentId) {
      toast.error('Please select a student');
      return;
    }
    const data = {
      studentId: formStudentId,
      studentName: formStudentName,
      fatherName: formFatherName,
      className: formClassName,
      section: formSection,
      rollNo: formRollNo,
      enrollmentNo: formEnrollmentNo,
      examName: formExamName,
      examYear: formExamYear,
      examDates: { startDate: formStartDate, endDate: formEndDate },
      examCenter: { name: formCenterName, address: formCenterAddress, roomNo: formRoomNo },
      subjects: subjects,
      instructions: instructions.split('\n').filter(s => s.trim()),
      generatedDate: new Date().toISOString().split('T')[0],
    };

    setLoading(true);
    try {
      let res;
      if (editingCard) {
        res = await axios.put(`${API_BASE}/exam-admit-cards/${editingCard._id}`, data);
      } else {
        res = await axios.post(`${API_BASE}/exam-admit-cards`, data);
      }
      if (res.data.status) {
        toast.success(res.data.message);
        setShowFormModal(false);
        resetForm();
        fetchCards();
      } else {
        toast.error(res.data.message || 'Failed to save');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  // ----- Print (color) -----
  const getAdmitCardHTML = (card: ExamAdmitCard) => {
    // ... same as before (use card fields)
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Admit Card - ${card.studentName}</title>
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body { font-family:'Times New Roman',Times,serif; background:white; padding:20px; margin:0; }
          .admit-card { max-width:900px; margin:0 auto; background:white; border:2px solid #1e3a8a; border-radius:12px; overflow:hidden; page-break-after:avoid; break-inside:avoid; }
          .header { background:linear-gradient(135deg,#1e3a8a,#3b82f6); color:white; text-align:center; padding:20px; }
          .header h1 { font-size:24px; margin:0 0 5px; }
          .header .affiliation { font-size:12px; margin:3px 0; opacity:0.9; }
          .header .address { font-size:10px; margin-top:5px; opacity:0.85; }
          .exam-title { background:#1e3a8a; color:white; text-align:center; padding:10px; font-size:18px; font-weight:bold; letter-spacing:1px; }
          .section { padding:15px; }
          .section-gray { background:#f8fafc; border-bottom:1px dashed #cbd5e1; }
          .section-title { font-size:14px; font-weight:bold; color:#1e3a8a; margin-bottom:10px; border-left:3px solid #1e3a8a; padding-left:8px; }
          .info-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
          .info-item { display:flex; flex-direction:column; }
          .info-label { font-size:9px; color:#64748b; text-transform:uppercase; }
          .info-value { font-size:13px; font-weight:600; color:#1e293b; margin-top:2px; }
          .center-box { background:#f1f5f9; padding:10px; border-radius:6px; margin-top:5px; }
          .subject-table { width:100%; border-collapse:collapse; margin-top:8px; font-size:12px; }
          .subject-table th, .subject-table td { border:1px solid #cbd5e1; padding:8px; text-align:left; }
          .subject-table th { background:#e2e8f0; font-weight:bold; }
          .instructions-list { margin-left:20px; margin-top:8px; }
          .instructions-list li { margin-bottom:5px; color:#334155; font-size:11px; line-height:1.3; }
          .signatures { display:flex; justify-content:space-between; padding:15px 20px; border-top:1px solid #e2e8f0; margin-top:10px; }
          .signature-item { text-align:center; font-size:11px; }
          .signature-line { width:150px; border-top:1px solid #333; margin-top:25px; padding-top:5px; }
          .footer { text-align:center; padding:10px; background:#f8fafc; font-size:9px; color:#64748b; border-top:1px solid #e2e8f0; }
          @media print {
            body { padding:0; margin:0; }
            .admit-card { border:2px solid #1e3a8a; margin:0; border-radius:0; page-break-after:avoid; break-inside:avoid; }
            .no-print { display:none; }
            .header { background:#1e3a8a !important; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
            .exam-title { background:#1e3a8a !important; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
            .section-title { color:#1e3a8a !important; }
          }
        </style>
      </head>
      <body>
        <div class="admit-card">
          <div class="header"><h1>🏫 EduManager School</h1><div class="affiliation">(Affiliated to CBSE, New Delhi)</div><div class="address">Sector 62, Noida, Uttar Pradesh - 201301</div></div>
          <div class="exam-title">EXAMINATION ADMIT CARD</div>
          <div class="section section-gray">
            <div class="section-title">Student Information</div>
            <div class="info-grid">
              <div class="info-item"><div class="info-label">Student Name</div><div class="info-value">${card.studentName}</div></div>
              <div class="info-item"><div class="info-label">Father's Name</div><div class="info-value">${card.fatherName}</div></div>
              <div class="info-item"><div class="info-label">Roll Number</div><div class="info-value">${card.rollNo}</div></div>
              <div class="info-item"><div class="info-label">Enrollment No</div><div class="info-value">${card.enrollmentNo}</div></div>
              <div class="info-item"><div class="info-label">Class & Section</div><div class="info-value">${card.className} - Section ${card.section}</div></div>
            </div>
          </div>
          <div class="section">
            <div class="section-title">Examination Details</div>
            <div class="info-grid">
              <div class="info-item"><div class="info-label">Exam Name</div><div class="info-value">${card.examName}</div></div>
              <div class="info-item"><div class="info-label">Academic Year</div><div class="info-value">${card.examYear}</div></div>
              <div class="info-item"><div class="info-label">Start Date</div><div class="info-value">${new Date(card.examDates.startDate).toLocaleDateString('en-GB')}</div></div>
              <div class="info-item"><div class="info-label">End Date</div><div class="info-value">${new Date(card.examDates.endDate).toLocaleDateString('en-GB')}</div></div>
            </div>
          </div>
          <div class="section">
            <div class="section-title">Exam Center</div>
            <div class="center-box">
              <div class="info-value" style="font-weight:bold;">${card.examCenter.name}</div>
              <div class="info-value" style="font-size:11px;margin-top:3px;">${card.examCenter.address}</div>
              <div class="info-value" style="margin-top:5px;">Room No: ${card.examCenter.roomNo}</div>
            </div>
          </div>
          <div class="section">
            <div class="section-title">Subject Schedule</div>
            <table class="subject-table">
              <thead><tr><th>Subject</th><th>Date</th><th>Time</th><th>Duration</th></tr></thead>
              <tbody>
                ${card.subjects.map(s => `
                  <tr><td>${s.name}</td><td>${new Date(s.date).toLocaleDateString('en-GB')}</td><td>${s.time}</td><td>${s.duration}</td></tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="section">
            <div class="section-title">Instructions</div>
            <ul class="instructions-list">
              ${card.instructions.map(i => `<li>${i}</li>`).join('')}
            </ul>
          </div>
          <div class="signatures">
            <div class="signature-item"><div class="signature-line"></div><div>(Controller of Examinations)</div></div>
            <div class="signature-item"><div class="signature-line"></div><div>(Principal)</div></div>
          </div>
          <div class="footer">Generated on: ${new Date(card.generatedDate).toLocaleDateString('en-GB')}</div>
        </div>
      </body>
      </html>
    `;
  };

  // ----- Render -----
  return (
    <Box sx={{ minHeight: '100vh', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, md: 3 }, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: 'white', mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            <EventNote sx={{ fontSize: 40, color: '#60a5fa' }} />
            Examination Admit Card Management
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Manage admit cards – student details are fetched from student records
          </Typography>
        </Box>

        {/* Stats */}
        <Grid container spacing={2} mb={3}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card sx={{ p: 2, bgcolor: 'rgba(59,130,246,0.2)', borderRadius: 3 }}>
              <Typography variant="body2" sx={{ color: '#93bbfc' }}>Total Admit Cards</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>{cards.length}</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Filters & Add Button */}
        <Box display="flex" gap={2} mb={3} flexWrap="wrap" alignItems="center">
          <TextField
            placeholder="Search by student name, roll no, enrollment..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1, minWidth: 250,
              '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.05)', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }, '& input': { color: 'white' } }}
            InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'rgba(255,255,255,0.5)' }} /> }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Class</InputLabel>
            <Select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} label="Class"
              sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}>
              <MenuItem value="all">All Classes</MenuItem>
              {classes.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Exam Name</InputLabel>
            <Select value={filterExam} onChange={(e) => setFilterExam(e.target.value)} label="Exam Name"
              sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}>
              <MenuItem value="all">All Exams</MenuItem>
              {examOptions.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<Add />} onClick={() => openCreateForm()}
            sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, textTransform: 'none' }}>
            Create Admit Card
          </Button>
        </Box>

        {/* Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.3)' }}>
                  <TableCell sx={{ color: 'white' }}>Admit Card ID</TableCell>
                  <TableCell sx={{ color: 'white' }}>Roll No</TableCell>
                  <TableCell sx={{ color: 'white' }}>Student Name</TableCell>
                  <TableCell sx={{ color: 'white' }}>Class</TableCell>
                  <TableCell sx={{ color: 'white' }}>Exam Name</TableCell>
                  <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cards.map((card) => (
                  <TableRow key={card._id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}>
                    <TableCell sx={{ color: '#60a5fa', fontFamily: 'monospace' }}>{card.admitCardId}</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{card.rollNo}</TableCell>
                    <TableCell><Box display="flex" alignItems="center" gap={1}><Avatar sx={{ bgcolor: '#667eea', width: 32, height: 32 }}>{card.studentName.charAt(0)}</Avatar><Typography sx={{ color: 'white' }}>{card.studentName}</Typography></Box></TableCell>
                    <TableCell sx={{ color: 'white' }}>{card.className}-{card.section}</TableCell>
                    <TableCell><Chip label={card.examName} size="small" sx={{ bgcolor: '#3b82f620', color: '#60a5fa' }} /></TableCell>
                    <TableCell>
                      <Box display="flex" gap={1} justifyContent="center">
                        <Tooltip title="View"><IconButton onClick={() => { setSelectedCard(card); setShowViewModal(true); }} sx={{ color: '#10b981' }}><Visibility /></IconButton></Tooltip>
                        <Tooltip title="Edit"><IconButton onClick={() => openEditForm(card)} sx={{ color: '#f59e0b' }}><Edit /></IconButton></Tooltip>
                        <Tooltip title="Delete"><IconButton onClick={async () => { if (window.confirm('Delete?')) { try { await axios.delete(`${API_BASE}/exam-admit-cards/${card._id}`); toast.success('Deleted'); fetchCards(); } catch { toast.error('Delete failed'); } } }} sx={{ color: '#ef4444' }}><Delete /></IconButton></Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!loading && cards.length === 0 && <Box textAlign="center" py={4}><Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>No admit cards found</Typography></Box>}
        </TableContainer>

        {/* View Modal */}
        {showViewModal && selectedCard && (
          <Dialog open={showViewModal} onClose={() => setShowViewModal(false)} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: '#0f172a', borderRadius: 3 } }}>
            <DialogTitle sx={{ bgcolor: '#1e293b', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box display="flex" alignItems="center" gap={1}><Assignment /> Exam Admit Card</Box>
              <Box>
                <Tooltip title="Print"><IconButton onClick={() => { const win = window.open('', '_blank'); if (win) { win.document.write(getAdmitCardHTML(selectedCard)); win.document.close(); win.focus(); win.print(); } }} sx={{ color: '#10b981', mr: 1 }}><Print /></IconButton></Tooltip>
                <IconButton onClick={() => setShowViewModal(false)} sx={{ color: 'white' }}><Close /></IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 0, bgcolor: '#f1f5f9', minHeight: 500 }}>
              {/* Same inline display as before – but we can just show a preview */}
              <Box sx={{ p: 3 }} dangerouslySetInnerHTML={{ __html: getAdmitCardHTML(selectedCard) }} />
            </DialogContent>
          </Dialog>
        )}

        {/* Create/Edit Form Modal */}
        <Dialog open={showFormModal} onClose={() => { setShowFormModal(false); resetForm(); }} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: '#0f172a', borderRadius: 3, maxHeight: '90vh' } }}>
          <DialogTitle sx={{ bgcolor: '#1e293b', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box display="flex" alignItems="center" gap={1}><EventNote /> {editingCard ? 'Edit Admit Card' : 'Create Admit Card'}</Box>
            <IconButton onClick={() => { setShowFormModal(false); resetForm(); }} sx={{ color: 'white' }}><Close /></IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <form onSubmit={handleFormSubmit}>
              <Grid container spacing={2}>
                {/* Student selection (only for new, edit disabled) */}
                {!editingCard && (
                  <Grid size={{ xs: 12 }}>
                    <Autocomplete
                      options={studentOptions}
                      getOptionLabel={(option) => `${option.name} (${option.class}-${option.section}, Roll: ${option.rollNumber})`}
                      onInputChange={(e, val) => searchStudents(val)}
                      onChange={(e, val) => {
                        if (val) {
                          setFormStudentId(val._id);
                          setFormStudentName(val.name);
                          setFormFatherName(val.fatherName || '');
                          setFormClassName(val.class || '');
                          setFormSection(val.section || '');
                          setFormRollNo(val.rollNumber || '');
                          setFormEnrollmentNo(val.enrollmentNo || '');
                          setSelectedStudent(val);
                        }
                      }}
                      renderInput={(params) => <TextField {...params} label="Search Student" variant="outlined" sx={{ input: { color: 'white' }, label: { color: 'rgba(255,255,255,0.7)' }, '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} />}
                    />
                  </Grid>
                )}
                {/* Readonly student info (for edit) */}
                {editingCard && (
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Student" value={`${formStudentName} (${formClassName}-${formSection})`} disabled variant="outlined" sx={{ input: { color: 'white' }, label: { color: 'rgba(255,255,255,0.7)' }, '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} />
                  </Grid>
                )}
                <Grid size={{ xs: 6 }}><TextField fullWidth label="Student Name" value={formStudentName} disabled variant="outlined" sx={{ input: { color: 'white' }, label: { color: 'rgba(255,255,255,0.7)' }, '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} /></Grid>
                <Grid size={{ xs: 6 }}><TextField fullWidth label="Father's Name" value={formFatherName} disabled variant="outlined" sx={{ input: { color: 'white' }, label: { color: 'rgba(255,255,255,0.7)' }, '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} /></Grid>
                <Grid size={{ xs: 4 }}><TextField fullWidth label="Class" value={formClassName} disabled variant="outlined" sx={{ input: { color: 'white' }, label: { color: 'rgba(255,255,255,0.7)' }, '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} /></Grid>
                <Grid size={{ xs: 4 }}><TextField fullWidth label="Section" value={formSection} disabled variant="outlined" sx={{ input: { color: 'white' }, label: { color: 'rgba(255,255,255,0.7)' }, '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} /></Grid>
                <Grid size={{ xs: 4 }}><TextField fullWidth label="Roll No" value={formRollNo} disabled variant="outlined" sx={{ input: { color: 'white' }, label: { color: 'rgba(255,255,255,0.7)' }, '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} /></Grid>
                <Grid size={{ xs: 12 }}><TextField fullWidth label="Enrollment No" value={formEnrollmentNo} disabled variant="outlined" sx={{ input: { color: 'white' }, label: { color: 'rgba(255,255,255,0.7)' }, '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} /></Grid>

                {/* Exam Details */}
                <Grid size={{ xs: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Exam Name</InputLabel>
                    <Select value={formExamName} onChange={(e) => { setFormExamName(e.target.value); }} label="Exam Name"
                      sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}>
                      {examOptions.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Academic Year</InputLabel>
                    <Select value={formExamYear} onChange={(e) => setFormExamYear(e.target.value)} label="Academic Year"
                      sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}>
                      {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 6 }}><TextField fullWidth label="Start Date" type="date" value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} required variant="outlined" InputLabelProps={{ shrink: true }} sx={{ input: { color: 'white' }, label: { color: 'rgba(255,255,255,0.7)' }, '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} /></Grid>
                <Grid size={{ xs: 6 }}><TextField fullWidth label="End Date" type="date" value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} required variant="outlined" InputLabelProps={{ shrink: true }} sx={{ input: { color: 'white' }, label: { color: 'rgba(255,255,255,0.7)' }, '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} /></Grid>

                {/* Exam Center */}
                <Grid size={{ xs: 6 }}><TextField fullWidth label="Center Name" value={formCenterName} onChange={(e) => setFormCenterName(e.target.value)} required variant="outlined" sx={{ input: { color: 'white' }, label: { color: 'rgba(255,255,255,0.7)' }, '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} /></Grid>
                <Grid size={{ xs: 6 }}><TextField fullWidth label="Room No" value={formRoomNo} onChange={(e) => setFormRoomNo(e.target.value)} required variant="outlined" sx={{ input: { color: 'white' }, label: { color: 'rgba(255,255,255,0.7)' }, '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} /></Grid>
                <Grid size={{ xs: 12 }}><TextField fullWidth label="Center Address" value={formCenterAddress} onChange={(e) => setFormCenterAddress(e.target.value)} required multiline rows={2} variant="outlined" sx={{ input: { color: 'white' }, label: { color: 'rgba(255,255,255,0.7)' }, '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} /></Grid>

                {/* Subjects */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" sx={{ color: '#93bbfc', mb: 1 }}>Subjects</Typography>
                  {subjects.map((sub, idx) => (
                    <Box key={idx} display="flex" gap={1} mb={1}>
                      <TextField size="small" value={sub.name} onChange={(e) => { const newSubs = [...subjects]; newSubs[idx].name = e.target.value; setSubjects(newSubs); }} placeholder="Subject" sx={{ flex: 2, input: { color: 'white' }, '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} />
                      <TextField size="small" type="date" value={sub.date} onChange={(e) => { const newSubs = [...subjects]; newSubs[idx].date = e.target.value; setSubjects(newSubs); }} sx={{ flex: 1, input: { color: 'white' }, '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} />
                      <TextField size="small" value={sub.time} onChange={(e) => { const newSubs = [...subjects]; newSubs[idx].time = e.target.value; setSubjects(newSubs); }} placeholder="Time" sx={{ flex: 1, input: { color: 'white' }, '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} />
                      <TextField size="small" value={sub.duration} onChange={(e) => { const newSubs = [...subjects]; newSubs[idx].duration = e.target.value; setSubjects(newSubs); }} placeholder="Duration" sx={{ flex: 1, input: { color: 'white' }, '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} />
                      <IconButton size="small" onClick={() => setSubjects(subjects.filter((_, i) => i !== idx))} sx={{ color: '#ef4444' }}><Close /></IconButton>
                    </Box>
                  ))}
                  <Button type="button" size="small" onClick={() => setSubjects([...subjects, { name: '', date: '', time: '', duration: '' }])} sx={{ color: '#60a5fa' }}>+ Add Subject</Button>
                </Grid>

                {/* Instructions */}
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Instructions (one per line)" value={instructions} onChange={(e) => setInstructions(e.target.value)} multiline rows={4} variant="outlined" sx={{ textarea: { color: 'white' }, label: { color: 'rgba(255,255,255,0.7)' }, '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} />
                </Grid>
              </Grid>
              <Box display="flex" gap={2} mt={3}>
                <Button type="submit" variant="contained" sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}>{editingCard ? 'Update' : 'Create'}</Button>
                <Button variant="outlined" onClick={() => { setShowFormModal(false); resetForm(); }} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>Cancel</Button>
              </Box>
            </form>
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ExamAdmitCard;