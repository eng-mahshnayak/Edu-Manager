import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Homework {
  id: string;
  class: string;
  section: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  title: string;
  description: string;
  dueDate: string;
  assignedDate: string;
  weekNumber: number;
  academicYear: string;
  attachments?: string[];
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'submitted' | 'checked';
  syllabusCoverage: number; // percentage of syllabus completed
  topicsCovered: string[];
  remainingTopics: string[];
  remarks?: string;
  submittedBy?: { studentId: string; studentName: string; submissionDate: string; marks?: number }[];
}

interface SyllabusProgress {
  class: string;
  section: string;
  subject: string;
  totalChapters: number;
  completedChapters: number;
  completedTopics: string[];
  pendingTopics: string[];
  lastUpdated: string;
  updatedBy: string;
}

const HomeworkManagement: React.FC = () => {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [syllabusProgress, setSyllabusProgress] = useState<SyllabusProgress[]>([]);
  const [userRole, setUserRole] = useState<'principal' | 'teacher'>('principal');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedWeek, setSelectedWeek] = useState<number>(getCurrentWeek());
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);

  console.log(selectedHomework,'====selectedHomework===');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [selectedSyllabus, setSelectedSyllabus] = useState<SyllabusProgress | null>(null);

  // Classes from LKG to 12th
  const classesList = [
    'LKG', 'UKG',
    '1st', '2nd', '3rd', '4th', '5th',
    '6th', '7th', '8th', '9th', '10th',
    '11th', '12th'
  ];

  const sectionsList = ['A', 'B', 'C', 'D'];
  
  const subjectsList = [
    'Mathematics', 'English', 'Hindi', 'Science', 'Social Studies',
    'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics',
    'Accountancy', 'Business Studies', 'History', 'Geography', 'Political Science',
    'Sanskrit', 'Physical Education', 'Art', 'Music'
  ];

  const teachersList = [
    { id: 'TCH001', name: 'Dr. Rajesh Kumar', subject: 'Mathematics', class: ['9th', '10th', '11th', '12th'] },
    { id: 'TCH002', name: 'Prof. Meera Sharma', subject: 'Science', class: ['6th', '7th', '8th', '9th', '10th'] },
    { id: 'TCH003', name: 'Mr. Suresh Verma', subject: 'English', class: ['1st', '2nd', '3rd', '4th', '5th'] },
    { id: 'TCH004', name: 'Mrs. Priya Singh', subject: 'Economics', class: ['11th', '12th'] },
    { id: 'TCH005', name: 'Mr. Amit Patel', subject: 'Computer Science', class: ['6th', '7th', '8th', '9th', '10th'] }
  ];

  // Get current week number
  function getCurrentWeek() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
  }

  // Static homework data
  const initialHomework: Homework[] = [
    {
      id: 'HW001',
      class: '10th',
      section: 'A',
      subject: 'Mathematics',
      teacherId: 'TCH001',
      teacherName: 'Dr. Rajesh Kumar',
      title: 'Quadratic Equations Practice',
      description: 'Solve Exercise 4.1 and 4.2 from NCERT. Practice 20 quadratic equation problems.',
      dueDate: '2024-12-10',
      assignedDate: '2024-12-03',
      weekNumber: 49,
      academicYear: '2024-2025',
      priority: 'high',
      status: 'pending',
      syllabusCoverage: 65,
      topicsCovered: ['Linear Equations', 'Quadratic Equations', 'Polynomials'],
      remainingTopics: ['Arithmetic Progressions', 'Coordinate Geometry', 'Trigonometry'],
      remarks: 'Students are struggling with quadratic formula'
    },
    {
      id: 'HW002',
      class: '10th',
      section: 'B',
      subject: 'Science',
      teacherId: 'TCH002',
      teacherName: 'Prof. Meera Sharma',
      title: 'Chemical Reactions',
      description: 'Learn all chemical reactions from Chapter 1. Write balanced equations.',
      dueDate: '2024-12-09',
      assignedDate: '2024-12-02',
      weekNumber: 49,
      academicYear: '2024-2025',
      priority: 'medium',
      status: 'submitted',
      syllabusCoverage: 70,
      topicsCovered: ['Chemical Reactions', 'Acids Bases', 'Metals Non-metals'],
      remainingTopics: ['Carbon Compounds', 'Periodic Table'],
      submittedBy: [
        { studentId: 'STU001', studentName: 'Amit Kumar', submissionDate: '2024-12-08', marks: 85 }
      ]
    },
    {
      id: 'HW003',
      class: '8th',
      section: 'C',
      subject: 'English',
      teacherId: 'TCH003',
      teacherName: 'Mr. Suresh Verma',
      title: 'Essay Writing',
      description: 'Write an essay on "Importance of Education" (300 words).',
      dueDate: '2024-12-12',
      assignedDate: '2024-12-05',
      weekNumber: 49,
      academicYear: '2024-2025',
      priority: 'low',
      status: 'pending',
      syllabusCoverage: 80,
      topicsCovered: ['Grammar', 'Comprehension', 'Essay Writing'],
      remainingTopics: ['Letter Writing', 'Story Writing']
    },
    {
      id: 'HW004',
      class: '12th',
      section: 'A',
      subject: 'Economics',
      teacherId: 'TCH004',
      teacherName: 'Mrs. Priya Singh',
      title: 'Indian Economy',
      description: 'Prepare notes on economic reforms of 1991. Submit by Friday.',
      dueDate: '2024-12-10',
      assignedDate: '2024-12-04',
      weekNumber: 49,
      academicYear: '2024-2025',
      priority: 'high',
      status: 'pending',
      syllabusCoverage: 55,
      topicsCovered: ['Indian Economy', 'Economic Reforms', 'Poverty'],
      remainingTopics: ['Employment', 'Infrastructure', 'Sustainable Development']
    }
  ];

  // Static syllabus progress data
  const initialSyllabusProgress: SyllabusProgress[] = [
    {
      class: '10th',
      section: 'A',
      subject: 'Mathematics',
      totalChapters: 15,
      completedChapters: 10,
      completedTopics: ['Number Systems', 'Polynomials', 'Linear Equations', 'Quadratic Equations', 'Arithmetic Progressions', 'Triangles', 'Coordinate Geometry', 'Trigonometry', 'Circles', 'Constructions'],
      pendingTopics: ['Areas Related to Circles', 'Surface Areas', 'Statistics', 'Probability'],
      lastUpdated: '2024-12-05',
      updatedBy: 'Dr. Rajesh Kumar'
    },
    {
      class: '10th',
      section: 'A',
      subject: 'Science',
      totalChapters: 16,
      completedChapters: 11,
      completedTopics: ['Chemical Reactions', 'Acids Bases', 'Metals Non-metals', 'Carbon Compounds', 'Periodic Table', 'Life Processes', 'Control Coordination', 'Reproduction', 'Heredity', 'Light', 'Human Eye'],
      pendingTopics: ['Electricity', 'Magnetic Effects', 'Sources of Energy', 'Ecosystems', 'Environment'],
      lastUpdated: '2024-12-04',
      updatedBy: 'Prof. Meera Sharma'
    },
    {
      class: '12th',
      section: 'A',
      subject: 'Economics',
      totalChapters: 12,
      completedChapters: 7,
      completedTopics: ['Indian Economy', 'Economic Reforms', 'Poverty', 'Human Capital', 'Rural Development', 'Employment', 'Infrastructure'],
      pendingTopics: ['Environment', 'Sustainable Development', 'Comparative Development', 'International Trade', 'Balance of Payments'],
      lastUpdated: '2024-12-03',
      updatedBy: 'Mrs. Priya Singh'
    }
  ];

  useEffect(() => {
    setHomeworks(initialHomework);
    setSyllabusProgress(initialSyllabusProgress);
  }, []);

  // Filter homeworks
  const filteredHomeworks = homeworks.filter(hw => {
    const matchesClass = selectedClass === 'all' || hw.class === selectedClass;
    const matchesSection = selectedSection === 'all' || hw.section === selectedSection;
    const matchesSubject = filterSubject === 'all' || hw.subject === filterSubject;
    const matchesWeek = hw.weekNumber === selectedWeek;
    const matchesSearch = hw.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hw.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hw.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSection && matchesSubject && matchesWeek && matchesSearch;
  });

  // Get syllabus progress for a class
  const getSyllabusForClass = (className: string, section: string, subject: string) => {
    return syllabusProgress.find(s => s.class === className && s.section === section && s.subject === subject);
  };

  // Handle Add/Update Homework (Principal/Teacher)
  const handleHomeworkSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const homeworkData: Omit<Homework, 'id'> = {
      class: formData.get('class') as string,
      section: formData.get('section') as string,
      subject: formData.get('subject') as string,
      teacherId: formData.get('teacherId') as string,
      teacherName: teachersList.find(t => t.id === formData.get('teacherId'))?.name || '',
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      dueDate: formData.get('dueDate') as string,
      assignedDate: new Date().toISOString().split('T')[0],
      weekNumber: selectedWeek,
      academicYear: '2024-2025',
      priority: formData.get('priority') as Homework['priority'],
      status: 'pending',
      syllabusCoverage: parseInt(formData.get('syllabusCoverage') as string),
      topicsCovered: (formData.get('topicsCovered') as string).split(',').map(t => t.trim()),
      remainingTopics: (formData.get('remainingTopics') as string).split(',').map(t => t.trim()),
      remarks: formData.get('remarks') as string
    };

    if (editingHomework) {
      setHomeworks(prev => prev.map(h => 
        h.id === editingHomework.id ? { ...homeworkData, id: h.id } : h
      ));
      toast.success('Homework updated successfully!');
    } else {
      const newId = `HW${String(homeworks.length + 1).padStart(3, '0')}`;
      setHomeworks(prev => [...prev, { ...homeworkData, id: newId }]);
      toast.success('Homework assigned successfully!');
    }
    
    setShowHomeworkModal(false);
    setEditingHomework(null);
  };

  // Handle Syllabus Progress Update (Principal)
  const handleSyllabusSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const syllabusData: SyllabusProgress = {
      class: formData.get('class') as string,
      section: formData.get('section') as string,
      subject: formData.get('subject') as string,
      totalChapters: parseInt(formData.get('totalChapters') as string),
      completedChapters: parseInt(formData.get('completedChapters') as string),
      completedTopics: (formData.get('completedTopics') as string).split(',').map(t => t.trim()),
      pendingTopics: (formData.get('pendingTopics') as string).split(',').map(t => t.trim()),
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedBy: userRole === 'principal' ? 'Principal Office' : 'Teacher'
    };

    if (selectedSyllabus) {
      setSyllabusProgress(prev => prev.map(s => 
        s.class === selectedSyllabus.class && s.section === selectedSyllabus.section && s.subject === selectedSyllabus.subject
          ? syllabusData
          : s
      ));
      toast.success('Syllabus progress updated successfully!');
    } else {
      setSyllabusProgress(prev => [...prev, syllabusData]);
      toast.success('Syllabus progress added successfully!');
    }
    
    setShowSyllabusModal(false);
    setSelectedSyllabus(null);
  };

  // Get week range display
  const getWeekRange = (weekNumber: number) => {
    const year = new Date().getFullYear();
    const startDate = new Date(year, 0, 1 + (weekNumber - 1) * 7);
    const endDate = new Date(year, 0, 7 + (weekNumber - 1) * 7);
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">🔥 High</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">📌 Medium</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">ℹ️ Low</span>;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">✓ Submitted</span>;
      case 'checked':
        return <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">✓ Checked</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-orange-500/20 text-orange-400">⏳ Pending</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Homework & Syllabus Management
              </h1>
              <p className="text-gray-400 mt-1">
                {userRole === 'principal' 
                  ? 'Principal Dashboard - Monitor homework and syllabus progress across all classes'
                  : 'Teacher Dashboard - Manage homework and track syllabus completion'}
              </p>
            </div>
            
            {/* Role Switcher (for demo) */}
            <div className="flex gap-2 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setUserRole('principal')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  userRole === 'principal' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                👑 Principal View
              </button>
              <button
                onClick={() => setUserRole('teacher')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  userRole === 'teacher' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                👨‍🏫 Teacher View
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Homework</p>
                <p className="text-2xl font-bold text-white">{homeworks.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Submitted</p>
                <p className="text-2xl font-bold text-green-400">
                  {homeworks.filter(h => h.status === 'submitted').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {homeworks.filter(h => h.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Classes</p>
                <p className="text-2xl font-bold text-blue-400">{classesList.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-orange-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Syllabus</p>
                <p className="text-2xl font-bold text-orange-400">
                  {Math.round(syllabusProgress.reduce((acc, s) => acc + (s.completedChapters / s.totalChapters) * 100, 0) / syllabusProgress.length)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Week Selector */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <label className="text-gray-300 font-semibold">Week:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedWeek(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1 bg-gray-800 rounded-lg text-white hover:bg-gray-700"
                >
                  ◀
                </button>
                <span className="px-4 py-1 bg-purple-600 rounded-lg text-white font-semibold">
                  Week {selectedWeek}
                </span>
                <button
                  onClick={() => setSelectedWeek(prev => prev + 1)}
                  className="px-3 py-1 bg-gray-800 rounded-lg text-white hover:bg-gray-700"
                >
                  ▶
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              📅 {getWeekRange(selectedWeek)}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search homework..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 outline-none"
            />
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
            >
              <option value="all">All Classes</option>
              {classesList.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
            >
              <option value="all">All Sections</option>
              {sectionsList.map(sec => (
                <option key={sec} value={sec}>Section {sec}</option>
              ))}
            </select>
            
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
            >
              <option value="all">All Subjects</option>
              {subjectsList.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            
            {userRole === 'principal' && (
              <>
                <button
                  onClick={() => setShowSyllabusModal(true)}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Update Syllabus
                </button>
                <button
                  onClick={() => {
                    setEditingHomework(null);
                    setShowHomeworkModal(true);
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Assign Homework
                </button>
              </>
            )}
          </div>
        </div>

        {/* Homework Table */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Class/Section</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Subject/Teacher</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Homework Details</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Syllabus</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Due Date</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredHomeworks.map((homework) => {
                  const syllabus = getSyllabusForClass(homework.class, homework.section, homework.subject);
                  return (
                    <tr key={homework.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold text-white">{homework.class}</div>
                        <div className="text-xs text-gray-400">Section {homework.section}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-white">{homework.subject}</div>
                        <div className="text-xs text-gray-400">{homework.teacherName}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white">{homework.title}</p>
                            {getPriorityBadge(homework.priority)}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{homework.description.substring(0, 60)}...</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {syllabus ? (
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-400">Progress</span>
                              <span className="text-purple-400">{Math.round((syllabus.completedChapters / syllabus.totalChapters) * 100)}%</span>
                            </div>
                            <div className="w-24 bg-gray-700 rounded-full h-1.5">
                              <div 
                                className="bg-purple-500 rounded-full h-1.5 transition-all"
                                style={{ width: `${(syllabus.completedChapters / syllabus.totalChapters) * 100}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {syllabus.completedChapters}/{syllabus.totalChapters} chapters
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">Not updated</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="text-sm text-yellow-400">{new Date(homework.dueDate).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">
                          {Math.ceil((new Date(homework.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getStatusBadge(homework.status)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => {
                              setSelectedHomework(homework);
                              setShowHomeworkModal(true);
                            }}
                            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                            title="View Details"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          {userRole === 'principal' && (
                            <button
                              onClick={() => {
                                setEditingHomework(homework);
                                setShowHomeworkModal(true);
                              }}
                              className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                              title="Edit"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredHomeworks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No homework assigned for this week</p>
            </div>
          )}
        </div>

        {/* Syllabus Progress Summary */}
        <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Syllabus Progress Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {syllabusProgress.map((syllabus, idx) => (
              <div key={idx} className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-semibold text-white">{syllabus.class} - Section {syllabus.section}</p>
                    <p className="text-xs text-gray-400">{syllabus.subject}</p>
                  </div>
                  <span className="text-xs text-gray-500">Updated: {new Date(syllabus.lastUpdated).toLocaleDateString()}</span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Chapter Progress</span>
                    <span className="text-purple-400">{Math.round((syllabus.completedChapters / syllabus.totalChapters) * 100)}%</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 rounded-full h-2 transition-all"
                      style={{ width: `${(syllabus.completedChapters / syllabus.totalChapters) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  ✅ Completed: {syllabus.completedChapters}/{syllabus.totalChapters} chapters
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  📚 Pending: {syllabus.pendingTopics.slice(0, 3).join(', ')}
                  {syllabus.pendingTopics.length > 3 && ` +${syllabus.pendingTopics.length - 3} more`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Homework Modal */}
      {showHomeworkModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {editingHomework ? 'Edit Homework' : 'Assign New Homework'}
              </h2>
              <button
                onClick={() => {
                  setShowHomeworkModal(false);
                  setEditingHomework(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleHomeworkSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Class *</label>
                  <select
                    name="class"
                    defaultValue={editingHomework?.class}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                  >
                    <option value="">Select Class</option>
                    {classesList.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Section *</label>
                  <select
                    name="section"
                    defaultValue={editingHomework?.section}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                  >
                    <option value="">Select Section</option>
                    {sectionsList.map(sec => (
                      <option key={sec} value={sec}>Section {sec}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Subject *</label>
                  <select
                    name="subject"
                    defaultValue={editingHomework?.subject}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                  >
                    <option value="">Select Subject</option>
                    {subjectsList.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Teacher *</label>
                  <select
                    name="teacherId"
                    defaultValue={editingHomework?.teacherId}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                  >
                    <option value="">Select Teacher</option>
                    {teachersList.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>{teacher.name} ({teacher.subject})</option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingHomework?.title}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                    placeholder="e.g., Quadratic Equations Practice"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description *</label>
                  <textarea
                    name="description"
                    defaultValue={editingHomework?.description}
                    required
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                    placeholder="Detailed homework instructions..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Due Date *</label>
                  <input
                    type="date"
                    name="dueDate"
                    defaultValue={editingHomework?.dueDate}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                  <select
                    name="priority"
                    defaultValue={editingHomework?.priority || 'medium'}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Syllabus Coverage (%)</label>
                  <input
                    type="number"
                    name="syllabusCoverage"
                    defaultValue={editingHomework?.syllabusCoverage || 0}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Topics Covered (comma separated)</label>
                  <input
                    type="text"
                    name="topicsCovered"
                    defaultValue={editingHomework?.topicsCovered?.join(', ')}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                    placeholder="Algebra, Trigonometry, Calculus"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Remaining Topics (comma separated)</label>
                  <input
                    type="text"
                    name="remainingTopics"
                    defaultValue={editingHomework?.remainingTopics?.join(', ')}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                    placeholder="Statistics, Probability"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Remarks (Optional)</label>
                  <textarea
                    name="remarks"
                    defaultValue={editingHomework?.remarks}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                    placeholder="Any additional remarks for students/parents..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all"
                >
                  {editingHomework ? 'Update Homework' : 'Assign Homework'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowHomeworkModal(false);
                    setEditingHomework(null);
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

      {/* Syllabus Modal */}
      {showSyllabusModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {selectedSyllabus ? 'Update Syllabus Progress' : 'Add Syllabus Progress'}
              </h2>
              <button
                onClick={() => {
                  setShowSyllabusModal(false);
                  setSelectedSyllabus(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSyllabusSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Class *</label>
                  <select
                    name="class"
                    defaultValue={selectedSyllabus?.class}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-orange-500 outline-none"
                  >
                    <option value="">Select Class</option>
                    {classesList.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Section *</label>
                  <select
                    name="section"
                    defaultValue={selectedSyllabus?.section}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-orange-500 outline-none"
                  >
                    <option value="">Select Section</option>
                    {sectionsList.map(sec => (
                      <option key={sec} value={sec}>Section {sec}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Subject *</label>
                  <select
                    name="subject"
                    defaultValue={selectedSyllabus?.subject}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-orange-500 outline-none"
                  >
                    <option value="">Select Subject</option>
                    {subjectsList.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Total Chapters *</label>
                  <input
                    type="number"
                    name="totalChapters"
                    defaultValue={selectedSyllabus?.totalChapters}
                    required
                    min="1"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-orange-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Completed Chapters *</label>
                  <input
                    type="number"
                    name="completedChapters"
                    defaultValue={selectedSyllabus?.completedChapters}
                    required
                    min="0"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-orange-500 outline-none"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Completed Topics (comma separated)</label>
                  <textarea
                    name="completedTopics"
                    defaultValue={selectedSyllabus?.completedTopics?.join(', ')}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-orange-500 outline-none"
                    placeholder="Topic 1, Topic 2, Topic 3"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Pending Topics (comma separated)</label>
                  <textarea
                    name="pendingTopics"
                    defaultValue={selectedSyllabus?.pendingTopics?.join(', ')}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-orange-500 outline-none"
                    placeholder="Topic 1, Topic 2, Topic 3"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all"
                >
                  {selectedSyllabus ? 'Update Progress' : 'Add Progress'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSyllabusModal(false);
                    setSelectedSyllabus(null);
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
    </div>
  );
};

export default HomeworkManagement;