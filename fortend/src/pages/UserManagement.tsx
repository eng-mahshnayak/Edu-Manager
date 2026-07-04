import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'principal' | 'teacher' | 'staff' | 'parent' | 'student';
  phone: string;
  address?: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  permissions: string[];
  assignedTo?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showPassword, setShowPassword] = useState(false);

  // Static user data
  const initialUsers: User[] = [
    {
      id: 'USR001',
      username: 'admin',
      email: 'admin@edumanager.edu',
      password: 'admin123',
      fullName: 'System Administrator',
      role: 'admin',
      phone: '9876543290',
      address: 'Admin Office, School Campus',
      isActive: true,
      createdAt: '2024-01-01',
      permissions: ['all'],
      lastLogin: '2024-12-05 10:30:00'
    },
    {
      id: 'USR002',
      username: 'principal',
      email: 'principal@edumanager.edu',
      password: 'principal123',
      fullName: 'Dr. Rajesh Kumar',
      role: 'principal',
      phone: '9876543291',
      address: 'Principal Office',
      isActive: true,
      createdAt: '2024-01-01',
      permissions: ['manage_staff', 'manage_students', 'manage_expenses', 'view_reports'],
      lastLogin: '2024-12-05 09:15:00'
    },
    {
      id: 'USR003',
      username: 'rajesh.teacher',
      email: 'rajesh.kumar@edumanager.edu',
      password: 'teacher123',
      fullName: 'Dr. Rajesh Kumar',
      role: 'teacher',
      phone: '9876543210',
      address: 'Staff Quarters',
      isActive: true,
      createdAt: '2024-01-15',
      permissions: ['manage_homework', 'mark_attendance', 'view_students'],
      assignedTo: 'Mathematics Department',
      lastLogin: '2024-12-04 14:20:00'
    },
    {
      id: 'USR004',
      username: 'meera.teacher',
      email: 'meera.sharma@edumanager.edu',
      password: 'teacher123',
      fullName: 'Prof. Meera Sharma',
      role: 'teacher',
      phone: '9876543211',
      address: 'Staff Quarters',
      isActive: true,
      createdAt: '2024-01-15',
      permissions: ['manage_homework', 'mark_attendance', 'view_students'],
      assignedTo: 'Science Department',
      lastLogin: '2024-12-04 11:45:00'
    },
    {
      id: 'USR005',
      username: 'suresh.teacher',
      email: 'suresh.verma@edumanager.edu',
      password: 'teacher123',
      fullName: 'Mr. Suresh Verma',
      role: 'teacher',
      phone: '9876543212',
      isActive: true,
      createdAt: '2024-01-15',
      permissions: ['manage_homework', 'mark_attendance', 'view_students'],
      assignedTo: 'English Department',
      lastLogin: '2024-12-03 09:30:00'
    },
    {
      id: 'USR006',
      username: 'ramesh.driver',
      email: 'ramesh.singh@edumanager.edu',
      password: 'staff123',
      fullName: 'Ramesh Singh',
      role: 'staff',
      phone: '9876543216',
      isActive: true,
      createdAt: '2024-02-01',
      permissions: ['view_transport'],
      assignedTo: 'Transport Department',
      lastLogin: '2024-12-05 08:00:00'
    },
    {
      id: 'USR007',
      username: 'parent_kumar',
      email: 'parent.kumar@gmail.com',
      password: 'parent123',
      fullName: 'Amit Kumar',
      role: 'parent',
      phone: '9876543220',
      address: 'Green Park, Delhi',
      isActive: true,
      createdAt: '2024-03-01',
      permissions: ['view_student_progress', 'view_notices', 'submit_feedback'],
      assignedTo: '10th A - Student: Rohan Kumar',
      lastLogin: '2024-12-04 19:00:00'
    },
    {
      id: 'USR008',
      username: 'student_rohan',
      email: 'rohan.kumar@student.edu',
      password: 'student123',
      fullName: 'Rohan Kumar',
      role: 'student',
      phone: '9876543221',
      isActive: true,
      createdAt: '2024-03-01',
      permissions: ['view_homework', 'submit_assignment', 'view_results'],
      assignedTo: '10th A',
      lastLogin: '2024-12-04 16:30:00'
    }
  ];

  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(initialUsers);
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  const roleOptions = [
    { value: 'admin', label: '👑 Admin', color: 'bg-red-500/20 text-red-400' },
    { value: 'principal', label: '👔 Principal', color: 'bg-purple-500/20 text-purple-400' },
    { value: 'teacher', label: '👨‍🏫 Teacher', color: 'bg-blue-500/20 text-blue-400' },
    { value: 'staff', label: '👩‍💼 Staff', color: 'bg-green-500/20 text-green-400' },
    { value: 'parent', label: '👪 Parent', color: 'bg-yellow-500/20 text-yellow-400' },
    { value: 'student', label: '🎓 Student', color: 'bg-pink-500/20 text-pink-400' }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' ? user.isActive : !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'> = {
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      fullName: formData.get('fullName') as string,
      role: formData.get('role') as User['role'],
      phone: formData.get('phone') as string,
      address: formData.get('address') as string || undefined,
      isActive: formData.get('status') === 'active',
      permissions: [],
      assignedTo: formData.get('assignedTo') as string || undefined
    };

    if (!editingUser && users.some(u => u.username === userData.username)) {
      toast.error('Username already exists!');
      return;
    }

    if (editingUser) {
      const updatedUser = {
        ...userData,
        id: editingUser.id,
        createdAt: editingUser.createdAt,
        password: userData.password || editingUser.password,
        lastLogin: editingUser.lastLogin
      };
      setUsers(prev => prev.map(u => u.id === editingUser.id ? updatedUser : u));
      toast.success('User updated successfully!');
    } else {
      const newId = `USR${String(users.length + 1).padStart(3, '0')}`;
      const newUser: User = {
        ...userData,
        id: newId,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUsers(prev => [...prev, newUser]);
      toast.success(`User created successfully! Username: ${userData.username}, Password: ${userData.password}`);
    }
    
    setShowModal(false);
    setEditingUser(null);
  };

  const handleDelete = (user: User) => {
    if (user.username === 'admin') {
      toast.error('Cannot delete admin user!');
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${user.fullName}?`)) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
      toast.success('User deleted successfully!');
    }
  };

  const toggleStatus = (user: User) => {
    if (user.username === 'admin') {
      toast.error('Cannot deactivate admin user!');
      return;
    }
    setUsers(prev => prev.map(u => 
      u.id === user.id ? { ...u, isActive: !u.isActive } : u
    ));
    toast.success(`User ${!user.isActive ? 'activated' : 'deactivated'} successfully!`);
  };

  const resetPassword = (user: User) => {
    const newPassword = Math.random().toString(36).slice(-8);
    setUsers(prev => prev.map(u => 
      u.id === user.id ? { ...u, password: newPassword } : u
    ));
    toast.success(`Password reset for ${user.fullName}. New password: ${newPassword}`);
  };

  const getRoleBadge = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: 'bg-red-500/20 text-red-400',
      principal: 'bg-purple-500/20 text-purple-400',
      teacher: 'bg-blue-500/20 text-blue-400',
      staff: 'bg-green-500/20 text-green-400',
      parent: 'bg-yellow-500/20 text-yellow-400',
      student: 'bg-pink-500/20 text-pink-400'
    };
    const roleIcons: Record<string, string> = {
      admin: '👑',
      principal: '👔',
      teacher: '👨‍🏫',
      staff: '👩‍💼',
      parent: '👪',
      student: '🎓'
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${roleMap[role]}`}>
        {roleIcons[role]} {role.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-cyan-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            User Management
          </h1>
          <p className="text-gray-400 mt-1">Create and manage users who can login to the system</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-green-400">{users.filter(u => u.isActive).length}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Teachers</p>
                <p className="text-2xl font-bold text-blue-400">{users.filter(u => u.role === 'teacher').length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Students</p>
                <p className="text-2xl font-bold text-purple-400">{users.filter(u => u.role === 'student').length}</p>
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
              placeholder="Search by name, username, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 outline-none"
            />
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 outline-none"
            >
              <option value="all">All Roles</option>
              <option value="admin">👑 Admin</option>
              <option value="principal">👔 Principal</option>
              <option value="teacher">👨‍🏫 Teacher</option>
              <option value="staff">👩‍💼 Staff</option>
              <option value="parent">👪 Parent</option>
              <option value="student">🎓 Student</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <button
              onClick={() => {
                setEditingUser(null);
                setShowModal(true);
              }}
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Login Credentials</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Login</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                          user.role === 'admin' ? 'bg-red-600' :
                          user.role === 'principal' ? 'bg-purple-600' :
                          user.role === 'teacher' ? 'bg-blue-600' :
                          user.role === 'staff' ? 'bg-green-600' :
                          user.role === 'parent' ? 'bg-yellow-600' : 'bg-pink-600'
                        }`}>
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{user.fullName}</p>
                          <p className="text-xs text-gray-400">{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm text-white">Username: <span className="text-cyan-400">{user.username}</span></p>
                        <p className="text-xs text-gray-500">Password: ••••••••</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-white">{user.phone}</div>
                      {user.assignedTo && (
                        <div className="text-xs text-gray-400">📍 {user.assignedTo}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(user)}
                        className={`px-2 py-1 text-xs rounded-full transition-colors ${
                          user.isActive 
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => resetPassword(user)}
                          className="p-1 text-purple-400 hover:text-purple-300 transition-colors"
                          title="Reset Password"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setShowModal(true);
                          }}
                          className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
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
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No users found</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-blue-400 font-semibold mb-1">Login Information</h3>
              <p className="text-sm text-gray-300">
                Users can login using their <strong>Username</strong> and <strong>Password</strong> at the login page.
              </p>
              <div className="mt-2 text-xs text-gray-400">
                <strong>Default credentials:</strong><br />
                • Admin: username: admin, password: admin123<br />
                • Principal: username: principal, password: principal123<br />
                • Teacher: username: rajesh.teacher, password: teacher123<br />
                • Student: username: student_rohan, password: student123
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {editingUser ? 'Edit User' : 'Create New User'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingUser(null);
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
                    name="fullName"
                    defaultValue={editingUser?.fullName}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Username *</label>
                  <input
                    type="text"
                    name="username"
                    defaultValue={editingUser?.username}
                    required
                    disabled={editingUser?.username === 'admin'}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 outline-none disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingUser?.email}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Password {!editingUser && '*'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required={!editingUser}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 outline-none"
                      placeholder={editingUser ? "Leave blank to keep current" : "Enter password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={editingUser?.phone}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Role *</label>
                  <select
                    name="role"
                    defaultValue={editingUser?.role}
                    required
                    disabled={editingUser?.username === 'admin'}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 outline-none disabled:opacity-50"
                  >
                    {roleOptions.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Assigned To (Class/Dept)</label>
                  <input
                    type="text"
                    name="assignedTo"
                    defaultValue={editingUser?.assignedTo}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 outline-none"
                    placeholder="e.g., 10th A, Mathematics Dept"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={editingUser?.isActive ? 'active' : 'inactive'}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                  <textarea
                    name="address"
                    defaultValue={editingUser?.address}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all"
                >
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingUser(null);
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

export default UserManagement;