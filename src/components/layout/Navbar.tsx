import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Mic,
  Bell,
  Sun,
  Moon,
  DollarSign,
  ChevronDown,
  LogOut,
  Settings as SettingsIcon,
  X,
  Menu,
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const {
    user,
    setUser,
    darkMode,
    setDarkMode,
    currency,
    setCurrency,
    setIsCommandPaletteOpen,
    setIsVoiceAssistantOpen,
    showToast,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const notifications = [
    { id: '1', title: 'Proposal Generated', desc: 'Upwork proposal for React project ready', time: '5m ago' },
    { id: '2', title: 'Scam Risk Passed', desc: 'Client conversation verified safe (94% Trust)', time: '1h ago' },
    { id: '3', title: 'Invoice Paid', desc: 'Invoice #108 ($1,200) marked paid', time: '3h ago' },
  ];

  const handleLogout = () => {
    setUser({ ...user, isLoggedIn: false });
    showToast('Logged out of FreelanceIQ OS', 'info');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 flex-shrink-0 flex items-center justify-between px-3 sm:px-6 lg:px-8 bg-white/[0.02] border-b border-white/10 backdrop-blur-xl">
      {/* Left: Mobile Menu Toggle & Search */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Button */}
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition shrink-0"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Search & Command Palette Trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2 sm:gap-3 bg-white/5 border border-white/10 px-3 sm:px-4 py-1.5 rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition w-36 sm:w-64 md:w-80 lg:w-96 text-xs"
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate">Search AI tools...</span>
          <span className="hidden sm:inline-block ml-auto text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-400 font-mono tracking-tighter shrink-0">
            ⌘ K
          </span>
        </button>

        {/* Voice Assistant Trigger */}
        <button
          onClick={() => setIsVoiceAssistantOpen(true)}
          className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
          title="Voice Assistant"
        >
          <Mic className="w-4 h-4 text-indigo-400 animate-pulse shrink-0" />
          <span className="hidden md:inline text-xs">Voice AI</span>
        </button>
      </div>

      {/* Right Navbar Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Currency Selector */}
        <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full px-2 sm:px-2.5 py-1">
          <DollarSign className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as any)}
            className="bg-transparent text-[11px] sm:text-xs font-medium text-slate-200 focus:outline-none cursor-pointer pr-1"
          >
            <option value="USD" className="bg-[#111827] text-slate-100">USD ($)</option>
            <option value="PKR" className="bg-[#111827] text-slate-100">PKR (Rs)</option>
            <option value="EUR" className="bg-[#111827] text-slate-100">EUR (€)</option>
          </select>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition shrink-0"
          title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 relative transition shrink-0"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500" />
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#111827]/95 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                <span className="text-xs font-bold text-white">Activity Notifications</span>
                <button onClick={() => setIsNotifOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-200">{n.title}</span>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-1.5 sm:gap-2 p-1 rounded-full hover:bg-white/5 transition"
          >
            <div className="h-8 w-8 rounded-full border border-indigo-500/50 p-0.5">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 sm:w-56 bg-[#111827]/95 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>

              <button
                onClick={() => {
                  navigate('/app/settings');
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 rounded-xl transition text-left"
              >
                <SettingsIcon className="w-4 h-4 text-indigo-400" />
                <span>Account Settings</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition text-left mt-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
