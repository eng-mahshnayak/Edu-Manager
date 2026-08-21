
import { Routes, Route } from "react-router-dom";

import Login from "./common/Login";
import Signup from "./common/Signup";
import Layout from "./components/layout/Layout";




import UserTable from "./pages/users/UserTable";
import UserForm from "./pages/users/UserForm";


import ForgotPassword from "./common/ForgotPassword";
import VerifyOTP from "./common/VerifyOTP";
import ResetPassword from "./common/ResetPassword";

// Import route protection components
import ProtectedRoute from "./route/protectedRoute";
import PublicRoute from "./route/PublicRoute";

import { Toaster } from "react-hot-toast";



// Import 404 Page
import NotFound from "./pages/NotFound";

import Reports from "./pages/Reports";
import TeachersManagement from "./pages/StaffManagement";
import StudentsAdmission from "./pages/StudentsAdmission";
// import DrawingAI from "./pages/DrawingAI";
import ClassSectionManagement from "./pages/ClassSectionManagement";
import StaffAttendanceManagement from "./pages/StaffAttendanceManagement";
import MonthlyAttendanceReport from "./pages/MonthlyAttendanceReport";
import ExpenseManagement from "./pages/ExpenseManagement";
import NoticesAnnouncements from "./pages/NoticesAnnouncements";
import HomeworkManagement from "./pages/HomeworkManagement";
import UserManagement from "./pages/UserManagement";
import SchoolDashboard from "./pages/Dashboard";
import QuestionPaperGenerator from "./pages/QuestionPaperGenerator";
// import LeaveCalendar from "./pages/LeaveCalendar";
import StudentAdmissionCard from "./pages/StudentAdmissionCard";
import TransferCertificate from "./pages/TransferCertificate";
import AIStoryGenerator from "./pages/SimpleAIQuestionPaper";
import DescriptionInputPage from "./pages/DescriptionInputPage";
import MemoryGame from "./pages/MemoryGame";
import QuizGenerator from "./pages/QuizGenerator";
import ExploreDropdown from "./pages/ExploreDropdown";
import DrawingApp from "./pages/DrawingApp";
import ProblemSolver from "./pages/ProblemSolver";
import StudentTreeView from "./pages/StudentTreeView";
import LeaveCalendar from "./pages/LeaveCalendar";
import StoryBuilder from "./pages/GameLibrary";





function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* Public Routes - accessible only when NOT logged in */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protected Routes - accessible only when logged in */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route path="/dashboard" element={<SchoolDashboard />} />



      <Route path="/reports" element={<Reports />} />




{/*  working routes  */}


        <Route path="/staff" element={<TeachersManagement />} />
         <Route path="/students" element={<StudentsAdmission />} />

 <Route path="/studentsfeeview" element={<StudentTreeView />} />

  <Route path="/studentleave" element={<LeaveCalendar />} />

    <Route path="/learning/storybuilder" element={<StoryBuilder />} />
         


         
      
{/*  working routes end   */}




      
           {/* <Route path="/classes" element={<DrawingAI />} /> */}

            <Route path="/classes" element={<ClassSectionManagement />} />

              <Route path="/attendance/mark" element={<StaffAttendanceManagement />} />

               <Route path="/attendance/summary" element={<MonthlyAttendanceReport />} />
           
            <Route path="/expenses" element={<ExpenseManagement />} />

               <Route path="/notices" element={<NoticesAnnouncements />} />
               <Route path="/homework" element={<HomeworkManagement />} />

             <Route path="/users" element={<UserManagement />} />

               <Route path="/learning/quiz-generator" element={<QuestionPaperGenerator />} />

               

                 <Route path="/learning/story-generator" element={<AIStoryGenerator />} />

                  <Route path="/learning/test121" element={<DescriptionInputPage />} />

                  <Route path="/learning/memory-games" element={<MemoryGame />} />


                    <Route path="/learning/drawing-studio" element={<DrawingApp />} />

                     <Route path="/learning/problem-solver" element={<ProblemSolver />} />



                   

                   

                

                    <Route path="/learning/quiz-generator" element={<QuizGenerator />} />



 <Route path="/ai-learn/courses" element={<ExploreDropdown />} />
               




                 {/* <Route path="/leavecalendar" element={<LeaveCalendar />} /> */}

                   <Route path="/exams/admit-card" element={<StudentAdmissionCard />} />
                    <Route path="/transfercertificate" element={<TransferCertificate />} />






            {/* Users Routes */}
            <Route path="users/list" element={<UserTable />} />
            <Route path="users/create" element={<UserForm isStandalone={true} />} />
           


    
      
            
          </Route>
        </Route>

          {/* Optional: Catch-all for public routes (if someone tries to access non-existent public route) */}
        <Route path="*" element={<NotFound />} />
        
      </Routes>
    </>
  );
}

export default App;