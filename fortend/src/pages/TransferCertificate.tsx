// TransferCertificate.tsx

import React, { useState, useEffect, useRef } from 'react';
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
  // RadioGroup,
  // Radio,
  // FormControlLabel,
  // FormLabel,
  // Checkbox,
} from '@mui/material';
import {
  // Download,
  Print,
  Visibility,
  Edit,
  Delete,
  Add,
  Close,
  // School,
  Search,
  PictureAsPdf,
  // EventNote,
  // Assignment,
  Cancel,
  CheckCircle,
  Pending,
  Description,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface TransferCertificate {
  id: string;
  tcNo: string;
  studentId: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  className: string;
  section: string;
  rollNo: string;
  admissionNo: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  religion: string;
  caste: string;
  nationality: string;
  lastAttendedClass: string;
  lastAttendedYear: string;
  dateOfLeaving: string;
  reasonForLeaving: string;
  conduct: 'excellent' | 'very_good' | 'good' | 'satisfactory' | 'poor';
  percentage: number;
  tcType: 'normal' | 'urgent' | 'express';
  paymentStatus: 'paid' | 'pending' | 'partial';
  paymentAmount: number;
  remarks?: string;
  issuedDate: string;
  status: 'pending' | 'issued' | 'rejected';
  principalSignature?: string;
  officeStamp?: string;
  subjects: string[];
  achievements?: string;
  nextAdmissionClass?: string;
  nextSchoolName?: string;
  schoolLeavingReason: string;
}

const TransferCertificate: React.FC = () => {
  const [tcList, setTcList] = useState<TransferCertificate[]>([]);
  const [selectedTC, setSelectedTC] = useState<TransferCertificate | null>(null);
  const [showTCModal, setShowTCModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTC, setEditingTC] = useState<TransferCertificate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [printLoading, setPrintLoading] = useState(false);
  const tcPreviewRef = useRef<HTMLDivElement>(null);

  console.log(tcPreviewRef);
  

  // Static TC data for 5 students
  const initialTCList: TransferCertificate[] = [
    {
      id: 'TC001',
      tcNo: '2024TC001',
      studentId: 'STU001',
      studentName: 'Aarav Sharma',
      fatherName: 'Rajesh Sharma',
      motherName: 'Neha Sharma',
      className: '10th',
      section: 'A',
      rollNo: '101',
      admissionNo: '2024ADM001',
      dateOfBirth: '2010-05-15',
      gender: 'male',
      religion: 'Hindu',
      caste: 'General',
      nationality: 'Indian',
      lastAttendedClass: '10th',
      lastAttendedYear: '2024',
      dateOfLeaving: '2024-12-20',
      reasonForLeaving: 'Parent Transfer',
      conduct: 'excellent',
      percentage: 85.5,
      tcType: 'normal',
      paymentStatus: 'paid',
      paymentAmount: 500,
      remarks: 'Good student, awarded for academic excellence',
      issuedDate: '2024-12-21',
      status: 'issued',
      principalSignature: 'Dr. Rajesh Kumar',
      officeStamp: 'EduManager School',
      subjects: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies'],
      achievements: 'Gold Medal in Mathematics Olympiad',
      nextAdmissionClass: '11th',
      nextSchoolName: 'Delhi Public School, Noida',
      schoolLeavingReason: 'Father transferred to another city',
    },
    {
      id: 'TC002',
      tcNo: '2024TC002',
      studentId: 'STU002',
      studentName: 'Isha Verma',
      fatherName: 'Vikram Verma',
      motherName: 'Priya Verma',
      className: '10th',
      section: 'A',
      rollNo: '102',
      admissionNo: '2024ADM002',
      dateOfBirth: '2010-08-22',
      gender: 'female',
      religion: 'Hindu',
      caste: 'General',
      nationality: 'Indian',
      lastAttendedClass: '10th',
      lastAttendedYear: '2024',
      dateOfLeaving: '2024-12-18',
      reasonForLeaving: 'Family Relocation',
      conduct: 'excellent',
      percentage: 92.8,
      tcType: 'urgent',
      paymentStatus: 'paid',
      paymentAmount: 1000,
      remarks: 'Top performer in Science',
      issuedDate: '2024-12-19',
      status: 'issued',
      principalSignature: 'Dr. Rajesh Kumar',
      officeStamp: 'EduManager School',
      subjects: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies'],
      achievements: 'First Prize in Science Exhibition',
      nextAdmissionClass: '11th Science',
      nextSchoolName: 'Ryan International School',
      schoolLeavingReason: 'Family relocated to Mumbai',
    },
    {
      id: 'TC003',
      tcNo: '2024TC003',
      studentId: 'STU003',
      studentName: 'Rohan Gupta',
      fatherName: 'Amit Gupta',
      motherName: 'Sunita Gupta',
      className: '9th',
      section: 'B',
      rollNo: '201',
      admissionNo: '2024ADM003',
      dateOfBirth: '2011-03-10',
      gender: 'male',
      religion: 'Hindu',
      caste: 'General',
      nationality: 'Indian',
      lastAttendedClass: '9th',
      lastAttendedYear: '2024',
      dateOfLeaving: '2024-12-15',
      reasonForLeaving: 'Seeking better opportunities',
      conduct: 'very_good',
      percentage: 78.5,
      tcType: 'normal',
      paymentStatus: 'pending',
      paymentAmount: 500,
      remarks: 'Good in sports',
      issuedDate: '2024-12-16',
      status: 'pending',
      principalSignature: '',
      officeStamp: '',
      subjects: ['Mathematics', 'Science', 'English', 'Hindi'],
      achievements: 'School Cricket Team Captain',
      nextAdmissionClass: '9th',
      nextSchoolName: 'St. Mary School',
      schoolLeavingReason: 'Parents want better sports facilities',
    },
    {
      id: 'TC004',
      tcNo: '2024TC004',
      studentId: 'STU004',
      studentName: 'Priya Singh',
      fatherName: 'Rajiv Singh',
      motherName: 'Kavita Singh',
      className: '9th',
      section: 'B',
      rollNo: '202',
      admissionNo: '2024ADM004',
      dateOfBirth: '2011-07-18',
      gender: 'female',
      religion: 'Hindu',
      caste: 'General',
      nationality: 'Indian',
      lastAttendedClass: '9th',
      lastAttendedYear: '2024',
      dateOfLeaving: '2024-12-10',
      reasonForLeaving: 'Medical Reasons',
      conduct: 'good',
      percentage: 88.2,
      tcType: 'express',
      paymentStatus: 'paid',
      paymentAmount: 1500,
      remarks: 'Health issues require change of school',
      issuedDate: '2024-12-12',
      status: 'issued',
      principalSignature: 'Dr. Rajesh Kumar',
      officeStamp: 'EduManager School',
      subjects: ['Mathematics', 'Science', 'English', 'Hindi'],
      achievements: 'Best Student Award 2023',
      nextAdmissionClass: '9th',
      nextSchoolName: 'Home Schooling',
      schoolLeavingReason: 'Medical reasons - need home schooling',
    },
    {
      id: 'TC005',
      tcNo: '2024TC005',
      studentId: 'STU005',
      studentName: 'Aditya Kumar',
      fatherName: 'Manoj Kumar',
      motherName: 'Rekha Devi',
      className: '8th',
      section: 'C',
      rollNo: '301',
      admissionNo: '2024ADM005',
      dateOfBirth: '2012-01-05',
      gender: 'male',
      religion: 'Hindu',
      caste: 'General',
      nationality: 'Indian',
      lastAttendedClass: '8th',
      lastAttendedYear: '2024',
      dateOfLeaving: '2024-12-05',
      reasonForLeaving: 'Financial Problems',
      conduct: 'satisfactory',
      percentage: 65.5,
      tcType: 'normal',
      paymentStatus: 'partial',
      paymentAmount: 250,
      remarks: 'Average academic performance',
      issuedDate: '2024-12-07',
      status: 'rejected',
      principalSignature: '',
      officeStamp: '',
      subjects: ['Mathematics', 'Science', 'English', 'Hindi'],
      achievements: 'None',
      nextAdmissionClass: '8th',
      nextSchoolName: 'Government School',
      schoolLeavingReason: 'Financial constraints - moving to government school',
    },
  ];

  useEffect(() => {
    const savedTCList = localStorage.getItem('transferCertificates');
    if (savedTCList) {
      setTcList(JSON.parse(savedTCList));
    } else {
      setTcList(initialTCList);
      localStorage.setItem('transferCertificates', JSON.stringify(initialTCList));
    }
  }, []);

  useEffect(() => {
    if (tcList.length > 0) {
      localStorage.setItem('transferCertificates', JSON.stringify(tcList));
    }
  }, [tcList]);

  const classes = ['8th', '9th', '10th', '11th', '12th'];

  const filteredTCList = tcList.filter(tc => {
    const matchesSearch = tc.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tc.tcNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tc.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'all' || tc.className === filterClass;
    const matchesStatus = filterStatus === 'all' || tc.status === filterStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newTC: TransferCertificate = {
      id: `TC${String(tcList.length + 1).padStart(3, '0')}`,
      tcNo: `2024TC${String(tcList.length + 1).padStart(3, '0')}`,
      studentId: `STU${String(tcList.length + 1).padStart(3, '0')}`,
      studentName: formData.get('studentName') as string,
      fatherName: formData.get('fatherName') as string,
      motherName: formData.get('motherName') as string,
      className: formData.get('className') as string,
      section: formData.get('section') as string,
      rollNo: formData.get('rollNo') as string,
      admissionNo: formData.get('admissionNo') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
      gender: formData.get('gender') as 'male' | 'female' | 'other',
      religion: formData.get('religion') as string,
      caste: formData.get('caste') as string,
      nationality: formData.get('nationality') as string,
      lastAttendedClass: formData.get('lastAttendedClass') as string,
      lastAttendedYear: formData.get('lastAttendedYear') as string,
      dateOfLeaving: formData.get('dateOfLeaving') as string,
      reasonForLeaving: formData.get('reasonForLeaving') as string,
      conduct: formData.get('conduct') as any,
      percentage: parseFloat(formData.get('percentage') as string),
      tcType: formData.get('tcType') as any,
      paymentStatus: formData.get('paymentStatus') as any,
      paymentAmount: parseFloat(formData.get('paymentAmount') as string),
      remarks: formData.get('remarks') as string,
      issuedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      principalSignature: '',
      officeStamp: '',
      subjects: [],
      achievements: formData.get('achievements') as string,
      nextAdmissionClass: formData.get('nextAdmissionClass') as string,
      nextSchoolName: formData.get('nextSchoolName') as string,
      schoolLeavingReason: formData.get('schoolLeavingReason') as string,
    };

    if (editingTC) {
      setTcList(prev => prev.map(t => t.id === editingTC.id ? { ...newTC, id: t.id } : t));
      toast.success('Transfer Certificate updated successfully!');
    } else {
      setTcList(prev => [...prev, newTC]);
      toast.success('Transfer Certificate generated successfully!');
    }
    
    setShowForm(false);
    setEditingTC(null);
  };

  const handleDelete = (tc: TransferCertificate) => {
    if (window.confirm(`Are you sure you want to delete TC for ${tc.studentName}?`)) {
      setTcList(prev => prev.filter(t => t.id !== tc.id));
      toast.success('Transfer Certificate deleted successfully!');
    }
  };

  const viewTC = (tc: TransferCertificate) => {
    setSelectedTC(tc);
    setShowTCModal(true);
  };

  const updateStatus = (tc: TransferCertificate, newStatus: 'issued' | 'rejected') => {
    setTcList(prev => prev.map(t => 
      t.id === tc.id ? { ...t, status: newStatus, issuedDate: newStatus === 'issued' ? new Date().toISOString().split('T')[0] : t.issuedDate } : t
    ));
    toast.success(`TC ${newStatus === 'issued' ? 'issued' : 'rejected'} successfully!`);
  };

  // Get TC HTML for print/PDF
  const getTCHTML = (tc: TransferCertificate) => {
    const conductText = {
      excellent: 'Excellent',
      very_good: 'Very Good',
      good: 'Good',
      satisfactory: 'Satisfactory',
      poor: 'Poor',
    };

    const tcTypeText = {
      normal: 'Normal',
      urgent: 'Urgent',
      express: 'Express',
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Transfer Certificate - ${tc.studentName}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            background: white;
            padding: 30px;
            margin: 0;
          }
          .tc-container {
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
            position: relative;
          }
          .header h1 {
            font-size: 28px;
            margin: 0 0 5px 0;
          }
          .header .subtitle {
            font-size: 14px;
            margin: 5px 0;
            opacity: 0.9;
          }
          .tc-number {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(255,255,255,0.2);
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
          }
          .title {
            background: #1e3a8a;
            color: white;
            text-align: center;
            padding: 12px;
            font-size: 22px;
            font-weight: bold;
            letter-spacing: 2px;
          }
          .content {
            padding: 25px;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #1e3a8a;
            margin-bottom: 12px;
            border-left: 4px solid #1e3a8a;
            padding-left: 10px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .info-row {
            display: flex;
            margin-bottom: 8px;
          }
          .info-label {
            width: 160px;
            font-size: 12px;
            font-weight: bold;
            color: #4b5563;
          }
          .info-value {
            flex: 1;
            font-size: 13px;
            color: #1f2937;
            border-bottom: 1px dotted #d1d5db;
            padding-bottom: 3px;
          }
          .conduct-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
          }
          .conduct-excellent { background: #d1fae5; color: #065f46; }
          .conduct-very_good { background: #dbeafe; color: #1e40af; }
          .conduct-good { background: #fed7aa; color: #92400e; }
          .conduct-satisfactory { background: #fef3c7; color: #92400e; }
          .conduct-poor { background: #fee2e2; color: #991b1b; }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
          }
          .status-issued { background: #d1fae5; color: #065f46; }
          .status-pending { background: #fed7aa; color: #92400e; }
          .status-rejected { background: #fee2e2; color: #991b1b; }
          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
          }
          .signature {
            text-align: center;
            width: 200px;
          }
          .signature-line {
            border-top: 1px solid #333;
            margin-top: 40px;
            padding-top: 8px;
          }
          .footer {
            text-align: center;
            padding: 15px;
            background: #f8fafc;
            font-size: 10px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
          }
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            .tc-container {
              border: 2px solid #1e3a8a;
              margin: 0;
              border-radius: 0;
              page-break-after: avoid;
              break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="tc-container">
          <div class="header">
            <div class="tc-number">TC No: ${tc.tcNo}</div>
            <h1>🏫 EduManager School</h1>
            <div class="subtitle">(Affiliated to CBSE, New Delhi)</div>
            <div class="subtitle">Sector 62, Noida, Uttar Pradesh - 201301</div>
          </div>
          
          <div class="title">
            TRANSFER CERTIFICATE
          </div>
          
          <div class="content">
            <div class="section">
              <div class="section-title">Student Information</div>
              <div class="info-grid">
                <div class="info-row"><div class="info-label">Student Name:</div><div class="info-value">${tc.studentName}</div></div>
                <div class="info-row"><div class="info-label">Father's Name:</div><div class="info-value">${tc.fatherName}</div></div>
                <div class="info-row"><div class="info-label">Mother's Name:</div><div class="info-value">${tc.motherName}</div></div>
                <div class="info-row"><div class="info-label">Date of Birth:</div><div class="info-value">${new Date(tc.dateOfBirth).toLocaleDateString('en-GB')}</div></div>
                <div class="info-row"><div class="info-label">Gender:</div><div class="info-value">${tc.gender === 'male' ? 'Male' : tc.gender === 'female' ? 'Female' : 'Other'}</div></div>
                <div class="info-row"><div class="info-label">Religion:</div><div class="info-value">${tc.religion}</div></div>
                <div class="info-row"><div class="info-label">Caste:</div><div class="info-value">${tc.caste}</div></div>
                <div class="info-row"><div class="info-label">Nationality:</div><div class="info-value">${tc.nationality}</div></div>
                <div class="info-row"><div class="info-label">Admission No:</div><div class="info-value">${tc.admissionNo}</div></div>
                <div class="info-row"><div class="info-label">Roll No:</div><div class="info-value">${tc.rollNo}</div></div>
                <div class="info-row"><div class="info-label">Class & Section:</div><div class="info-value">${tc.className} - Section ${tc.section}</div></div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Academic Information</div>
              <div class="info-grid">
                <div class="info-row"><div class="info-label">Last Attended Class:</div><div class="info-value">${tc.lastAttendedClass}</div></div>
                <div class="info-row"><div class="info-label">Academic Year:</div><div class="info-value">${tc.lastAttendedYear}</div></div>
                <div class="info-row"><div class="info-label">Percentage Obtained:</div><div class="info-value">${tc.percentage}%</div></div>
                <div class="info-row"><div class="info-label">Conduct:</div><div class="info-value"><span class="conduct-badge conduct-${tc.conduct}">${conductText[tc.conduct]}</span></div></div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Leaving Information</div>
              <div class="info-grid">
                <div class="info-row"><div class="info-label">Date of Leaving:</div><div class="info-value">${new Date(tc.dateOfLeaving).toLocaleDateString('en-GB')}</div></div>
                <div class="info-row"><div class="info-label">Reason for Leaving:</div><div class="info-value">${tc.reasonForLeaving}</div></div>
                <div class="info-row"><div class="info-label">TC Type:</div><div class="info-value">${tcTypeText[tc.tcType]}</div></div>
                <div class="info-row"><div class="info-label">Status:</div><div class="info-value"><span class="status-badge status-${tc.status}">${tc.status.toUpperCase()}</span></div></div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Achievements & Remarks</div>
              <div class="info-row"><div class="info-label">Achievements:</div><div class="info-value">${tc.achievements || 'None'}</div></div>
              <div class="info-row"><div class="info-label">Remarks:</div><div class="info-value">${tc.remarks || 'No remarks'}</div></div>
              <div class="info-row"><div class="info-label">Next School:</div><div class="info-value">${tc.nextSchoolName || 'Not specified'}</div></div>
              <div class="info-row"><div class="info-label">Next Class:</div><div class="info-value">${tc.nextAdmissionClass || 'Not specified'}</div></div>
            </div>

            <div class="signatures">
              <div class="signature">
                <div class="signature-line"></div>
                <div>Class Teacher</div>
              </div>
              <div class="signature">
                <div class="signature-line"></div>
                <div>Principal</div>
              </div>
              <div class="signature">
                <div class="signature-line"></div>
                <div>Office Stamp</div>
              </div>
            </div>
          </div>
          
          <div class="footer">
            This Transfer Certificate is issued based on the school records. <br>
            Issued Date: ${new Date(tc.issuedDate).toLocaleDateString('en-GB')} | Generated by EduManager System
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // Print function
  const handlePrint = () => {
    if (!selectedTC) return;
    
    setPrintLoading(true);
    const printContent = getTCHTML(selectedTC);
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

  // Download PDF function
  const downloadAsPDF = async () => {
    if (!selectedTC) return;
    
    setPrintLoading(true);
    toast.loading('Generating PDF...', { id: 'pdf' });
    
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.innerHTML = getTCHTML(selectedTC);
    document.body.appendChild(tempDiv);
    
    const element = tempDiv.querySelector('.tc-container') as HTMLElement;
    
    if (element) {
      try {
        const canvas = await html2canvas(element, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });
        
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save(`Transfer_Certificate_${selectedTC.studentName}_${selectedTC.tcNo}.pdf`);
        
        toast.success('PDF downloaded successfully!', { id: 'pdf' });
      } catch (error) {
        console.error('PDF generation error:', error);
        toast.error('Failed to generate PDF', { id: 'pdf' });
      }
    }
    
    document.body.removeChild(tempDiv);
    setPrintLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'issued': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'issued': return <CheckCircle sx={{ fontSize: 16 }} />;
      case 'pending': return <Pending sx={{ fontSize: 16 }} />;
      case 'rejected': return <Cancel sx={{ fontSize: 16 }} />;
      default: return null;
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
            <Description sx={{ fontSize: 40 }} />
            Transfer Certificate Management
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)" }}>
            Generate and manage transfer certificates for students
          </Typography>
        </Box>

        <Grid container spacing={2} mb={3}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card sx={{ p: 2, bgcolor: 'rgba(102,126,234,0.2)', borderRadius: 3 }}>
              <Typography variant="body2" sx={{ color: '#a78bfa' }}>Total TC Issued</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>{tcList.length}</Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card sx={{ p: 2, bgcolor: 'rgba(16,185,129,0.2)', borderRadius: 3 }}>
              <Typography variant="body2" sx={{ color: '#10b981' }}>Issued</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#10b981' }}>{tcList.filter(t => t.status === 'issued').length}</Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card sx={{ p: 2, bgcolor: 'rgba(245,158,11,0.2)', borderRadius: 3 }}>
              <Typography variant="body2" sx={{ color: '#f59e0b' }}>Pending</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#f59e0b' }}>{tcList.filter(t => t.status === 'pending').length}</Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                setEditingTC(null);
                setShowForm(true);
              }}
              sx={{
                height: '100%',
                minHeight: '80px',
                bgcolor: '#10b981',
                '&:hover': { bgcolor: '#059669' },
                borderRadius: 3,
              }}
            >
              <Add sx={{ mr: 1 }} /> Generate TC
            </Button>
          </Grid>
        </Grid>

        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <TextField
            placeholder="Search by student name, TC no, admission no..."
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
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
              sx={{
                bgcolor: 'rgba(255,255,255,0.05)',
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
              }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="issued">Issued</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.3)' }}>
                <TableCell sx={{ color: 'white' }}>TC No</TableCell>
                <TableCell sx={{ color: 'white' }}>Student Name</TableCell>
                <TableCell sx={{ color: 'white' }}>Class</TableCell>
                <TableCell sx={{ color: 'white' }}>Admission No</TableCell>
                <TableCell sx={{ color: 'white' }}>Date of Leaving</TableCell>
                <TableCell sx={{ color: 'white' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTCList.map((tc) => (
                <TableRow key={tc.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{tc.tcNo}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ bgcolor: '#667eea', width: 32, height: 32 }}>{tc.studentName.charAt(0)}</Avatar>
                      <Typography sx={{ color: 'white' }}>{tc.studentName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>{tc.className}-{tc.section}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{tc.admissionNo}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{new Date(tc.dateOfLeaving).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {/* <Chip
                      icon={getStatusIcon(tc.status)}
                      label={tc.status.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: `${getStatusColor(tc.status)}20`,
                        color: getStatusColor(tc.status),
                      }}
                    /> */}

                    <Chip
  icon={getStatusIcon(tc.status) ?? <span />}
  label={tc.status.toUpperCase()}
  size="small"
  sx={{
    bgcolor: `${getStatusColor(tc.status)}20`,
    color: getStatusColor(tc.status),
  }}
/>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1} justifyContent="center">
                      <Tooltip title="View TC">
                        <IconButton onClick={() => viewTC(tc)} sx={{ color: '#10b981' }}><Visibility /></IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => { setEditingTC(tc); setShowForm(true); }} sx={{ color: '#f59e0b' }}><Edit /></IconButton>
                      </Tooltip>
                      {tc.status === 'pending' && (
                        <>
                          <Tooltip title="Issue TC">
                            <IconButton onClick={() => updateStatus(tc, 'issued')} sx={{ color: '#10b981' }}><CheckCircle /></IconButton>
                          </Tooltip>
                          <Tooltip title="Reject TC">
                            <IconButton onClick={() => updateStatus(tc, 'rejected')} sx={{ color: '#ef4444' }}><Cancel /></IconButton>
                          </Tooltip>
                        </>
                      )}
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(tc)} sx={{ color: '#ef4444' }}><Delete /></IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredTCList.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>No transfer certificates found</Typography>
            </Box>
          )}
        </TableContainer>

        {/* View TC Modal */}
        {showTCModal && selectedTC && (
          <Dialog
            open={showTCModal}
            onClose={() => setShowTCModal(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { bgcolor: '#0f172a', borderRadius: 3 } }}
          >
            <DialogTitle sx={{ bgcolor: '#1e293b', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box display="flex" alignItems="center" gap={1}><Description /> Transfer Certificate</Box>
              <Box>
                <Tooltip title="Download PDF">
                  <IconButton onClick={downloadAsPDF} disabled={printLoading} sx={{ color: '#ef4444', mr: 1 }}>
                    <PictureAsPdf />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Print">
                  <IconButton onClick={handlePrint} disabled={printLoading} sx={{ color: '#10b981', mr: 1 }}>
                    <Print />
                  </IconButton>
                </Tooltip>
                <IconButton onClick={() => setShowTCModal(false)} sx={{ color: 'white' }}><Close /></IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, bgcolor: '#f1f5f9', maxHeight: '70vh', overflow: 'auto' }}>
                <Box sx={{ bgcolor: 'white', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
                  <Box sx={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: 'white', p: 2, textAlign: 'center', position: 'relative' }}>
                    <Typography variant="caption" sx={{ position: 'absolute', top: 10, right: 15 }}>TC No: {selectedTC.tcNo}</Typography>
                    <Typography variant="h5" fontWeight="bold">🏫 EduManager School</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>(Affiliated to CBSE, New Delhi)</Typography>
                    <Typography variant="caption" display="block" sx={{ opacity: 0.85 }}>Sector 62, Noida, Uttar Pradesh - 201301</Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 1, borderTop: '1px solid rgba(255,255,255,0.3)', display: 'inline-block', pt: 1 }}>
                      TRANSFER CERTIFICATE
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#1e3a8a', mb: 1, borderLeft: '3px solid #1e3a8a', pl: 1 }}>Student Information</Typography>
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 6 }}><Typography variant="caption">Student Name:</Typography><Typography variant="body2" fontWeight="bold">{selectedTC.studentName}</Typography></Grid>
                      <Grid size={{ xs: 6 }}><Typography variant="caption">Father's Name:</Typography><Typography variant="body2">{selectedTC.fatherName}</Typography></Grid>
                      <Grid size={{ xs: 6 }}><Typography variant="caption">Mother's Name:</Typography><Typography variant="body2">{selectedTC.motherName}</Typography></Grid>
                      <Grid size={{ xs: 6 }}><Typography variant="caption">Date of Birth:</Typography><Typography variant="body2">{new Date(selectedTC.dateOfBirth).toLocaleDateString()}</Typography></Grid>
                      <Grid size={{ xs: 4 }}><Typography variant="caption">Class & Section:</Typography><Typography variant="body2">{selectedTC.className}-{selectedTC.section}</Typography></Grid>
                      <Grid size={{ xs: 4 }}><Typography variant="caption">Roll No:</Typography><Typography variant="body2">{selectedTC.rollNo}</Typography></Grid>
                      <Grid size={{ xs: 4 }}><Typography variant="caption">Admission No:</Typography><Typography variant="body2">{selectedTC.admissionNo}</Typography></Grid>
                    </Grid>

                    <Divider sx={{ my: 1.5 }} />

                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#1e3a8a', mb: 1, borderLeft: '3px solid #1e3a8a', pl: 1 }}>Academic & Leaving Details</Typography>
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 6 }}><Typography variant="caption">Last Attended Class:</Typography><Typography variant="body2">{selectedTC.lastAttendedClass}</Typography></Grid>
                      <Grid size={{ xs: 6 }}><Typography variant="caption">Percentage:</Typography><Typography variant="body2" fontWeight="bold">{selectedTC.percentage}%</Typography></Grid>
                      <Grid size={{ xs: 6 }}><Typography variant="caption">Date of Leaving:</Typography><Typography variant="body2">{new Date(selectedTC.dateOfLeaving).toLocaleDateString()}</Typography></Grid>
                      <Grid size={{ xs: 6 }}><Typography variant="caption">Reason for Leaving:</Typography><Typography variant="body2">{selectedTC.reasonForLeaving}</Typography></Grid>
                      <Grid size={{ xs: 6 }}><Typography variant="caption">Conduct:</Typography><Typography variant="body2" sx={{ color: '#10b981' }}>{selectedTC.conduct.replace('_', ' ').toUpperCase()}</Typography></Grid>
                      <Grid size={{ xs: 6 }}><Typography variant="caption">Status:</Typography><Chip size="small" label={selectedTC.status.toUpperCase()} sx={{ bgcolor: `${getStatusColor(selectedTC.status)}20`, color: getStatusColor(selectedTC.status) }} /></Grid>
                    </Grid>

                    <Divider sx={{ my: 1.5 }} />

                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#1e3a8a', mb: 1, borderLeft: '3px solid #1e3a8a', pl: 1 }}>Additional Information</Typography>
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 12 }}><Typography variant="caption">Achievements:</Typography><Typography variant="body2">{selectedTC.achievements || 'None'}</Typography></Grid>
                      <Grid size={{ xs: 12 }}><Typography variant="caption">Remarks:</Typography><Typography variant="body2">{selectedTC.remarks || 'No remarks'}</Typography></Grid>
                      <Grid size={{ xs: 12 }}><Typography variant="caption">Next School:</Typography><Typography variant="body2">{selectedTC.nextSchoolName || 'Not specified'}</Typography></Grid>
                    </Grid>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
          </Dialog>
        )}

        {/* Generate TC Form Dialog */}
        <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: '#1e293b', color: 'white' }}>{editingTC ? 'Edit Transfer Certificate' : 'Generate New Transfer Certificate'}</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ bgcolor: '#0f172a' }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}><TextField fullWidth name="studentName" label="Student Name" defaultValue={editingTC?.studentName} required /></Grid>
                <Grid size={{ xs: 6 }}><TextField fullWidth name="fatherName" label="Father's Name" defaultValue={editingTC?.fatherName} required /></Grid>
                <Grid size={{ xs: 6 }}><TextField fullWidth name="motherName" label="Mother's Name" defaultValue={editingTC?.motherName} required /></Grid>
                <Grid size={{ xs: 6 }}><TextField fullWidth type="date" name="dateOfBirth" label="Date of Birth" defaultValue={editingTC?.dateOfBirth} InputLabelProps={{ shrink: true }} required /></Grid>
                <Grid size={{ xs: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Class</InputLabel>
                    <Select name="className" defaultValue={editingTC?.className || '10th'}>
                      {classes.map(cls => <MenuItem key={cls} value={cls}>{cls}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Section</InputLabel>
                    <Select name="section" defaultValue={editingTC?.section || 'A'}>
                      <MenuItem value="A">A</MenuItem><MenuItem value="B">B</MenuItem><MenuItem value="C">C</MenuItem><MenuItem value="D">D</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 4 }}><TextField fullWidth name="rollNo" label="Roll No" defaultValue={editingTC?.rollNo} required /></Grid>
                <Grid size={{ xs: 6 }}><TextField fullWidth name="admissionNo" label="Admission No" defaultValue={editingTC?.admissionNo} required /></Grid>
                <Grid size={{ xs: 6 }}><TextField fullWidth name="percentage" label="Percentage (%)" type="number" defaultValue={editingTC?.percentage} required /></Grid>
                <Grid size={{ xs: 6 }}><TextField fullWidth type="date" name="dateOfLeaving" label="Date of Leaving" defaultValue={editingTC?.dateOfLeaving} InputLabelProps={{ shrink: true }} required /></Grid>
                <Grid size={{ xs: 6 }}><TextField fullWidth name="reasonForLeaving" label="Reason for Leaving" defaultValue={editingTC?.reasonForLeaving} required /></Grid>
                <Grid size={{ xs: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Conduct</InputLabel>
                    <Select name="conduct" defaultValue={editingTC?.conduct || 'good'}>
                      <MenuItem value="excellent">Excellent</MenuItem>
                      <MenuItem value="very_good">Very Good</MenuItem>
                      <MenuItem value="good">Good</MenuItem>
                      <MenuItem value="satisfactory">Satisfactory</MenuItem>
                      <MenuItem value="poor">Poor</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>TC Type</InputLabel>
                    <Select name="tcType" defaultValue={editingTC?.tcType || 'normal'}>
                      <MenuItem value="normal">Normal (₹500)</MenuItem>
                      <MenuItem value="urgent">Urgent (₹1000)</MenuItem>
                      <MenuItem value="express">Express (₹1500)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}><TextField fullWidth name="achievements" label="Achievements (Optional)" defaultValue={editingTC?.achievements} multiline rows={2} /></Grid>
                <Grid size={{ xs: 12 }}><TextField fullWidth name="remarks" label="Remarks (Optional)" defaultValue={editingTC?.remarks} multiline rows={2} /></Grid>
                <Grid size={{ xs: 6 }}><TextField fullWidth name="nextSchoolName" label="Next School Name (Optional)" defaultValue={editingTC?.nextSchoolName} /></Grid>
                <Grid size={{ xs: 6 }}><TextField fullWidth name="nextAdmissionClass" label="Next Class (Optional)" defaultValue={editingTC?.nextAdmissionClass} /></Grid>
                <Grid size={{ xs: 12 }}><TextField fullWidth name="schoolLeavingReason" label="Detailed Reason for Leaving" defaultValue={editingTC?.schoolLeavingReason} multiline rows={2} required /></Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" variant="contained" sx={{ bgcolor: '#10b981' }}>{editingTC ? 'Update' : 'Generate'}</Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Box>
  );
};

export default TransferCertificate;