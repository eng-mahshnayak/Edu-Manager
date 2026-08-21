import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';



interface AttendanceRecord {
  staffId: string;
  staffName: string;
  role: string;
  department: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
  _id?: string | null;
}

interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  percentage: number;
}

// ==================== Main Component ====================
const StaffAttendanceManagement: React.FC = () => {
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // ----- State -----
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<AttendanceSummary>({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    halfDay: 0,
    percentage: 0,
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // ----- API Functions -----
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const params: any = { date: selectedDate };
      if (selectedRole !== 'all') params.role = selectedRole;

      const [attRes, sumRes] = await Promise.all([
        axios.get(`${API_BASE}/attendance`, { params }),
        axios.get(`${API_BASE}/attendance/summary`, { params: { date: selectedDate } }),
      ]);

      if (attRes.data.status) {
        setAttendanceRecords(attRes.data.data);
        // Clear selections on new data load
        setSelectedIds(new Set());
      } else {
        toast.error(attRes.data.message || 'Failed to fetch attendance');
      }

      if (sumRes.data.status) {
        setSummary(sumRes.data.data);
      }
    } catch (error) {
      toast.error('Server error while fetching attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate, selectedRole]);

  // ----- Update single record status -----
  const updateRecordStatus = (
    staffId: string,
    status: AttendanceRecord['status'],
    checkInTime?: string,
    checkOutTime?: string,
    remarks?: string
  ) => {
    setAttendanceRecords((prev) =>
      prev.map((rec) =>
        rec.staffId === staffId
          ? { ...rec, status, checkInTime, checkOutTime, remarks }
          : rec
      )
    );
  };

  // ----- Bulk status update -----
  const bulkUpdateStatus = (status: AttendanceRecord['status']) => {
    if (selectedIds.size === 0) {
      toast.error('Please select at least one staff member');
      return;
    }
    setAttendanceRecords((prev) =>
      prev.map((rec) =>
        selectedIds.has(rec.staffId)
          ? {
              ...rec,
              status,
              checkInTime: status === 'present' ? rec.checkInTime || '09:00' : rec.checkInTime,
              checkOutTime: status === 'present' ? rec.checkOutTime || '17:00' : rec.checkOutTime,
            }
          : rec
      )
    );
    toast.success(`Selected staff marked as ${status}`);
  };

  // ----- Mark All Present / Absent (all rows) -----
  const markAllPresent = () => {
    setAttendanceRecords((prev) =>
      prev.map((rec) => ({
        ...rec,
        status: 'present',
        checkInTime: rec.checkInTime || '09:00',
        checkOutTime: rec.checkOutTime || '17:00',
      }))
    );
    // Select all rows (optional)
    setSelectedIds(new Set(attendanceRecords.map((r) => r.staffId)));
    toast.success('All staff marked as present');
  };

  const markAllAbsent = () => {
    setAttendanceRecords((prev) =>
      prev.map((rec) => ({
        ...rec,
        status: 'absent',
        checkInTime: '',
        checkOutTime: '',
      }))
    );
    setSelectedIds(new Set());
    toast.success('All staff marked as absent');
  };

  // ----- Save Attendance -----
  const saveAttendance = async () => {
    setLoading(true);
    try {
      const payload = {
        date: selectedDate,
        records: attendanceRecords.map((rec) => ({
          staffId: rec.staffId,
          staffName: rec.staffName,
          status: rec.status,
          checkInTime: rec.checkInTime || '',
          checkOutTime: rec.checkOutTime || '',
          remarks: rec.remarks || '',
        })),
      };

      const res = await axios.post(`${API_BASE}/attendance/bulk`, payload);
      if (res.data.status) {
        toast.success('Attendance saved successfully');
        fetchAttendance(); // refresh
      } else {
        toast.error(res.data.message || 'Save failed');
      }
    } catch (error) {
      toast.error('Server error while saving');
    } finally {
      setLoading(false);
    }
  };

  // ----- Toggle selection -----
  const toggleSelect = (staffId: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(staffId)) newSet.delete(staffId);
    else newSet.add(staffId);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === attendanceRecords.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(attendanceRecords.map((r) => r.staffId)));
    }
  };

  // ----- Render -----
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Staff Attendance Management
          </h1>
          <p className="text-gray-400 mt-1">Mark attendance with bulk actions and save</p>
        </div>

        {/* Summary Cards */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none"
              >
                <option value="all">All Roles</option>
                <option value="TEACHER">👨‍🏫 Teachers</option>
                <option value="DRIVER">🚌 Drivers</option>
                <option value="MAID">🧹 Maids</option>
                <option value="LABOUR">🔧 Labour</option>
              </select>
            </div>
          </div>

          {/* Bulk Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-700">
            {/* Select All */}
            <button
              onClick={toggleSelectAll}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              {selectedIds.size === attendanceRecords.length ? 'Deselect All' : 'Select All'}
            </button>

            {/* Bulk status buttons */}
            <button
              onClick={() => bulkUpdateStatus('present')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              ✓ Present
            </button>
            <button
              onClick={() => bulkUpdateStatus('absent')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              ✗ Absent
            </button>
            <button
              onClick={() => bulkUpdateStatus('late')}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              ⏰ Late
            </button>
            <button
              onClick={() => bulkUpdateStatus('half-day')}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              ½ Half-day
            </button>

            <div className="flex-1"></div>

            {/* Mark All Present / Absent (affect all rows) */}
            <button
              onClick={markAllPresent}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              Mark All Present
            </button>
            <button
              onClick={markAllAbsent}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              Mark All Absent
            </button>

            <button
              onClick={saveAttendance}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all ml-auto flex items-center gap-2"
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
            {loading && !attendanceRecords.length ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-2 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === attendanceRecords.length && attendanceRecords.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Staff Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Check In</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Check Out</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {attendanceRecords.map((rec) => (
                    <tr key={rec.staffId} className="hover:bg-white/5 transition-colors">
                      <td className="px-2 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(rec.staffId)}
                          onChange={() => toggleSelect(rec.staffId)}
                          className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300 font-mono">{rec.staffId}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                            rec.role === 'TEACHER' ? 'bg-blue-600' :
                            rec.role === 'DRIVER' ? 'bg-green-600' :
                            rec.role === 'MAID' ? 'bg-purple-600' : 'bg-orange-600'
                          }`}>
                            {rec.staffName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{rec.staffName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          rec.role === 'TEACHER' ? 'bg-blue-500/20 text-blue-400' :
                          rec.role === 'DRIVER' ? 'bg-green-500/20 text-green-400' :
                          rec.role === 'MAID' ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          {rec.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => updateRecordStatus(rec.staffId, 'present', '09:00', '17:00')}
                            className={`px-2 py-1 text-xs rounded transition-all ${
                              rec.status === 'present'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-700 text-gray-400 hover:bg-green-700/50'
                            }`}
                          >
                            P
                          </button>
                          <button
                            onClick={() => updateRecordStatus(rec.staffId, 'absent')}
                            className={`px-2 py-1 text-xs rounded transition-all ${
                              rec.status === 'absent'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-700 text-gray-400 hover:bg-red-700/50'
                            }`}
                          >
                            A
                          </button>
                          <button
                            onClick={() => updateRecordStatus(rec.staffId, 'late', '10:30', '17:00')}
                            className={`px-2 py-1 text-xs rounded transition-all ${
                              rec.status === 'late'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-gray-700 text-gray-400 hover:bg-yellow-700/50'
                            }`}
                          >
                            L
                          </button>
                          <button
                            onClick={() => updateRecordStatus(rec.staffId, 'half-day', '09:00', '13:00')}
                            className={`px-2 py-1 text-xs rounded transition-all ${
                              rec.status === 'half-day'
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-700 text-gray-400 hover:bg-orange-700/50'
                            }`}
                          >
                            HD
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="time"
                          value={rec.checkInTime || ''}
                          onChange={(e) => updateRecordStatus(rec.staffId, rec.status, e.target.value, rec.checkOutTime)}
                          disabled={rec.status === 'absent'}
                          className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm w-28 focus:border-blue-500 outline-none disabled:opacity-50"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="time"
                          value={rec.checkOutTime || ''}
                          onChange={(e) => updateRecordStatus(rec.staffId, rec.status, rec.checkInTime, e.target.value)}
                          disabled={rec.status === 'absent'}
                          className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm w-28 focus:border-blue-500 outline-none disabled:opacity-50"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="Remarks..."
                          value={rec.remarks || ''}
                          onChange={(e) => updateRecordStatus(rec.staffId, rec.status, rec.checkInTime, rec.checkOutTime, e.target.value)}
                          className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm w-32 focus:border-blue-500 outline-none"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && attendanceRecords.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No staff found for this date</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAttendanceManagement;