import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface Student {
  id: string;
  studentId: string;
  name: string;
  fatherName: string;
  class: string;
  section: string;
  rollNumber: string;
  admissionDate: string;
  leavingDate?: string;
  reason?: string;
}

interface LeaveApplication {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedBy?: string;
}

interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  subject: string;
  description: string;
  status: 'pending' | 'resolved' | 'in-progress';
  submittedDate: string;
  resolvedDate?: string;
  remarks?: string;
}

interface SportsAchievement {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  gameName: string;
  position: '1st' | '2nd' | '3rd';
  eventName: string;
  date: string;
  level: 'school' | 'district' | 'state' | 'national';
  certificateIssued: boolean;
}

interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  certificateType: 'transfer' | 'sports' | 'merit' | 'participation';
  issueDate: string;
  downloadUrl: string;
}

const ReportsAndCertificates: React.FC = () => {
  const [activeTab, setActiveTab] = useState('transfer');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [showSportsForm, setShowSportsForm] = useState(false);
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([
    {
      id: '1',
      studentId: 'S001',
      studentName: 'Aarav Sharma',
      class: '5th-A',
      fromDate: '2024-03-15',
      toDate: '2024-03-20',
      reason: 'Family function out of station',
      status: 'approved',
      appliedDate: '2024-03-10',
      approvedBy: 'Mr. Rajesh (Class Teacher)'
    },
    {
      id: '2',
      studentId: 'S002',
      studentName: 'Iyer Iyer',
      class: '6th-B',
      fromDate: '2024-03-18',
      toDate: '2024-03-22',
      reason: 'Medical emergency',
      status: 'pending',
      appliedDate: '2024-03-16'
    }
  ]);

  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: '1',
      studentId: 'S001',
      studentName: 'Aarav Sharma',
      class: '5th-A',
      subject: 'Lost Library Book',
      description: 'My library book was taken by someone from my desk',
      status: 'in-progress',
      submittedDate: '2024-03-12',
      remarks: 'Investigating with class students'
    },
    {
      id: '2',
      studentId: 'S003',
      studentName: 'Priya Patel',
      class: '3rd-A',
      subject: 'Canteen Food Quality',
      description: 'The food in canteen is not fresh',
      status: 'resolved',
      submittedDate: '2024-03-05',
      resolvedDate: '2024-03-08',
      remarks: 'Canteen vendor has been warned'
    }
  ]);

  const [sportsAchievements, setSportsAchievements] = useState<SportsAchievement[]>([
    {
      id: '1',
      studentId: 'S002',
      studentName: 'Iyer Iyer',
      class: '6th-B',
      gameName: 'Cricket',
      position: '1st',
      eventName: 'Inter-School Cricket Tournament',
      date: '2024-02-20',
      level: 'district',
      certificateIssued: true
    },
    {
      id: '2',
      studentId: 'S001',
      studentName: 'Aarav Sharma',
      class: '5th-A',
      gameName: 'Chess',
      position: '2nd',
      eventName: 'Annual Sports Day',
      date: '2024-02-15',
      level: 'school',
      certificateIssued: false
    }
  ]);

  const [students] = useState<Student[]>([
    {
      id: '1',
      studentId: 'S001',
      name: 'Aarav Sharma',
      fatherName: 'Rajesh Sharma',
      class: '5th',
      section: 'A',
      rollNumber: '1',
      admissionDate: '2023-04-01'
    },
    {
      id: '2',
      studentId: 'S002',
      name: 'Iyer Iyer',
      fatherName: 'Karthik Iyer',
      class: '6th',
      section: 'B',
      rollNumber: '5',
      admissionDate: '2023-04-01'
    },
    {
      id: '3',
      studentId: 'S003',
      name: 'Priya Patel',
      fatherName: 'Amit Patel',
      class: '3rd',
      section: 'A',
      rollNumber: '8',
      admissionDate: '2023-06-15'
    }
  ]);

  // Handle Transfer Certificate
  const handleTransferCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const studentId = formData.get('studentId') as string;
    const leavingDate = formData.get('leavingDate') as string;
    const reason = formData.get('reason') as string;
    
    const student = students.find(s => s.id === studentId);
    if (student) {
      toast.success(`Transfer Certificate generated for ${student.name}`);
      // In real app, this would generate PDF
      setShowTransferForm(false);
    }
  };

  // Handle Leave Application
  const handleLeaveApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newLeave: LeaveApplication = {
      id: String(leaveApplications.length + 1),
      studentId: formData.get('studentId') as string,
      studentName: students.find(s => s.id === formData.get('studentId'))?.name || '',
      class: formData.get('class') as string,
      fromDate: formData.get('fromDate') as string,
      toDate: formData.get('toDate') as string,
      reason: formData.get('reason') as string,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    setLeaveApplications([newLeave, ...leaveApplications]);
    toast.success('Leave application submitted successfully!');
    setShowLeaveForm(false);
  };

  // Handle Complaint
  const handleComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newComplaint: Complaint = {
      id: String(complaints.length + 1),
      studentId: formData.get('studentId') as string,
      studentName: students.find(s => s.id === formData.get('studentId'))?.name || '',
      class: formData.get('class') as string,
      subject: formData.get('subject') as string,
      description: formData.get('description') as string,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0]
    };
    setComplaints([newComplaint, ...complaints]);
    toast.success('Complaint submitted successfully!');
    setShowComplaintForm(false);
  };

  // Handle Sports Achievement
  const handleSportsAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newAchievement: SportsAchievement = {
      id: String(sportsAchievements.length + 1),
      studentId: formData.get('studentId') as string,
      studentName: students.find(s => s.id === formData.get('studentId'))?.name || '',
      class: formData.get('class') as string,
      gameName: formData.get('gameName') as string,
      position: formData.get('position') as '1st' | '2nd' | '3rd',
      eventName: formData.get('eventName') as string,
      date: formData.get('date') as string,
      level: formData.get('level') as 'school' | 'district' | 'state' | 'national',
      certificateIssued: false
    };
    setSportsAchievements([newAchievement, ...sportsAchievements]);
    toast.success('Sports achievement recorded! Certificate can be generated.');
    setShowSportsForm(false);
  };

  // Generate Sports Certificate
  const generateSportsCertificate = (achievement: SportsAchievement) => {
    setSportsAchievements(prev => prev.map(a => 
      a.id === achievement.id ? { ...a, certificateIssued: true } : a
    ));
    toast.success(`Sports certificate generated for ${achievement.studentName} (${achievement.position} place in ${achievement.gameName})`);
  };

  // Update Leave Status
  const updateLeaveStatus = (id: string, status: 'approved' | 'rejected') => {
    setLeaveApplications(prev => prev.map(leave => 
      leave.id === id ? { ...leave, status, approvedBy: status === 'approved' ? 'Principal' : undefined } : leave
    ));
    toast.success(`Leave application ${status}`);
  };

  // Update Complaint Status
  const updateComplaintStatus = (id: string, status: 'resolved' | 'in-progress', remarks?: string) => {
    setComplaints(prev => prev.map(complaint => 
      complaint.id === id ? { 
        ...complaint, 
        status, 
        resolvedDate: status === 'resolved' ? new Date().toISOString().split('T')[0] : undefined,
        remarks: remarks || complaint.remarks
      } : complaint
    ));
    toast.success(`Complaint ${status}`);
  };

  // Generate Transfer Certificate PDF (simulated)
  const generateTransferCertificate = (student: Student) => {
    toast.success(`Transfer Certificate generated for ${student.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Reports & Certificates
          </h1>
          <p className="text-gray-400 mt-1">Manage transfer certificates, leave applications, complaints, and sports certificates</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700 pb-2">
          <button
            onClick={() => setActiveTab('transfer')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'transfer' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Transfer Certificate
          </button>
          <button
            onClick={() => setActiveTab('leave')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'leave' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Leave Applications
          </button>
          <button
            onClick={() => setActiveTab('complaint')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'complaint' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Student Complaints
          </button>
          <button
            onClick={() => setActiveTab('sports')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'sports' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Sports Certificates
          </button>
          <button
            onClick={() => setActiveTab('other')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'other' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Other Reports
          </button>
        </div>

        {/* Transfer Certificate Tab */}
        {activeTab === 'transfer' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Transfer Certificates</h2>
              <button
                onClick={() => setShowTransferForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Issue Transfer Certificate
              </button>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Student ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Student Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Class</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Admission Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-white/5">
                        <td className="px-4 py-3 text-sm text-blue-400 font-mono">{student.studentId}</td>
                        <td className="px-4 py-3 text-sm text-white">{student.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">{student.class}-{student.section}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">{student.admissionDate}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => generateTransferCertificate(student)}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-all"
                          >
                            Generate TC
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Leave Applications Tab */}
        {activeTab === 'leave' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Leave Applications</h2>
              <button
                onClick={() => setShowLeaveForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Apply for Leave
              </button>
            </div>

            <div className="grid gap-4">
              {leaveApplications.map((leave) => (
                <div key={leave.id} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{leave.studentName}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          leave.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          leave.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {leave.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">Class: {leave.class} | Student ID: {leave.studentId}</p>
                      <p className="text-sm text-gray-300 mt-2">📅 {leave.fromDate} to {leave.toDate}</p>
                      <p className="text-sm text-gray-300">📝 Reason: {leave.reason}</p>
                      <p className="text-xs text-gray-500 mt-1">Applied on: {leave.appliedDate}</p>
                      {leave.approvedBy && <p className="text-xs text-green-400">Approved by: {leave.approvedBy}</p>}
                    </div>
                    {leave.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateLeaveStatus(leave.id, 'approved')}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateLeaveStatus(leave.id, 'rejected')}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Student Complaints Tab */}
        {activeTab === 'complaint' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Student Complaints</h2>
              <button
                onClick={() => setShowComplaintForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Register Complaint
              </button>
            </div>

            <div className="grid gap-4">
              {complaints.map((complaint) => (
                <div key={complaint.id} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{complaint.studentName}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          complaint.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                          complaint.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {complaint.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">Class: {complaint.class} | Student ID: {complaint.studentId}</p>
                      <p className="text-sm font-medium text-yellow-400 mt-2">Subject: {complaint.subject}</p>
                      <p className="text-sm text-gray-300">📝 {complaint.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Submitted: {complaint.submittedDate}</p>
                      {complaint.resolvedDate && <p className="text-xs text-green-400">Resolved on: {complaint.resolvedDate}</p>}
                      {complaint.remarks && <p className="text-xs text-gray-400">Remarks: {complaint.remarks}</p>}
                    </div>
                    {complaint.status !== 'resolved' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const remarks = prompt('Enter remarks (optional):');
                            updateComplaintStatus(complaint.id, 'in-progress', remarks || undefined);
                          }}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          Mark In Progress
                        </button>
                        <button
                          onClick={() => {
                            const remarks = prompt('Resolution remarks:');
                            updateComplaintStatus(complaint.id, 'resolved', remarks || undefined);
                          }}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                          Resolve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sports Certificates Tab */}
        {activeTab === 'sports' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Sports Achievements & Certificates</h2>
              <button
                onClick={() => setShowSportsForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Achievement
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {sportsAchievements.map((achievement) => (
                <div key={achievement.id} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">{achievement.studentName}</h3>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-400">
                          {achievement.position} Place
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">Class: {achievement.class} | ID: {achievement.studentId}</p>
                      <p className="text-sm text-yellow-400 mt-2">🏆 {achievement.gameName}</p>
                      <p className="text-sm text-gray-300">Event: {achievement.eventName}</p>
                      <p className="text-sm text-gray-300">Level: {achievement.level.toUpperCase()} | Date: {achievement.date}</p>
                    </div>
                    <div>
                      {achievement.certificateIssued ? (
                        <span className="text-green-400 text-sm">✓ Certificate Issued</span>
                      ) : (
                        <button
                          onClick={() => generateSportsCertificate(achievement)}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                          Generate Certificate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Reports Tab */}
        {activeTab === 'other' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Other Reports & Certificates</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Merit Certificate */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Merit Certificate</h3>
                <p className="text-sm text-gray-400 mt-1">For academic excellence and top performers</p>
                <button className="mt-3 text-blue-400 hover:text-blue-300 text-sm">Generate →</button>
              </div>

              {/* Participation Certificate */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Participation Certificate</h3>
                <p className="text-sm text-gray-400 mt-1">For event participation and extracurricular activities</p>
                <button className="mt-3 text-blue-400 hover:text-blue-300 text-sm">Generate →</button>
              </div>

              {/* Conduct Certificate */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Conduct Certificate</h3>
                <p className="text-sm text-gray-400 mt-1">For discipline and good behavior</p>
                <button className="mt-3 text-blue-400 hover:text-blue-300 text-sm">Generate →</button>
              </div>

              {/* Student Report Card */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Student Report Card</h3>
                <p className="text-sm text-gray-400 mt-1">Term-wise academic performance report</p>
                <button className="mt-3 text-blue-400 hover:text-blue-300 text-sm">Generate →</button>
              </div>

              {/* Fee Receipt */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Fee Receipt</h3>
                <p className="text-sm text-gray-400 mt-1">Payment receipts for fee collection</p>
                <button className="mt-3 text-blue-400 hover:text-blue-300 text-sm">Generate →</button>
              </div>

              {/* Bonafide Certificate */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Bonafide Certificate</h3>
                <p className="text-sm text-gray-400 mt-1">Proof of school enrollment</p>
                <button className="mt-3 text-blue-400 hover:text-blue-300 text-sm">Generate →</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transfer Certificate Modal */}
      {showTransferForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-md w-full border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Issue Transfer Certificate</h2>
              <button onClick={() => setShowTransferForm(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleTransferCertificate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Select Student</label>
                <select name="studentId" required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} - {s.studentId} ({s.class})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Leaving Date</label>
                <input type="date" name="leavingDate" required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Reason for Leaving</label>
                <textarea name="reason" rows={3} required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" placeholder="e.g., Family relocation, School transfer, etc."></textarea>
              </div>
              <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">Generate Certificate</button>
            </form>
          </div>
        </div>
      )}

      {/* Leave Application Modal */}
      {showLeaveForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-md w-full border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Apply for Leave</h2>
              <button onClick={() => setShowLeaveForm(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleLeaveApplication} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Student</label>
                <select name="studentId" required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} - {s.studentId}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Class</label>
                <input type="text" name="class" required placeholder="e.g., 5th-A" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">From Date</label>
                  <input type="date" name="fromDate" required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">To Date</label>
                  <input type="date" name="toDate" required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Reason</label>
                <textarea name="reason" rows={3} required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" placeholder="Reason for leave..."></textarea>
              </div>
              <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">Submit Application</button>
            </form>
          </div>
        </div>
      )}

      {/* Complaint Modal */}
      {showComplaintForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-md w-full border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Register Complaint</h2>
              <button onClick={() => setShowComplaintForm(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleComplaint} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Student</label>
                <select name="studentId" required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} - {s.studentId}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Class</label>
                <input type="text" name="class" required placeholder="e.g., 5th-A" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                <input type="text" name="subject" required placeholder="Brief subject of complaint" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea name="description" rows={3} required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" placeholder="Detailed description of the issue..."></textarea>
              </div>
              <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">Submit Complaint</button>
            </form>
          </div>
        </div>
      )}

      {/* Sports Achievement Modal */}
      {showSportsForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-md w-full border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Add Sports Achievement</h2>
              <button onClick={() => setShowSportsForm(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSportsAchievement} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Student</label>
                <select name="studentId" required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} - {s.studentId}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Class</label>
                <input type="text" name="class" required placeholder="e.g., 5th-A" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Game Name</label>
                <input type="text" name="gameName" required placeholder="e.g., Cricket, Chess, Badminton" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Position</label>
                <select name="position" required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                  <option value="1st">1st Place</option>
                  <option value="2nd">2nd Place</option>
                  <option value="3rd">3rd Place</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Event Name</label>
                <input type="text" name="eventName" required placeholder="e.g., Annual Sports Day 2024" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Event Level</label>
                <select name="level" required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                  <option value="school">School Level</option>
                  <option value="district">District Level</option>
                  <option value="state">State Level</option>
                  <option value="national">National Level</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                <input type="date" name="date" required className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
              </div>
              <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">Save Achievement</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsAndCertificates;