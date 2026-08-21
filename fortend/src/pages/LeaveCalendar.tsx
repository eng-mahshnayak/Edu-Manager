import React from 'react';

// ----- Types -----
type LeaveType = 'personal' | 'sick' | 'casual' | 'holiday' | 'other';

interface LeaveRecord {
  date: string; // 'YYYY-MM-DD'
  type: LeaveType;
  reason?: string;
}

// ----- Generate Dummy Data for Full Year -----
const generateYearLeaves = (year: number): LeaveRecord[] => {
  const leaves: LeaveRecord[] = [];

  // Helper: random date in a given month
  const dateStr = (month: number, day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // ---- Personal Leaves (12 random days across year) ----
  const personalDays = [
    { month: 0, day: 5 }, { month: 1, day: 12 }, { month: 2, day: 18 },
    { month: 3, day: 22 }, { month: 4, day: 8 }, { month: 5, day: 15 },
    { month: 6, day: 20 }, { month: 7, day: 25 }, { month: 8, day: 10 },
    { month: 9, day: 28 }, { month: 10, day: 14 }, { month: 11, day: 30 },
  ];
  personalDays.forEach((d) => {
    leaves.push({
      date: dateStr(d.month, d.day),
      type: 'personal',
      reason: 'Personal work',
    });
  });

  // ---- Sick Leaves (8 random days) ----
  const sickDays = [
    { month: 0, day: 15 }, { month: 2, day: 10 }, { month: 3, day: 5 },
    { month: 5, day: 22 }, { month: 7, day: 3 }, { month: 8, day: 19 },
    { month: 10, day: 7 }, { month: 11, day: 12 },
  ];
  sickDays.forEach((d) => {
    leaves.push({
      date: dateStr(d.month, d.day),
      type: 'sick',
      reason: 'Fever / Medical',
    });
  });

  // ---- Casual Leaves (6 random days) ----
  const casualDays = [
    { month: 1, day: 25 }, { month: 4, day: 30 }, { month: 6, day: 12 },
    { month: 8, day: 28 }, { month: 9, day: 15 }, { month: 11, day: 5 },
  ];
  casualDays.forEach((d) => {
    leaves.push({
      date: dateStr(d.month, d.day),
      type: 'casual',
      reason: 'Casual leave',
    });
  });

  // ---- Holidays (fixed national/regional holidays) ----
  const holidays = [
    { month: 0, day: 1, name: "New Year" },
    { month: 0, day: 26, name: "Republic Day" },
    { month: 1, day: 14, name: "Valentine's Day" },
    { month: 2, day: 8, name: "Holi" },
    { month: 2, day: 25, name: "Good Friday" },
    { month: 3, day: 14, name: "Baisakhi" },
    { month: 4, day: 1, name: "Labour Day" },
    { month: 4, day: 9, name: "Buddha Purnima" },
    { month: 6, day: 15, name: "Eid-ul-Adha" },
    { month: 7, day: 15, name: "Independence Day" },
    { month: 8, day: 30, name: "Janmashtami" },
    { month: 9, day: 2, name: "Gandhi Jayanti" },
    { month: 9, day: 15, name: "Dussehra" },
    { month: 10, day: 1, name: "Diwali" },
    { month: 11, day: 25, name: "Christmas" },
  ];
  holidays.forEach((h) => {
    leaves.push({
      date: dateStr(h.month, h.day),
      type: 'holiday',
      reason: h.name,
    });
  });

  // ---- Other leaves (some random) ----
  const otherDays = [
    { month: 0, day: 10 }, { month: 6, day: 8 }, { month: 10, day: 20 },
  ];
  otherDays.forEach((d) => {
    leaves.push({
      date: dateStr(d.month, d.day),
      type: 'other',
      reason: 'Emergency',
    });
  });

  return leaves;
};

// ----- Month Data -----
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

console.log(shortMonthNames);

// ----- Main Component -----
const FullYearLeaveCalendar: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [leaves] = React.useState<LeaveRecord[]>(generateYearLeaves(currentYear));

  // Color & Label mapping
  const typeColors: Record<LeaveType, string> = {
    personal: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    sick: 'bg-red-500/20 text-red-400 border-red-500/30',
    casual: 'bg-green-500/20 text-green-400 border-green-500/30',
    holiday: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };
  const typeLabels: Record<LeaveType, string> = {
    personal: 'P',
    sick: 'S',
    casual: 'C',
    holiday: 'H',
    other: 'O',
  };





  // ----- Statistics - Full Year -----
  const totalLeaves = leaves.length;
  const stats = {
    personal: leaves.filter(l => l.type === 'personal').length,
    sick: leaves.filter(l => l.type === 'sick').length,
    casual: leaves.filter(l => l.type === 'casual').length,
    holiday: leaves.filter(l => l.type === 'holiday').length,
    other: leaves.filter(l => l.type === 'other').length,
  };

  // Group leaves by month for details
  const leavesByMonth = monthNames.map((_, idx) => {
    return leaves.filter(l => new Date(l.date).getMonth() === idx);
  });

  // ----- Render -----
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Leave Calendar {currentYear}
            </h1>
            <p className="text-gray-400 text-sm mt-1">Full year view with all leaves</p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition flex items-center gap-2 shadow-lg no-print"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
        </div>

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center">
            <p className="text-gray-400 text-xs">Total Leaves</p>
            <p className="text-2xl font-bold text-white">{totalLeaves}</p>
          </div>
          <div className="bg-blue-500/10 backdrop-blur-sm rounded-xl p-3 border border-blue-500/20 text-center">
            <p className="text-gray-400 text-xs">🟦 Personal</p>
            <p className="text-2xl font-bold text-blue-400">{stats.personal}</p>
          </div>
          <div className="bg-red-500/10 backdrop-blur-sm rounded-xl p-3 border border-red-500/20 text-center">
            <p className="text-gray-400 text-xs">🟥 Sick</p>
            <p className="text-2xl font-bold text-red-400">{stats.sick}</p>
          </div>
          <div className="bg-green-500/10 backdrop-blur-sm rounded-xl p-3 border border-green-500/20 text-center">
            <p className="text-gray-400 text-xs">🟩 Casual</p>
            <p className="text-2xl font-bold text-green-400">{stats.casual}</p>
          </div>
          <div className="bg-yellow-500/10 backdrop-blur-sm rounded-xl p-3 border border-yellow-500/20 text-center">
            <p className="text-gray-400 text-xs">🟨 Holiday</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.holiday}</p>
          </div>
        </div>

       

        {/* Detailed Month-wise List */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
          <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
            <span>📋</span> Month-wise Leave Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {leavesByMonth.map((monthLeaves, idx) => (
              <div key={idx} className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/30">
                <div className="font-medium text-blue-400 text-sm mb-2 flex justify-between">
                  <span>{monthNames[idx]}</span>
                  <span className="text-gray-400 text-xs">{monthLeaves.length} leaves</span>
                </div>
                {monthLeaves.length === 0 ? (
                  <p className="text-gray-500 text-xs">No leaves</p>
                ) : (
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {monthLeaves.map((leave, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${typeColors[leave.type].split(' ')[0]} ${typeColors[leave.type].split(' ')[1]}`}>
                          {typeLabels[leave.type]}
                        </span>
                        <span>{new Date(leave.date).getDate()}</span>
                        <span className="text-gray-500 text-[10px]">{leave.reason || ''}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullYearLeaveCalendar;