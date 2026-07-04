// import React, { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';

// interface Teacher {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   qualification: string;
//   subjects: string[];
//   classAssigned: string[];
//   experience: number;
//   joiningDate: string;
//   salary: number;
//   address: string;
//   status: 'active' | 'inactive';
//   gender: 'male' | 'female' | 'other';
// }

// const TeachersManagement: React.FC = () => {
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
//   const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);

//   // Static subjects list
//   const subjectsList = [
//     'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English',
//     'Hindi', 'Sanskrit', 'History', 'Geography', 'Political Science',
//     'Economics', 'Computer Science', 'Physical Education', 'Art', 'Music'
//   ];

//   // Static classes list
//   const classesList = [
//     'Nursery', 'LKG', 'UKG',
//     '1st', '2nd', '3rd', '4th', '5th',
//     '6th', '7th', '8th', '9th', '10th',
//     '11th Science', '11th Commerce', '11th Arts',
//     '12th Science', '12th Commerce', '12th Arts'
//   ];

//   // Initial static data
//   const initialTeachers: Teacher[] = [
//     {
//       id: 'TCH001',
//       name: 'Dr. Rajesh Kumar',
//       email: 'rajesh.kumar@edumanager.edu',
//       phone: '9876543210',
//       qualification: 'Ph.D. in Mathematics',
//       subjects: ['Mathematics', 'Physics'],
//       classAssigned: ['11th Science', '12th Science'],
//       experience: 12,
//       joiningDate: '2015-06-15',
//       salary: 65000,
//       address: '123, Green Park, New Delhi',
//       status: 'active',
//       gender: 'male'
//     },
//     {
//       id: 'TCH002',
//       name: 'Prof. Meera Sharma',
//       email: 'meera.sharma@edumanager.edu',
//       phone: '9876543211',
//       qualification: 'M.Sc. Chemistry, B.Ed',
//       subjects: ['Chemistry', 'Biology'],
//       classAssigned: ['10th', '11th Science', '12th Science'],
//       experience: 8,
//       joiningDate: '2018-07-20',
//       salary: 55000,
//       address: '45, Civil Lines, Delhi',
//       status: 'active',
//       gender: 'female'
//     },
//     {
//       id: 'TCH003',
//       name: 'Mr. Suresh Verma',
//       email: 'suresh.verma@edumanager.edu',
//       phone: '9876543212',
//       qualification: 'M.A. English, B.Ed',
//       subjects: ['English'],
//       classAssigned: ['9th', '10th', '11th Commerce', '12th Commerce'],
//       experience: 15,
//       joiningDate: '2010-04-10',
//       salary: 70000,
//       address: '78, Model Town, Noida',
//       status: 'active',
//       gender: 'male'
//     },
//     {
//       id: 'TCH004',
//       name: 'Mrs. Priya Singh',
//       email: 'priya.singh@edumanager.edu',
//       phone: '9876543213',
//       qualification: 'M.Com, B.Ed',
//       subjects: ['Economics', 'Business Studies'],
//       classAssigned: ['11th Commerce', '12th Commerce'],
//       experience: 6,
//       joiningDate: '2019-08-01',
//       salary: 48000,
//       address: '12, Sector 15, Gurgaon',
//       status: 'active',
//       gender: 'female'
//     },
//     {
//       id: 'TCH005',
//       name: 'Mr. Amit Patel',
//       email: 'amit.patel@edumanager.edu',
//       phone: '9876543214',
//       qualification: 'M.C.A',
//       subjects: ['Computer Science'],
//       classAssigned: ['9th', '10th', '11th Science', '12th Science'],
//       experience: 5,
//       joiningDate: '2020-01-15',
//       salary: 45000,
//       address: '56, Vikaspuri, Delhi',
//       status: 'active',
//       gender: 'male'
//     },
//     {
//       id: 'TCH006',
//       name: 'Dr. Neha Gupta',
//       email: 'neha.gupta@edumanager.edu',
//       phone: '9876543215',
//       qualification: 'Ph.D. in History',
//       subjects: ['History', 'Political Science'],
//       classAssigned: ['11th Arts', '12th Arts'],
//       experience: 10,
//       joiningDate: '2016-09-12',
//       salary: 60000,
//       address: '89, Raj Nagar, Ghaziabad',
//       status: 'inactive',
//       gender: 'female'
//     }
//   ];

//   useEffect(() => {
//     // Load static data
//     setTeachers(initialTeachers);
//   }, []);

//   // Filter teachers based on search and status
//   const filteredTeachers = teachers.filter(teacher => {
//     const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          teacher.phone.includes(searchTerm) ||
//                          teacher.id.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = filterStatus === 'all' || teacher.status === filterStatus;
//     return matchesSearch && matchesStatus;
//   });

//   // Calculate statistics
//   const totalTeachers = teachers.length;
//   const activeTeachers = teachers.filter(t => t.status === 'active').length;
//   const totalSalaryExpense = teachers.reduce((sum, t) => sum + t.salary, 0);
//   const avgSalary = totalTeachers > 0 ? Math.round(totalSalaryExpense / totalTeachers) : 0;

//   // Handle Add/Update Teacher
//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
    
//     const subjects = subjectsList.filter(sub => 
//       (formData.getAll('subjects') as string[]).includes(sub)
//     );
    
//     const classAssigned = classesList.filter(cls => 
//       (formData.getAll('classes') as string[]).includes(cls)
//     );

//     const teacherData: Omit<Teacher, 'id'> = {
//       name: formData.get('name') as string,
//       email: formData.get('email') as string,
//       phone: formData.get('phone') as string,
//       qualification: formData.get('qualification') as string,
//       subjects,
//       classAssigned,
//       experience: parseInt(formData.get('experience') as string),
//       joiningDate: formData.get('joiningDate') as string,
//       salary: parseInt(formData.get('salary') as string),
//       address: formData.get('address') as string,
//       status: formData.get('status') as 'active' | 'inactive',
//       gender: formData.get('gender') as 'male' | 'female' | 'other'
//     };

//     if (editingTeacher) {
//       // Update existing teacher
//       setTeachers(prev => prev.map(t => 
//         t.id === editingTeacher.id ? { ...teacherData, id: t.id } : t
//       ));
//       toast.success('Teacher updated successfully!');
//     } else {
//       // Add new teacher
//       const newId = `TCH${String(teachers.length + 1).padStart(3, '0')}`;
//       setTeachers(prev => [...prev, { ...teacherData, id: newId }]);
//       toast.success('Teacher added successfully!');
//     }
    
//     setShowModal(false);
//     setEditingTeacher(null);
//   };

//   // Handle Delete Teacher
//   const handleDelete = (teacher: Teacher) => {
//     if (window.confirm(`Are you sure you want to delete ${teacher.name}?`)) {
//       setTeachers(prev => prev.filter(t => t.id !== teacher.id));
//       toast.success('Teacher deleted successfully!');
//     }
//   };

//   // Handle Edit Click
//   const handleEdit = (teacher: Teacher) => {
//     setEditingTeacher(teacher);
//     setShowModal(true);
//   };

//   // Handle View Details
//   const handleViewDetails = (teacher: Teacher) => {
//     setSelectedTeacher(teacher);
//     setShowDetailsModal(true);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
//             <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//             </svg>
//             Teacher Management
//           </h1>
//           <p className="text-gray-400 mt-1">Manage all teachers, their subjects, classes, and salary information</p>
//         </div>

//         {/* Statistics Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-400 text-sm">Total Teachers</p>
//                 <p className="text-2xl font-bold text-white">{totalTeachers}</p>
//               </div>
//               <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
//                 <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//                 </svg>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-400 text-sm">Active Teachers</p>
//                 <p className="text-2xl font-bold text-green-400">{activeTeachers}</p>
//               </div>
//               <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
//                 <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-400 text-sm">Monthly Salary Expense</p>
//                 <p className="text-2xl font-bold text-yellow-400">₹{totalSalaryExpense.toLocaleString()}</p>
//               </div>
//               <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
//                 <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-400 text-sm">Average Salary</p>
//                 <p className="text-2xl font-bold text-purple-400">₹{avgSalary.toLocaleString()}</p>
//               </div>
//               <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
//                 <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search and Filter Bar */}
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
//           <div className="relative w-full sm:w-96">
//             <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//             <input
//               type="text"
//               placeholder="Search by name, email, ID or phone..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
//             />
//           </div>
          
//           <div className="flex gap-3 w-full sm:w-auto">
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
//               className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
//             >
//               <option value="all">All Status</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
            
//             <button
//               onClick={() => {
//                 setEditingTeacher(null);
//                 setShowModal(true);
//               }}
//               className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//               </svg>
//               Add Teacher
//             </button>
//           </div>
//         </div>

//         {/* Teachers Table */}
//         <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-800/50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Teacher</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Subjects</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Classes</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Experience</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Salary</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-700">
//                 {filteredTeachers.map((teacher) => (
//                   <tr key={teacher.id} className="hover:bg-white/5 transition-colors">
//                     <td className="px-4 py-3 text-sm text-gray-300 font-mono">{teacher.id}</td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
//                           {teacher.name.charAt(0)}
//                         </div>
//                         <div>
//                           <p className="text-sm font-medium text-white">{teacher.name}</p>
//                           <p className="text-xs text-gray-400">{teacher.email}</p>
//                           <p className="text-xs text-gray-500">{teacher.phone}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex flex-wrap gap-1">
//                         {teacher.subjects.slice(0, 2).map(sub => (
//                           <span key={sub} className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
//                             {sub}
//                           </span>
//                         ))}
//                         {teacher.subjects.length > 2 && (
//                           <span className="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs rounded-full">
//                             +{teacher.subjects.length - 2}
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex flex-wrap gap-1">
//                         {teacher.classAssigned.slice(0, 2).map(cls => (
//                           <span key={cls} className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
//                             {cls}
//                           </span>
//                         ))}
//                         {teacher.classAssigned.length > 2 && (
//                           <span className="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs rounded-full">
//                             +{teacher.classAssigned.length - 2}
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-sm text-white">{teacher.experience} years</td>
//                     <td className="px-4 py-3">
//                       <span className="text-sm font-semibold text-yellow-400">₹{teacher.salary.toLocaleString()}</span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className={`px-2 py-1 text-xs rounded-full ${teacher.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
//                         {teacher.status === 'active' ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleViewDetails(teacher)}
//                           className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
//                           title="View Details"
//                         >
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                           </svg>
//                         </button>
//                         <button
//                           onClick={() => handleEdit(teacher)}
//                           className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
//                           title="Edit"
//                         >
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                           </svg>
//                         </button>
//                         <button
//                           onClick={() => handleDelete(teacher)}
//                           className="p-1 text-red-400 hover:text-red-300 transition-colors"
//                           title="Delete"
//                         >
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                           </svg>
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           {filteredTeachers.length === 0 && (
//             <div className="text-center py-12">
//               <p className="text-gray-400">No teachers found</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Add/Edit Teacher Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
//           <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
//             <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
//               <h2 className="text-xl font-bold text-white">
//                 {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
//               </h2>
//               <button
//                 onClick={() => {
//                   setShowModal(false);
//                   setEditingTeacher(null);
//                 }}
//                 className="text-gray-400 hover:text-white transition-colors"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
            
//             <form onSubmit={handleSubmit} className="p-6 space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
//                   <input
//                     type="text"
//                     name="name"
//                     defaultValue={editingTeacher?.name}
//                     required
//                     className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
//                   <input
//                     type="email"
//                     name="email"
//                     defaultValue={editingTeacher?.email}
//                     required
//                     className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-1">Phone *</label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     defaultValue={editingTeacher?.phone}
//                     required
//                     className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
//                   <select
//                     name="gender"
//                     defaultValue={editingTeacher?.gender || 'male'}
//                     className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
//                   >
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-1">Qualification *</label>
//                   <input
//                     type="text"
//                     name="qualification"
//                     defaultValue={editingTeacher?.qualification}
//                     required
//                     className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-1">Experience (years) *</label>
//                   <input
//                     type="number"
//                     name="experience"
//                     defaultValue={editingTeacher?.experience}
//                     required
//                     min="0"
//                     className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-1">Joining Date *</label>
//                   <input
//                     type="date"
//                     name="joiningDate"
//                     defaultValue={editingTeacher?.joiningDate}
//                     required
//                     className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-1">Monthly Salary (₹) *</label>
//                   <input
//                     type="number"
//                     name="salary"
//                     defaultValue={editingTeacher?.salary}
//                     required
//                     min="0"
//                     className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
//                   />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
//                   <textarea
//                     name="address"
//                     defaultValue={editingTeacher?.address}
//                     rows={2}
//                     className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
//                   />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-300 mb-1">Subjects Taught *</label>
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-gray-800/50 rounded-lg max-h-40 overflow-y-auto">
//                     {subjectsList.map(subject => (
//                       <label key={subject} className="flex items-center gap-2 text-sm text-gray-300">
//                         <input
//                           type="checkbox"
//                           name="subjects"
//                           value={subject}
//                           defaultChecked={editingTeacher?.subjects.includes(subject)}
//                           className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
//                         />
//                         {subject}
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-300 mb-1">Classes Assigned *</label>
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-gray-800/50 rounded-lg max-h-40 overflow-y-auto">
//                     {classesList.map(cls => (
//                       <label key={cls} className="flex items-center gap-2 text-sm text-gray-300">
//                         <input
//                           type="checkbox"
//                           name="classes"
//                           value={cls}
//                           defaultChecked={editingTeacher?.classAssigned.includes(cls)}
//                           className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
//                         />
//                         {cls}
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
//                   <select
//                     name="status"
//                     defaultValue={editingTeacher?.status || 'active'}
//                     className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
//                   >
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                   </select>
//                 </div>
//               </div>
              
//               <div className="flex gap-3 pt-4">
//                 <button
//                   type="submit"
//                   className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
//                 >
//                   {editingTeacher ? 'Update Teacher' : 'Add Teacher'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowModal(false);
//                     setEditingTeacher(null);
//                   }}
//                   className="px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Teacher Details Modal */}
//       {showDetailsModal && selectedTeacher && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//           <div className="bg-gray-900 rounded-xl max-w-2xl w-full border border-gray-700">
//             <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
//               <h2 className="text-xl font-bold text-white">Teacher Details</h2>
//               <button
//                 onClick={() => setShowDetailsModal(false)}
//                 className="text-gray-400 hover:text-white transition-colors"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
            
//             <div className="p-6">
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
//                   {selectedTeacher.name.charAt(0)}
//                 </div>
//                 <div>
//                   <h3 className="text-2xl font-bold text-white">{selectedTeacher.name}</h3>
//                   <p className="text-gray-400">{selectedTeacher.id}</p>
//                   <span className={`px-2 py-0.5 text-xs rounded-full ${selectedTeacher.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
//                     {selectedTeacher.status === 'active' ? 'Active' : 'Inactive'}
//                   </span>
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="bg-gray-800/50 p-3 rounded-lg">
//                   <p className="text-xs text-gray-500">Email</p>
//                   <p className="text-white">{selectedTeacher.email}</p>
//                 </div>
//                 <div className="bg-gray-800/50 p-3 rounded-lg">
//                   <p className="text-xs text-gray-500">Phone</p>
//                   <p className="text-white">{selectedTeacher.phone}</p>
//                 </div>
//                 <div className="bg-gray-800/50 p-3 rounded-lg">
//                   <p className="text-xs text-gray-500">Qualification</p>
//                   <p className="text-white">{selectedTeacher.qualification}</p>
//                 </div>
//                 <div className="bg-gray-800/50 p-3 rounded-lg">
//                   <p className="text-xs text-gray-500">Experience</p>
//                   <p className="text-white">{selectedTeacher.experience} years</p>
//                 </div>
//                 <div className="bg-gray-800/50 p-3 rounded-lg">
//                   <p className="text-xs text-gray-500">Joining Date</p>
//                   <p className="text-white">{selectedTeacher.joiningDate}</p>
//                 </div>
//                 <div className="bg-gray-800/50 p-3 rounded-lg">
//                   <p className="text-xs text-gray-500">Monthly Salary</p>
//                   <p className="text-xl font-bold text-yellow-400">₹{selectedTeacher.salary.toLocaleString()}</p>
//                 </div>
//                 <div className="md:col-span-2 bg-gray-800/50 p-3 rounded-lg">
//                   <p className="text-xs text-gray-500">Subjects</p>
//                   <div className="flex flex-wrap gap-1 mt-1">
//                     {selectedTeacher.subjects.map(sub => (
//                       <span key={sub} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">{sub}</span>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="md:col-span-2 bg-gray-800/50 p-3 rounded-lg">
//                   <p className="text-xs text-gray-500">Classes Assigned</p>
//                   <div className="flex flex-wrap gap-1 mt-1">
//                     {selectedTeacher.classAssigned.map(cls => (
//                       <span key={cls} className="px-2 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">{cls}</span>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="md:col-span-2 bg-gray-800/50 p-3 rounded-lg">
//                   <p className="text-xs text-gray-500">Address</p>
//                   <p className="text-white">{selectedTeacher.address}</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="px-6 py-4 border-t border-gray-700 flex justify-end">
//               <button
//                 onClick={() => setShowDetailsModal(false)}
//                 className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TeachersManagement;



import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Staff {
  _id: string;
  name: string;
  phone: string;
  email: string;
  role: 'TEACHER' | 'DRIVER' | 'MAID' | 'LABOUR';
  department?: string;
  joiningDate: string;
  salaryType: 'MONTHLY' | 'DAILY' | 'HOURLY';
  salary: number;
  isActive: boolean;
}

const StaffManagement: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'TEACHER' | 'DRIVER' | 'MAID' | 'LABOUR'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Department options (only for TEACHER role)
  const departmentsList = [
    'Science', 'Mathematics', 'Languages', 'Social Science', 
    'Commerce', 'Arts', 'Computer Science', 'Physical Education', 
    'Fine Arts', 'Music', 'Primary Education', 'Kindergarten'
  ];

  // Role options with icons and descriptions
  const rolesConfig = {
    TEACHER: { icon: '👨‍🏫', name: 'Teacher', color: 'blue', departmentRequired: true },
    DRIVER: { icon: '🚌', name: 'Driver', color: 'green', departmentRequired: false },
    MAID: { icon: '🧹', name: 'Maid', color: 'purple', departmentRequired: false },
    LABOUR: { icon: '🔧', name: 'Labour', color: 'orange', departmentRequired: false }
  };

  // Initial static data
  const initialStaff: Staff[] = [
    {
      _id: 'STF001',
      name: 'Dr. Rajesh Kumar',
      phone: '9876543210',
      email: 'rajesh.kumar@edumanager.edu',
      role: 'TEACHER',
      department: 'Mathematics',
      joiningDate: '2015-06-15',
      salaryType: 'MONTHLY',
      salary: 65000,
      isActive: true
    },
    {
      _id: 'STF002',
      name: 'Meera Sharma',
      phone: '9876543211',
      email: 'meera.sharma@edumanager.edu',
      role: 'TEACHER',
      department: 'Science',
      joiningDate: '2018-07-20',
      salaryType: 'MONTHLY',
      salary: 55000,
      isActive: true
    },
    {
      _id: 'STF003',
      name: 'Suresh Verma',
      phone: '9876543212',
      email: 'suresh.verma@edumanager.edu',
      role: 'TEACHER',
      department: 'Languages',
      joiningDate: '2010-04-10',
      salaryType: 'MONTHLY',
      salary: 70000,
      isActive: true
    },
    {
      _id: 'STF004',
      name: 'Ramesh Singh',
      phone: '9876543213',
      email: 'ramesh.singh@edumanager.edu',
      role: 'DRIVER',
      department: undefined,
      joiningDate: '2020-01-15',
      salaryType: 'MONTHLY',
      salary: 25000,
      isActive: true
    },
    {
      _id: 'STF005',
      name: 'Lakshmi Bai',
      phone: '9876543214',
      email: 'lakshmi.bai@edumanager.edu',
      role: 'MAID',
      department: undefined,
      joiningDate: '2021-03-10',
      salaryType: 'MONTHLY',
      salary: 15000,
      isActive: true
    },
    {
      _id: 'STF006',
      name: 'Mohan Kumar',
      phone: '9876543215',
      email: 'mohan.kumar@edumanager.edu',
      role: 'LABOUR',
      department: undefined,
      joiningDate: '2022-06-20',
      salaryType: 'DAILY',
      salary: 500,
      isActive: true
    },
    {
      _id: 'STF007',
      name: 'Priya Gupta',
      phone: '9876543216',
      email: 'priya.gupta@edumanager.edu',
      role: 'TEACHER',
      department: 'Commerce',
      joiningDate: '2019-08-01',
      salaryType: 'MONTHLY',
      salary: 48000,
      isActive: false
    }
  ];

  useEffect(() => {
    // Load static data
    setStaff(initialStaff);
  }, []);

  // Filter staff based on search, role and status
  const filteredStaff = staff.filter(staffMember => {
    const matchesSearch = staffMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staffMember.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staffMember.phone.includes(searchTerm) ||
                         staffMember._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || staffMember.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' ? staffMember.isActive : !staffMember.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate statistics
  const totalStaff = staff.length;
  const activeStaff = staff.filter(s => s.isActive).length;
  const totalSalaryExpense = staff.reduce((sum, s) => 
    sum + (s.salaryType === 'MONTHLY' ? s.salary : s.salary * 30), 0
  );
  const avgSalary = totalStaff > 0 ? Math.round(totalSalaryExpense / totalStaff) : 0;

  const getRoleStats = (role: string) => {
    return staff.filter(s => s.role === role && s.isActive).length;
  };

  // Handle Add/Update Staff
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const role = formData.get('role') as Staff['role'];
    const staffData: Omit<Staff, '_id'> = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      role: role,
      department: rolesConfig[role].departmentRequired ? (formData.get('department') as string) : undefined,
      joiningDate: formData.get('joiningDate') as string,
      salaryType: formData.get('salaryType') as Staff['salaryType'],
      salary: parseFloat(formData.get('salary') as string),
      isActive: formData.get('status') === 'active'
    };

    if (editingStaff) {
      // Update existing staff
      setStaff(prev => prev.map(s => 
        s._id === editingStaff._id ? { ...staffData, _id: s._id } : s
      ));
      toast.success('Staff member updated successfully!');
    } else {
      // Add new staff
      const newId = `STF${String(staff.length + 1).padStart(3, '0')}`;
      setStaff(prev => [...prev, { ...staffData, _id: newId }]);
      toast.success('Staff member added successfully!');
    }
    
    setShowModal(false);
    setEditingStaff(null);
  };

  // Handle Delete Staff
  const handleDelete = (staffMember: Staff) => {
    if (window.confirm(`Are you sure you want to delete ${staffMember.name}?`)) {
      setStaff(prev => prev.filter(s => s._id !== staffMember._id));
      toast.success('Staff member deleted successfully!');
    }
  };

  // Handle Edit Click
  const handleEdit = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setShowModal(true);
  };

  // Handle View Details
  const handleViewDetails = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setShowDetailsModal(true);
  };

  // Get salary display text
  const getSalaryDisplay = (staffMember: Staff) => {
    if (staffMember.salaryType === 'MONTHLY') {
      return `₹${staffMember.salary.toLocaleString()}/month`;
    } else if (staffMember.salaryType === 'DAILY') {
      return `₹${staffMember.salary.toLocaleString()}/day`;
    } else {
      return `₹${staffMember.salary.toLocaleString()}/hour`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Staff Management
          </h1>
          <p className="text-gray-400 mt-1">Manage all staff members including teachers, drivers, maids, and labour</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Staff</p>
                <p className="text-2xl font-bold text-white">{totalStaff}</p>
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
                <p className="text-gray-400 text-sm">Active Staff</p>
                <p className="text-2xl font-bold text-green-400">{activeStaff}</p>
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
                <p className="text-gray-400 text-sm">Monthly Salary Expense</p>
                <p className="text-2xl font-bold text-yellow-400">₹{totalSalaryExpense.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Average Salary</p>
                <p className="text-2xl font-bold text-purple-400">₹{avgSalary.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Role Distribution */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {Object.entries(rolesConfig).map(([role, config]) => (
            <div key={role} className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-center border border-white/10">
              <div className="text-2xl mb-1">{config.icon}</div>
              <div className="text-white font-semibold">{config.name}</div>
              <div className="text-2xl font-bold text-blue-400">{getRoleStats(role)}</div>
              <div className="text-xs text-gray-400">Active</div>
            </div>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, email, ID or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as typeof filterRole)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
            >
              <option value="all">All Roles</option>
              <option value="TEACHER">👨‍🏫 Teachers</option>
              <option value="DRIVER">🚌 Drivers</option>
              <option value="MAID">🧹 Maids</option>
              <option value="LABOUR">🔧 Labour</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <button
              onClick={() => {
                setEditingStaff(null);
                setShowModal(true);
              }}
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Staff
            </button>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Staff Member</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Salary Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Salary</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joining Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredStaff.map((staffMember) => (
                  <tr key={staffMember._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-300 font-mono">{staffMember._id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br from-${rolesConfig[staffMember.role].color}-500 to-${rolesConfig[staffMember.role].color}-600 rounded-full flex items-center justify-center text-white text-xl`}>
                          {rolesConfig[staffMember.role].icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{staffMember.name}</p>
                          <p className="text-xs text-gray-400">{staffMember.email}</p>
                          <p className="text-xs text-gray-500">{staffMember.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full bg-${rolesConfig[staffMember.role].color}-500/20 text-${rolesConfig[staffMember.role].color}-400`}>
                        {rolesConfig[staffMember.role].icon} {rolesConfig[staffMember.role].name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {staffMember.department || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        staffMember.salaryType === 'MONTHLY' ? 'bg-green-500/20 text-green-400' :
                        staffMember.salaryType === 'DAILY' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {staffMember.salaryType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-yellow-400">
                        {getSalaryDisplay(staffMember)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {new Date(staffMember.joiningDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${staffMember.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {staffMember.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(staffMember)}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                          title="View Details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEdit(staffMember)}
                          className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(staffMember)}
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
          {filteredStaff.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No staff members found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingStaff(null);
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingStaff?.name}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingStaff?.email}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={editingStaff?.phone}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Role *</label>
                  <select
                    name="role"
                    defaultValue={editingStaff?.role || 'TEACHER'}
                    required
                    onChange={(e) => {
                      const role = e.target.value as Staff['role'];
                      const deptField = document.getElementById('department-field');
                      if (deptField) {
                        deptField.style.display = rolesConfig[role].departmentRequired ? 'block' : 'none';
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  >
                    <option value="TEACHER">👨‍🏫 Teacher</option>
                    <option value="DRIVER">🚌 Driver</option>
                    <option value="MAID">🧹 Maid</option>
                    <option value="LABOUR">🔧 Labour</option>
                  </select>
                </div>
                <div id="department-field" style={{ display: editingStaff?.role === 'TEACHER' || (!editingStaff && true) ? 'block' : 'none' }}>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Department (for Teachers) *</label>
                  <select
                    name="department"
                    defaultValue={editingStaff?.department || departmentsList[0]}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  >
                    {departmentsList.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Joining Date *</label>
                  <input
                    type="date"
                    name="joiningDate"
                    defaultValue={editingStaff?.joiningDate}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Salary Type *</label>
                  <select
                    name="salaryType"
                    defaultValue={editingStaff?.salaryType || 'MONTHLY'}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  >
                    <option value="MONTHLY">Monthly (₹/month)</option>
                    <option value="DAILY">Daily (₹/day)</option>
                    <option value="HOURLY">Hourly (₹/hour)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Salary Amount *</label>
                  <input
                    type="number"
                    name="salary"
                    defaultValue={editingStaff?.salary}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={editingStaff?.isActive ? 'active' : 'inactive'}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
                >
                  {editingStaff ? 'Update Staff' : 'Add Staff'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingStaff(null);
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

      {/* Staff Details Modal */}
      {showDetailsModal && selectedStaff && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Staff Details</h2>
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
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-20 h-20 bg-gradient-to-br from-${rolesConfig[selectedStaff.role].color}-500 to-${rolesConfig[selectedStaff.role].color}-600 rounded-full flex items-center justify-center text-4xl`}>
                  {rolesConfig[selectedStaff.role].icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedStaff.name}</h3>
                  <p className="text-gray-400">{selectedStaff._id}</p>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${selectedStaff.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {selectedStaff.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="text-white text-lg">{rolesConfig[selectedStaff.role].icon} {rolesConfig[selectedStaff.role].name}</p>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-white">{selectedStaff.email}</p>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-white">{selectedStaff.phone}</p>
                </div>
                {selectedStaff.department && (
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-white">{selectedStaff.department}</p>
                  </div>
                )}
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Joining Date</p>
                  <p className="text-white">{new Date(selectedStaff.joiningDate).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Salary Type</p>
                  <p className="text-white">{selectedStaff.salaryType}</p>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg md:col-span-2">
                  <p className="text-xs text-gray-500">Salary</p>
                  <p className="text-2xl font-bold text-yellow-400">{getSalaryDisplay(selectedStaff)}</p>
                  {selectedStaff.salaryType !== 'MONTHLY' && (
                    <p className="text-xs text-gray-400 mt-1">
                      Monthly equivalent: ₹{(selectedStaff.salaryType === 'DAILY' ? selectedStaff.salary * 30 : selectedStaff.salary * 8 * 30).toLocaleString()}/month
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-700 flex justify-end">
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

export default StaffManagement;
