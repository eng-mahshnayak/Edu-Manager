import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// ==================== Types ====================
interface Staff {
  _id: string;
  staffId: string;
  name: string;
  role: string;
  department?: string;
  isActive: boolean;
}

interface ClassAssignment {
  _id: string;
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

interface TimetableEntry {
  staffName: string;
  subject: string;
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
  roomNumber: string;
}

// ==================== Main Component ====================
const ClassSectionManagement: React.FC = () => {
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // ----- State -----
  const [assignments, setAssignments] = useState<ClassAssignment[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<ClassAssignment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [selectedAssignment, setSelectedAssignment] = useState<ClassAssignment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [timetableData, setTimetableData] = useState<{ className: string; timetable: Record<string, TimetableEntry[]> } | null>(null);

  // ----- Constants -----
  const classesList = [
    'Nursery', 'LKG', 'UKG',
    '1st', '2nd', '3rd', '4th', '5th',
    '6th', '7th', '8th', '9th', '10th',
  ];

  const sectionsList = ['A', 'B', 'C', 'D'];

  const subjectsList = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English',
    'Hindi', 'Sanskrit', 'History', 'Geography', 'Political Science',
    'Economics', 'Computer Science', 'Physical Education', 'Art', 'Music',
    'Business Studies', 'Accountancy', 'Psychology', 'Sociology'
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // ----- API Functions -----
  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filterClass !== 'all') params.className = filterClass;
      if (searchTerm) params.search = searchTerm;

      const res = await axios.get(`${API_BASE}/class-assignments`, { params });
      if (res.data.status) {
        setAssignments(res.data.data);
      } else {
        toast.error(res.data.message || 'Failed to fetch assignments');
      }
    } catch (error) {
      toast.error('Server error while fetching assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${API_BASE}/staff`, { params: { role: 'TEACHER', status: 'active' } });
      if (res.data.status) {
        setStaffList(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch staff');
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchStaff();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAssignments();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, filterClass]);

  // ----- CRUD Handlers -----
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const selectedDays = daysOfWeek.filter(day =>
      formData.getAll('daysOfWeek').includes(day)
    );

    const data = {
      className: formData.get('className') as string,
      section: formData.get('section') as string,
      staffId: formData.get('staffId') as string,
      staffName: staffList.find(s => s._id === formData.get('staffId'))?.name || '',
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

    setLoading(true);
    try {
      let res;
      if (editingAssignment) {
        res = await axios.put(`${API_BASE}/class-assignments/${editingAssignment._id}`, data);
      } else {
        res = await axios.post(`${API_BASE}/class-assignments`, data);
      }
      if (res.data.status) {
        toast.success(res.data.message);
        setShowModal(false);
        setEditingAssignment(null);
        fetchAssignments();
      } else {
        toast.error(res.data.message || 'Operation failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (assignment: ClassAssignment) => {
    if (!window.confirm(`Delete assignment for ${assignment.className} - Section ${assignment.section}?`)) return;
    try {
      const res = await axios.delete(`${API_BASE}/class-assignments/${assignment._id}`);
      if (res.data.status) {
        toast.success('Deleted!');
        fetchAssignments();
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleEdit = async (assignment: ClassAssignment) => {
    try {
      const res = await axios.get(`${API_BASE}/class-assignments/${assignment._id}`);
      if (res.data.status) {
        setEditingAssignment(res.data.data);
        setShowModal(true);
      }
    } catch (error) {
      toast.error('Failed to load assignment');
    }
  };

  const handleViewDetails = (assignment: ClassAssignment) => {
    setSelectedAssignment(assignment);
    setShowDetailsModal(true);
  };

  const toggleStatus = async (assignment: ClassAssignment) => {
    try {
      const res = await axios.put(`${API_BASE}/class-assignments/${assignment._id}`, {
        isActive: !assignment.isActive
      });
      if (res.data.status) {
        toast.success(`Assignment ${assignment.isActive ? 'deactivated' : 'activated'}!`);
        fetchAssignments();
      }
    } catch (error) {
      toast.error('Status update failed');
    }
  };

  // ----- Timetable View -----
  const handleViewTimetable = async (className: string) => {
    try {
      const res = await axios.get(`${API_BASE}/class-assignments/timetable/${className}`);
      if (res.data.status) {
        setTimetableData(res.data.data);
        setShowTimetableModal(true);
      } else {
        toast.error('No timetable found for this class');
      }
    } catch (error) {
      toast.error('Failed to load timetable');
    }
  };

  // ----- Statistics -----
  const totalAssignments = assignments.length;
  const activeAssignments = assignments.filter(a => a.isActive).length;
  const totalClasses = new Set(assignments.map(a => a.className)).size;
  const totalTeachers = new Set(assignments.map(a => a.staffId)).size;

  // Unique classes for filter
  const uniqueClasses = ['all', ...new Set(assignments.map(a => a.className))];

  // ----- Render -----
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <p className="text-2xl font-bold text-purple-400">{totalTeachers}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
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
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2"
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
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
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
                  {assignments.map((assignment) => (
                    <tr key={assignment._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-white">{assignment.className}</p>
                          <p className="text-xs text-gray-400">Section {assignment.section}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
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
                            onClick={() => handleViewTimetable(assignment.className)}
                            className="p-1 text-green-400 hover:text-green-300 transition-colors"
                            title="View Timetable"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </button>
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
            )}
            {!loading && assignments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No class assignments found</p>
              </div>
            )}
          </div>
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
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
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
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
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
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  >
                    <option value="">Select Teacher</option>
                    {staffList.map(staff => (
                      <option key={staff._id} value={staff._id}>
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
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
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
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">End Time *</label>
                  <input
                    type="time"
                    name="endTime"
                    defaultValue={editingAssignment?.timings.endTime}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Room Number *</label>
                  <input
                    type="text"
                    name="roomNumber"
                    defaultValue={editingAssignment?.roomNumber}
                    required
                    placeholder="e.g., 101, Lab-1"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Academic Year *</label>
                  <select
                    name="academicYear"
                    defaultValue={editingAssignment?.academicYear || '2024-2025'}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
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
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
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
                          className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
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
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
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
                      <span key={day} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
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

      {/* Timetable Modal */}
      {showTimetableModal && timetableData && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                📅 Timetable - {timetableData.className}
              </h2>
              <button
                onClick={() => setShowTimetableModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {Object.entries(timetableData.timetable).length === 0 ? (
                <p className="text-gray-400 text-center py-8">No active assignments for this class.</p>
              ) : (
                <div className="space-y-6">
                  {Object.entries(timetableData.timetable).map(([section, entries]) => (
                    <div key={section} className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-3">Section {section}</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                          <thead className="bg-gray-800/50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Subject</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Teacher</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Time</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Days</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Room</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700">
                            {entries.map((entry, idx) => (
                              <tr key={idx} className="hover:bg-white/5">
                                <td className="px-3 py-2 text-sm text-white">{entry.subject}</td>
                                <td className="px-3 py-2 text-sm text-white">{entry.staffName}</td>
                                <td className="px-3 py-2 text-sm text-white">{entry.startTime} - {entry.endTime}</td>
                                <td className="px-3 py-2 text-sm text-white">
                                  {entry.daysOfWeek.join(', ')}
                                </td>
                                <td className="px-3 py-2 text-sm text-white">Room {entry.roomNumber}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-700 flex justify-end">
              <button
                onClick={() => setShowTimetableModal(false)}
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