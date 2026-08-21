import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

interface StaffReport {
  staffId: string;
  staffName: string;
  role: string;
  department: string;
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  totalDays: number;
  percentage: number;
  salaryType: string;
  basicSalary: number;
  earnedSalary: number;
  deductions: number;
}

const MonthlyAttendanceReport: React.FC = () => {
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [selectedStaff, setSelectedStaff] = useState<string>('all');
  const [viewType, setViewType] = useState<'summary' | 'detailed' | 'chart'>('summary');
  const [reportData, setReportData] = useState<StaffReport[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch monthly report
  const fetchMonthlyReport = async () => {
    if (!selectedMonth) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/attendance/monthly-report`, {
        params: { month: selectedMonth }
      });
      if (res.data.status) {
        setReportData(res.data.data);
      } else {
        toast.error(res.data.message || 'Failed to fetch report');
      }
    } catch (error) {
      toast.error('Server error while fetching report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyReport();
  }, [selectedMonth]);

  // Get unique staff list for dropdown
  const staffOptions = reportData.map(s => ({
    staffId: s.staffId,
    staffName: s.staffName,
    role: s.role,
  }));

  // Filter data based on selected staff
  const filteredData = selectedStaff === 'all'
    ? reportData
    : reportData.filter(s => s.staffId === selectedStaff);

  // Aggregated summary
  const summary = {
    totalStaff: reportData.length,
    totalPresent: reportData.reduce((sum, s) => sum + s.present, 0),
    totalAbsent: reportData.reduce((sum, s) => sum + s.absent, 0),
    totalLate: reportData.reduce((sum, s) => sum + s.late, 0),
    totalHalfDay: reportData.reduce((sum, s) => sum + s.halfDay, 0),
    totalDays: reportData.length > 0 ? reportData[0].totalDays : 0,
    avgPercentage: reportData.length > 0
      ? reportData.reduce((sum, s) => sum + s.percentage, 0) / reportData.length
      : 0,
    totalBasicSalary: reportData.reduce((sum, s) => sum + s.basicSalary, 0),
    totalEarnedSalary: reportData.reduce((sum, s) => sum + s.earnedSalary, 0),
    totalDeductions: reportData.reduce((sum, s) => sum + s.deductions, 0),
  };

  const [year, month] = selectedMonth.split('-');
  const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long' });

  // Chart colors
  const COLORS = {
    present: '#10B981',
    absent: '#EF4444',
    late: '#F59E0B',
    halfDay: '#F97316'
  };

  const pieChartData = [
    { name: 'Present', value: summary.totalPresent, color: COLORS.present },
    { name: 'Absent', value: summary.totalAbsent, color: COLORS.absent },
    { name: 'Late', value: summary.totalLate, color: COLORS.late },
    { name: 'Half Day', value: summary.totalHalfDay, color: COLORS.halfDay }
  ].filter(item => item.value > 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Monthly Attendance & Salary Report
          </h1>
          <p className="text-gray-400 mt-1">View attendance summary and salary breakdown for staff</p>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Select Month</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Select Staff</label>
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
              >
                <option value="all">All Staff Members</option>
                {staffOptions.map(staff => (
                  <option key={staff.staffId} value={staff.staffId}>
                    {staff.staffName} ({staff.role})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">View Type</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewType('summary')}
                  className={`flex-1 px-3 py-2 rounded-lg transition-all ${
                    viewType === 'summary' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  Summary
                </button>
                <button
                  onClick={() => setViewType('detailed')}
                  className={`flex-1 px-3 py-2 rounded-lg transition-all ${
                    viewType === 'detailed' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  Detailed
                </button>
                <button
                  onClick={() => setViewType('chart')}
                  className={`flex-1 px-3 py-2 rounded-lg transition-all ${
                    viewType === 'chart' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  Charts
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards (including salary totals) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-gray-400 text-xs">Total Staff</p>
            <p className="text-2xl font-bold text-white">{summary.totalStaff}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
            <p className="text-gray-400 text-xs">Present Days</p>
            <p className="text-2xl font-bold text-green-400">{summary.totalPresent}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-red-500/30">
            <p className="text-gray-400 text-xs">Absent Days</p>
            <p className="text-2xl font-bold text-red-400">{summary.totalAbsent}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
            <p className="text-gray-400 text-xs">Attendance %</p>
            <p className="text-2xl font-bold text-purple-400">{summary.avgPercentage.toFixed(1)}%</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
            <p className="text-gray-400 text-xs">Total Salary</p>
            <p className="text-2xl font-bold text-yellow-400">{formatCurrency(summary.totalEarnedSalary)}</p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && (
          <>
            {/* Summary View */}
            {viewType === 'summary' && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white">
                    Attendance & Salary Summary for {monthName} {year}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Staff</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Role</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">P</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">A</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">L</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">HD</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">%</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">Basic Salary</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">Deductions</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">Earned Salary</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredData.map((staff) => (
                        <tr key={staff.staffId} className="hover:bg-white/5">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                                staff.role === 'TEACHER' ? 'bg-blue-600' :
                                staff.role === 'DRIVER' ? 'bg-green-600' :
                                staff.role === 'MAID' ? 'bg-purple-600' : 'bg-orange-600'
                              }`}>
                                {staff.staffName.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{staff.staffName}</p>
                                <p className="text-xs text-gray-500">{staff.staffId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">{staff.role}</td>
                          <td className="px-4 py-3 text-center text-sm text-green-400">{staff.present}</td>
                          <td className="px-4 py-3 text-center text-sm text-red-400">{staff.absent}</td>
                          <td className="px-4 py-3 text-center text-sm text-yellow-400">{staff.late}</td>
                          <td className="px-4 py-3 text-center text-sm text-orange-400">{staff.halfDay}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-purple-500 rounded-full h-2 transition-all"
                                  style={{ width: `${staff.percentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-purple-400">{staff.percentage.toFixed(1)}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-300">{formatCurrency(staff.basicSalary)}</td>
                          <td className="px-4 py-3 text-right text-sm text-red-400">{formatCurrency(staff.deductions)}</td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-yellow-400">{formatCurrency(staff.earnedSalary)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Detailed View */}
            {viewType === 'detailed' && selectedStaff !== 'all' && (
              <div className="space-y-6">
                {filteredData.map((staff) => {
                  // Monthly trend – we don't have historical data here, but we can just show this month's details.
                  // For a more complete detailed view, we could fetch yearly data, but we'll keep it simple.
                  return (
                    <div key={staff.staffId} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold text-white ${
                          staff.role === 'TEACHER' ? 'bg-blue-600' :
                          staff.role === 'DRIVER' ? 'bg-green-600' :
                          staff.role === 'MAID' ? 'bg-purple-600' : 'bg-orange-600'
                        }`}>
                          {staff.staffName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{staff.staffName}</h3>
                          <p className="text-gray-400">{staff.staffId} • {staff.role} • {staff.department}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-gray-400 text-xs">Present</p>
                          <p className="text-xl font-bold text-green-400">{staff.present}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Absent</p>
                          <p className="text-xl font-bold text-red-400">{staff.absent}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Late</p>
                          <p className="text-xl font-bold text-yellow-400">{staff.late}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Half Day</p>
                          <p className="text-xl font-bold text-orange-400">{staff.halfDay}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800/30 rounded-lg">
                        <div>
                          <p className="text-gray-400 text-xs">Basic Salary</p>
                          <p className="text-lg font-bold text-gray-200">{formatCurrency(staff.basicSalary)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Deductions</p>
                          <p className="text-lg font-bold text-red-400">{formatCurrency(staff.deductions)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Earned Salary</p>
                          <p className="text-lg font-bold text-yellow-400">{formatCurrency(staff.earnedSalary)}</p>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-gray-400">
                        <span>Salary Type: {staff.salaryType} • Total Working Days: {staff.totalDays} • Attendance: {staff.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {viewType === 'detailed' && selectedStaff === 'all' && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                <p className="text-yellow-400">Please select a specific staff member to view detailed report</p>
              </div>
            )}

            {/* Charts */}
            {viewType === 'chart' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4 text-center">Attendance Distribution</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                       label={({ name, percent }) =>
  `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4 text-center">Staff-wise Comparison</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={filteredData.map(s => ({
                      name: s.staffName.split(' ')[0],
                      present: s.present,
                      absent: s.absent,
                      percentage: s.percentage
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                      />
                      <Legend />
                      <Bar dataKey="present" fill="#10B981" name="Present Days" />
                      <Bar dataKey="absent" fill="#EF4444" name="Absent Days" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4 text-center">Attendance Percentage</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={filteredData.map(s => ({
                      name: s.staffName.split(' ')[0],
                      percentage: s.percentage
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="percentage" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} name="Attendance %" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MonthlyAttendanceReport;