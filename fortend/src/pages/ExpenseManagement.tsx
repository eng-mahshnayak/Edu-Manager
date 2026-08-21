import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// ==================== Types ====================
interface Expense {
  _id: string;
  expenseId: string;
  date: string;
  category: string;
  subCategory?: string;
  amount: number;
  description: string;
  paymentMethod: 'cash' | 'bank' | 'cheque' | 'online';
  paymentStatus: 'paid' | 'pending' | 'partial';
  billNumber?: string;
  vendorName?: string;
  vendorPhone?: string;
  attachment?: string;
  approvedBy?: string;
  remarks?: string;
}

interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  subCategories: string[];
  budget?: number;
}

// ==================== Main Component ====================
const ExpenseManagement: React.FC = () => {
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // ----- State -----
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState<'daily' | 'monthly' | 'yearly' | 'category'>('monthly');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>(
    (new Date().getMonth() + 1).toString().padStart(2, '0')
  );

  // ----- Expense Categories -----
  const expenseCategories: ExpenseCategory[] = [
    {
      id: 'SAL',
      name: 'Staff Salary',
      icon: '💰',
      color: '#10B981',
      subCategories: [
        'Teachers Salary',
        'Drivers Salary',
        'Maid Salary',
        'Labour Salary',
        'Admin Salary',
        'Bonus',
        'Overtime',
      ],
      budget: 500000,
    },
    {
      id: 'INF',
      name: 'Infrastructure',
      icon: '🏗️',
      color: '#3B82F6',
      subCategories: [
        'Building Maintenance',
        'Classroom Repair',
        'Furniture',
        'Electrical Work',
        'Plumbing',
        'Painting',
        'Construction',
      ],
      budget: 200000,
    },
    {
      id: 'UTL',
      name: 'Utilities',
      icon: '💡',
      color: '#F59E0B',
      subCategories: ['Electricity Bill', 'Water Bill', 'Internet Bill', 'Phone Bill', 'Gas Bill', 'Generator Fuel'],
      budget: 100000,
    },
    {
      id: 'EQP',
      name: 'Equipment',
      icon: '💻',
      color: '#8B5CF6',
      subCategories: [
        'Computers',
        'Projectors',
        'Smart Boards',
        'Sports Equipment',
        'Lab Equipment',
        'Library Books',
        'Furniture',
      ],
      budget: 150000,
    },
    {
      id: 'SUP',
      name: 'Supplies',
      icon: '📚',
      color: '#EC4899',
      subCategories: ['Stationery', 'Printing Materials', 'Cleaning Supplies', 'First Aid', 'Uniforms', 'Books', 'Notebooks'],
      budget: 75000,
    },
    {
      id: 'TRA',
      name: 'Transport',
      icon: '🚌',
      color: '#EF4444',
      subCategories: ['Fuel', 'Vehicle Maintenance', 'Driver Salary', 'Insurance', 'Rent', 'Repairs'],
      budget: 80000,
    },
    {
      id: 'EVE',
      name: 'Events',
      icon: '🎉',
      color: '#F97316',
      subCategories: ['Annual Day', 'Sports Day', 'Picnic', 'Workshops', 'Competitions', 'Parent Meeting', 'Festivals'],
      budget: 100000,
    },
    {
      id: 'MKT',
      name: 'Marketing',
      icon: '📢',
      color: '#06B6D4',
      subCategories: ['Advertising', 'Printing', 'Social Media', 'Brochures', 'Website', 'Events'],
      budget: 50000,
    },
    {
      id: 'MSC',
      name: 'Miscellaneous',
      icon: '📦',
      color: '#6B7280',
      subCategories: ['Misc Expenses', 'Emergency', 'Donations', 'Gifts', 'Refreshments'],
      budget: 30000,
    },
  ];

  // ----- API Functions -----
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedPaymentMethod !== 'all') params.paymentMethod = selectedPaymentMethod;
      if (searchTerm) params.search = searchTerm;

      const res = await axios.get(`${API_BASE}/expenses`, { params });
      if (res.data.status) {
        setExpenses(res.data.data);
      } else {
        toast.error(res.data.message || 'Failed to fetch expenses');
      }
    } catch (error) {
      toast.error('Server error while fetching expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExpenses();
    }, 500);
    return () => clearTimeout(timer);
  }, [startDate, endDate, selectedCategory, selectedPaymentMethod, searchTerm]);

  // ----- CRUD Handlers -----
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      date: formData.get('date') as string,
      category: formData.get('category') as string,
      subCategory: formData.get('subCategory') as string || '',
      amount: parseFloat(formData.get('amount') as string),
      description: formData.get('description') as string,
      paymentMethod: formData.get('paymentMethod') as Expense['paymentMethod'],
      paymentStatus: formData.get('paymentStatus') as Expense['paymentStatus'],
      billNumber: (formData.get('billNumber') as string) || '',
      vendorName: (formData.get('vendorName') as string) || '',
      vendorPhone: (formData.get('vendorPhone') as string) || '',
      approvedBy: (formData.get('approvedBy') as string) || '',
      remarks: (formData.get('remarks') as string) || '',
    };

    setLoading(true);
    try {
      let res;
      if (editingExpense) {
        res = await axios.put(`${API_BASE}/expenses/${editingExpense._id}`, data);
      } else {
        res = await axios.post(`${API_BASE}/expenses`, data);
      }
      if (res.data.status) {
        toast.success(res.data.message);
        setShowModal(false);
        setEditingExpense(null);
        fetchExpenses();
      } else {
        toast.error(res.data.message || 'Operation failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (expense: Expense) => {
    if (!window.confirm(`Delete expense of ₹${expense.amount.toLocaleString()}?`)) return;
    try {
      const res = await axios.delete(`${API_BASE}/expenses/${expense._id}`);
      if (res.data.status) {
        toast.success('Deleted!');
        fetchExpenses();
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleEdit = async (expense: Expense) => {
    try {
      const res = await axios.get(`${API_BASE}/expenses/${expense._id}`);
      if (res.data.status) {
        setEditingExpense(res.data.data);
        setShowModal(true);
      }
    } catch (error) {
      toast.error('Failed to load expense');
    }
  };

  // ----- Computed Data -----
  const filteredExpenses = expenses; // Already filtered by API

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalPaid = filteredExpenses.filter((e) => e.paymentStatus === 'paid').reduce((sum, e) => sum + e.amount, 0);
  const totalPending = filteredExpenses.filter((e) => e.paymentStatus === 'pending').reduce((sum, e) => sum + e.amount, 0);
  const totalPartial = filteredExpenses.filter((e) => e.paymentStatus === 'partial').reduce((sum, e) => sum + e.amount, 0);

  const categoryWiseExpenses = expenseCategories
    .map((cat) => ({
      name: cat.name,
      amount: filteredExpenses.filter((e) => e.category === cat.name).reduce((sum, e) => sum + e.amount, 0),
      budget: cat.budget || 0,
      color: cat.color,
      icon: cat.icon,
    }))
    .filter((c) => c.amount > 0);

  const getMonthlyExpenses = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => {
      const monthNumber = (index + 1).toString().padStart(2, '0');
      const amount = expenses
        .filter((e) => e.date.startsWith(`${selectedYear}-${monthNumber}`))
        .reduce((sum, e) => sum + e.amount, 0);
      return { month, amount };
    });
  };

  const getReportData = () => {
    if (reportType === 'daily') {
      const daysInMonth = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => {
        const day = (i + 1).toString().padStart(2, '0');
        const date = `${selectedYear}-${selectedMonth}-${day}`;
        const amount = expenses.filter((e) => e.date === date).reduce((sum, e) => sum + e.amount, 0);
        return { day: `${day}`, amount, date };
      }).filter((d) => d.amount > 0);
    } else if (reportType === 'yearly' || reportType === 'monthly') {
      return getMonthlyExpenses();
    } else {
      return categoryWiseExpenses;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = expenseCategories.find((c) => c.name === categoryName);
    return category ? category.icon : '📋';
  };


  // ----- Render -----
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Expense Management
          </h1>
          <p className="text-gray-400 mt-1">Track and manage all institution expenses with detailed reports</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Expenses</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalExpenses)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Paid</p>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(totalPaid)}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{formatCurrency(totalPending)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-orange-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Partial</p>
                <p className="text-2xl font-bold text-orange-400">{formatCurrency(totalPartial)}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
              >
                <option value="all">All Categories</option>
                {expenseCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Payment Method</label>
              <select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
              >
                <option value="all">All Methods</option>
                <option value="cash">💵 Cash</option>
                <option value="bank">🏦 Bank Transfer</option>
                <option value="cheque">📝 Cheque</option>
                <option value="online">💻 Online</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Search</label>
              <input
                type="text"
                placeholder="Description, vendor, bill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-700">
            <button
              onClick={() => {
                setEditingExpense(null);
                setShowModal(true);
              }}
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Expense
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Generate Report
            </button>
          </div>
        </div>

        {/* Category Budget Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {categoryWiseExpenses.slice(0, 4).map((cat) => (
            <div key={cat.name} className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-sm font-medium text-white">{cat.name}</span>
                </div>
                <span className="text-xs text-gray-400">{formatCurrency(cat.amount)}</span>
              </div>
              {cat.budget > 0 && (
                <>
                  <div className="flex-1 bg-gray-700 rounded-full h-1.5 mb-1">
                    <div
                      className="bg-blue-500 rounded-full h-1.5 transition-all"
                      style={{ width: `${Math.min((cat.amount / cat.budget) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Budget: {formatCurrency(cat.budget)}</span>
                    <span className={cat.amount > cat.budget ? 'text-red-400' : 'text-green-400'}>
                      {((cat.amount / cat.budget) * 100).toFixed(0)}%
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Expenses Table */}
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vendor</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Payment</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredExpenses.map((expense) => (
                    <tr key={expense._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-300 font-mono">{expense.expenseId}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-white">{expense.description}</p>
                          {expense.billNumber && (
                            <p className="text-xs text-gray-500">Bill: {expense.billNumber}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getCategoryIcon(expense.category)}</span>
                          <div>
                            <p className="text-sm text-white">{expense.category}</p>
                            {expense.subCategory && (
                              <p className="text-xs text-gray-500">{expense.subCategory}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {expense.vendorName ? (
                          <div>
                            <p className="text-sm text-white">{expense.vendorName}</p>
                            {expense.vendorPhone && (
                              <p className="text-xs text-gray-500">{expense.vendorPhone}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-semibold text-yellow-400">
                          {formatCurrency(expense.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            expense.paymentMethod === 'cash'
                              ? 'bg-gray-500/20 text-gray-400'
                              : expense.paymentMethod === 'bank'
                              ? 'bg-blue-500/20 text-blue-400'
                              : expense.paymentMethod === 'cheque'
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-cyan-500/20 text-cyan-400'
                          }`}
                        >
                          {expense.paymentMethod === 'cash'
                            ? '💵 Cash'
                            : expense.paymentMethod === 'bank'
                            ? '🏦 Bank'
                            : expense.paymentMethod === 'cheque'
                            ? '📝 Cheque'
                            : '💻 Online'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            expense.paymentStatus === 'paid'
                              ? 'bg-green-500/20 text-green-400'
                              : expense.paymentStatus === 'pending'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-orange-500/20 text-orange-400'
                          }`}
                        >
                          {expense.paymentStatus === 'paid'
                            ? '✓ Paid'
                            : expense.paymentStatus === 'pending'
                            ? '⏳ Pending'
                            : '🔄 Partial'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(expense)}
                            className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(expense)}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && filteredExpenses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No expenses found for the selected criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Summary */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-blue-400 font-semibold mb-1">Expense Summary</h3>
              <p className="text-sm text-gray-300">
                Total expenses from {new Date(startDate).toLocaleDateString()} to{' '}
                {new Date(endDate).toLocaleDateString()}:{' '}
                <strong className="text-yellow-400">{formatCurrency(totalExpenses)}</strong>
                {totalPending > 0 && ` • Pending: ${formatCurrency(totalPending)}`}
                {totalPartial > 0 && ` • Partial: ${formatCurrency(totalPartial)}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingExpense(null);
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
                  <label className="block text-sm font-medium text-gray-300 mb-1">Date *</label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={editingExpense?.date || new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category *</label>
                  <select
                    name="category"
                    defaultValue={editingExpense?.category}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  >
                    <option value="">Select Category</option>
                    {expenseCategories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Sub Category</label>
                  <select
                    name="subCategory"
                    defaultValue={editingExpense?.subCategory}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  >
                    <option value="">Select Sub Category</option>
                    {expenseCategories
                      .find((c) => c.name === (editingExpense?.category || ''))
                      ?.subCategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    name="amount"
                    defaultValue={editingExpense?.amount}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description *</label>
                  <textarea
                    name="description"
                    defaultValue={editingExpense?.description}
                    required
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                    placeholder="Describe the expense..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Payment Method *</label>
                  <select
                    name="paymentMethod"
                    defaultValue={editingExpense?.paymentMethod || 'bank'}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  >
                    <option value="cash">💵 Cash</option>
                    <option value="bank">🏦 Bank Transfer</option>
                    <option value="cheque">📝 Cheque</option>
                    <option value="online">💻 Online Payment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Payment Status *</label>
                  <select
                    name="paymentStatus"
                    defaultValue={editingExpense?.paymentStatus || 'paid'}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                  >
                    <option value="paid">✓ Paid</option>
                    <option value="pending">⏳ Pending</option>
                    <option value="partial">🔄 Partial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Bill Number</label>
                  <input
                    type="text"
                    name="billNumber"
                    defaultValue={editingExpense?.billNumber}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Vendor Name</label>
                  <input
                    type="text"
                    name="vendorName"
                    defaultValue={editingExpense?.vendorName}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Vendor Phone</label>
                  <input
                    type="tel"
                    name="vendorPhone"
                    defaultValue={editingExpense?.vendorPhone}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Approved By</label>
                  <input
                    type="text"
                    name="approvedBy"
                    defaultValue={editingExpense?.approvedBy}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                    placeholder="Optional"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Remarks</label>
                  <textarea
                    name="remarks"
                    defaultValue={editingExpense?.remarks}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
                    placeholder="Additional remarks..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
                >
                  {editingExpense ? 'Update Expense' : 'Add Expense'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingExpense(null);
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

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Expense Reports</h2>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as any)}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                >
                  <option value="daily">Daily Report</option>
                  <option value="monthly">Monthly Report</option>
                  <option value="category">Category Report</option>
                </select>

                {reportType === 'daily' && (
                  <>
                    <input
                      type="number"
                      placeholder="Year"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white w-24 focus:border-purple-500 outline-none"
                    />
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                    >
                      {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((month) => (
                        <option key={month} value={month}>
                          {new Date(2000, parseInt(month) - 1, 1).toLocaleString('default', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                {reportType === 'monthly' && (
                  <input
                    type="number"
                    placeholder="Year"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white w-24 focus:border-purple-500 outline-none"
                  />
                )}
              </div>

              <ResponsiveContainer width="100%" height={400}>
                {/* <BarChart data={getReportData()}> */}
               <BarChart data={getReportData() as any}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey={reportType === 'daily' ? 'day' : reportType === 'monthly' ? 'month' : 'name'}
                    stroke="#9CA3AF"
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                    formatter={(value: any) => formatCurrency(value)}
                  />
                  <Legend />
                  <Bar dataKey="amount" fill="#3B82F6" name="Expense Amount" />
                </BarChart>
              </ResponsiveContainer>

              {reportType === 'category' && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getReportData().map((item: any) => (
                    <div key={item.name} className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-white">{item.name}</span>
                        <span className="text-yellow-400 font-bold">{formatCurrency(item.amount)}</span>
                      </div>
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 rounded-full h-2 transition-all"
                          style={{
                            width: `${
                              (item.amount / getReportData().reduce((sum: number, d: any) => sum + d.amount, 0)) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <div className="text-right text-xs text-gray-400 mt-1">
                        {(
                          (item.amount / getReportData().reduce((sum: number, d: any) => sum + d.amount, 0)) *
                          100
                        ).toFixed(1)}
                        % of total
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseManagement;