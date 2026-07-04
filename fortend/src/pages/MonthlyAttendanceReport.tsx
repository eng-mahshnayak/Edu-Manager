import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

interface StaffAttendanceReport {
  staffId: string;
  staffName: string;
  role: string;
  department: string;
  monthlyData: {
    [key: string]: { // month in YYYY-MM format
      present: number;
      absent: number;
      late: number;
      halfDay: number;
      totalDays: number;
      percentage: number;
    }
  };
}

const MonthlyAttendanceReport: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('2024-01');
  const [selectedStaff, setSelectedStaff] = useState<string>('all');
  const [viewType, setViewType] = useState<'summary' | 'detailed' | 'chart'>('summary');

  // Static data for 5 staff members across multiple months
  const staffAttendanceData: StaffAttendanceReport[] = [
    {
      staffId: 'TCH001',
      staffName: 'Dr. Rajesh Kumar',
      role: 'TEACHER',
      department: 'Mathematics',
      monthlyData: {
        '2024-01': { present: 22, absent: 2, late: 1, halfDay: 0, totalDays: 25, percentage: 92 },
        '2024-02': { present: 20, absent: 3, late: 1, halfDay: 1, totalDays: 25, percentage: 88 },
        '2024-03': { present: 23, absent: 1, late: 1, halfDay: 0, totalDays: 25, percentage: 96 },
        '2024-04': { present: 21, absent: 2, late: 2, halfDay: 0, totalDays: 25, percentage: 92 },
        '2024-05': { present: 19, absent: 4, late: 1, halfDay: 1, totalDays: 25, percentage: 84 },
        '2024-06': { present: 22, absent: 1, late: 2, halfDay: 0, totalDays: 25, percentage: 96 },
        '2024-07': { present: 20, absent: 3, late: 1, halfDay: 1, totalDays: 25, percentage: 88 },
        '2024-08': { present: 21, absent: 2, late: 2, halfDay: 0, totalDays: 25, percentage: 92 },
        '2024-09': { present: 23, absent: 1, late: 1, halfDay: 0, totalDays: 25, percentage: 96 },
        '2024-10': { present: 22, absent: 2, late: 1, halfDay: 0, totalDays: 25, percentage: 92 },
        '2024-11': { present: 20, absent: 3, late: 1, halfDay: 1, totalDays: 25, percentage: 88 },
        '2024-12': { present: 21, absent: 2, late: 2, halfDay: 0, totalDays: 25, percentage: 92 }
      }
    },
    {
      staffId: 'TCH002',
      staffName: 'Prof. Meera Sharma',
      role: 'TEACHER',
      department: 'Science',
      monthlyData: {
        '2024-01': { present: 24, absent: 0, late: 1, halfDay: 0, totalDays: 25, percentage: 100 },
        '2024-02': { present: 23, absent: 1, late: 1, halfDay: 0, totalDays: 25, percentage: 96 },
        '2024-03': { present: 22, absent: 2, late: 1, halfDay: 0, totalDays: 25, percentage: 92 },
        '2024-04': { present: 24, absent: 0, late: 1, halfDay: 0, totalDays: 25, percentage: 100 },
        '2024-05': { present: 21, absent: 2, late: 2, halfDay: 0, totalDays: 25, percentage: 92 },
        '2024-06': { present: 23, absent: 1, late: 1, halfDay: 0, totalDays: 25, percentage: 96 },
        '2024-07': { present: 22, absent: 2, late: 1, halfDay: 0, totalDays: 25, percentage: 92 },
        '2024-08': { present: 24, absent: 0, late: 1, halfDay: 0, totalDays: 25, percentage: 100 },
        '2024-09': { present: 23, absent: 1, late: 1, halfDay: 0, totalDays: 25, percentage: 96 },
        '2024-10': { present: 22, absent: 2, late: 1, halfDay: 0, totalDays: 25, percentage: 92 },
        '2024-11': { present: 24, absent: 0, late: 1, halfDay: 0, totalDays: 25, percentage: 100 },
        '2024-12': { present: 23, absent: 1, late: 1, halfDay: 0, totalDays: 25, percentage: 96 }
      }
    },
    {
      staffId: 'DRV001',
      staffName: 'Ramesh Singh',
      role: 'DRIVER',
      department: 'Transport',
      monthlyData: {
        '2024-01': { present: 20, absent: 3, late: 2, halfDay: 0, totalDays: 25, percentage: 88 },
        '2024-02': { present: 18, absent: 5, late: 2, halfDay: 0, totalDays: 25, percentage: 80 },
        '2024-03': { present: 21, absent: 2, late: 2, halfDay: 0, totalDays: 25, percentage: 92 },
        '2024-04': { present: 19, absent: 4, late: 2, halfDay: 0, totalDays: 25, percentage: 84 },
        '2024-05': { present: 17, absent: 6, late: 2, halfDay: 0, totalDays: 25, percentage: 76 },
        '2024-06': { present: 20, absent: 3, late: 2, halfDay: 0, totalDays: 25, percentage: 88 },
        '2024-07': { present: 18, absent: 5, late: 2, halfDay: 0, totalDays: 25, percentage: 80 },
        '2024-08': { present: 21, absent: 2, late: 2, halfDay: 0, totalDays: 25, percentage: 92 },
        '2024-09': { present: 19, absent: 4, late: 2, halfDay: 0, totalDays: 25, percentage: 84 },
        '2024-10': { present: 22, absent: 1, late: 2, halfDay: 0, totalDays: 25, percentage: 96 },
        '2024-11': { present: 20, absent: 3, late: 2, halfDay: 0, totalDays: 25, percentage: 88 },
        '2024-12': { present: 18, absent: 5, late: 2, halfDay: 0, totalDays: 25, percentage: 80 }
      }
    },
    {
      staffId: 'MAD001',
      staffName: 'Lakshmi Bai',
      role: 'MAID',
      department: 'Housekeeping',
      monthlyData: {
        '2024-01': { present: 23, absent: 1, late: 1, halfDay: 0, totalDays: 25, percentage: 96 },
        '2024-02': { present: 22, absent: 2, late: 1, halfDay: 0, totalDays: 25, percentage: 92 },
        '2024-03': { present: 24, absent: 0, late: 1, halfDay: 0, totalDays: 25, percentage: 100 },
        '2024-04': { present: 21, absent: 3, late: 1, halfDay: 0, totalDays: 25, percentage: 88 },
        '2024-05': { present: 23, absent: 1, late: 1, halfDay: 0, totalDays: 25, percentage: 96 },
        '2024-06': { present: 22, absent: 2, late: 1, halfDay: 0, totalDays: 25, percentage: 92 },
        '2024-07': { present: 24, absent: 0, late: 1, halfDay: 0, totalDays: 25, percentage: 100 },
        '2024-08': { present: 23, absent: 1, late: 1, halfDay: 0, totalDays: 25, percentage: 96 },
        '2024-09': { present: 21, absent: 3, late: 1, halfDay: 0, totalDays: 25, percentage: 88 },
        '2024-10': { present: 22, absent: 2, late: 1, halfDay: 0, totalDays: 25, percentage: 92 },
        '2024-11': { present: 24, absent: 0, late: 1, halfDay: 0, totalDays: 25, percentage: 100 },
        '2024-12': { present: 23, absent: 1, late: 1, halfDay: 0, totalDays: 25, percentage: 96 }
      }
    },
    {
      staffId: 'LAB001',
      staffName: 'Mohan Kumar',
      role: 'LABOUR',
      department: 'Maintenance',
      monthlyData: {
        '2024-01': { present: 19, absent: 4, late: 2, halfDay: 0, totalDays: 25, percentage: 84 },
        '2024-02': { present: 17, absent: 6, late: 2, halfDay: 0, totalDays: 25, percentage: 76 },
        '2024-03': { present: 20, absent: 3, late: 2, halfDay: 0, totalDays: 25, percentage: 88 },
        '2024-04': { present: 18, absent: 5, late: 2, halfDay: 0, totalDays: 25, percentage: 80 },
        '2024-05': { present: 16, absent: 7, late: 2, halfDay: 0, totalDays: 25, percentage: 72 },
        '2024-06': { present: 19, absent: 4, late: 2, halfDay: 0, totalDays: 25, percentage: 84 },
        '2024-07': { present: 17, absent: 6, late: 2, halfDay: 0, totalDays: 25, percentage: 76 },
        '2024-08': { present: 20, absent: 3, late: 2, halfDay: 0, totalDays: 25, percentage: 88 },
        '2024-09': { present: 18, absent: 5, late: 2, halfDay: 0, totalDays: 25, percentage: 80 },
        '2024-10': { present: 21, absent: 2, late: 2, halfDay: 0, totalDays: 25, percentage: 92 },
        '2024-11': { present: 19, absent: 4, late: 2, halfDay: 0, totalDays: 25, percentage: 84 },
        '2024-12': { present: 17, absent: 6, late: 2, halfDay: 0, totalDays: 25, percentage: 76 }
      }
    }
  ];

  // Get available months from data
  const availableMonths = Array.from(
    new Set(staffAttendanceData.flatMap(staff => Object.keys(staff.monthlyData)))
  ).sort();

  // Get selected month data
  const getSelectedMonthData = () => {
    if (selectedStaff === 'all') {
      // Aggregate data for all staff
      let totalPresent = 0, totalAbsent = 0, totalLate = 0, totalHalfDay = 0, totalDays = 0;
      
      staffAttendanceData.forEach(staff => {
        const monthData = staff.monthlyData[selectedMonth];
        if (monthData) {
          totalPresent += monthData.present;
          totalAbsent += monthData.absent;
          totalLate += monthData.late;
          totalHalfDay += monthData.halfDay;
          totalDays += monthData.totalDays;
        }
      });
      
      const totalStaff = staffAttendanceData.length;
      const avgPercentage = totalDays > 0 ? ((totalPresent + totalLate + totalHalfDay) / totalDays) * 100 : 0;
      
      return {
        summary: { totalPresent, totalAbsent, totalLate, totalHalfDay, totalDays, avgPercentage, totalStaff },
        details: staffAttendanceData.map(staff => ({
          ...staff,
          data: staff.monthlyData[selectedMonth]
        })).filter(item => item.data)
      };
    } else {
      // Get data for specific staff
      const staff = staffAttendanceData.find(s => s.staffId === selectedStaff);
      const monthData = staff?.monthlyData[selectedMonth];
      
      return {
        summary: monthData ? {
          totalPresent: monthData.present,
          totalAbsent: monthData.absent,
          totalLate: monthData.late,
          totalHalfDay: monthData.halfDay,
          totalDays: monthData.totalDays,
          avgPercentage: monthData.percentage,
          totalStaff: 1
        } : null,
        details: staff && monthData ? [{ ...staff, data: monthData }] : []
      };
    }
  };

  // Get yearly trend data for a staff
  const getYearlyTrend = (staffId: string) => {
    const staff = staffAttendanceData.find(s => s.staffId === staffId);
    if (!staff) return [];
    
    return Object.entries(staff.monthlyData).map(([month, data]) => ({
      month: new Date(month + '-01').toLocaleString('default', { month: 'short' }),
      percentage: data.percentage,
      present: data.present,
      absent: data.absent
    }));
  };

  // Chart colors
  const COLORS = {
    present: '#10B981',
    absent: '#EF4444',
    late: '#F59E0B',
    halfDay: '#F97316'
  };

  const selectedData = getSelectedMonthData();
  const [year, month] = selectedMonth.split('-');
  const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long' });

  // Prepare chart data
  const pieChartData = selectedData.summary ? [
    { name: 'Present', value: selectedData.summary.totalPresent, color: COLORS.present },
    { name: 'Absent', value: selectedData.summary.totalAbsent, color: COLORS.absent },
    { name: 'Late', value: selectedData.summary.totalLate, color: COLORS.late },
    { name: 'Half Day', value: selectedData.summary.totalHalfDay, color: COLORS.halfDay }
  ].filter(item => item.value > 0) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Monthly Attendance Report
          </h1>
          <p className="text-gray-400 mt-1">View detailed attendance reports by month and staff member</p>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Select Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
              >
                {availableMonths.map(month => (
                  <option key={month} value={month}>
                    {new Date(month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Select Staff</label>
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
              >
                <option value="all">All Staff Members</option>
                {staffAttendanceData.map(staff => (
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
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  Summary
                </button>
                <button
                  onClick={() => setViewType('detailed')}
                  className={`flex-1 px-3 py-2 rounded-lg transition-all ${
                    viewType === 'detailed' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  Detailed
                </button>
                <button
                  onClick={() => setViewType('chart')}
                  className={`flex-1 px-3 py-2 rounded-lg transition-all ${
                    viewType === 'chart' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  Charts
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {selectedData.summary && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-center">
                <p className="text-gray-400 text-xs">Total Staff</p>
                <p className="text-2xl font-bold text-white">{selectedData.summary.totalStaff}</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
              <div className="text-center">
                <p className="text-gray-400 text-xs">Present Days</p>
                <p className="text-2xl font-bold text-green-400">{selectedData.summary.totalPresent}</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-red-500/30">
              <div className="text-center">
                <p className="text-gray-400 text-xs">Absent Days</p>
                <p className="text-2xl font-bold text-red-400">{selectedData.summary.totalAbsent}</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
              <div className="text-center">
                <p className="text-gray-400 text-xs">Late Days</p>
                <p className="text-2xl font-bold text-yellow-400">{selectedData.summary.totalLate}</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-orange-500/30">
              <div className="text-center">
                <p className="text-gray-400 text-xs">Half Days</p>
                <p className="text-2xl font-bold text-orange-400">{selectedData.summary.totalHalfDay}</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
              <div className="text-center">
                <p className="text-gray-400 text-xs">Attendance %</p>
                <p className="text-2xl font-bold text-purple-400">{selectedData.summary.avgPercentage.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        )}

        {/* View Content */}
        {viewType === 'summary' && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">
                Attendance Summary for {monthName} {year}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Staff Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Department</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">Present</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">Absent</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">Late</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">Half Day</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">Total Days</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {selectedData.details.map((item: any) => (
                    <tr key={item.staffId} className="hover:bg-white/5">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                            item.role === 'TEACHER' ? 'bg-blue-600' :
                            item.role === 'DRIVER' ? 'bg-green-600' :
                            item.role === 'MAID' ? 'bg-purple-600' : 'bg-orange-600'
                          }`}>
                            {item.staffName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{item.staffName}</p>
                            <p className="text-xs text-gray-500">{item.staffId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">{item.role}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{item.department}</td>
                      <td className="px-4 py-3 text-center text-sm text-green-400">{item.data.present}</td>
                      <td className="px-4 py-3 text-center text-sm text-red-400">{item.data.absent}</td>
                      <td className="px-4 py-3 text-center text-sm text-yellow-400">{item.data.late}</td>
                      <td className="px-4 py-3 text-center text-sm text-orange-400">{item.data.halfDay}</td>
                      <td className="px-4 py-3 text-center text-sm text-white">{item.data.totalDays}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-purple-500 rounded-full h-2 transition-all"
                              style={{ width: `${item.data.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-purple-400">{item.data.percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewType === 'detailed' && selectedStaff !== 'all' && (
          <div className="space-y-6">
            {/* Staff Info Card */}
            {(() => {
              const staff = staffAttendanceData.find(s => s.staffId === selectedStaff);
              const yearlyTrend = getYearlyTrend(selectedStaff);
              
              return (
                <>
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold text-white">
                        {staff?.staffName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{staff?.staffName}</h3>
                        <p className="text-purple-200">{staff?.staffId} • {staff?.role} • {staff?.department}</p>
                      </div>
                    </div>
                  </div>

                  {/* Yearly Trend Chart */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">Yearly Attendance Trend - {new Date().getFullYear()}</h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={yearlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                          labelStyle={{ color: '#F3F4F6' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="percentage" stroke="#8B5CF6" name="Attendance %" strokeWidth={2} />
                        <Line type="monotone" dataKey="present" stroke="#10B981" name="Present Days" />
                        <Line type="monotone" dataKey="absent" stroke="#EF4444" name="Absent Days" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Monthly Details Table */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-700">
                      <h3 className="text-lg font-semibold text-white">Monthly Breakdown</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-800/50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Month</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">Present</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">Absent</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">Late</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">Half Day</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">Total Days</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">Percentage</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {Object.entries(staff?.monthlyData || {}).map(([month, data]) => (
                            <tr key={month} className="hover:bg-white/5">
                              <td className="px-4 py-3 text-sm text-white">
                                {new Date(month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}
                              </td>
                              <td className="px-4 py-3 text-center text-sm text-green-400">{data.present}</td>
                              <td className="px-4 py-3 text-center text-sm text-red-400">{data.absent}</td>
                              <td className="px-4 py-3 text-center text-sm text-yellow-400">{data.late}</td>
                              <td className="px-4 py-3 text-center text-sm text-orange-400">{data.halfDay}</td>
                              <td className="px-4 py-3 text-center text-sm text-white">{data.totalDays}</td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                                    <div 
                                      className="bg-purple-500 rounded-full h-2 transition-all"
                                      style={{ width: `${data.percentage}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-semibold text-purple-400">{data.percentage}%</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {viewType === 'detailed' && selectedStaff === 'all' && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
            <p className="text-yellow-400">Please select a specific staff member to view detailed report</p>
          </div>
        )}

        {viewType === 'chart' && selectedData.summary && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Attendance Distribution</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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

            {/* Bar Chart */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Staff-wise Comparison</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={selectedData.details.map((item: any) => ({
                  name: item.staffName.split(' ')[0],
                  present: item.data.present,
                  absent: item.data.absent,
                  percentage: item.data.percentage
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

            {/* Area Chart for Trend */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Staff Performance Comparison</h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={selectedData.details.map((item: any) => ({
                  name: item.staffName.split(' ')[0],
                  percentage: item.data.percentage
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
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
      </div>
    </div>
  );
};

export default MonthlyAttendanceReport;