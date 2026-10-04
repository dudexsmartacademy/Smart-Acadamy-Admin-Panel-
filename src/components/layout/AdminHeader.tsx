import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  Search,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  ChevronDown,
  CheckCheck,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { notificationService } from '../../services/notificationService';
import { NotificationItem } from '../../types';
import { Link, useNavigate } from 'react-router-dom';

export interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenSearch: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleMobileMenu,
  isCollapsed,
  onToggleCollapse,
  onOpenSearch,
}) => {
  const { admin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Load notifications
  const reloadNotifs = () => {
    notificationService.getNotifications().then((list) => {
      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.read).length);
    });
  };

  useEffect(() => {
    reloadNotifs();
  }, [isNotifOpen]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    reloadNotifs();
  };

  const handleNotifClick = async (notif: NotificationItem) => {
    await notificationService.markAsRead(notif.id);
    reloadNotifs();
    setIsNotifOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#111111]/90 backdrop-blur-md border-b border-[#3A2922] px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile menu toggle + Desktop collapse toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 -ml-2 text-[#A89A91] hover:text-[#F5F0EA] rounded-lg hover:bg-[#2A1710]/40 lg:hidden cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-2 text-[#A89A91] hover:text-[#F5F0EA] rounded-lg hover:bg-[#2A1710]/40 transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>

        {/* Global Search trigger button */}
        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-lg bg-[#171311] hover:bg-[#1F1916] text-[#A89A91] hover:text-[#F5F0EA] border border-[#3A2922] transition-colors text-xs cursor-pointer w-48 md:w-64"
        >
          <Search className="w-3.5 h-3.5 text-[#946246]" />
          <span className="truncate">Search system...</span>
          <kbd className="ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#2A1710] border border-[#3A2922] text-[#A89A91]">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Action Icons: Search (mobile), Theme, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile search icon */}
        <button
          onClick={onOpenSearch}
          className="p-2 text-[#A89A91] hover:text-[#F5F0EA] rounded-lg hover:bg-[#2A1710]/40 sm:hidden cursor-pointer"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-[#A89A91] hover:text-[#F5F0EA] rounded-lg hover:bg-[#2A1710]/40 transition-colors cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notification dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="relative p-2 text-[#A89A91] hover:text-[#F5F0EA] rounded-lg hover:bg-[#2A1710]/40 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-[#0B0B0B] text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#171311] border border-[#3A2922] rounded-2xl shadow-2xl py-2 z-50 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#3A2922]">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#F5F0EA]">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5A321F] text-[#F1E5D8]">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-[#946246] hover:text-[#F1E5D8] flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#3A2922]/50">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#A89A91]">No notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotifClick(notif)}
                      className={`p-3.5 hover:bg-[#2A1710]/40 transition-colors cursor-pointer flex items-start gap-3 ${
                        !notif.read ? 'bg-[#2A1710]/20' : ''
                      }`}
                    >
                      <div className="shrink-0 mt-1">
                        <span
                          className={`w-2 h-2 rounded-full inline-block ${
                            !notif.read ? 'bg-amber-400' : 'bg-transparent'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs ${!notif.read ? 'font-bold text-[#F5F0EA]' : 'text-[#A89A91]'}`}>
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-[#A89A91]/80 mt-0.5 leading-relaxed line-clamp-2">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Admin profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1 sm:p-1.5 rounded-xl hover:bg-[#2A1710]/40 border border-transparent hover:border-[#3A2922] transition-colors cursor-pointer"
            aria-label="Admin account menu"
          >
            <div className="w-8 h-8 rounded-full bg-[#2A1710] border border-[#5A321F]/80 flex items-center justify-center text-xs font-bold text-[#F1E5D8]">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#F5F0EA] leading-none">
                {admin?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-[#A89A91] mt-1 leading-none">{admin?.role || 'Super Admin'}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#A89A91] hidden sm:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#171311] border border-[#3A2922] rounded-2xl shadow-2xl py-2 z-50 animate-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-[#3A2922]">
                <p className="text-xs font-bold text-[#F5F0EA] truncate">{admin?.name}</p>
                <p className="text-[11px] text-[#A89A91] truncate mt-0.5">{admin?.email}</p>
              </div>

              <div className="p-1 space-y-0.5">
                <Link
                  to="/admin/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#F5F0EA] hover:bg-[#2A1710]/60 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4 text-[#946246]" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/admin/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#F5F0EA] hover:bg-[#2A1710]/60 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#946246]" />
                  <span>Admin Settings</span>
                </Link>
              </div>

              <div className="pt-1 mt-1 border-t border-[#3A2922] p-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
