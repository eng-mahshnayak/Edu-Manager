// LeaveCalendar.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  Chip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Badge,
  Tooltip,
  Paper,
  Avatar,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  Work,
  LocalHospital,
  BeachAccess,
  FamilyRestroom,
  School,
  EventBusy,
  CheckCircle,
  Cancel,
  Pending,
  Add,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import toast from 'react-hot-toast';

interface Leave {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  leaveType: 'sick' | 'casual' | 'earned' | 'emergency' | 'maternity' | 'paternity' | 'unpaid';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
  approvedBy?: string;
  approvedOn?: string;
  documentUrl?: string;
  totalDays: number;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  profileImage?: string;
}

const LeaveCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [selectedLeaveType, setSelectedLeaveType] = useState<string>('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Leave type configurations with colors
  const leaveTypeConfig = {
    sick: {
      label: 'Sick Leave',
      color: '#ef4444',
      bgColor: '#fef2f2',
      darkBgColor: '#7f1d1d',
      icon: <LocalHospital sx={{ fontSize: 16 }} />,
    },
    casual: {
      label: 'Casual Leave',
      color: '#10b981',
      bgColor: '#ecfdf5',
      darkBgColor: '#064e3b',
      icon: <BeachAccess sx={{ fontSize: 16 }} />,
    },
    earned: {
      label: 'Earned Leave',
      color: '#3b82f6',
      bgColor: '#eff6ff',
      darkBgColor: '#1e3a8a',
      icon: <Work sx={{ fontSize: 16 }} />,
    },
    emergency: {
      label: 'Emergency Leave',
      color: '#f59e0b',
      bgColor: '#fffbeb',
      darkBgColor: '#78350f',
      icon: <EventBusy sx={{ fontSize: 16 }} />,
    },
    maternity: {
      label: 'Maternity Leave',
      color: '#ec4899',
      bgColor: '#fdf2f8',
      darkBgColor: '#831843',
      icon: <FamilyRestroom sx={{ fontSize: 16 }} />,
    },
    paternity: {
      label: 'Paternity Leave',
      color: '#8b5cf6',
      bgColor: '#f5f3ff',
      darkBgColor: '#4c1d95',
      icon: <FamilyRestroom sx={{ fontSize: 16 }} />,
    },
    unpaid: {
      label: 'Unpaid Leave',
      color: '#6b7280',
      bgColor: '#f9fafb',
      darkBgColor: '#374151',
      icon: <Cancel sx={{ fontSize: 16 }} />,
    },
  };

  // Sample employees data
  const initialEmployees: Employee[] = [
    { id: 'EMP001', name: 'Dr. Rajesh Kumar', role: 'Principal', department: 'Administration' },
    { id: 'EMP002', name: 'Prof. Meera Sharma', role: 'Teacher', department: 'Science' },
    { id: 'EMP003', name: 'Mr. Suresh Verma', role: 'Teacher', department: 'English' },
    { id: 'EMP004', name: 'Mrs. Priya Singh', role: 'Teacher', department: 'Commerce' },
    { id: 'EMP005', name: 'Mr. Amit Patel', role: 'Teacher', department: 'Computer Science' },
    { id: 'EMP006', name: 'Ramesh Singh', role: 'Driver', department: 'Transport' },
    { id: 'EMP007', name: 'Lakshmi Bai', role: 'Maid', department: 'Housekeeping' },
    { id: 'EMP008', name: 'Mohan Kumar', role: 'Labour', department: 'Maintenance' },
  ];

  // Sample leaves data for 12 months
  const generateSampleLeaves = (): Leave[] => {
    const sampleLeaves: Leave[] = [];
    const employees = initialEmployees;
    
    // Generate leaves for each month
    for (let month = 0; month < 12; month++) {
      const year = 2024;
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      employees.forEach((emp, empIndex) => {
        // Random number of leaves per employee per month (0-3)
        const numLeaves = Math.floor(Math.random() * 4);
        
        for (let i = 0; i < numLeaves; i++) {
          const leaveTypes: Leave['leaveType'][] = ['sick', 'casual', 'earned', 'emergency', 'maternity', 'paternity', 'unpaid'];
          const leaveType = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
          
          // Random date in month
          const day = Math.floor(Math.random() * daysInMonth) + 1;
          const startDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const endDate = startDate;
          
          sampleLeaves.push({
            id: `LEV${String(sampleLeaves.length + 1).padStart(3, '0')}`,
            employeeId: emp.id,
            employeeName: emp.name,
            employeeRole: emp.role,
            leaveType,
            startDate,
            endDate,
            reason: `${leaveType} leave reason`,
            status: ['pending', 'approved', 'approved', 'approved'][Math.floor(Math.random() * 4)] as any,
            appliedOn: startDate,
            totalDays: 1,
          });
        }
      });
    }
    
    return sampleLeaves;
  };

  useEffect(() => {
    setEmployees(initialEmployees);
    setLeaves(generateSampleLeaves());
  }, []);

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Get leaves for a specific date
  const getLeavesForDate = (year: number, month: number, day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    let filteredLeaves = leaves.filter(l => l.startDate <= dateStr && l.endDate >= dateStr);
    
    if (selectedEmployee !== 'all') {
      filteredLeaves = filteredLeaves.filter(l => l.employeeId === selectedEmployee);
    }
    
    if (selectedLeaveType !== 'all') {
      filteredLeaves = filteredLeaves.filter(l => l.leaveType === selectedLeaveType);
    }
    
    return filteredLeaves;
  };

  // Get total leaves count for a date
  const getLeavesCountForDate = (year: number, month: number, day: number) => {
    return getLeavesForDate(year, month, day).length;
  };

  // Get leave type distribution for a date
  const getLeaveTypeDistribution = (year: number, month: number, day: number) => {
    const leavesForDate = getLeavesForDate(year, month, day);
    const distribution: Record<string, number> = {};
    leavesForDate.forEach(leave => {
      distribution[leave.leaveType] = (distribution[leave.leaveType] || 0) + 1;
    });
    return distribution;
  };

  // Navigate to previous month
  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  // Navigate to next month
  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  // Go to current month
  const goToCurrentMonth = () => {
    setSelectedMonth(currentDate.getMonth());
    setSelectedYear(currentDate.getFullYear());
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Chip icon={<CheckCircle sx={{ fontSize: 14 }} />} label="Approved" size="small" sx={{ bgcolor: '#10b98120', color: '#10b981' }} />;
      case 'rejected':
        return <Chip icon={<Cancel sx={{ fontSize: 14 }} />} label="Rejected" size="small" sx={{ bgcolor: '#ef444420', color: '#ef4444' }} />;
      default:
        return <Chip icon={<Pending sx={{ fontSize: 14 }} />} label="Pending" size="small" sx={{ bgcolor: '#f59e0b20', color: '#f59e0b' }} />;
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);
  
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Calculate statistics
  const totalLeaves = leaves.filter(l => {
    const leaveDate = new Date(l.startDate);
    return leaveDate.getFullYear() === selectedYear && leaveDate.getMonth() === selectedMonth;
  }).length;
  
  const approvedLeaves = leaves.filter(l => {
    const leaveDate = new Date(l.startDate);
    return leaveDate.getFullYear() === selectedYear && leaveDate.getMonth() === selectedMonth && l.status === 'approved';
  }).length;
  
  const pendingLeaves = leaves.filter(l => {
    const leaveDate = new Date(l.startDate);
    return leaveDate.getFullYear() === selectedYear && leaveDate.getMonth() === selectedMonth && l.status === 'pending';
  }).length;

  // Leave type statistics
  const leaveTypeStats: Record<string, number> = {};
  Object.keys(leaveTypeConfig).forEach(type => {
    leaveTypeStats[type] = leaves.filter(l => {
      const leaveDate = new Date(l.startDate);
      return leaveDate.getFullYear() === selectedYear && leaveDate.getMonth() === selectedMonth && l.leaveType === type;
    }).length;
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, md: 3 },
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: "white", mb: 1, display: "flex", alignItems: "center", gap: 2 }}>
            <EventBusy sx={{ fontSize: 40 }} />
            Leave Management Calendar
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)" }}>
            Track and manage employee leaves with color-coded calendar view
          </Typography>
        </Box>

        {/* Filters */}
        <Grid container spacing={2} mb={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Employee</InputLabel>
              <Select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                label="Employee"
                sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              >
                <MenuItem value="all">All Employees</MenuItem>
                {employees.map(emp => (
                  <MenuItem key={emp.id} value={emp.id}>{emp.name} ({emp.role})</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Leave Type</InputLabel>
              <Select
                value={selectedLeaveType}
                onChange={(e) => setSelectedLeaveType(e.target.value)}
                label="Leave Type"
                sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              >
                <MenuItem value="all">All Types</MenuItem>
                {Object.entries(leaveTypeConfig).map(([key, config]) => (
                  <MenuItem key={key} value={key}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{ width: 12, height: 12, borderRadius: 2, bgcolor: config.color }} />
                      {config.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                onClick={() => setOpenDialog(true)}
                sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
              >
                <Add sx={{ mr: 1 }} /> Apply Leave
              </Button>
              <Button variant="outlined" onClick={goToCurrentMonth} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                <Today sx={{ mr: 1 }} /> Today
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Statistics Cards */}
        <Grid container spacing={2} mb={3}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Total Leaves</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>{totalLeaves}</Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card sx={{ p: 2, bgcolor: 'rgba(16,185,129,0.1)', borderRadius: 3, border: '1px solid rgba(16,185,129,0.3)' }}>
              <Typography variant="body2" sx={{ color: '#10b981' }}>Approved</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#10b981' }}>{approvedLeaves}</Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card sx={{ p: 2, bgcolor: 'rgba(245,158,11,0.1)', borderRadius: 3, border: '1px solid rgba(245,158,11,0.3)' }}>
              <Typography variant="body2" sx={{ color: '#f59e0b' }}>Pending</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#f59e0b' }}>{pendingLeaves}</Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card sx={{ p: 2, bgcolor: 'rgba(59,130,246,0.1)', borderRadius: 3, border: '1px solid rgba(59,130,246,0.3)' }}>
              <Typography variant="body2" sx={{ color: '#3b82f6' }}>Leave Types</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#3b82f6' }}>{Object.keys(leaveTypeConfig).length}</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Calendar Navigation */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <IconButton onClick={prevMonth} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>
            {monthNames[selectedMonth]} {selectedYear}
          </Typography>
          <IconButton onClick={nextMonth} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
            <ChevronRight />
          </IconButton>
        </Box>

        {/* Calendar Grid */}
        <Card sx={{ borderRadius: 4, overflow: 'hidden', bgcolor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
          {/* Weekday Headers */}
          <Grid container sx={{ bgcolor: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {weekDays.map(day => (
              <Grid key={day} size={{ xs: 12/7 }} sx={{ p: 2, textAlign: 'center' }}>
                <Typography fontWeight="bold" sx={{ color: 'rgba(255,255,255,0.8)' }}>{day}</Typography>
              </Grid>
            ))}
          </Grid>

          {/* Calendar Days */}
          <Grid container>
            {calendarDays.map((day, index) => {
              const dateLeaves = day ? getLeavesForDate(selectedYear, selectedMonth, day) : [];
              const leaveCount = day ? getLeavesCountForDate(selectedYear, selectedMonth, day) : 0;
              const leaveDistribution = day ? getLeaveTypeDistribution(selectedYear, selectedMonth, day) : {};
              
              return (
                <Grid 
                  key={index} 
                  size={{ xs: 12/7 }} 
                  sx={{ 
                    minHeight: 120, 
                    p: 1, 
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    bgcolor: day ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.2)',
                    '&:hover': day ? { bgcolor: 'rgba(255,255,255,0.08)' } : {},
                    cursor: day ? 'pointer' : 'default',
                  }}
                  onClick={() => {
                    if (day && dateLeaves.length > 0) {
                      setSelectedLeave(dateLeaves[0]);
                    }
                  }}
                >
                  {day && (
                    <>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'rgba(255,255,255,0.9)', 
                          fontWeight: 'bold',
                          mb: 1,
                        }}
                      >
                        {day}
                      </Typography>
                      
                      {leaveCount > 0 && (
                        <Box display="flex" flexWrap="wrap" gap={0.5}>
                          {Object.entries(leaveDistribution).map(([type, count]) => (
                            <Tooltip key={type} title={`${leaveTypeConfig[type as keyof typeof leaveTypeConfig].label}: ${count}`}>
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor: leaveTypeConfig[type as keyof typeof leaveTypeConfig].color,
                                  display: 'inline-block',
                                }}
                              />
                            </Tooltip>
                          ))}
                        </Box>
                      )}
                      
                      {leaveCount > 0 && (
                        <Badge 
                          badgeContent={leaveCount} 
                          color="error" 
                          sx={{ 
                            '& .MuiBadge-badge': { 
                              fontSize: 10, 
                              height: 18, 
                              minWidth: 18,
                              bgcolor: '#ef4444',
                              top: -5,
                              right: -5,
                            } 
                          }}
                        />
                      )}
                      
                      {/* Show leave type labels for first few leaves */}
                      {dateLeaves.slice(0, 2).map((leave, idx) => (
                        <Box 
                          key={idx}
                          sx={{ 
                            mt: 0.5, 
                            p: 0.3, 
                            borderRadius: 1,
                            fontSize: 10,
                            bgcolor: `${leaveTypeConfig[leave.leaveType].color}20`,
                            color: leaveTypeConfig[leave.leaveType].color,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {leave.employeeName.split(' ')[0]}: {leaveTypeConfig[leave.leaveType].label.substring(0, 8)}
                        </Box>
                      ))}
                      {dateLeaves.length > 2 && (
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5, display: 'block' }}>
                          +{dateLeaves.length - 2} more
                        </Typography>
                      )}
                    </>
                  )}
                </Grid>
              );
            })}
          </Grid>
        </Card>

        {/* Legend */}
        <Box mt={3}>
          <Typography variant="body2" fontWeight="bold" sx={{ color: 'white', mb: 1 }}>
            Leave Type Legend
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {Object.entries(leaveTypeConfig).map(([key, config]) => (
              <Box key={key} display="flex" alignItems="center" gap={1}>
                <Box sx={{ width: 16, height: 16, borderRadius: 2, bgcolor: config.color }} />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {config.label}
                </Typography>
                <Typography variant="caption" fontWeight="bold" sx={{ color: config.color }}>
                  ({leaveTypeStats[key] || 0})
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Leave Details Dialog */}
        <Dialog open={!!selectedLeave} onClose={() => setSelectedLeave(null)} maxWidth="sm" fullWidth>
          {selectedLeave && (
            <>
              <DialogTitle sx={{ bgcolor: '#1e293b', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 2, bgcolor: leaveTypeConfig[selectedLeave.leaveType].color }} />
                  Leave Details - {selectedLeave.employeeName}
                </Box>
              </DialogTitle>
              <DialogContent sx={{ bgcolor: '#0f172a', py: 3 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Leave Type</Typography>
                    <Typography variant="body1" fontWeight="bold" sx={{ color: leaveTypeConfig[selectedLeave.leaveType].color }}>
                      {leaveTypeConfig[selectedLeave.leaveType].label}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Status</Typography>
                    <Box mt={0.5}>{getStatusBadge(selectedLeave.status)}</Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Start Date</Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>{new Date(selectedLeave.startDate).toLocaleDateString()}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>End Date</Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>{new Date(selectedLeave.endDate).toLocaleDateString()}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Reason</Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>{selectedLeave.reason}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Applied On</Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>{new Date(selectedLeave.appliedOn).toLocaleDateString()}</Typography>
                  </Grid>
                  {selectedLeave.approvedBy && (
                    <>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Approved By</Typography>
                        <Typography variant="body2" sx={{ color: 'white' }}>{selectedLeave.approvedBy}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Approved On</Typography>
                        <Typography variant="body2" sx={{ color: 'white' }}>{selectedLeave.approvedOn && new Date(selectedLeave.approvedOn).toLocaleDateString()}</Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions sx={{ bgcolor: '#1e293b', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Button onClick={() => setSelectedLeave(null)} sx={{ color: 'white' }}>Close</Button>
                {selectedLeave.status === 'pending' && (
                  <>
                    <Button variant="contained" sx={{ bgcolor: '#10b981' }}>Approve</Button>
                    <Button variant="contained" sx={{ bgcolor: '#ef4444' }}>Reject</Button>
                  </>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Apply Leave Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: '#1e293b', color: 'white' }}>Apply for Leave</DialogTitle>
          <DialogContent sx={{ bgcolor: '#0f172a', py: 3 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Employee</InputLabel>
                  <Select label="Employee" sx={{ color: 'white' }}>
                    {employees.map(emp => (
                      <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Leave Type</InputLabel>
                  <Select label="Leave Type" sx={{ color: 'white' }}>
                    {Object.entries(leaveTypeConfig).map(([key, config]) => (
                      <MenuItem key={key} value={key}>{config.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField fullWidth type="date" label="Start Date" InputLabelProps={{ shrink: true }} sx={{ input: { color: 'white' } }} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField fullWidth type="date" label="End Date" InputLabelProps={{ shrink: true }} sx={{ input: { color: 'white' } }} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth multiline rows={3} label="Reason" sx={{ textarea: { color: 'white' } }} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ bgcolor: '#1e293b' }}>
            <Button onClick={() => setOpenDialog(false)} sx={{ color: 'white' }}>Cancel</Button>
            <Button variant="contained" sx={{ bgcolor: '#10b981' }}>Submit Application</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default LeaveCalendar;