import { Link, Outlet } from "react-router";
import { useState } from "react";
import WalletButton from "@/components/wallet/WalletButton";
import logo from "/World_IP_logo.svg";
import { LayoutDashboard, Settings, HelpCircle, BookOpen } from 'lucide-react';

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="max-w-8xl mx-auto min-h-dvh bg-white flex flex-col">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-4 md:px-16 sticky top-0 z-30 bg-white" style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)' }}>
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger Menu */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          
        <div className="self-start pb-8 pt-12">
            <img src={logo} alt="logo" className="h-8 md:h-auto" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Upload Button - Desktop Only */}
          <Link
            to="/create-hash"
            className="hidden md:flex items-center gap-2 bg-[#FF9519] hover:bg-[#E6850F] text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M8 12L8 4M8 4L5 7M8 4L11 7M2 2L14 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Upload
          </Link>
          <WalletButton />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <img src={logo} alt="logo" className="h-8" />
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                />
              </svg>
                </button>
              </div>
              
              <ul className="space-y-6">
                <li className="flex gap-3 items-center">
                  <Link
                    to="/dashboard"
                    className="flex gap-3 items-center hover:text-[#5865F2] transition-colors cursor-pointer text-lg"
                    onClick={toggleMobileMenu}
                  >
                    <LayoutDashboard className="w-6 h-6" />
                    Dashboard
                  </Link>
                </li>
                <li className="flex gap-3 items-center">
                  <Link
                    to="/address-book"
                    className="flex gap-3 items-center hover:text-[#5865F2] transition-colors cursor-pointer text-lg"
                    onClick={toggleMobileMenu}
                  >
                    <BookOpen className="w-6 h-6" />
                    Address Book
                  </Link>
                </li>
                <li className="flex gap-3 items-center">
                  <Link
                    to="/settings"
                    className="flex gap-3 items-center hover:text-[#5865F2] transition-colors cursor-pointer text-lg"
                    onClick={toggleMobileMenu}
                  >
                    <Settings className="w-6 h-6" />
                    Settings
                  </Link>
                </li>
                <li className="flex gap-3 items-center">
                  <Link
                    to="/faq"
                    className="flex gap-3 items-center hover:text-[#5865F2] transition-colors cursor-pointer text-lg"
                    onClick={toggleMobileMenu}
                  >
                    <HelpCircle className="w-6 h-6" />
                    FAQs
                  </Link>
            </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="flex grow min-h-0">
        {/* Desktop Sidebar */}
        <div className="hidden md:block sticky top-0 h-[calc(100vh-0px)] bg-white z-20 flex-shrink-0">
          <ul className="p-8 w-fit px-16 space-y-8 whitespace-nowrap">
            <li className="flex gap-2 items-center">
              <Link
                to="/dashboard"
                className="flex gap-2 items-center hover:text-[#5865F2] transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-6 h-6" />
                Dashboard
              </Link>
            </li>
            <li className="flex gap-2 items-center">
              <Link
                to="/address-book"
                className="flex gap-2 items-center hover:text-[#5865F2] transition-colors cursor-pointer"
              >
                <BookOpen className="w-6 h-6" />
                Address Book
              </Link>
            </li>
            <li className="flex gap-2 items-center">
              <Link
                to="/settings"
                className="flex gap-2 items-center hover:text-[#5865F2] transition-colors cursor-pointer"
              >
                <Settings className="w-6 h-6" />
              Settings
              </Link>
            </li>
            <li className="flex gap-2 items-center">
              <Link
                to="/faq"
                className="flex gap-2 items-center hover:text-[#5865F2] transition-colors cursor-pointer"
              >
                <HelpCircle className="w-6 h-6" />
                FAQs
              </Link>
            </li>
          </ul>
        </div>
        {/* Main Content (scrollable) */}
        <div className="flex-1 min-h-0 overflow-y-auto">
        <Outlet />
        </div>
      </div>
      <footer className="border-t border-black/30 px-4 md:px-31.5 py-6 md:py-9 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        <p className="text-[0.875rem] text-[#182537]/70 text-center md:text-left">
          © 2025 Worldip.ai || All rights reserved.
        </p>
        <ul className="flex items-center text-[0.75rem] text-[#182537]/70 font-medium">
          <li className="px-3 md:px-5 border-r border-[#182537]/20">Privacy policy</li>
          <li className="px-3 md:px-5">Terms and conditions</li>
        </ul>
      </footer>
    </div>
  );
};

export default DashboardLayout;
