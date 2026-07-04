// ExamAdmitCard.tsx - Fixed PDF & Print

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Download,
  Print,
  Visibility,
  Edit,
  Delete,
  Add,
  Close,
  School,
  Search,
  PictureAsPdf,
  EventNote,
  Assignment,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExamAdmitCard {
  id: string;
  studentId: string;
  studentName: string;
  fatherName: string;
  className: string;
  section: string;
  rollNo: string;
  enrollmentNo: string;
  examName: string;
  examYear: string;
  examDates: {
    startDate: string;
    endDate: string;
  };
  examCenter: {
    name: string;
    address: string;
    roomNo: string;
  };
  subjects: {
    name: string;
    date: string;
    time: string;
    duration: string;
  }[];
  instructions: string[];
  generatedDate: string;
}

const ExamAdmitCard: React.FC = () => {
  const [students, setStudents] = useState<ExamAdmitCard[]>([]);
  const [selectedAdmitCard, setSelectedAdmitCard] = useState<ExamAdmitCard | null>(null);
  const [showAdmitCard, setShowAdmitCard] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<ExamAdmitCard | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterExam, setFilterExam] = useState<string>('all');
  const [printLoading, setPrintLoading] = useState(false);

  const initialExamAdmitCards: ExamAdmitCard[] = [
    {
      id: 'ADM001',
      studentId: 'STU001',
      studentName: 'Aarav Sharma',
      fatherName: 'Rajesh Sharma',
      className: '10th',
      section: 'A',
      rollNo: '101',
      enrollmentNo: '2024ENR001',
      examName: 'Half-Yearly Examination 2024',
      examYear: '2024-25',
      examDates: {
        startDate: '2024-12-01',
        endDate: '2024-12-15',
      },
      examCenter: {
        name: 'EduManager School',
        address: 'Sector 62, Noida, Uttar Pradesh - 201301',
        roomNo: 'Room No. 101',
      },
      subjects: [
        { name: 'Mathematics', date: '2024-12-01', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
        { name: 'Science', date: '2024-12-03', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
        { name: 'English', date: '2024-12-05', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
        { name: 'Hindi', date: '2024-12-07', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
        { name: 'Social Studies', date: '2024-12-09', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
      ],
      instructions: [
        'Students must report 30 minutes before the exam starts.',
        'Bring your own stationery (pen, pencil, eraser, ruler).',
        'No electronic devices allowed inside the exam hall.',
        'Admit card is mandatory for entry to the examination hall.',
        'Write your roll number and enrollment number on the answer sheet.',
        'Do not write anything on the question paper.',
      ],
      generatedDate: '2024-11-20',
    },
    {
      id: 'ADM002',
      studentId: 'STU002',
      studentName: 'Isha Verma',
      fatherName: 'Vikram Verma',
      className: '10th',
      section: 'A',
      rollNo: '102',
      enrollmentNo: '2024ENR002',
      examName: 'Half-Yearly Examination 2024',
      examYear: '2024-25',
      examDates: {
        startDate: '2024-12-01',
        endDate: '2024-12-15',
      },
      examCenter: {
        name: 'EduManager School',
        address: 'Sector 62, Noida, Uttar Pradesh - 201301',
        roomNo: 'Room No. 102',
      },
      subjects: [
        { name: 'Mathematics', date: '2024-12-01', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
        { name: 'Science', date: '2024-12-03', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
        { name: 'English', date: '2024-12-05', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
        { name: 'Hindi', date: '2024-12-07', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
        { name: 'Social Studies', date: '2024-12-09', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
      ],
      instructions: [
        'Students must report 30 minutes before the exam starts.',
        'Bring your own stationery.',
        'No electronic devices allowed.',
        'Admit card is mandatory for entry.',
      ],
      generatedDate: '2024-11-20',
    },
    {
      id: 'ADM003',
      studentId: 'STU003',
      studentName: 'Rohan Gupta',
      fatherName: 'Amit Gupta',
      className: '9th',
      section: 'B',
      rollNo: '201',
      enrollmentNo: '2024ENR003',
      examName: 'Final Examination 2024',
      examYear: '2024-25',
      examDates: {
        startDate: '2024-12-10',
        endDate: '2024-12-25',
      },
      examCenter: {
        name: 'EduManager School',
        address: 'Sector 62, Noida, Uttar Pradesh - 201301',
        roomNo: 'Room No. 201',
      },
      subjects: [
        { name: 'Mathematics', date: '2024-12-11', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
        { name: 'Science', date: '2024-12-13', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
        { name: 'English', date: '2024-12-15', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
        { name: 'Hindi', date: '2024-12-17', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
      ],
      instructions: [
        'Students must report 30 minutes before the exam starts.',
        'Bring your own stationery.',
        'No electronic devices allowed.',
        'Admit card is mandatory for entry.',
      ],
      generatedDate: '2024-11-25',
    },
    {
      id: 'ADM004',
      studentId: 'STU004',
      studentName: 'Priya Singh',
      fatherName: 'Rajiv Singh',
      className: '9th',
      section: 'B',
      rollNo: '202',
      enrollmentNo: '2024ENR004',
      examName: 'Final Examination 2024',
      examYear: '2024-25',
      examDates: {
        startDate: '2024-12-10',
        endDate: '2024-12-25',
      },
      examCenter: {
        name: 'EduManager School',
        address: 'Sector 62, Noida, Uttar Pradesh - 201301',
        roomNo: 'Room No. 202',
      },
      subjects: [
        { name: 'Mathematics', date: '2024-12-11', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
        { name: 'Science', date: '2024-12-13', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
        { name: 'English', date: '2024-12-15', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
        { name: 'Hindi', date: '2024-12-17', time: '09:00 AM - 12:00 PM', duration: '3 Hours' },
      ],
      instructions: [
        'Students must report 30 minutes before the exam starts.',
        'Bring your own stationery.',
        'No electronic devices allowed.',
        'Admit card is mandatory for entry.',
      ],
      generatedDate: '2024-11-25',
    },
    {
      id: 'ADM005',
      studentId: 'STU005',
      studentName: 'Aditya Kumar',
      fatherName: 'Manoj Kumar',
      className: '8th',
      section: 'C',
      rollNo: '301',
      enrollmentNo: '2024ENR005',
      examName: 'Unit Test 2024',
      examYear: '2024-25',
      examDates: {
        startDate: '2024-11-15',
        endDate: '2024-11-20',
      },
      examCenter: {
        name: 'EduManager School',
        address: 'Sector 62, Noida, Uttar Pradesh - 201301',
        roomNo: 'Room No. 301',
      },
      subjects: [
        { name: 'Mathematics', date: '2024-11-15', time: '09:00 AM - 11:00 AM', duration: '2 Hours' },
        { name: 'Science', date: '2024-11-16', time: '09:00 AM - 11:00 AM', duration: '2 Hours' },
        { name: 'English', date: '2024-11-17', time: '09:00 AM - 11:00 AM', duration: '2 Hours' },
      ],
      instructions: [
        'Students must report 30 minutes before the exam starts.',
        'Bring your own stationery.',
        'No electronic devices allowed.',
        'Admit card is mandatory for entry.',
      ],
      generatedDate: '2024-11-10',
    },
  ];

  useEffect(() => {
    const savedCards = localStorage.getItem('examAdmitCards');
    if (savedCards) {
      setStudents(JSON.parse(savedCards));
    } else {
      setStudents(initialExamAdmitCards);
      localStorage.setItem('examAdmitCards', JSON.stringify(initialExamAdmitCards));
    }
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem('examAdmitCards', JSON.stringify(students));
    }
  }, [students]);

  const classes = ['8th', '9th', '10th', '11th', '12th'];
  const exams = ['Half-Yearly Examination 2024', 'Final Examination 2024', 'Unit Test 2024', 'Annual Examination 2025'];

  const filteredCards = students.filter(card => {
    const matchesSearch = card.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.rollNo.includes(searchTerm) ||
                         card.enrollmentNo.includes(searchTerm);
    const matchesClass = filterClass === 'all' || card.className === filterClass;
    const matchesExam = filterExam === 'all' || card.examName === filterExam;
    return matchesSearch && matchesClass && matchesExam;
  });



  const handleDelete = (card: ExamAdmitCard) => {
    if (window.confirm(`Are you sure you want to delete admit card for ${card.studentName}?`)) {
      setStudents(prev => prev.filter(c => c.id !== card.id));
      toast.success('Admit card deleted successfully!');
    }
  };

  const viewAdmitCard = (card: ExamAdmitCard) => {
    setSelectedAdmitCard(card);
    setShowAdmitCard(true);
  };

  // Generate HTML for print/PDF
  const getAdmitCardHTML = (card: ExamAdmitCard) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Admit Card - ${card.studentName}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            background: white;
            padding: 20px;
            margin: 0;
          }
          .admit-card {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border: 2px solid #1e3a8a;
            border-radius: 12px;
            overflow: hidden;
            page-break-after: avoid;
            break-inside: avoid;
          }
          .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            color: white;
            text-align: center;
            padding: 20px;
          }
          .header h1 {
            font-size: 24px;
            margin: 0 0 5px 0;
          }
          .header .affiliation {
            font-size: 12px;
            margin: 3px 0;
            opacity: 0.9;
          }
          .header .address {
            font-size: 10px;
            margin-top: 5px;
            opacity: 0.85;
          }
          .exam-title {
            background: #1e3a8a;
            color: white;
            text-align: center;
            padding: 10px;
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 1px;
          }
          .section {
            padding: 15px;
          }
          .section-gray {
            background: #f8fafc;
            border-bottom: 1px dashed #cbd5e1;
          }
          .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #1e3a8a;
            margin-bottom: 10px;
            border-left: 3px solid #1e3a8a;
            padding-left: 8px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .info-item {
            display: flex;
            flex-direction: column;
          }
          .info-label {
            font-size: 9px;
            color: #64748b;
            text-transform: uppercase;
          }
          .info-value {
            font-size: 13px;
            font-weight: 600;
            color: #1e293b;
            margin-top: 2px;
          }
          .center-box {
            background: #f1f5f9;
            padding: 10px;
            border-radius: 6px;
            margin-top: 5px;
          }
          .subject-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
            font-size: 12px;
          }
          .subject-table th,
          .subject-table td {
            border: 1px solid #cbd5e1;
            padding: 8px;
            text-align: left;
          }
          .subject-table th {
            background: #e2e8f0;
            font-weight: bold;
          }
          .instructions-list {
            margin-left: 20px;
            margin-top: 8px;
          }
          .instructions-list li {
            margin-bottom: 5px;
            color: #334155;
            font-size: 11px;
            line-height: 1.3;
          }
          .signatures {
            display: flex;
            justify-content: space-between;
            padding: 15px 20px;
            border-top: 1px solid #e2e8f0;
            margin-top: 10px;
          }
          .signature-item {
            text-align: center;
            font-size: 11px;
          }
          .signature-line {
            width: 150px;
            border-top: 1px solid #333;
            margin-top: 25px;
            padding-top: 5px;
          }
          .footer {
            text-align: center;
            padding: 10px;
            background: #f8fafc;
            font-size: 9px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
          }
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            .admit-card {
              border: 2px solid #1e3a8a;
              margin: 0;
              border-radius: 0;
              page-break-after: avoid;
              break-inside: avoid;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="admit-card">
          <div class="header">
            <h1>🏫 EduManager School</h1>
            <div class="affiliation">(Affiliated to CBSE, New Delhi)</div>
            <div class="address">Sector 62, Noida, Uttar Pradesh - 201301</div>
          </div>
          
          <div class="exam-title">
            EXAMINATION ADMIT CARD
          </div>
          
          <div class="section section-gray">
            <div class="section-title">Student Information</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Student Name</div>
                <div class="info-value">${card.studentName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Father's Name</div>
                <div class="info-value">${card.fatherName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Roll Number</div>
                <div class="info-value">${card.rollNo}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Enrollment No</div>
                <div class="info-value">${card.enrollmentNo}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Class & Section</div>
                <div class="info-value">${card.className} - Section ${card.section}</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Examination Details</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Exam Name</div>
                <div class="info-value">${card.examName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Academic Year</div>
                <div class="info-value">${card.examYear}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Start Date</div>
                <div class="info-value">${new Date(card.examDates.startDate).toLocaleDateString('en-GB')}</div>
              </div>
              <div class="info-item">
                <div class="info-label">End Date</div>
                <div class="info-value">${new Date(card.examDates.endDate).toLocaleDateString('en-GB')}</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Exam Center</div>
            <div class="center-box">
              <div class="info-value" style="font-weight: bold;">${card.examCenter.name}</div>
              <div class="info-value" style="font-size: 11px; margin-top: 3px;">${card.examCenter.address}</div>
              <div class="info-value" style="margin-top: 5px;">Room No: ${card.examCenter.roomNo}</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Subject Schedule</div>
            <table class="subject-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                ${card.subjects.map(subject => `
                  <tr>
                    <td>${subject.name}</td>
                    <td>${new Date(subject.date).toLocaleDateString('en-GB')}</td>
                    <td>${subject.time}</td>
                    <td>${subject.duration}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <div class="section-title">Instructions for Candidates</div>
            <ul class="instructions-list">
              ${card.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
            </ul>
          </div>
          
          <div class="signatures">
            <div class="signature-item">
              <div class="signature-line"></div>
              <div>(Controller of Examinations)</div>
            </div>
            <div class="signature-item">
              <div class="signature-line"></div>
              <div>(Principal)</div>
            </div>
          </div>
          
          <div class="footer">
            This admit card is valid only for the mentioned examination period.<br>
            Generated on: ${new Date(card.generatedDate).toLocaleDateString('en-GB')}
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // Print function
  const handlePrint = () => {
    if (!selectedAdmitCard) return;
    
    setPrintLoading(true);
    const printContent = getAdmitCardHTML(selectedAdmitCard);
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = function() {
        printWindow.close();
        setPrintLoading(false);
      };
    } else {
      setPrintLoading(false);
      toast.error('Please allow pop-ups to print');
    }
  };



  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, md: 3 },
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: "white", mb: 1, display: "flex", alignItems: "center", gap: 2 }}>
            <EventNote sx={{ fontSize: 40 }} />
            Examination Admit Card Management
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)" }}>
            Generate and manage exam admit cards for students
          </Typography>
        </Box>

        <Grid container spacing={2} mb={3}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card sx={{ p: 2, bgcolor: 'rgba(102,126,234,0.2)', borderRadius: 3 }}>
              <Typography variant="body2" sx={{ color: '#a78bfa' }}>Total Admit Cards</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>{students.length}</Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card sx={{ p: 2, bgcolor: 'rgba(16,185,129,0.2)', borderRadius: 3 }}>
              <Typography variant="body2" sx={{ color: '#10b981' }}>Exams</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#10b981' }}>{exams.length}</Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card sx={{ p: 2, bgcolor: 'rgba(245,158,11,0.2)', borderRadius: 3 }}>
              <Typography variant="body2" sx={{ color: '#f59e0b' }}>Active Students</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#f59e0b' }}>{students.length}</Typography>
            </Card>
          </Grid>
        </Grid>

        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <TextField
            placeholder="Search by student name, roll no, enrollment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flex: 1,
              minWidth: 250,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255,255,255,0.05)',
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
              '& input': { color: 'white' },
            }}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'rgba(255,255,255,0.5)' }} />,
            }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Class</InputLabel>
            <Select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              label="Class"
              sx={{
                bgcolor: 'rgba(255,255,255,0.05)',
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
              }}
            >
              <MenuItem value="all">All Classes</MenuItem>
              {classes.map(cls => <MenuItem key={cls} value={cls}>{cls}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Exam Name</InputLabel>
            <Select
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
              label="Exam Name"
              sx={{
                bgcolor: 'rgba(255,255,255,0.05)',
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
              }}
            >
              <MenuItem value="all">All Exams</MenuItem>
              {exams.map(exam => <MenuItem key={exam} value={exam}>{exam}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.3)' }}>
                <TableCell sx={{ color: 'white' }}>Roll No</TableCell>
                <TableCell sx={{ color: 'white' }}>Student Name</TableCell>
                <TableCell sx={{ color: 'white' }}>Class</TableCell>
                <TableCell sx={{ color: 'white' }}>Exam Name</TableCell>
                <TableCell sx={{ color: 'white' }}>Enrollment No</TableCell>
                <TableCell sx={{ color: 'white', textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCards.map((card) => (
                <TableRow key={card.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{card.rollNo}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ bgcolor: '#667eea', width: 32, height: 32 }}>{card.studentName.charAt(0)}</Avatar>
                      <Typography sx={{ color: 'white' }}>{card.studentName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>{card.className}-{card.section}</TableCell>
                  <TableCell><Chip label={card.examName} size="small" sx={{ bgcolor: '#3b82f620', color: '#60a5fa' }} /></TableCell>
                  <TableCell sx={{ color: 'white' }}>{card.enrollmentNo}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1} justifyContent="center">
                      <Tooltip title="View Admit Card">
                        <IconButton onClick={() => viewAdmitCard(card)} sx={{ color: '#10b981' }}><Visibility /></IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => { setEditingCard(card); setShowForm(true); }} sx={{ color: '#f59e0b' }}><Edit /></IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(card)} sx={{ color: '#ef4444' }}><Delete /></IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredCards.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>No admit cards found</Typography>
            </Box>
          )}
        </TableContainer>

        {/* View Admit Card Modal */}
        {showAdmitCard && selectedAdmitCard && (
          <Dialog
            open={showAdmitCard}
            onClose={() => setShowAdmitCard(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { bgcolor: '#0f172a', borderRadius: 3 } }}
          >
            <DialogTitle sx={{ bgcolor: '#1e293b', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box display="flex" alignItems="center" gap={1}><Assignment /> Exam Admit Card</Box>
              <Box>
               
                <Tooltip title="Print">
                  <IconButton onClick={handlePrint} disabled={printLoading} sx={{ color: '#10b981', mr: 1 }}>
                    <Print />
                  </IconButton>
                </Tooltip>
                <IconButton onClick={() => setShowAdmitCard(false)} sx={{ color: 'white' }}><Close /></IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, bgcolor: '#f1f5f9', minHeight: 500 }}>
                <Box sx={{ bgcolor: 'white', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
                  <Box sx={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: 'white', p: 3, textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold">🏫 EduManager School</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>(Affiliated to CBSE, New Delhi)</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.85 }}>Sector 62, Noida, Uttar Pradesh - 201301</Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 2, borderTop: '2px solid rgba(255,255,255,0.3)', display: 'inline-block', pt: 1 }}>
                      EXAMINATION ADMIT CARD
                    </Typography>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1e3a8a', mb: 2, borderLeft: '4px solid #1e3a8a', pl: 1 }}>Student Information</Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#666' }}>Student Name</Typography><Typography fontWeight="bold">{selectedAdmitCard.studentName}</Typography></Grid>
                      <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#666' }}>Father's Name</Typography><Typography>{selectedAdmitCard.fatherName}</Typography></Grid>
                      <Grid size={{ xs: 4 }}><Typography variant="caption" sx={{ color: '#666' }}>Roll Number</Typography><Typography fontWeight="bold" sx={{ color: '#1e3a8a' }}>{selectedAdmitCard.rollNo}</Typography></Grid>
                      <Grid size={{ xs: 4 }}><Typography variant="caption" sx={{ color: '#666' }}>Enrollment No</Typography><Typography>{selectedAdmitCard.enrollmentNo}</Typography></Grid>
                      <Grid size={{ xs: 4 }}><Typography variant="caption" sx={{ color: '#666' }}>Class & Section</Typography><Typography>{selectedAdmitCard.className} - {selectedAdmitCard.section}</Typography></Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1e3a8a', mb: 2, borderLeft: '4px solid #1e3a8a', pl: 1 }}>Examination Details</Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#666' }}>Exam Name</Typography><Typography fontWeight="bold">{selectedAdmitCard.examName}</Typography></Grid>
                      <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#666' }}>Academic Year</Typography><Typography>{selectedAdmitCard.examYear}</Typography></Grid>
                      <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#666' }}>Start Date</Typography><Typography>{new Date(selectedAdmitCard.examDates.startDate).toLocaleDateString('en-GB')}</Typography></Grid>
                      <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#666' }}>End Date</Typography><Typography>{new Date(selectedAdmitCard.examDates.endDate).toLocaleDateString('en-GB')}</Typography></Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1e3a8a', mb: 2, borderLeft: '4px solid #1e3a8a', pl: 1 }}>Exam Center</Typography>
                    <Box sx={{ bgcolor: '#f1f5f9', p: 2, borderRadius: 2 }}>
                      <Typography fontWeight="bold">{selectedAdmitCard.examCenter.name}</Typography>
                      <Typography variant="body2">{selectedAdmitCard.examCenter.address}</Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>Room No: {selectedAdmitCard.examCenter.roomNo}</Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1e3a8a', mb: 2, borderLeft: '4px solid #1e3a8a', pl: 1 }}>Subject Schedule</Typography>
                    <TableContainer component={Paper} sx={{ mb: 2 }}>
                      <Table size="small">
                        <TableHead><TableRow sx={{ bgcolor: '#e2e8f0' }}><TableCell><b>Subject</b></TableCell><TableCell><b>Date</b></TableCell><TableCell><b>Time</b></TableCell><TableCell><b>Duration</b></TableCell></TableRow></TableHead>
                        <TableBody>
                          {selectedAdmitCard.subjects.map((subject, idx) => (
                            <TableRow key={idx}><TableCell>{subject.name}</TableCell><TableCell>{new Date(subject.date).toLocaleDateString('en-GB')}</TableCell><TableCell>{subject.time}</TableCell><TableCell>{subject.duration}</TableCell></TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1e3a8a', mb: 2, borderLeft: '4px solid #1e3a8a', pl: 1 }}>Instructions</Typography>
                    <ul style={{ marginLeft: 20 }}>
                      {selectedAdmitCard.instructions.map((instruction, idx) => (<li key={idx} style={{ marginBottom: 5 }}>{instruction}</li>))}
                    </ul>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
          </Dialog>
        )}

       
      </Box>
    </Box>
  );
};

export default ExamAdmitCard;