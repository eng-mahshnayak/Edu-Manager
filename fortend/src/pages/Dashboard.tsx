import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  Typography,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { 
  TrendingUp, 
  TrendingDown, 
  AttachMoney,
  People, 
  School, 
  Book, 
  Event,
  MenuBook,
  LocalLibrary,
  DirectionsBus,
  Restaurant,
  Computer,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  Today,
  CalendarToday,
  CheckCircle,
  Pending,
  Warning,
  Star,
  Grade,
  AttachFile
} from "@mui/icons-material";
import { Bar, Line, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

// ===================== STYLED COMPONENTS =====================

const StatsCard = styled(Card)<{ gradient: string }>(({ gradient }) => ({
  borderRadius: "20px",
  padding: "20px",
  background: gradient,
  color: "white",
  height: "100%",
  minHeight: "170px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
  transition: "0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  },
}));

const InfoCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  padding: "16px",
  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  color: "white",
  border: "1px solid rgba(255,255,255,0.1)",
  transition: "0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
  },
}));

// ===================== MAIN DASHBOARD =====================

const SchoolDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Dashboard Data
  const [dashboardData, setDashboardData] = useState({
    // Statistics
    statistics: {
      totalStudents: 1250,
      totalTeachers: 68,
      totalStaff: 45,
      totalClasses: 32,
      totalRevenue: 2450000,
      totalExpenses: 1890000,
      profit: 560000,
      attendanceRate: 92.5,
      averageMarks: 78.3,
      passPercentage: 94.2,
    },
    
    // Class wise student distribution
    classDistribution: [
      { class: "Nursery", students: 85, boys: 45, girls: 40 },
      { class: "LKG", students: 92, boys: 48, girls: 44 },
      { class: "UKG", students: 88, boys: 46, girls: 42 },
      { class: "1st", students: 95, boys: 50, girls: 45 },
      { class: "2nd", students: 90, boys: 47, girls: 43 },
      { class: "3rd", students: 92, boys: 48, girls: 44 },
      { class: "4th", students: 88, boys: 45, girls: 43 },
      { class: "5th", students: 94, boys: 49, girls: 45 },
      { class: "6th", students: 96, boys: 50, girls: 46 },
      { class: "7th", students: 89, boys: 46, girls: 43 },
      { class: "8th", students: 93, boys: 48, girls: 45 },
      { class: "9th", students: 91, boys: 47, girls: 44 },
      { class: "10th", students: 87, boys: 45, girls: 42 },
      { class: "11th", students: 76, boys: 40, girls: 36 },
      { class: "12th", students: 74, boys: 39, girls: 35 },
    ],
    
    // Monthly revenue/expense data
    financialData: {
      months: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      revenue: [185000, 192000, 188000, 195000, 210000, 245000, 230000, 225000, 240000, 235000, 250000, 260000],
      expenses: [142000, 148000, 145000, 152000, 165000, 189000, 178000, 175000, 182000, 180000, 192000, 198000],
    },
    
    // Attendance data for current week
    attendanceData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      students: [92, 94, 91, 95, 93, 88],
      teachers: [98, 97, 96, 98, 97, 95],
      staff: [96, 95, 94, 96, 95, 93],
    },
    
    // Subject wise performance
    subjectPerformance: [
      { subject: "Mathematics", average: 76.5, passRate: 91, topScore: 98 },
      { subject: "Science", average: 78.2, passRate: 93, topScore: 99 },
      { subject: "English", average: 79.8, passRate: 94, topScore: 97 },
      { subject: "Hindi", average: 81.3, passRate: 95, topScore: 100 },
      { subject: "Social Studies", average: 77.9, passRate: 92, topScore: 98 },
      { subject: "Computer", average: 84.5, passRate: 96, topScore: 100 },
    ],
    
    // Recent activities
    recentActivities: [
      { id: 1, activity: "Parents-Teacher Meeting Scheduled", date: "2024-12-15", status: "upcoming", type: "event" },
      { id: 2, activity: "Half-Yearly Exams Started", date: "2024-12-10", status: "ongoing", type: "exam" },
      { id: 3, activity: "New Library Books Added", date: "2024-12-08", status: "completed", type: "update" },
      { id: 4, activity: "Sports Day Registration Open", date: "2024-12-20", status: "upcoming", type: "event" },
      { id: 5, activity: "Teacher Training Workshop", date: "2024-12-05", status: "completed", type: "training" },
      { id: 6, activity: "Fee Submission Deadline", date: "2024-12-18", status: "pending", type: "reminder" },
    ],
    
    // Topper students
    topPerformers: [
      { name: "Aarav Sharma", class: "12th", percentage: 96.8, rank: 1, subjects: ["Math", "Physics"] },
      { name: "Isha Verma", class: "10th", percentage: 95.4, rank: 2, subjects: ["Science", "English"] },
      { name: "Rohan Gupta", class: "12th", percentage: 94.2, rank: 3, subjects: ["Chemistry", "Biology"] },
      { name: "Priya Singh", class: "9th", percentage: 93.8, rank: 4, subjects: ["Math", "SST"] },
      { name: "Aditya Kumar", class: "11th", percentage: 92.5, rank: 5, subjects: ["Computer", "Physics"] },
    ],
    
    // Upcoming events
    upcomingEvents: [
      { id: 1, title: "Annual Sports Day", date: "2024-12-20", venue: "School Ground", time: "9:00 AM" },
      { id: 2, title: "Winter Break", date: "2024-12-25", venue: "School", time: "All Day" },
      { id: 3, title: "New Year Celebration", date: "2025-01-01", venue: "Auditorium", time: "10:00 AM" },
      { id: 4, title: "PTM for Classes 10-12", date: "2025-01-10", venue: "Classrooms", time: "8:30 AM" },
    ],
    
    // Notice board
    notices: [
      { id: 1, title: "School Reopening", content: "School will reopen on 1st Jan 2025", date: "2024-12-20", priority: "high" },
      { id: 2, title: "Fee Submission", content: "Last date for fee submission is 25th Dec", date: "2024-12-18", priority: "urgent" },
      { id: 3, title: "Holiday Notice", content: "School will remain closed on 25th Dec", date: "2024-12-15", priority: "normal" },
    ],
    
    // Transport stats
    transportStats: {
      totalBuses: 12,
      totalRoutes: 18,
      studentsTransport: 850,
      drivers: 14,
      conductors: 12,
    },
    
    // Canteen stats
    canteenStats: {
      dailySales: 25000,
      monthlySales: 600000,
      totalItems: 45,
      staff: 8,
    },
  });

  // Chart data configurations
  const revenueChartData = {
    labels: dashboardData.financialData.months,
    datasets: [
      {
        label: 'Revenue (₹)',
        data: dashboardData.financialData.revenue,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Expenses (₹)',
        data: dashboardData.financialData.expenses,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const attendanceChartData = {
    labels: dashboardData.attendanceData.labels,
    datasets: [
      {
        label: 'Students Attendance (%)',
        data: dashboardData.attendanceData.students,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
      },
      {
        label: 'Teachers Attendance (%)',
        data: dashboardData.attendanceData.teachers,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
      },
      {
        label: 'Staff Attendance (%)',
        data: dashboardData.attendanceData.staff,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
      },
    ],
  };

  const classDistributionData = {
    labels: dashboardData.classDistribution.slice(0, 10).map(c => c.class),
    datasets: [
      {
        label: 'Boys',
        data: dashboardData.classDistribution.slice(0, 10).map(c => c.boys),
        backgroundColor: '#3b82f6',
        borderRadius: 8,
      },
      {
        label: 'Girls',
        data: dashboardData.classDistribution.slice(0, 10).map(c => c.girls),
        backgroundColor: '#ec4899',
        borderRadius: 8,
      },
    ],
  };

  const subjectPerformanceData = {
    labels: dashboardData.subjectPerformance.map(s => s.subject),
    datasets: [
      {
        label: 'Average Marks',
        data: dashboardData.subjectPerformance.map(s => s.average),
        backgroundColor: '#8b5cf6',
        borderRadius: 8,
      },
    ],
  };

  const revenueExpenseComparisonData = {
    labels: ['Revenue', 'Expenses', 'Profit'],
    datasets: [
      {
        data: [
          dashboardData.statistics.totalRevenue,
          dashboardData.statistics.totalExpenses,
          dashboardData.statistics.profit,
        ],
        backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedEvent(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return '#f59e0b';
      case 'ongoing': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'pending': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'normal': return '#3b82f6';
      default: return '#6b7280';
    }
  };

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
        {/* Welcome Section */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: "white", mb: 1 }}>
            Welcome back, Principal! 👨‍🏫
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)" }}>
            Here's your school management overview for {new Date().toLocaleDateString()}
          </Typography>
        </Box>

        {/* ================= STATS SECTION ================= */}
        <Grid container spacing={2}>
          {/* Total Students */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <StatsCard gradient="linear-gradient(135deg, #3b82f6, #2563eb)">
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  TOTAL STUDENTS
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {dashboardData.statistics.totalStudents}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <People fontSize="small" />
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  +125 from last year
                </Typography>
              </Box>
            </StatsCard>
          </Grid>

          {/* Total Teachers */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <StatsCard gradient="linear-gradient(135deg, #10b981, #059669)">
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  TOTAL TEACHERS
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {dashboardData.statistics.totalTeachers}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <School fontSize="small" />
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Student-Teacher Ratio: 18:1
                </Typography>
              </Box>
            </StatsCard>
          </Grid>

          {/* Total Staff */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <StatsCard gradient="linear-gradient(135deg, #8b5cf6, #7c3aed)">
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  TOTAL STAFF
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {dashboardData.statistics.totalStaff}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <People fontSize="small" />
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Support & Admin
                </Typography>
              </Box>
            </StatsCard>
          </Grid>

          {/* Total Classes */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <StatsCard gradient="linear-gradient(135deg, #f59e0b, #d97706)">
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  TOTAL CLASSES
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {dashboardData.statistics.totalClasses}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <MenuBook fontSize="small" />
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Sections: A, B, C, D
                </Typography>
              </Box>
            </StatsCard>
          </Grid>

          {/* Attendance Rate */}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <StatsCard gradient="linear-gradient(135deg, #06b6d4, #0891b2)">
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  ATTENDANCE RATE
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {dashboardData.statistics.attendanceRate}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={dashboardData.statistics.attendanceRate}
                sx={{
                  height: 5,
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.3)",
                  "& .MuiLinearProgress-bar": { bgcolor: "white" },
                }}
              />
            </StatsCard>
          </Grid>

          {/* Pass Percentage */}
          {/* <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <StatsCard gradient="linear-gradient(135deg, #ec4899, #db2777)">
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  PASS PERCENTAGE
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {dashboardData.statistics.passPercentage}%
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingUp fontSize="small" />
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  +5.2% from last year
                </Typography>
              </Box>
            </StatsCard>
          </Grid> */}
        </Grid>

        {/* ================= FINANCIAL OVERVIEW ================= */}
        <Box mt={5}>
          <Card sx={{ 
            p: 3, 
            borderRadius: 4, 
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "white", mb: 2 }}>
              Financial Overview (₹ in Thousands)
            </Typography>
            <Box sx={{ width: "100%", height: 400 }}>
              <Line
                data={revenueChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: { color: "white" }
                    }
                  },
                  scales: {
                    x: {
                      ticks: { color: "rgba(255,255,255,0.7)" },
                      grid: { color: "rgba(255,255,255,0.1)" }
                    },
                    y: {
                      ticks: { color: "rgba(255,255,255,0.7)" },
                      grid: { color: "rgba(255,255,255,0.1)" }
                    }
                  }
                }}
              />
            </Box>
          </Card>
        </Box>

        {/* ================= ATTENDANCE & CLASS DISTRIBUTION ================= */}
        <Grid container spacing={3} mt={1}>
          {/* Attendance Trend */}
          <Grid size={{ xs: 12, md: 7 }}>
            <InfoCard>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "white", mb: 2 }}>
                Weekly Attendance Trend
              </Typography>
              <Box sx={{ height: 350 }}>
                <Line
                  data={attendanceChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: { color: "white" }
                      }
                    },
                    scales: {
                      x: {
                        ticks: { color: "rgba(255,255,255,0.7)" },
                        grid: { color: "rgba(255,255,255,0.1)" }
                      },
                      y: {
                        ticks: { color: "rgba(255,255,255,0.7)" },
                        grid: { color: "rgba(255,255,255,0.1)" },
                        min: 80,
                        max: 100,
                      }
                    }
                  }}
                />
              </Box>
            </InfoCard>
          </Grid>

          {/* Finance Pie Chart */}
          <Grid size={{ xs: 12, md: 5 }}>
            <InfoCard>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "white", mb: 2 }}>
                Revenue vs Expenses
              </Typography>
              <Box sx={{ height: 300, display: "flex", justifyContent: "center" }}>
                <Doughnut
                  data={revenueExpenseComparisonData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: { color: "white" }
                      }
                    }
                  }}
                />
              </Box>
              <Box mt={2} display="flex" justifyContent="space-around">
                <Box textAlign="center">
                  <Typography variant="body2" sx={{ color: "#10b981" }}>Revenue</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "white" }}>
                    ₹{(dashboardData.statistics.totalRevenue / 100000).toFixed(1)}L
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="body2" sx={{ color: "#ef4444" }}>Expenses</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "white" }}>
                    ₹{(dashboardData.statistics.totalExpenses / 100000).toFixed(1)}L
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="body2" sx={{ color: "#f59e0b" }}>Profit</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "white" }}>
                    ₹{(dashboardData.statistics.profit / 100000).toFixed(1)}L
                  </Typography>
                </Box>
              </Box>
            </InfoCard>
          </Grid>
        </Grid>

        {/* ================= CLASS DISTRIBUTION & SUBJECT PERFORMANCE ================= */}
        <Grid container spacing={3} mt={1}>
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "white", mb: 2 }}>
                Class-wise Student Distribution (Top 10)
              </Typography>
              <Box sx={{ height: 400 }}>
                <Bar
                  data={classDistributionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: { color: "white" }
                      }
                    },
                    scales: {
                      x: {
                        ticks: { color: "rgba(255,255,255,0.7)" },
                        grid: { color: "rgba(255,255,255,0.1)" }
                      },
                      y: {
                        ticks: { color: "rgba(255,255,255,0.7)" },
                        grid: { color: "rgba(255,255,255,0.1)" }
                      }
                    }
                  }}
                />
              </Box>
            </InfoCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "white", mb: 2 }}>
                Subject-wise Average Marks
              </Typography>
              <Box sx={{ height: 400 }}>
                <Bar
                  data={subjectPerformanceData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: { color: "white" }
                      }
                    },
                    scales: {
                      x: {
                        ticks: { color: "rgba(255,255,255,0.7)" },
                        grid: { color: "rgba(255,255,255,0.1)" }
                      },
                      y: {
                        ticks: { color: "rgba(255,255,255,0.7)" },
                        grid: { color: "rgba(255,255,255,0.1)" },
                        min: 60,
                        max: 100,
                      }
                    },
                    indexAxis: 'y',
                  }}
                />
              </Box>
            </InfoCard>
          </Grid>
        </Grid>

        {/* ================= TOP PERFORMERS & RECENT ACTIVITIES ================= */}
        <Grid container spacing={3} mt={1}>
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "white", mb: 2 }}>
                🏆 Top Performing Students
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 3, bgcolor: "transparent" }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "rgba(255,255,255,0.05)" }}>
                      <TableCell sx={{ color: "white" }}><b>Rank</b></TableCell>
                      <TableCell sx={{ color: "white" }}><b>Student Name</b></TableCell>
                      <TableCell sx={{ color: "white" }}><b>Class</b></TableCell>
                      <TableCell sx={{ color: "white" }}><b>Percentage</b></TableCell>
                      <TableCell sx={{ color: "white" }}><b>Top Subjects</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.topPerformers.map((student) => (
                      <TableRow key={student.rank} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03)" } }}>
                        <TableCell sx={{ color: "white" }}>
                          <Chip
                            label={`#${student.rank}`}
                            size="small"
                            sx={{
                              bgcolor: student.rank === 1 ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.1)",
                              color: student.rank === 1 ? "#f59e0b" : "white",
                              fontWeight: "bold"
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>{student.name}</TableCell>
                        <TableCell sx={{ color: "white" }}>{student.class}</TableCell>
                        <TableCell sx={{ color: "#10b981", fontWeight: "bold" }}>{student.percentage}%</TableCell>
                        <TableCell>
                          {student.subjects.map((sub, idx) => (
                            <Chip
                              key={idx}
                              label={sub}
                              size="small"
                              sx={{ mr: 0.5, bgcolor: "rgba(59,130,246,0.2)", color: "#60a5fa" }}
                            />
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </InfoCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "white", mb: 2 }}>
                📋 Recent Activities
              </Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    {dashboardData.recentActivities.map((activity) => (
                      <TableRow key={activity.id} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03)" } }}>
                        <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Box>
                              <Typography variant="body2" sx={{ color: "white", fontWeight: "medium" }}>
                                {activity.activity}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                                {new Date(activity.date).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Box ml="auto">
                              <Chip
                                label={activity.status}
                                size="small"
                                sx={{
                                  bgcolor: `${getStatusColor(activity.status)}20`,
                                  color: getStatusColor(activity.status),
                                }}
                              />
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </InfoCard>
          </Grid>
        </Grid>

        {/* ================= UPCOMING EVENTS & NOTICES ================= */}
        <Grid container spacing={3} mt={1}>
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "white", mb: 2 }}>
                📅 Upcoming Events
              </Typography>
              {dashboardData.upcomingEvents.map((event) => (
                <Box key={event.id} sx={{ mb: 2, p: 2, bgcolor: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={2}>
                      <CalendarToday sx={{ color: "#f59e0b" }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ color: "white", fontWeight: "bold" }}>
                          {event.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                          📍 {event.venue} • 🕒 {event.time}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#f59e0b" }}>
                          {new Date(event.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton size="small" sx={{ color: "white" }}>
                      <MoreVert />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </InfoCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "white", mb: 2 }}>
                📢 Notice Board
              </Typography>
              {dashboardData.notices.map((notice) => (
                <Box key={notice.id} sx={{ mb: 2, p: 2, bgcolor: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <AttachFile sx={{ color: getPriorityColor(notice.priority) }} />
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle1" sx={{ color: "white", fontWeight: "bold" }}>
                          {notice.title}
                        </Typography>
                        <Chip
                          label={notice.priority}
                          size="small"
                          sx={{
                            bgcolor: `${getPriorityColor(notice.priority)}20`,
                            color: getPriorityColor(notice.priority),
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mt: 0.5 }}>
                        {notice.content}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", mt: 1, display: "block" }}>
                        {new Date(notice.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </InfoCard>
          </Grid>
        </Grid>

        {/* ================= TRANSPORT & CANTEEN STATS ================= */}
        <Grid container spacing={3} mt={1} mb={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "white", mb: 2 }}>
                🚌 Transport Department
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Box textAlign="center" p={2} bgcolor="rgba(255,255,255,0.05)" borderRadius={2}>
                    <DirectionsBus sx={{ fontSize: 40, color: "#3b82f6" }} />
                    <Typography variant="h4" fontWeight="bold" sx={{ color: "white" }}>
                      {dashboardData.transportStats.totalBuses}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                      Total Buses
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box textAlign="center" p={2} bgcolor="rgba(255,255,255,0.05)" borderRadius={2}>
                    <People sx={{ fontSize: 40, color: "#10b981" }} />
                    <Typography variant="h4" fontWeight="bold" sx={{ color: "white" }}>
                      {dashboardData.transportStats.studentsTransport}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                      Students Transporting
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box textAlign="center" p={2} bgcolor="rgba(255,255,255,0.05)" borderRadius={2}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: "white" }}>
                      {dashboardData.transportStats.totalRoutes}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                      Total Routes
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box textAlign="center" p={2} bgcolor="rgba(255,255,255,0.05)" borderRadius={2}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: "white" }}>
                      {dashboardData.transportStats.drivers}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                      Drivers
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </InfoCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "white", mb: 2 }}>
                🍽️ Canteen Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Box textAlign="center" p={2} bgcolor="rgba(255,255,255,0.05)" borderRadius={2}>
                    <AttachMoney sx={{ fontSize: 40, color: "#f59e0b" }} />
                    <Typography variant="h4" fontWeight="bold" sx={{ color: "white" }}>
                      ₹{dashboardData.canteenStats.dailySales.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                      Daily Sales
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box textAlign="center" p={2} bgcolor="rgba(255,255,255,0.05)" borderRadius={2}>
                    <TrendingUp sx={{ fontSize: 40, color: "#10b981" }} />
                    <Typography variant="h4" fontWeight="bold" sx={{ color: "white" }}>
                      ₹{(dashboardData.canteenStats.monthlySales / 1000).toFixed(0)}K
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                      Monthly Sales
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box textAlign="center" p={2} bgcolor="rgba(255,255,255,0.05)" borderRadius={2}>
                    <Restaurant sx={{ fontSize: 40, color: "#8b5cf6" }} />
                    <Typography variant="h4" fontWeight="bold" sx={{ color: "white" }}>
                      {dashboardData.canteenStats.totalItems}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                      Menu Items
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box textAlign="center" p={2} bgcolor="rgba(255,255,255,0.05)" borderRadius={2}>
                    <People sx={{ fontSize: 40, color: "#ec4899" }} />
                    <Typography variant="h4" fontWeight="bold" sx={{ color: "white" }}>
                      {dashboardData.canteenStats.staff}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                      Canteen Staff
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </InfoCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SchoolDashboard;