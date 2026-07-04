




import React, { useState, useRef, useEffect } from "react";
import { UserIcon, LogoutIcon } from "../common/Icons";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  toggleSidebar: () => void;
  pageTitle?: string;
}

const Header: React.FC<HeaderProps> = ({
  toggleSidebar,
  pageTitle = "Dashboard",
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();


  const [user, setUser] = useState<any>(null);

useEffect(() => {
  const storedUser = localStorage.getItem("erpuser");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
}, []);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("erptoken");
    localStorage.removeItem("erpuser");
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 w-full">
      <div className="flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16 relative">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle (Mobile only) */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          {/* Page Title */}
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {pageTitle}
          </h1>
        </div>

        {/* RIGHT SIDE */}
        <div
          className="flex items-center gap-3 relative"
          ref={dropdownRef}
        >
          {/* Username hidden on mobile */}
          <span className="hidden md:block text-sm font-medium text-gray-700">
            {user?.name || "User"}
          </span>

          {/* Avatar */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex items-center justify-center hover:shadow-md transition"
          >
            <UserIcon />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fadeIn">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                 {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                    {user?.email || "user@gmail.com"}
                  
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
              >
                <LogoutIcon />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;
