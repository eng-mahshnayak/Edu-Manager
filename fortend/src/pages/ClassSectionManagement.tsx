import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Staff {
  id: string;
  name: string;
  role: string;
  department?: string;
}

interface ClassAssignment {
  id: string;
  className: string;
  section: string;
  staffId: string;
  staffName: string;
  subject: string;
  timings: {
    startTime: string;
    endTime: string;
  };
  daysOfWeek: string[];
  roomNumber: string;
  academicYear: string;
  isActive: boolean;
}

const ClassSectionManagement: React.FC = () => {
  const [classAssignments, setClassAssignments] = useState<ClassAssignment[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<ClassAssignment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [selectedAssignment, setSelectedAssignment] = useState<ClassAssignment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Static data for classes and sections
  const classesList = [
    'Nursery', 'LKG', 'UKG',
    '1st', '2nd', '3rd', '4th', '5th',
    '6th', '7th', '8th', '9th', '10th',
    '11th', '12th'
  ];

  const sectionsList = ['A', 'B', 'C', 'D'];

  // Subjects list
  const subjectsList = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English',
    'Hindi', 'Sanskrit', 'History', 'Geography', 'Political Science',
    'Economics', 'Computer Science', 'Physical Education', 'Art', 'Music',
    'Business Studies', 'Accountancy', 'Psychology', 'Sociology'
  ];

  // Days of week
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Static staff data (teachers only for class assignments)
  const initialStaffList: Staff[] = [
    { id: 'TCH001', name: 'Dr. Rajesh Kumar', role: 'TEACHER', department: 'Mathematics' },
    { id: 'TCH002', name: 'Prof. Meera Sharma', role: 'TEACHER', department: 'Science' },
    { id: 'TCH003', name: 'Mr. Suresh Verma', role: 'TEACHER', department: 'Languages' },
    { id: 'TCH004', name: 'Mrs. Priya Singh', role: 'TEACHER', department: 'Commerce' },
    { id: 'TCH005', name: 'Mr. Amit Patel', role: 'TEACHER', department: 'Computer Science' },
    { id: 'TCH006', name: 'Dr. Neha Gupta', role: 'TEACHER', department: 'Social Science' },
    { id: 'TCH007', name: 'Mr. Vikram Singh', role: 'TEACHER', department: 'Science' },
    { id: 'TCH008', name: 'Mrs. Anjali Sharma', role: 'TEACHER', department: 'Mathematics' }
  ];

  // Initial class assignments
  const initialAssignments: ClassAssignment[] = [
    {
      id: '1',
      className: '10th',
      section: 'A',
      staffId: 'TCH001',
      staffName: 'Dr. Rajesh Kumar',
      subject: 'Mathematics',
      timings: { startTime: '09:00', endTime: '10:00' },
      daysOfWeek: ['Monday', 'Wednesday', 'Friday'],
      roomNumber: '101',
      academicYear: '2024-2025',
      isActive: true
    },
    {
      id: '2',
      className: '10th',
      section: 'B',
      staffId: 'TCH001',
      staffName: 'Dr. Rajesh Kumar',
      subject: 'Mathematics',
      timings: { startTime: '10:15', endTime: '11:15' },
      daysOfWeek: ['Monday', 'Wednesday', 'Friday'],
      roomNumber: '102',
      academicYear: '2024-2025',
      isActive: true
    },
    {
      id: '3',
      className: '11th',
      section: 'A',
      staffId: 'TCH002',
      staffName: 'Prof. Meera Sharma',
      subject: 'Chemistry',
      timings: { startTime: '09:00', endTime: '10:00' },
      daysOfWeek: ['Tuesday', 'Thursday'],
      roomNumber: '201',
      academicYear: '2024-2025',
      isActive: true
    },
    {
      id: '4',
      className: '9th',
      section: 'C',
      staffId: 'TCH003',
      staffName: 'Mr. Suresh Verma',
      subject: 'English',
      timings: { startTime: '11:30', endTime: '12:30' },
      daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      roomNumber: '105',
      academicYear: '2024-2025',
      isActive: true
    },
    {
      id: '5',
      className: '12th',
      section: 'A',
      staffId: 'TCH004',
      staffName: 'Mrs. Priya Singh',
      subject: 'Economics',
      timings: { startTime: '14:00', endTime: '15:00' },
      daysOfWeek: ['Monday', 'Wednesday'],
      roomNumber: '301',
      academicYear: '2024-2025',
      isActive: true
    }
  ];

  useEffect(() => {
    setStaffList(initialStaffList);
    setClassAssignments(initialAssignments);
  }, []);

  // Get unique classes for filter
  const uniqueClasses = ['all', ...new Set(classAssignments.map(a => a.className))];

  // Filter assignments
  const filteredAssignments = classAssignments.filter(assignment => {
    const matchesSearch = assignment.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'all' || assignment.className === filterClass;
    return matchesSearch && matchesClass;
  });

  // Get staff by subject/department match
  const getAvailableStaff = (subject: string) => {
    // This is a simple matching logic - you can enhance it based on staff subjects
    return staffList.filter(staff => 
      staff.role === 'TEACHER' && 
      (staff.department?.toLowerCase().includes(subject.toLowerCase()) || true)
    );
  };

  // Handle Add/Update Assignment
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const selectedDays = daysOfWeek.filter(day => 
      formData.getAll('daysOfWeek').includes(day)
    );

    const assignmentData: Omit<ClassAssignment, 'id'> = {
      className: formData.get('className') as string,
      section: formData.get('section') as string,
      staffId: formData.get('staffId') as string,
      staffName: staffList.find(s => s.id === formData.get('staffId'))?.name || '',
      subject: formData.get('subject') as string,
      timings: {
        startTime: formData.get('startTime') as string,
        endTime: formData.get('endTime') as string
      },
      daysOfWeek: selectedDays,
      roomNumber: formData.get('roomNumber') as string,
      academicYear: formData.get('academicYear') as string,
      isActive: formData.get('status') === 'active'
    };

    if (editingAssignment) {
      // Update existing assignment
      setClassAssignments(prev => prev.map(a => 
        a.id === editingAssignment.id ? { ...assignmentData, id: a.id } : a
      ));
      toast.success('Class assignment updated successfully!');
    } else {
      // Add new assignment
      const newId = String(classAssignments.length + 1);
      setClassAssignments(prev => [...prev, { ...assignmentData, id: newId }]);
      toast.success('Class assignment added successfully!');
    }
    
    setShowModal(false);
    setEditingAssignment(null);
  };

  // Handle Delete Assignment
  const handleDelete = (assignment: ClassAssignment) => {
    if (window.confirm(`Are you sure you want to delete ${assignment.className} - Section ${assignment.section} (${assignment.subject}) assignment?`)) {
      setClassAssignments(prev => prev.filter(a => a.id !== assignment.id));
      toast.success('Assignment deleted successfully!');
    }
  };

  // Handle Edit Click
  const handleEdit = (assignment: ClassAssignment) => {
    setEditingAssignment(assignment);
    setShowModal(true);
  };

  // Handle View Details
  const handleViewDetails = (assignment: ClassAssignment) => {
    setSelectedAssignment(assignment);
    setShowDetailsModal(true);
  };

  // Toggle assignment status
  const toggleStatus = (assignment: ClassAssignment) => {
    setClassAssignments(prev => prev.map(a => 
      a.id === assignment.id ? { ...a, isActive: !a.isActive } : a
    ));
    toast.success(`Class ${assignment.isActive ? 'deactivated' : 'activated'} successfully!`);
  };

  // Statistics
  const totalAssignments = classAssignments.length;
  const activeAssignments = classAssignments.filter(a => a.isActive).length;
  const totalClasses = new Set(classAssignments.map(a => a.className)).size;
  const totalTeachers = new Set(classAssignments.map(a => a.staffId)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Class & Section Management
          </h1>
          <p className="text-gray-400 mt-1">Assign teachers to classes, sections with subjects and timings</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Assignments</p>
                <p className="text-2xl font-bold text-white">{totalAssignments}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Assignments</p>
                <p className="text-2xl font-bold text-green-400">{activeAssignments}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Classes</p>
                <p className="text-2xl font-bold text-yellow-400">{totalClasses}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Teachers Assigned</p>
                <p className="text-2xl font-bold text-blue-400">{totalTeachers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
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
              placeholder="Search by class, section, teacher, subject or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
            />
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
            >
              {uniqueClasses.map(className => (
                <option key={className} value={className}>
                  {className === 'all' ? 'All Classes' : className}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => {
                setEditingAssignment(null);
                setShowModal(true);
              }}
              className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Assignment
            </button>
          </div>
        </div>

        {/* Assignments Table */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Class & Section</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Teacher</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Timing</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Days</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Room</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{assignment.className}</p>
                        <p className="text-xs text-gray-400">Section {assignment.section}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {assignment.staffName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{assignment.staffName}</p>
                          <p className="text-xs text-gray-500">{assignment.staffId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                        {assignment.subject}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-white">
                        {assignment.timings.startTime} - {assignment.timings.endTime}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {assignment.daysOfWeek.slice(0, 2).map(day => (
                          <span key={day} className="px-1.5 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                            {day.slice(0, 3)}
                          </span>
                        ))}
                        {assignment.daysOfWeek.length > 2 && (
                          <span className="px-1.5 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                            +{assignment.daysOfWeek.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-white">Room {assignment.roomNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(assignment)}
                        className={`px-2 py-1 text-xs rounded-full transition-colors ${
                          assignment.isActive 
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }`}
                      >
                        {assignment.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(assignment)}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                          title="View Details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEdit(assignment)}
                          className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(assignment)}
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
                ))}
              </tbody>
            </table>
          </div>
          {filteredAssignments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No class assignments found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {editingAssignment ? 'Edit Class Assignment' : 'New Class Assignment'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingAssignment(null);
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
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Class *</label>
                  <select
                    name="className"
                    defaultValue={editingAssignment?.className}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                  >
                    <option value="">Select Class</option>
                    {classesList.map(className => (
                      <option key={className} value={className}>{className}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Section *</label>
                  <select
                    name="section"
                    defaultValue={editingAssignment?.section}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                  >
                    <option value="">Select Section</option>
                    {sectionsList.map(section => (
                      <option key={section} value={section}>Section {section}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Teacher *</label>
                  <select
                    name="staffId"
                    defaultValue={editingAssignment?.staffId}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                  >
                    <option value="">Select Teacher</option>
                    {staffList.map(staff => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name} ({staff.department || 'Teacher'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Subject *</label>
                  <select
                    name="subject"
                    defaultValue={editingAssignment?.subject}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                  >
                    <option value="">Select Subject</option>
                    {subjectsList.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Start Time *</label>
                  <input
                    type="time"
                    name="startTime"
                    defaultValue={editingAssignment?.timings.startTime}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">End Time *</label>
                  <input
                    type="time"
                    name="endTime"
                    defaultValue={editingAssignment?.timings.endTime}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Room Number *</label>
                  <input
                    type="text"
                    name="roomNumber"
                    defaultValue={editingAssignment?.roomNumber}
                    required
                    placeholder="e.g., 101, Lab-1, etc."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Academic Year *</label>
                  <select
                    name="academicYear"
                    defaultValue={editingAssignment?.academicYear || '2024-2025'}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                  >
                    <option value="2023-2024">2023-2024</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={editingAssignment?.isActive ? 'active' : 'inactive'}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Days of Week *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-3 bg-gray-800/50 rounded-lg">
                    {daysOfWeek.map(day => (
                      <label key={day} className="flex items-center gap-2 text-sm text-gray-300">
                        <input
                          type="checkbox"
                          name="daysOfWeek"
                          value={day}
                          defaultChecked={editingAssignment?.daysOfWeek.includes(day)}
                          className="rounded border-gray-600 text-purple-500 focus:ring-purple-500"
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all"
                >
                  {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAssignment(null);
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Details Modal */}
      {showDetailsModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Assignment Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedAssignment.className}</h3>
                    <p className="text-gray-400">Section {selectedAssignment.section}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedAssignment.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {selectedAssignment.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Teacher</p>
                  <p className="text-white font-semibold">{selectedAssignment.staffName}</p>
                  <p className="text-xs text-gray-400">{selectedAssignment.staffId}</p>
                </div>
                
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Subject</p>
                  <p className="text-white font-semibold">{selectedAssignment.subject}</p>
                </div>
                
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Timing</p>
                  <p className="text-white font-semibold">
                    {selectedAssignment.timings.startTime} - {selectedAssignment.timings.endTime}
                  </p>
                </div>
                
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Room Number</p>
                  <p className="text-white font-semibold">{selectedAssignment.roomNumber}</p>
                </div>
                
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Academic Year</p>
                  <p className="text-white font-semibold">{selectedAssignment.academicYear}</p>
                </div>
                
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Total Classes/Week</p>
                  <p className="text-white font-semibold">{selectedAssignment.daysOfWeek.length} classes</p>
                </div>
                
                <div className="md:col-span-2 bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Schedule Days</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAssignment.daysOfWeek.map(day => (
                      <span key={day} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleEdit(selectedAssignment);
                }}
                className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-all"
              >
                Edit Assignment
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassSectionManagement;