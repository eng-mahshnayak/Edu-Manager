import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Student {
  id: string;
  studentId: string;
  name: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  class: string;
  section: string;
  rollNumber: string;
  admissionDate: string;
  admissionType: 'online' | 'offline';
  phone: string;
  alternatePhone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  documents: {
    aadharCard: string;
    birthCertificate: string;
    previousMarksheet: string;
    passportPhoto: string;
  };
  feeStructure: {
    admissionFee: number;
    monthlyFees: {
      month: string;
      amount: number;
      dueDate: string;
      paid: boolean;
      paidDate?: string;
    }[];
  };
  status: 'active' | 'inactive' | 'transferred';
}

interface CustomFee {
  month: string;
  amount: number;
  dueDate: string;
  selected: boolean;
}

const StudentsAdmission: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [selectedMonthForPayment, setSelectedMonthForPayment] = useState<string>('');
  
  // Custom fee structure state
  const [customFees, setCustomFees] = useState<CustomFee[]>([
    { month: 'April', amount: 2500, dueDate: '2025-04-10', selected: true },
    { month: 'May', amount: 2500, dueDate: '2025-05-10', selected: true },
    { month: 'June', amount: 2500, dueDate: '2025-06-10', selected: true },
    { month: 'July', amount: 2500, dueDate: '2025-07-10', selected: true },
    { month: 'August', amount: 2500, dueDate: '2025-08-10', selected: true },
    { month: 'September', amount: 2500, dueDate: '2025-09-10', selected: true },
    { month: 'October', amount: 2500, dueDate: '2025-10-10', selected: true },
    { month: 'November', amount: 2500, dueDate: '2025-11-10', selected: true },
    { month: 'December', amount: 2500, dueDate: '2025-12-10', selected: true },
    { month: 'January', amount: 2500, dueDate: '2026-01-10', selected: true },
    { month: 'February', amount: 2500, dueDate: '2026-02-10', selected: true },
    { month: 'March', amount: 2500, dueDate: '2026-03-10', selected: true },
  ]);
  
  const [admissionFee, setAdmissionFee] = useState<number>(5000);

  // All months list
  const allMonths = [
    'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December', 'January', 'February', 'March'
  ];

  // Classes list
  const classesList = [
    'Nursery', 'LKG', 'UKG',
    '1st', '2nd', '3rd', '4th', '5th',
    '6th', '7th', '8th', '9th', '10th',
    '11th Science', '11th Commerce', '11th Arts',
    '12th Science', '12th Commerce', '12th Arts'
  ];

  // Sections list
  const sectionsList = ['A', 'B', 'C', 'D'];

  // Initial static data
  const initialStudents: Student[] = [
    {
      id: '1',
      studentId: 'S001',
      name: 'Aarav Sharma',
      fatherName: 'Rajesh Sharma',
      motherName: 'Neha Sharma',
      dateOfBirth: '2015-05-15',
      gender: 'male',
      class: '5th',
      section: 'A',
      rollNumber: '1',
      admissionDate: '2024-03-01',
      admissionType: 'online',
      phone: '9876543210',
      alternatePhone: '9876543211',
      email: 'aarav.sharma@example.com',
      address: '123, Green Park, New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      documents: {
        aadharCard: 'aadhar_001.pdf',
        birthCertificate: 'birth_001.pdf',
        previousMarksheet: 'marksheet_001.pdf',
        passportPhoto: 'photo_001.jpg'
      },
      feeStructure: {
        admissionFee: 5000,
        monthlyFees: [
          { month: 'April', amount: 2500, dueDate: '2024-04-10', paid: true, paidDate: '2024-04-05' },
          { month: 'May', amount: 2500, dueDate: '2024-05-10', paid: false },
          { month: 'June', amount: 2500, dueDate: '2024-06-10', paid: false },
          { month: 'July', amount: 2500, dueDate: '2024-07-10', paid: false },
          { month: 'August', amount: 2500, dueDate: '2024-08-10', paid: false },
          { month: 'September', amount: 2500, dueDate: '2024-09-10', paid: false },
          { month: 'October', amount: 2500, dueDate: '2024-10-10', paid: false },
          { month: 'November', amount: 2500, dueDate: '2024-11-10', paid: false },
          { month: 'December', amount: 2500, dueDate: '2024-12-10', paid: false },
          { month: 'January', amount: 2500, dueDate: '2025-01-10', paid: false },
          { month: 'February', amount: 2500, dueDate: '2025-02-10', paid: false },
          { month: 'March', amount: 2500, dueDate: '2025-03-10', paid: false },
        ]
      },
      status: 'active'
    }
  ];

  useEffect(() => {
    setStudents(initialStudents);
  }, []);

  // Generate Student ID
  const generateStudentId = () => {
    const year = new Date().getFullYear();
    const count = students.length + 1;
    return `S${year}${String(count).padStart(4, '0')}`;
  };

  // Toggle month selection
  const toggleMonthSelection = (index: number) => {
    const updated = [...customFees];
    updated[index].selected = !updated[index].selected;
    setCustomFees(updated);
  };

  // Update month amount
  const updateMonthAmount = (index: number, amount: number) => {
    const updated = [...customFees];
    updated[index].amount = amount;
    setCustomFees(updated);
  };

  // Update month due date
  const updateMonthDueDate = (index: number, dueDate: string) => {
    const updated = [...customFees];
    updated[index].dueDate = dueDate;
    setCustomFees(updated);
  };

  // Select all months
  const selectAllMonths = () => {
    const updated = customFees.map(fee => ({ ...fee, selected: true }));
    setCustomFees(updated);
  };

  // Deselect all months
  const deselectAllMonths = () => {
    const updated = customFees.map(fee => ({ ...fee, selected: false }));
    setCustomFees(updated);
  };

  // Set default fee for all months
  const setDefaultFeeForAll = () => {
    const updated = customFees.map(fee => ({ ...fee, amount: 2500 }));
    setCustomFees(updated);
  };

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Get selected months with custom amounts
    const selectedMonths = customFees.filter(fee => fee.selected).map(fee => ({
      month: fee.month,
      amount: fee.amount,
      dueDate: fee.dueDate,
      paid: false
    }));

    const studentData: Omit<Student, 'id' | 'studentId'> = {
      name: formData.get('name') as string,
      fatherName: formData.get('fatherName') as string,
      motherName: formData.get('motherName') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
      gender: formData.get('gender') as 'male' | 'female' | 'other',
      class: formData.get('class') as string,
      section: formData.get('section') as string,
      rollNumber: formData.get('rollNumber') as string,
      admissionDate: new Date().toISOString().split('T')[0],
      admissionType: formData.get('admissionType') as 'online' | 'offline',
      phone: formData.get('phone') as string,
      alternatePhone: formData.get('alternatePhone') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      pincode: formData.get('pincode') as string,
      documents: {
        aadharCard: (formData.get('aadharCard') as File)?.name || 'pending',
        birthCertificate: (formData.get('birthCertificate') as File)?.name || 'pending',
        previousMarksheet: (formData.get('previousMarksheet') as File)?.name || 'pending',
        passportPhoto: (formData.get('passportPhoto') as File)?.name || 'pending',
      },
      feeStructure: {
        admissionFee: admissionFee,
        monthlyFees: selectedMonths
      },
      status: 'active'
    };

    if (editingStudent) {
      // Update existing student
      setStudents(prev => prev.map(s => 
        s.id === editingStudent.id ? { ...studentData, id: s.id, studentId: s.studentId } : s
      ));
      toast.success('Student updated successfully!');
    } else {
      // Add new student
      const newId = String(students.length + 1);
      const newStudentId = generateStudentId();
      setStudents(prev => [...prev, { 
        ...studentData, 
        id: newId, 
        studentId: newStudentId
      }]);
      
      const totalFee = selectedMonths.reduce((sum, m) => sum + m.amount, 0) + admissionFee;
      toast.success(`Student admitted successfully! Student ID: ${newStudentId}\nTotal Fee: ₹${totalFee.toLocaleString()}`);
    }
    
    setShowAdmissionForm(false);
    setEditingStudent(null);
    // Reset custom fees
    setCustomFees(customFees.map(f => ({ ...f, selected: true })));
    setAdmissionFee(5000);
  };

  // Handle Delete
  const handleDelete = (student: Student) => {
    if (window.confirm(`Are you sure you want to delete ${student.name}'s record?`)) {
      setStudents(prev => prev.filter(s => s.id !== student.id));
      toast.success('Student deleted successfully!');
    }
  };

  // Handle Edit
  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    // Pre-fill custom fees based on student's fee structure
    const updatedFees = customFees.map(fee => {
      const existingFee = student.feeStructure.monthlyFees.find(mf => mf.month === fee.month);
      return {
        ...fee,
        selected: !!existingFee,
        amount: existingFee?.amount || fee.amount,
        dueDate: existingFee?.dueDate || fee.dueDate
      };
    });
    setCustomFees(updatedFees);
    setAdmissionFee(student.feeStructure.admissionFee);
    setShowAdmissionForm(true);
  };

  // Handle Fee Payment
  const handleFeePayment = (student: Student, month?: string) => {
    if (month) {
      // Pay monthly fee
      setStudents(prev => prev.map(s => {
        if (s.id === student.id) {
          const updatedMonthlyFees = s.feeStructure.monthlyFees.map(mf => 
            mf.month === month ? { ...mf, paid: true, paidDate: new Date().toISOString().split('T')[0] } : mf
          );
          const feeAmount = s.feeStructure.monthlyFees.find(mf => mf.month === month)?.amount || 0;
          toast.success(`₹${feeAmount} fee paid for ${month}`);
          return {
            ...s,
            feeStructure: {
              ...s.feeStructure,
              monthlyFees: updatedMonthlyFees
            }
          };
        }
        return s;
      }));
    } else {
      // Pay admission fee
      setStudents(prev => prev.map(s => {
        if (s.id === student.id) {
          toast.success(`Admission fee of ₹${s.feeStructure.admissionFee} paid successfully!`);
          return s;
        }
        return s;
      }));
    }
    setShowFeeModal(false);
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.phone.includes(searchTerm);
    return matchesClass && matchesSearch;
  });

  // Calculate statistics
  const totalStudents = students.length;
  const totalAdmissionFeeCollected = students.reduce((sum, s) => sum + s.feeStructure.admissionFee, 0);
  const totalMonthlyFeeCollected = students.reduce((sum, s) => {
    const paidMonths = s.feeStructure.monthlyFees.filter(mf => mf.paid).length;
    const paidAmount = s.feeStructure.monthlyFees.filter(mf => mf.paid).reduce((amt, mf) => amt + mf.amount, 0);
    return sum + paidAmount;
  }, 0);
  
  const pendingFees = students.reduce((sum, s) => {
    const unpaidMonths = s.feeStructure.monthlyFees.filter(mf => !mf.paid).reduce((amt, mf) => amt + mf.amount, 0);
    return sum + unpaidMonths;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            Student Admission & Management
          </h1>
          <p className="text-gray-400 mt-1">Manage student admissions, custom fee structure, and generate student IDs</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Students</p>
                <p className="text-2xl font-bold text-white">{totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Fee Collected</p>
                <p className="text-2xl font-bold text-green-400">₹{(totalAdmissionFeeCollected + totalMonthlyFeeCollected).toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Fees</p>
                <p className="text-2xl font-bold text-red-400">₹{pendingFees.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Monthly Fee</p>
                <p className="text-2xl font-bold text-purple-400">₹2,500</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, ID or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
            >
              <option value="all">All Classes</option>
              {classesList.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            
            <button
              onClick={() => {
                setEditingStudent(null);
                setCustomFees(customFees.map(f => ({ ...f, selected: true })));
                setAdmissionFee(5000);
                setShowAdmissionForm(true);
              }}
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Admission
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Student ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Student Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Class</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Parent Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fee Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredStudents.map((student) => {
                  const totalMonths = student.feeStructure.monthlyFees.length;
                  const paidMonths = student.feeStructure.monthlyFees.filter(mf => mf.paid).length;
                  const feePercentage = totalMonths > 0 ? (paidMonths / totalMonths) * 100 : 0;
                  const totalMonthlyAmount = student.feeStructure.monthlyFees.reduce((sum, mf) => sum + mf.amount, 0);
                  
                  return (
                    <tr key={student.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-mono text-blue-400">{student.studentId}</p>
                          <p className="text-xs text-gray-500">Roll: {student.rollNumber}</p>
                        </div>
                       </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{student.name}</p>
                            <p className="text-xs text-gray-400">{student.class}-{student.section}</p>
                          </div>
                        </div>
                       </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                          {student.class} - {student.section}
                        </span>
                       </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-white">{student.phone}</p>
                        <p className="text-xs text-gray-500">{student.fatherName}</p>
                       </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${student.feeStructure.admissionFee > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className="text-xs text-gray-400">Admission: ₹{student.feeStructure.admissionFee}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${feePercentage}%` }}></div>
                          </div>
                          <p className="text-xs text-gray-500">{paidMonths}/{totalMonths} months paid (₹{totalMonthlyAmount}/year)</p>
                        </div>
                       </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowDetailsModal(true);
                            }}
                            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                            title="View Details"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEdit(student)}
                            className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowFeeModal(true);
                            }}
                            className="p-1 text-green-400 hover:text-green-300 transition-colors"
                            title="Pay Fee"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(student)}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                       </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No students found</p>
            </div>
          )}
        </div>
      </div>

      {/* Admission Form Modal with Custom Fee Structure */}
      {showAdmissionForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {editingStudent ? 'Edit Student Details' : 'New Student Admission'}
              </h2>
              <button
                onClick={() => {
                  setShowAdmissionForm(false);
                  setEditingStudent(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Personal Information */}
                <div className="md:col-span-2">
                  <h3 className="text-md font-semibold text-blue-400 mb-3">Personal Information</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
                  <input type="text" name="name" defaultValue={editingStudent?.name} required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Father's Name *</label>
                  <input type="text" name="fatherName" defaultValue={editingStudent?.fatherName} required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Mother's Name *</label>
                  <input type="text" name="motherName" defaultValue={editingStudent?.motherName} required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Date of Birth *</label>
                  <input type="date" name="dateOfBirth" defaultValue={editingStudent?.dateOfBirth} required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Gender *</label>
                  <select name="gender" defaultValue={editingStudent?.gender || 'male'} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                {/* Academic Information */}
                <div className="md:col-span-2 mt-2">
                  <h3 className="text-md font-semibold text-blue-400 mb-3">Academic Information</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Class *</label>
                  <select name="class" defaultValue={editingStudent?.class} required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none">
                    <option value="">Select Class</option>
                    {classesList.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Section *</label>
                  <select name="section" defaultValue={editingStudent?.section} required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none">
                    <option value="">Select Section</option>
                    {sectionsList.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Roll Number *</label>
                  <input type="text" name="rollNumber" defaultValue={editingStudent?.rollNumber} required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Admission Type *</label>
                  <select name="admissionType" defaultValue={editingStudent?.admissionType || 'online'} required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none">
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>

                {/* Contact Information */}
                <div className="md:col-span-2 mt-2">
                  <h3 className="text-md font-semibold text-blue-400 mb-3">Contact Information</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number *</label>
                  <input type="tel" name="phone" defaultValue={editingStudent?.phone} required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Alternate Phone</label>
                  <input type="tel" name="alternatePhone" defaultValue={editingStudent?.alternatePhone} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
                  <input type="email" name="email" defaultValue={editingStudent?.email} required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Address *</label>
                  <textarea name="address" defaultValue={editingStudent?.address} rows={2} required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">City *</label>
                  <input type="text" name="city" defaultValue={editingStudent?.city} required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">State *</label>
                  <input type="text" name="state" defaultValue={editingStudent?.state} required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Pincode *</label>
                  <input type="text" name="pincode" defaultValue={editingStudent?.pincode} required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none" />
                </div>

                {/* Document Upload */}
                <div className="md:col-span-2 mt-2">
                  <h3 className="text-md font-semibold text-blue-400 mb-3">Required Documents</h3>
                  <p className="text-xs text-gray-500 mb-3">Please upload clear copies of the following documents (PDF/JPG/PNG)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Aadhar Card *</label>
                  <input type="file" name="aadharCard" accept=".pdf,.jpg,.png" className="w-full text-gray-400 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Birth Certificate *</label>
                  <input type="file" name="birthCertificate" accept=".pdf,.jpg,.png" className="w-full text-gray-400 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Previous Marksheet</label>
                  <input type="file" name="previousMarksheet" accept=".pdf,.jpg,.png" className="w-full text-gray-400 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Passport Size Photo *</label>
                  <input type="file" name="passportPhoto" accept=".jpg,.png" className="w-full text-gray-400 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600" />
                </div>

                {/* Custom Fee Structure Section */}
                <div className="md:col-span-2 mt-4">
                  <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-md font-semibold text-blue-400">Custom Fee Structure</h3>
                      <div className="flex gap-2">
                        <button type="button" onClick={selectAllMonths} className="text-xs bg-blue-600 px-2 py-1 rounded hover:bg-blue-700">Select All</button>
                        <button type="button" onClick={deselectAllMonths} className="text-xs bg-gray-600 px-2 py-1 rounded hover:bg-gray-700">Deselect All</button>
                        <button type="button" onClick={setDefaultFeeForAll} className="text-xs bg-green-600 px-2 py-1 rounded hover:bg-green-700">Set ₹2500 All</button>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-1">Admission Fee (One Time)</label>
                      <input
                        type="number"
                        value={admissionFee}
                        onChange={(e) => setAdmissionFee(Number(e.target.value))}
                        className="w-48 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                        placeholder="Admission Fee"
                      />
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-3">Select months and set custom fee amounts:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto p-2">
                      {customFees.map((fee, index) => (
                        <div key={fee.month} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                          <input
                            type="checkbox"
                            checked={fee.selected}
                            onChange={() => toggleMonthSelection(index)}
                            className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                          />
                          <span className="text-sm text-white w-24">{fee.month}</span>
                          <input
                            type="number"
                            value={fee.amount}
                            onChange={(e) => updateMonthAmount(index, Number(e.target.value))}
                            disabled={!fee.selected}
                            className="w-24 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-blue-500 outline-none disabled:opacity-50"
                            placeholder="Amount"
                          />
                          <input
                            type="date"
                            value={fee.dueDate}
                            onChange={(e) => updateMonthDueDate(index, e.target.value)}
                            disabled={!fee.selected}
                            className="w-32 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-blue-500 outline-none disabled:opacity-50"
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 p-2 bg-gray-800/30 rounded-lg">
                      <p className="text-sm text-gray-300">
                        Total Monthly Fee: <span className="text-yellow-400 font-bold">
                          ₹{customFees.filter(f => f.selected).reduce((sum, f) => sum + f.amount, 0).toLocaleString()}
                        </span> / year
                      </p>
                      <p className="text-sm text-gray-300">
                        Total Admission + Yearly Fee: <span className="text-green-400 font-bold">
                          ₹{(admissionFee + customFees.filter(f => f.selected).reduce((sum, f) => sum + f.amount, 0)).toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all">
                  {editingStudent ? 'Update Student' : 'Admit Student'}
                </button>
                <button type="button" onClick={() => { setShowAdmissionForm(false); setEditingStudent(null); }} className="px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {showDetailsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl max-w-3xl w-full border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Student Details & ID Card</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {/* ID Card Style Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-4 mb-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">EduManager School</h3>
                    <p className="text-sm opacity-90">Student Identity Card</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-80">ID: {selectedStudent.studentId}</p>
                    <p className="text-xs opacity-80">Valid Till: March 2025</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Student Name</p>
                  <p className="text-white font-medium">{selectedStudent.name}</p>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Father's Name</p>
                  <p className="text-white">{selectedStudent.fatherName}</p>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Class & Section</p>
                  <p className="text-white">{selectedStudent.class} - {selectedStudent.section}</p>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Roll Number</p>
                  <p className="text-white">{selectedStudent.rollNumber}</p>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Date of Birth</p>
                  <p className="text-white">{selectedStudent.dateOfBirth}</p>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Admission Date</p>
                  <p className="text-white">{selectedStudent.admissionDate}</p>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-white">{selectedStudent.phone}</p>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-white">{selectedStudent.email}</p>
                </div>
                <div className="md:col-span-2 bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-white">{selectedStudent.address}, {selectedStudent.city}, {selectedStudent.state} - {selectedStudent.pincode}</p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-sm text-green-400 font-medium mb-2">Fee Structure:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <p className="text-gray-300">Admission Fee: ₹{selectedStudent.feeStructure.admissionFee}</p>
                  <p className="text-gray-300">Total Monthly Fee: ₹{selectedStudent.feeStructure.monthlyFees.reduce((sum, m) => sum + m.amount, 0)}/year</p>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-400 mb-1">Monthly Fee Details:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedStudent.feeStructure.monthlyFees.map(mf => (
                      <span key={mf.month} className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded-full">
                        {mf.month}: ₹{mf.amount}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print ID Card
              </button>
              <button onClick={() => setShowDetailsModal(false)} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fee Payment Modal */}
      {showFeeModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-md w-full border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Pay Fees - {selectedStudent.name}</h2>
              <button onClick={() => setShowFeeModal(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4 p-3 bg-blue-500/10 rounded-lg">
                <p className="text-sm text-gray-300">Student ID: <span className="text-blue-400">{selectedStudent.studentId}</span></p>
                <p className="text-sm text-gray-300">Class: {selectedStudent.class}-{selectedStudent.section}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Admission Fee</p>
                    <p className="text-xs text-gray-500">One time payment</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 font-bold">₹{selectedStudent.feeStructure.admissionFee}</p>
                    {selectedStudent.feeStructure.admissionFee > 0 ? (
                      <span className="text-xs text-green-400">Paid</span>
                    ) : (
                      <button onClick={() => { handleFeePayment(selectedStudent); setShowFeeModal(false); }} className="text-xs bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-700">Pay Now</button>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-gray-700 my-2"></div>
                
                <p className="text-sm font-medium text-gray-300">Monthly Tuition Fees</p>
                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                  {selectedStudent.feeStructure.monthlyFees.map(month => (
                    <div key={month.month} className="flex justify-between items-center p-2 bg-gray-800/30 rounded-lg">
                      <div>
                        <span className="text-sm text-gray-300">{month.month}</span>
                        <p className="text-xs text-gray-500">Due: {month.dueDate}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-yellow-400">₹{month.amount}</span>
                        {month.paid ? (
                          <span className="text-xs text-green-400">Paid on {month.paidDate}</span>
                        ) : (
                          <button onClick={() => { handleFeePayment(selectedStudent, month.month); setShowFeeModal(false); }} className="text-xs bg-green-600 px-3 py-1 rounded-lg hover:bg-green-700">Pay Now</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-700 flex justify-end">
              <button onClick={() => setShowFeeModal(false)} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsAdmission;