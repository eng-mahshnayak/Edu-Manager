import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Staff {
  _id: string;
  name: string;
  phone: string;
  email: string;
  role: 'TEACHER' | 'DRIVER' | 'MAID' | 'LABOUR';
  department?: string;
  isActive: boolean;
}

interface Attendance {
  staffId: string;
  staffName: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
}

interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  percentage: number;
}

const StaffAttendanceManagement: React.FC = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceMode, setAttendanceMode] = useState<'all' | 'absent-only' | 'present-only'>('all');
  const [loading, setLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));

  // Static staff data
  const initialStaffList: Staff[] = [
    { _id: 'TCH001', name: 'Dr. Rajesh Kumar', phone: '9876543210', email: 'rajesh@edu.com', role: 'TEACHER', department: 'Mathematics', isActive: true },
    { _id: 'TCH002', name: 'Prof. Meera Sharma', phone: '9876543211', email: 'meera@edu.com', role: 'TEACHER', department: 'Science', isActive: true },
    { _id: 'TCH003', name: 'Mr. Suresh Verma', phone: '9876543212', email: 'suresh@edu.com', role: 'TEACHER', department: 'Languages', isActive: true },
    { _id: 'TCH004', name: 'Mrs. Priya Singh', phone: '9876543213', email: 'priya@edu.com', role: 'TEACHER', department: 'Commerce', isActive: true },
    { _id: 'TCH005', name: 'Mr. Amit Patel', phone: '9876543214', email: 'amit@edu.com', role: 'TEACHER', department: 'Computer Science', isActive: true },
    { _id: 'TCH006', name: 'Dr. Neha Gupta', phone: '9876543215', email: 'neha@edu.com', role: 'TEACHER', department: 'Social Science', isActive: true },
    { _id: 'DRV001', name: 'Ramesh Singh', phone: '9876543216', email: 'ramesh@edu.com', role: 'DRIVER', department: 'Transport', isActive: true },
    { _id: 'DRV002', name: 'Sohan Yadav', phone: '9876543217', email: 'sohan@edu.com', role: 'DRIVER', department: 'Transport', isActive: true },
    { _id: 'MAD001', name: 'Lakshmi Bai', phone: '9876543218', email: 'lakshmi@edu.com', role: 'MAID', department: 'Housekeeping', isActive: true },
    { _id: 'MAD002', name: 'Kavita Devi', phone: '9876543219', email: 'kavita@edu.com', role: 'MAID', department: 'Housekeeping', isActive: true },
    { _id: 'LAB001', name: 'Mohan Kumar', phone: '9876543220', email: 'mohan@edu.com', role: 'LABOUR', department: 'Maintenance', isActive: true },
    { _id: 'LAB002', name: 'Raju Sharma', phone: '9876543221', email: 'raju@edu.com', role: 'LABOUR', department: 'Maintenance', isActive: true },
    { _id: 'TCH007', name: 'Dr. Vikram Singh', phone: '9876543222', email: 'vikram@edu.com', role: 'TEACHER', department: 'Science', isActive: true },
    { _id: 'TCH008', name: 'Mrs. Anjali Sharma', phone: '9876543223', email: 'anjali@edu.com', role: 'TEACHER', department: 'Mathematics', isActive: true },
    { _id: 'TCH009', name: 'Mr. Pankaj Tripathi', phone: '9876543224', email: 'pankaj@edu.com', role: 'TEACHER', department: 'History', isActive: true },
    { _id: 'TCH010', name: 'Ms. Shweta Sinha', phone: '9876543225', email: 'shweta@edu.com', role: 'TEACHER', department: 'Economics', isActive: true }
  ];

  // Departments for filtering
  const departments = ['all', 'Mathematics', 'Science', 'Languages', 'Commerce', 'Computer Science', 'Social Science', 'Transport', 'Housekeeping', 'Maintenance'];

  useEffect(() => {
    setStaffList(initialStaffList);
    loadAttendanceForDate(selectedDate);
  }, []);

  // Load attendance for selected date
  const loadAttendanceForDate = (date: string) => {
    const savedAttendance = localStorage.getItem(`attendance_${date}`);
    if (savedAttendance) {
      setAttendanceRecords(JSON.parse(savedAttendance));
    } else {
      // Initialize empty attendance for the day
      const initialAttendance: Attendance[] = staffList.map(staff => ({
        staffId: staff._id,
        staffName: staff.name,
        date: date,
        status: 'absent',
        remarks: ''
      }));
      setAttendanceRecords(initialAttendance);
    }
  };

  // Save attendance
  const saveAttendance = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem(`attendance_${selectedDate}`, JSON.stringify(attendanceRecords));
      toast.success(`Attendance saved for ${new Date(selectedDate).toLocaleDateString()}`);
      setLoading(false);
    }, 500);
  };

  // Update staff attendance status
  const updateAttendance = (staffId: string, status: Attendance['status'], checkInTime?: string, checkOutTime?: string, remarks?: string) => {
    setAttendanceRecords(prev => prev.map(record =>
      record.staffId === staffId
        ? { ...record, status, checkInTime, checkOutTime, remarks }
        : record
    ));
  };

  // Bulk update attendance
  const bulkUpdateAttendance = (status: Attendance['status']) => {
    const updatedRecords = attendanceRecords.map(record => ({
      ...record,
      status,
      checkInTime: status === 'present' ? '09:00' : record.checkInTime,
      checkOutTime: status === 'present' ? '17:00' : record.checkOutTime
    }));
    setAttendanceRecords(updatedRecords);
    toast.success(`All staff marked as ${status}`);
  };

  // Mark all as present
  const markAllPresent = () => bulkUpdateAttendance('present');
  
  // Mark all as absent
  const markAllAbsent = () => bulkUpdateAttendance('absent');

//   // Mark only absent staff as present
//   const markAbsentAsPresent = () => {
//     const updatedRecords = attendanceRecords.map(record => ({
//       ...record,
//       status: record.status === 'absent' ? 'present' : record.status,
//       checkInTime: record.status === 'absent' ? '09:00' : record.checkInTime,
//       checkOutTime: record.status === 'absent' ? '17:00' : record.checkOutTime
//     }));
//     setAttendanceRecords(updatedRecords);
//     toast.success('All absent staff marked as present');
//   };

//   // Mark only present staff as absent
//   const markPresentAsAbsent = () => {
//     const updatedRecords = attendanceRecords.map(record => ({
//       ...record,
//       status: record.status === 'present' ? 'absent' : record.status,
//       checkInTime: undefined,
//       checkOutTime: undefined
//     }));
//     setAttendanceRecords(updatedRecords);
//     toast.success('All present staff marked as absent');
//   };

  // Filter staff based on role, department, search and attendance mode
  const filteredStaff = staffList.filter(staff => {
    const matchesRole = selectedRole === 'all' || staff.role === selectedRole;
    const matchesDepartment = selectedDepartment === 'all' || staff.department === selectedDepartment;
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          staff._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          staff.phone.includes(searchTerm);
    
    let matchesAttendanceMode = true;
    const attendanceRecord = attendanceRecords.find(rec => rec.staffId === staff._id);
    
    if (attendanceMode === 'absent-only') {
      matchesAttendanceMode = attendanceRecord?.status === 'absent';
    } else if (attendanceMode === 'present-only') {
      matchesAttendanceMode = attendanceRecord?.status === 'present' || 
                              attendanceRecord?.status === 'late' || 
                              attendanceRecord?.status === 'half-day';
    }
    
    return matchesRole && matchesDepartment & matchesSearch && matchesAttendanceMode;
  });

  // Get attendance summary
  const getAttendanceSummary = (): AttendanceSummary => {
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    const absent = attendanceRecords.filter(r => r.status === 'absent').length;
    const late = attendanceRecords.filter(r => r.status === 'late').length;
    const halfDay = attendanceRecords.filter(r => r.status === 'half-day').length;
    const total = attendanceRecords.length;
    const percentage = total > 0 ? ((present + late + halfDay) / total) * 100 : 0;
    
    return { total, present, absent, late, halfDay, percentage };
  };

  // Get monthly report
  const getMonthlyReport = () => {
    const [year, month] = selectedMonth.split('-');
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    const report: any = {};
    
    staffList.forEach(staff => {
      let present = 0;
      let absent = 0;
      let late = 0;
      let halfDay = 0;
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${month}-${String(day).padStart(2, '0')}`;
        const attendance = localStorage.getItem(`attendance_${date}`);
        if (attendance) {
          const records: Attendance[] = JSON.parse(attendance);
          const staffRecord = records.find(r => r.staffId === staff._id);
          if (staffRecord) {
            switch (staffRecord.status) {
              case 'present': present++; break;
              case 'absent': absent++; break;
              case 'late': late++; break;
              case 'half-day': halfDay++; break;
            }
          }
        }
      }
      
      report[staff._id] = {
        name: staff.name,
        role: staff.role,
        department: staff.department,
        present,
        absent,
        late,
        halfDay,
        totalDays: daysInMonth,
        percentage: ((present + late + halfDay) / daysInMonth) * 100
      };
    });
    
    return report;
  };

  const summary = getAttendanceSummary();



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-cyan-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Staff Attendance Management
          </h1>
          <p className="text-gray-400 mt-1">Mark attendance for all staff members with bulk operations</p>
        </div>

        {/* Attendance Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="text-center">
              <p className="text-gray-400 text-xs">Total Staff</p>
              <p className="text-xl font-bold text-white">{summary.total}</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-green-500/30">
            <div className="text-center">
              <p className="text-gray-400 text-xs">Present</p>
              <p className="text-xl font-bold text-green-400">{summary.present}</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-red-500/30">
            <div className="text-center">
              <p className="text-gray-400 text-xs">Absent</p>
              <p className="text-xl font-bold text-red-400">{summary.absent}</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-yellow-500/30">
            <div className="text-center">
              <p className="text-gray-400 text-xs">Late</p>
              <p className="text-xl font-bold text-yellow-400">{summary.late}</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-orange-500/30">
            <div className="text-center">
              <p className="text-gray-400 text-xs">Half Day</p>
              <p className="text-xl font-bold text-orange-400">{summary.halfDay}</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-purple-500/30">
            <div className="text-center">
              <p className="text-gray-400 text-xs">Attendance %</p>
              <p className="text-xl font-bold text-purple-400">{summary.percentage.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  loadAttendanceForDate(e.target.value);
                }}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 outline-none"
              >
                <option value="all">All Roles</option>
                <option value="TEACHER">👨‍🏫 Teachers</option>
                <option value="DRIVER">🚌 Drivers</option>
                <option value="MAID">🧹 Maids</option>
                <option value="LABOUR">🔧 Labour</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 outline-none"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept === 'all' ? 'All Departments' : dept}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Attendance Mode</label>
              <select
                value={attendanceMode}
                onChange={(e) => setAttendanceMode(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 outline-none"
              >
                <option value="all">Show All Staff</option>
                <option value="absent-only">⚠️ Show Only Absent Staff</option>
                <option value="present-only">✓ Show Only Present Staff</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Search</label>
              <input
                type="text"
                placeholder="Name, ID, Phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 outline-none"
              />
            </div>
          </div>
          
          {/* Bulk Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-700">

            <button
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Monthly Report
            </button>
            
            <button
              onClick={markAllPresent}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Mark All Present
            </button>
            
            <button
              onClick={markAllAbsent}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Mark All Absent
            </button>
            
            {/* <button
              onClick={markAbsentAsPresent}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Mark Absent → Present
            </button> */}
            
            {/* <button
              onClick={markPresentAsAbsent}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
              </svg>
              Mark Present → Absent
            </button>
             */}
            
            
            <button
              onClick={saveAttendance}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all ml-auto flex items-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              )}
              Save Attendance
            </button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Staff Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Check In</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Check Out</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredStaff.map((staff) => {
                  const attendance = attendanceRecords.find(r => r.staffId === staff._id);
                  return (
                    <tr key={staff._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-300 font-mono">{staff._id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                            staff.role === 'TEACHER' ? 'bg-blue-600' :
                            staff.role === 'DRIVER' ? 'bg-green-600' :
                            staff.role === 'MAID' ? 'bg-purple-600' : 'bg-orange-600'
                          }`}>
                            {staff.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{staff.name}</p>
                            <p className="text-xs text-gray-500">{staff.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          staff.role === 'TEACHER' ? 'bg-blue-500/20 text-blue-400' :
                          staff.role === 'DRIVER' ? 'bg-green-500/20 text-green-400' :
                          staff.role === 'MAID' ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          {staff.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">{staff.department || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateAttendance(staff._id, 'present', '09:00', '17:00')}
                            className={`px-2 py-1 text-xs rounded transition-all ${
                              attendance?.status === 'present' 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-700 text-gray-400 hover:bg-green-700/50'
                            }`}
                          >
                            ✓ P
                          </button>
                          <button
                            onClick={() => updateAttendance(staff._id, 'absent')}
                            className={`px-2 py-1 text-xs rounded transition-all ${
                              attendance?.status === 'absent' 
                                ? 'bg-red-500 text-white' 
                                : 'bg-gray-700 text-gray-400 hover:bg-red-700/50'
                            }`}
                          >
                            ✗ A
                          </button>
                          <button
                            onClick={() => updateAttendance(staff._id, 'late', '10:30', '17:00')}
                            className={`px-2 py-1 text-xs rounded transition-all ${
                              attendance?.status === 'late' 
                                ? 'bg-yellow-500 text-white' 
                                : 'bg-gray-700 text-gray-400 hover:bg-yellow-700/50'
                            }`}
                          >
                            ⏰ L
                          </button>
                          <button
                            onClick={() => updateAttendance(staff._id, 'half-day', '09:00', '13:00')}
                            className={`px-2 py-1 text-xs rounded transition-all ${
                              attendance?.status === 'half-day' 
                                ? 'bg-orange-500 text-white' 
                                : 'bg-gray-700 text-gray-400 hover:bg-orange-700/50'
                            }`}
                          >
                            ½ HD
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="time"
                          value={attendance?.checkInTime || ''}
                          onChange={(e) => updateAttendance(staff._id, attendance?.status || 'present', e.target.value, attendance?.checkOutTime)}
                          disabled={attendance?.status === 'absent'}
                          className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm w-28 focus:border-cyan-500 outline-none disabled:opacity-50"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="time"
                          value={attendance?.checkOutTime || ''}
                          onChange={(e) => updateAttendance(staff._id, attendance?.status || 'present', attendance?.checkInTime, e.target.value)}
                          disabled={attendance?.status === 'absent'}
                          className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm w-28 focus:border-cyan-500 outline-none disabled:opacity-50"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="Remarks..."
                          value={attendance?.remarks || ''}
                          onChange={(e) => updateAttendance(staff._id, attendance?.status || 'absent', attendance?.checkInTime, attendance?.checkOutTime, e.target.value)}
                          className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm w-32 focus:border-cyan-500 outline-none"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredStaff.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No staff members found matching the criteria</p>
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-blue-400 font-semibold mb-1">Quick Tips</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <strong>P/A/L/HD</strong> buttons: Quick mark attendance for individual staff</li>
                <li>• <strong>Mark All Present/Absent</strong>: Bulk update for all staff</li>
                <li>• <strong>Mark Absent → Present</strong>: Only change absent staff to present (keeps present staff unchanged)</li>
                <li>• <strong>Show Only Absent Staff</strong>: Filter to see only staff who are absent</li>
                <li>• <strong>Check-in/out times</strong>: Can be customized for late arrivals or early departures</li>
                <li>• <strong>Monthly Report</strong>: View attendance summary for any month</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Monthly Attendance Report</h2>
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
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-3">
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
                  />
                  <button
                    onClick={() => {
                      const report = getMonthlyReport();
                      // In a real app, you'd generate a PDF/Excel here
                      toast.success('Report generated!');
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all"
                  >
                    Generate Report
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Staff Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Role</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">Present</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">Absent</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">Late</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">Half Day</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">Total Days</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {Object.entries(getMonthlyReport()).map(([id, data]: [string, any]) => (
                      <tr key={id} className="hover:bg-white/5">
                        <td className="px-4 py-3 text-sm text-white">{data.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">{data.role}</td>
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
                            <span className="text-sm font-semibold text-purple-400">{data.percentage.toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAttendanceManagement;