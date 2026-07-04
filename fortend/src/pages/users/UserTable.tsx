import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

// ==================== UserForm Component ====================
interface UserFormProps {
  user?: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: 'admin' | 'trader' | 'analyst' | 'manager';
    isActive: boolean;
  } | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    role: user?.role || 'trader',
    password: '',
    confirmPassword: '',
    isActive: user?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name cannot exceed 50 characters';
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }

    if (!user) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.dismiss();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (user) {
        const updateData: any = {
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
          isActive: formData.isActive,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }

        if(formData.password !== formData.confirmPassword){
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }
       
        const response = await axios.put(
          `${API_URL}/users/update/${user._id}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );

        if(response.data.success === true){
          toast.success(response.data.message || "Successfully updated user");
          onSuccess();
        } else {
          toast.error(response?.data?.message || response?.data?.errors || 'Failed to update user');
        }
      } else {
        const response = await axios.post(
          `${API_URL}/users/signup`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );

        if(response.data.success === true){
          toast.success(response.data.message || "Successfully created user");
          onSuccess();
        } else {
          toast.error(response?.data?.message || response?.data?.errors || 'Failed to create user');
        }
      }
    } catch (err: any) {
      console.error('Form submission error:', err);
      onError(err.response?.data?.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {user ? 'Edit Trader' : 'Add New Trader'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Full Name <span className="text-yellow-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className={`w-full px-4 py-2.5 bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all text-white ${
                  errors.name ? 'border-red-500' : 'border-gray-700'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email Address <span className="text-yellow-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className={`w-full px-4 py-2.5 bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all text-white ${
                  errors.email ? 'border-red-500' : 'border-gray-700'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter 10-digit phone number"
                maxLength={10}
                className={`w-full px-4 py-2.5 bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all text-white ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-700'
                }`}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Role <span className="text-yellow-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
              >
                <option value="trader">Trader</option>
                <option value="analyst">Market Analyst</option>
                <option value="manager">Portfolio Manager</option>
                <option value="admin">System Admin</option>
              </select>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {user ? 'New Password (leave blank to keep current)' : 'Password'} 
                  {!user && <span className="text-yellow-500">*</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={user ? 'Enter new password' : 'Enter password'}
                    className={`w-full px-4 py-2.5 bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all text-white ${
                      errors.password ? 'border-red-500' : 'border-gray-700'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-yellow-500"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {(!user || formData.password) && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className={`w-full px-4 py-2.5 bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all text-white ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              )}
            </div>

            {user && (
              <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-xl">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
                <span className="text-sm font-medium text-gray-300">
                  {formData.isActive ? 'Active Trader' : 'Inactive Account'}
                </span>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all hover:-translate-y-0.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 font-medium"
              >
                {loading ? 'Saving...' : user ? 'Update Trader' : 'Add Trader'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 border border-gray-700 rounded-xl hover:bg-gray-800 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 font-medium text-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ==================== Interfaces ====================
interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: 'admin' | 'trader' | 'analyst' | 'manager';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
  count: number;
}

// ==================== Main UserTable Component ====================
const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 25,
    pages: 0,
    count: 0
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch users with backend pagination
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm);
      }
      
      if (roleFilter !== 'all') {
        params.append('role', roleFilter);
      }
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await axios.get(
        `${API_URL}/users/getall?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      if (response.data.success) {
        setUsers(response.data.data);
        setPagination({
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          pages: response.data.pages,
          count: response.data.count
        });
        setError(null);
      } else {
        toast.error(response.data?.message || "Something went wrong");
      }
      
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const stats = {
    total: pagination.total,
    admin: users.filter(u => u.role === 'admin').length,
    trader: users.filter(u => u.role === 'trader').length,
    analyst: users.filter(u => u.role === 'analyst').length,
    manager: users.filter(u => u.role === 'manager').length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPagination({
      ...pagination,
      limit: Number(event.target.value),
      page: 1
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(
        `${API_URL}/users/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      if (response.data.success) {
        toast.success('Trader deleted successfully');
        fetchUsers();
      } else {
        toast.error(response.data?.message || "Something went wrong");
      }
    } catch (err) {
      toast.error('Failed to delete trader');
    }
    setDeleteDialogOpen(false);
  };

  const handleDeleteAll = async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/users/deleteall`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      if (response.data.success) {
        toast.success('All traders deleted successfully');
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchUsers();
      } else {
        toast.error(response.data?.message || "Something went wrong");
      }
    } catch (err) {
      toast.error('Failed to delete all traders');
    }
    setDeleteAllDialogOpen(false);
  };

  const handleStatusToggle = async (user: User) => {
    try {
      const response = await axios.patch(
        `${API_URL}/users/${user._id}`,
        { isActive: !user.isActive },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      
      if (response.data.success) {
        toast.success(`Trader ${user.isActive ? 'deactivated' : 'activated'} successfully`);
        setUsers(users.map(u => u._id === user._id ? { ...u, isActive: !u.isActive } : u));
      }
    } catch (err) {
      toast.error('Failed to update trader status');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-purple-900/50 text-purple-400 border-purple-700';
      case 'trader': return 'bg-blue-900/50 text-blue-400 border-blue-700';
      case 'analyst': return 'bg-green-900/50 text-green-400 border-green-700';
      case 'manager': return 'bg-orange-900/50 text-orange-400 border-orange-700';
      default: return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'admin': return '👑';
      case 'trader': return '📈';
      case 'analyst': return '📊';
      case 'manager': return '💼';
      default: return '👤';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch(role) {
      case 'admin': return 'System Admin';
      case 'trader': return 'Trader';
      case 'analyst': return 'Market Analyst';
      case 'manager': return 'Portfolio Manager';
      default: return role;
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto bg-gradient-to-br from-gray-900 to-purple-900 min-h-screen">
        <div className="h-16 bg-gray-800 rounded-lg animate-pulse mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-24 bg-gray-800 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-800 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto bg-gradient-to-br from-gray-900 to-purple-900 min-h-screen">
      {/* Header Section */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
            Trading Team Management
          </h1>
          <p className="text-sm md:text-base text-gray-400">
            Manage traders, analysts, and portfolio managers
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => {
              setSelectedUser(null);
              setFormOpen(true);
            }}
            className="px-4 md:px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm font-medium shadow-md"
          >
            <span>➕</span> Add Trader
          </button>

          <button
            onClick={fetchUsers}
            className="px-4 md:px-6 py-2.5 border border-gray-700 rounded-xl hover:bg-gray-800 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm font-medium text-gray-300"
          >
            <span>🔄</span> Refresh
          </button>

          <button
            onClick={() => setDeleteAllDialogOpen(true)}
            disabled={pagination.total === 0}
            className="px-4 md:px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all hover:-translate-y-0.5 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-sm font-medium"
          >
            <span>🗑️</span> Delete All
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-3 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group">
          <p className="text-xs opacity-90 group-hover:opacity-100">Total Traders</p>
          <p className="text-xl font-bold group-hover:scale-110 transition-transform inline-block">{stats.total}</p>
          <div className="mt-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            👥 All platform users
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group">
          <p className="text-xs opacity-90 group-hover:opacity-100">Admins</p>
          <p className="text-xl font-bold group-hover:scale-110 transition-transform inline-block">{stats.admin}</p>
          <div className="mt-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            👑 System administrators
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group">
          <p className="text-xs opacity-90 group-hover:opacity-100">Traders</p>
          <p className="text-xl font-bold group-hover:scale-110 transition-transform inline-block">{stats.trader}</p>
          <div className="mt-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            📈 Active traders
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group">
          <p className="text-xs opacity-90 group-hover:opacity-100">Analysts</p>
          <p className="text-xl font-bold group-hover:scale-110 transition-transform inline-block">{stats.analyst}</p>
          <div className="mt-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            📊 Market analysts
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-3 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group">
          <p className="text-xs opacity-90 group-hover:opacity-100">Managers</p>
          <p className="text-xl font-bold group-hover:scale-110 transition-transform inline-block">{stats.manager}</p>
          <div className="mt-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            💼 Portfolio managers
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-3 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group">
          <p className="text-xs opacity-90 group-hover:opacity-100">Active</p>
          <p className="text-xl font-bold group-hover:scale-110 transition-transform inline-block">{stats.active}</p>
          <div className="mt-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            ✅ Currently active
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 flex flex-col lg:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
          {searchTerm !== debouncedSearchTerm && (
            <span className="absolute right-3 top-2.5 text-xs text-gray-500">Searching...</span>
          )}
        </div>
        
        <div className="flex gap-2">
          <select
            value={roleFilter}
            onChange={handleRoleFilterChange}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="trader">Trader</option>
            <option value="analyst">Market Analyst</option>
            <option value="manager">Portfolio Manager</option>
          </select>

          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Rows Per Page Selector */}
      {pagination.total > 0 && (
        <div className="mb-4 flex justify-end">
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-xl border border-gray-700">
            <span className="text-sm text-gray-400">Show:</span>
            <select
              value={pagination.limit}
              onChange={handleRowsPerPageChange}
              className="border-none focus:outline-none text-sm font-medium bg-gray-800 text-white"
            >
              {[25, 50, 100, 200].map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <span className="text-sm text-gray-400">entries</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-400">
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="mb-4 p-4 bg-blue-900/50 border border-blue-700 rounded-xl text-blue-400">
          Loading traders...
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-gray-800 rounded-xl border border-gray-700 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Trader</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Contact</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Role</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Joined</th>
                <th className="px-4 py-4 text-center text-xs font-semibold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <p className="text-gray-500">No traders found</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-xs text-gray-500">ID: {user._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-300">{user.email}</p>
                      <p className="text-xs text-gray-500">{user.phoneNumber || 'No phone'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                        {getRoleIcon(user.role)} {getRoleDisplayName(user.role)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleStatusToggle(user)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          user.isActive 
                            ? 'bg-green-900/50 text-green-400 hover:bg-green-800/50' 
                            : 'bg-red-900/50 text-red-400 hover:bg-red-800/50'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{new Date(user.createdAt).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setFormOpen(true);
                          }}
                          className="p-2 text-yellow-500 hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setDeleteDialogOpen(true);
                          }}
                          className="p-2 text-red-500 hover:bg-gray-700 rounded-lg transition-colors"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-3">
        {users.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
            <p className="text-gray-500">No traders found</p>
          </div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-gray-500">ID: {user._id.slice(-6)}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                  {getRoleIcon(user.role)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 p-3 bg-gray-900 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm truncate text-gray-300">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-gray-300">{user.phoneNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="text-sm text-gray-300">{getRoleDisplayName(user.role)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <button
                    onClick={() => handleStatusToggle(user)}
                    className={`mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                      user.isActive 
                        ? 'bg-green-900/50 text-green-400' 
                        : 'bg-red-900/50 text-red-400'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-700">
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setFormOpen(true);
                  }}
                  className="flex-1 px-3 py-2 bg-gray-700 text-yellow-500 rounded-lg text-sm hover:bg-gray-600 transition-colors flex items-center justify-center gap-1"
                >
                  <span>✏️</span> Edit
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setDeleteDialogOpen(true);
                  }}
                  className="flex-1 px-3 py-2 bg-gray-700 text-red-500 rounded-lg text-sm hover:bg-gray-600 transition-colors flex items-center justify-center gap-1"
                >
                  <span>🗑️</span> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {pagination.total > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-gray-400">
            Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
          </div>
          
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={() => handlePageChange(1)}
              disabled={pagination.page === 1}
              className="px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300"
            >
              ⏮️ First
            </button>
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300"
            >
              ◀️ Prev
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, pagination.pages))].map((_, idx) => {
                let pageNum;
                if (pagination.pages <= 5) {
                  pageNum = idx + 1;
                } else if (pagination.page <= 3) {
                  pageNum = idx + 1;
                } else if (pagination.page >= pagination.pages - 2) {
                  pageNum = pagination.pages - 4 + idx;
                } else {
                  pageNum = pagination.page - 2 + idx;
                }
                
                return (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      pagination.page === pageNum
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                        : 'border border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300"
            >
              Next ▶️
            </button>
            <button
              onClick={() => handlePageChange(pagination.pages)}
              disabled={pagination.page === pagination.pages}
              className="px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300"
            >
              Last ⏭️
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-red-500 mb-4">Confirm Delete</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="px-4 py-2 border border-gray-700 rounded-lg text-sm hover:bg-gray-700 text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedUser && handleDelete(selectedUser._id)}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm hover:from-red-600 hover:to-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Confirmation Modal */}
      {deleteAllDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-red-500 mb-4">Delete All Traders</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete ALL traders? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteAllDialogOpen(false)}
                className="px-4 py-2 border border-gray-700 rounded-lg text-sm hover:bg-gray-700 text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm hover:from-red-600 hover:to-red-700"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Form Modal */}
      {formOpen && (
        <UserForm
          user={selectedUser}
          onClose={() => {
            setFormOpen(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            fetchUsers();
            setFormOpen(false);
            setSelectedUser(null);
            toast.success(selectedUser ? 'Trader updated successfully' : 'Trader added successfully');
          }}
          onError={(message: string) => toast.error(message)}
        />
      )}
    </div>
  );
};

export default UserTable;