import React from 'react';

// ----- Types -----
interface FeeYearData {
  year: string;
  className: string;
  totalFee: number;
  paid: number;
  status: 'paid' | 'partial' | 'due';
}

interface StudentTreeData {
  name: string;
  photo?: string;
  studentId: string;
  fatherName: string;
  motherName: string;
  class: string;
  section: string;
  rollNumber: string;
  phone: string;
  email: string;
  address: string;
  feeHistory: FeeYearData[];
}

// ----- Component -----
const StudentTreeView: React.FC = () => {
  // Static Data (sample)
  const student: StudentTreeData = {
    name: 'Rahul Sharma',
    studentId: 'STU-2025-001',
    fatherName: 'Mr. Rajesh Sharma',
    motherName: 'Mrs. Priya Sharma',
    class: '5th',
    section: 'A',
    rollNumber: '15',
    phone: '+91 98765 43210',
    email: 'rahul.s@example.com',
    address: '123, Green Valley, Mumbai, Maharashtra - 400001',
    feeHistory: [
      { year: '2024-25', className: 'Class 4', totalFee: 8000, paid: 8000, status: 'paid' },
      { year: '2025-26', className: 'Class 5', totalFee: 10000, paid: 8000, status: 'partial' },
      { year: '2026-27', className: 'Class 6', totalFee: 12000, paid: 0, status: 'due' },
    ],
  };

  // Status Badge with animation
  const StatusBadge: React.FC<{ status: FeeYearData['status'] }> = ({ status }) => {
    const config = {
      paid: {
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        border: 'border-green-500/30',
        label: '✅ Paid',
        extra: '',
      },
      partial: {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-400',
        border: 'border-yellow-500/30',
        label: '🟡 Partial',
        extra: '',
      },
      due: {
        bg: 'bg-red-500/20',
        text: 'text-red-400',
        border: 'border-red-500/30',
        label: '🔴 Due',
        extra: 'animate-pulse-glow', // pulsing glow on badge
      },
    };
    const c = config[status];
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border} ${c.extra}`}>
        {c.label}
      </span>
    );
  };

  // Helper to get due amount text with animation
  const DueAmount: React.FC<{ amount: number; status: FeeYearData['status'] }> = ({ amount, status }) => {
    if (amount === 0) return <span className="text-green-400">₹0</span>;
    if (status === 'paid') return <span className="text-green-400">₹{amount.toLocaleString()}</span>;
    // For partial or due, show with animation/glow
    const isDue = status === 'due';
    return (
      <span className={`font-medium ${isDue ? 'text-red-400 animate-pulse-glow' : 'text-yellow-400'}`}>
        ₹{amount.toLocaleString()}
      </span>
    );
  };

  return (
    <>
      {/* Self-contained CSS for animation */}
      <style>{`
        .animate-pulse-glow {
          animation: pulseGlow 1.5s ease-in-out infinite;
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          50% { box-shadow: 0 0 20px 5px rgba(239, 68, 68, 0.6); }
        }
        /* Print styles */
        @media print {
          .no-print {
            display: none !important;
          }
          .print-only-tree {
            background: white !important;
            color: black !important;
          }
          .print-only-tree .bg-gray-800\\/50 {
            background: #f3f4f6 !important;
            border-color: #d1d5db !important;
          }
          .print-only-tree .text-white {
            color: black !important;
          }
          .print-only-tree .text-gray-400 {
            color: #6b7280 !important;
          }
          .print-only-tree .border-white\\/10 {
            border-color: #e5e7eb !important;
          }
          .print-only-tree .bg-gradient-to-br {
            background: white !important;
          }
          .print-only-tree .shadow-2xl {
            box-shadow: none !important;
          }
          .print-only-tree .ring-4 {
            ring: none !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 p-4 md:p-6 print-only-tree">
        <div className="max-w-6xl mx-auto">
          {/* Header with Print Button (hidden in print) */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 no-print">
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
              </svg>
              Student Fee Tree
            </h1>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition flex items-center gap-2 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Tree
            </button>
          </div>

          {/* Tree Container - No Summary Cards */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl">
            <div className="flex flex-col items-center">
              {/* ====== ROOT NODE ====== */}
              <div className="flex flex-col items-center mb-2">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-5xl text-white shadow-2xl ring-4 ring-blue-500/30">
                  {student.photo ? (
                    <img src={student.photo} alt={student.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    student.name.charAt(0).toUpperCase()
                  )}
                </div>
                <p className="text-white font-bold text-2xl mt-3 tracking-wide">{student.name}</p>
                <p className="text-gray-400 text-sm font-mono bg-gray-800/50 px-3 py-0.5 rounded-full mt-1">
                  ID: {student.studentId}
                </p>
              </div>

              {/* ====== VERTICAL LINE ====== */}
              <div className="w-0.5 h-10 bg-gradient-to-b from-blue-400 to-transparent"></div>

              {/* ====== TWO BRANCHES ====== */}
              <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8 w-full mt-2">
                
                {/* --- LEFT: Student Info --- */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="flex items-center">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-400"></div>
                    <div className="w-0.5 h-8 bg-gradient-to-b from-blue-400 to-transparent"></div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-blue-500/20 w-full max-w-xs shadow-lg hover:shadow-blue-500/10 transition-shadow duration-300">
                    <h3 className="text-blue-400 font-semibold flex items-center gap-2 text-lg mb-4">
                      <span>👤</span> Student Info
                    </h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex justify-between border-b border-gray-700/50 pb-1">
                        <span className="text-gray-500">Father</span>
                        <span>{student.fatherName}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700/50 pb-1">
                        <span className="text-gray-500">Mother</span>
                        <span>{student.motherName}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700/50 pb-1">
                        <span className="text-gray-500">Class</span>
                        <span className="font-medium">{student.class} - {student.section}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700/50 pb-1">
                        <span className="text-gray-500">Roll</span>
                        <span>{student.rollNumber}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700/50 pb-1">
                        <span className="text-gray-500">Phone</span>
                        <span>{student.phone}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700/50 pb-1">
                        <span className="text-gray-500">Email</span>
                        <span className="truncate">{student.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Address</span>
                        <span className="text-right text-xs">{student.address}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- RIGHT: Fee History --- */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="flex items-center">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-green-400"></div>
                    <div className="w-0.5 h-8 bg-gradient-to-b from-green-400 to-transparent"></div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-green-500/20 w-full max-w-md shadow-lg hover:shadow-green-500/10 transition-shadow duration-300">
                    <h3 className="text-green-400 font-semibold flex items-center gap-2 text-lg mb-4">
                      <span>💰</span> Fee History
                    </h3>
                    <div className="space-y-4">
                      {student.feeHistory.map((yearData, index) => {
                        const dueAmount = yearData.totalFee - yearData.paid;
                        return (
                          <div
                            key={index}
                            className="relative pl-5 border-l-2 border-gray-600 last:border-l-0 last:pl-0 group transition-all duration-200"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gray-700/20 rounded-lg hover:bg-gray-700/40 transition-colors duration-200">
                              <div className="flex items-center gap-3">
                                <span className="text-yellow-400 font-mono text-sm font-bold">{yearData.year}</span>
                                <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-0.5 rounded-full">
                                  {yearData.className}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-300 font-medium">
                                  ₹{yearData.totalFee.toLocaleString()}
                                </span>
                                <StatusBadge status={yearData.status} />
                              </div>
                            </div>
                            {/* Paid / Due breakdown with animation on Due amount */}
                            <div className="mt-1 ml-4 text-xs text-gray-400 flex gap-4">
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                Paid: ₹{yearData.paid.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${yearData.status === 'due' ? 'bg-red-400 animate-pulse' : 'bg-gray-500'}`}></span>
                                Due: <DueAmount amount={dueAmount} status={yearData.status} />
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentTreeView;