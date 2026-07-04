import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  MenuIcon,
  UserRoleIcon,
  ReportIcon,
  DashboardIcon,
  PaymentIcon,
  InventoryIcon,
  EmployeeIcon,
  CustomerIcon,
  LogoutIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "../common/Icons";

// School Management Icons
const StudentsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const TeachersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ClassesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const AttendanceIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ExamsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const MarksIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);

const FeesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TimetableIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const HomeworkIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const LibraryIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const TransportIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2m16-8V9a4 4 0 00-4-4h-6a4 4 0 00-4 4v4m8 0v4a4 4 0 01-4 4H6a4 4 0 01-4-4v-4m8-8V3a2 2 0 00-2-2H6a2 2 0 00-2 2v4m12 0h2a2 2 0 012 2v4" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SupportIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const NoticeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const HolidayIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = React.useState<{ [key: string]: boolean }>({});

  // Auto close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  }, [location.pathname]);

  const toggleDropdown = (key: string) => {
    setOpenDropdowns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Check if any child route is active
  const isParentActive = (routes: string[]) => {
    return routes.some(route => location.pathname.startsWith(route));
  };

  // Handle WhatsApp click
  const handleWhatsAppClick = () => {
    const phoneNumber = "918319312507";
    const message = "Hello! I need support with EduManager.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          fixed lg:static top-0 left-0 h-full z-40
          bg-gradient-to-b from-gray-900 via-indigo-900 to-blue-900
          text-white border-r border-gray-700
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isOpen ? "w-64" : "w-20"}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          {isOpen && (
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l11 6 11-6-11-6zM1 15l11 6 11-6M1 12l11 6 11-6" />
              </svg>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Edu<span className="text-blue-400">Manager</span>
              </span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded hover:bg-white/10 transition-all duration-200"
          >
            <MenuIcon />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {/* Dashboard */}
          <SidebarItem
            to="/dashboard"
            icon={<DashboardIcon />}
            label="Dashboard"
            isOpen={isOpen}
          />

          {/* Academic Section */}
          <div className="px-2 mt-2">
            {isOpen && (
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Academic
              </p>
            )}
          </div>

          {/* Students */}
          <SidebarItem
            to="/students"
            icon={<StudentsIcon />}
            label="Students"
            isOpen={isOpen}
          />

          {/* Teachers */}
          <SidebarItem
            to="/teachers"
            icon={<TeachersIcon />}
            label="Teachers"
            isOpen={isOpen}
          />

          {/* Classes & Sections */}
          <SidebarItem
            to="/classes"
            icon={<ClassesIcon />}
            label="Classes & Sections"
            isOpen={isOpen}
          />

          {/* Attendance Dropdown */}
          <SidebarDropdown
            to="/attendance"
            icon={<AttendanceIcon />}
            label="Attendance"
            isOpen={isOpen}
            isDropdownOpen={openDropdowns['attendance']}
            onToggle={() => toggleDropdown('attendance')}
            isActive={isParentActive(['/attendance'])}
            subItems={[
              { to: "/attendance/mark", label: "Mark Attendance" },
              // { to: "/attendance/report", label: "Attendance Report" },
              { to: "/attendance/summary", label: "Monthly Summary" },
            ]}
          />

          {/* Exams Dropdown */}
          <SidebarDropdown
            to="/exams"
            icon={<ExamsIcon />}
            label="Exams"
            isOpen={isOpen}
            isDropdownOpen={openDropdowns['exams']}
            onToggle={() => toggleDropdown('exams')}
            isActive={isParentActive(['/exams'])}
            subItems={[
              { to: "/exams/schedule", label: "Exam Schedule" },
              { to: "/exams/admit-card", label: "Admit Card" },
              { to: "/exams/routine", label: "Exam Routine" },
            ]}
          />

          {/* Marks & Grades */}
          <SidebarItem
            to="/marks"
            icon={<MarksIcon />}
            label="Marks & Grades"
            isOpen={isOpen}
          />

          {/* Timetable */}
          <SidebarItem
            to="/timetable"
            icon={<TimetableIcon />}
            label="Timetable"
            isOpen={isOpen}
          />

          {/* Homework */}
          <SidebarItem
            to="/homework"
            icon={<HomeworkIcon />}
            label="Homework"
            isOpen={isOpen}
          />

          {/* Financial Section */}
          <div className="px-2 mt-4">
            {isOpen && (
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Financial
              </p>
            )}
          </div>

          {/* Fee Management */}
          {/* <SidebarDropdown
            to="/fees"
            icon={<FeesIcon />}
            label="Fee Management"
            isOpen={isOpen}
            isDropdownOpen={openDropdowns['fees']}
            onToggle={() => toggleDropdown('fees')}
            isActive={isParentActive(['/fees'])}
            subItems={[
              { to: "/fees/structure", label: "Fee Structure" },
              { to: "/fees/collection", label: "Fee Collection" },
              { to: "/fees/dues", label: "Fee Dues" },
              { to: "/fees/reports", label: "Fee Reports" },
            ]}
          /> */}

          {/* Expenses */}
          <SidebarItem
            to="/expenses"
            icon={<PaymentIcon />}
            label="Expenses"
            isOpen={isOpen}
          />

       

          {/* Communication Section */}
          <div className="px-2 mt-4">
            {isOpen && (
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Communication
              </p>
            )}
          </div>

          {/* Notices */}
          <SidebarItem
            to="/notices"
            icon={<NoticeIcon />}
            label="Notices & Announcements"
            isOpen={isOpen}
          />

          {/* Holidays */}
          {/* <SidebarItem
            to="/holidays"
            icon={<HolidayIcon />}
            label="Holidays"
            isOpen={isOpen}
          /> */}

          {/* Reports Section */}
          <div className="px-2 mt-4">
            {isOpen && (
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Reports
              </p>
            )}
          </div>

          {/* Reports */}
          <SidebarItem
            to="/reports"
            icon={<ReportIcon />}
            label="Reports"
            isOpen={isOpen}
          />

          {/* Settings Section */}
          <div className="px-2 mt-4">
            {isOpen && (
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Administration
              </p>
            )}
          </div>

          {/* Users Management */}
          <SidebarItem
            to="/users"
            icon={<UserRoleIcon />}
            label="Users Management"
            isOpen={isOpen}
          />

          {/* Settings */}
          <SidebarItem
            to="/settings"
            icon={<SettingsIcon />}
            label="AI Assist"
            isOpen={isOpen}
          />

          {/* Support */}
          {isOpen ? (
            <button
              onClick={handleWhatsAppClick}
              className="w-full flex items-center gap-4 px-4 py-3 my-1 mx-2 rounded-lg transition-all hover:bg-white/10 text-left"
            >
              <SupportIcon />
              <span>24/7 Support</span>
            </button>
          ) : (
            <div className="relative group">
              <button
                onClick={handleWhatsAppClick}
                className="w-full flex items-center justify-center px-4 py-3 my-1 mx-2 rounded-lg transition-all hover:bg-white/10"
              >
                <SupportIcon />
              </button>
              <div className="absolute left-full top-0 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-50">
                24/7 Support
              </div>
            </div>
          )}
        </nav>

        {isOpen && (
          <div className="p-4 text-sm text-gray-500 border-t border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

interface ItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  customActive?: boolean;
}

const SidebarItem: React.FC<ItemProps> = ({
  to,
  icon,
  label,
  isOpen,
  customActive,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-3 my-1 mx-2 rounded-lg transition-all ${
          (isActive || customActive) 
            ? "bg-blue-500/20 border-l-4 border-blue-500" 
            : "hover:bg-white/10"
        }`
      }
    >
      <div className="text-blue-400">{icon}</div>
      {isOpen && <span>{label}</span>}
    </NavLink>
  );
};

interface DropdownProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  isDropdownOpen: boolean;
  onToggle: () => void;
  isActive: boolean;
  subItems: Array<{ to: string; label: string }>;
}

const SidebarDropdown: React.FC<DropdownProps> = ({
  to,
  icon,
  label,
  isOpen,
  isDropdownOpen,
  onToggle,
  isActive,
  subItems,
}) => {
  const location = useLocation();

  return (
    <div>
      <button
        onClick={onToggle}
        className={`
          w-full flex items-center justify-between gap-4 px-4 py-3 my-1 mx-2 rounded-lg transition-all
          ${isActive || isDropdownOpen ? "bg-blue-500/20 border-l-4 border-blue-500" : "hover:bg-white/10"}
        `}
      >
        <div className="flex items-center gap-4">
          <div className="text-blue-400">{icon}</div>
          {isOpen && <span>{label}</span>}
        </div>
        {isOpen && (
          <div className="text-gray-400">
            {isDropdownOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </div>
        )}
      </button>
      
      {isOpen && isDropdownOpen && (
        <div className="ml-8 mt-1 space-y-1">
          {subItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block px-4 py-2 text-sm rounded-lg transition-all ${
                  isActive
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;