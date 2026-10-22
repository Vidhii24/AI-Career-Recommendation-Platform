import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  ChevronDown,
  Menu,
  X,
  User,
  Sliders,
  RotateCcw,
  LogOut,
  Sparkles
} from 'lucide-react';
import { UserAccount } from '../types';

interface NavbarProps {
  isAuthenticated: boolean;
  currentUser: UserAccount | null;
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
  onEditProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated,
  currentUser,
  currentView,
  setCurrentView,
  onOpenAuth,
  onLogout,
  onEditProfile
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation Links based on authentication status
  const navLinks = isAuthenticated
    ? [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'domains', label: 'Explore Domains' },
        { id: 'roadmaps', label: 'My Roadmap' }
      ]
    : [
        { id: 'landing', label: 'Home' },
        { id: 'domains', label: 'Explore Domains' }
      ];

  const handleLinkClick = (id: string) => {
    setCurrentView(id);
    setMobileMenuOpen(false);
  };

  const getUserInitial = () => {
    if (currentUser?.name && currentUser.name.trim().length > 0) {
      return currentUser.name.trim().charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div
          onClick={() => setCurrentView(isAuthenticated ? 'dashboard' : 'landing')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center shadow-xs group-hover:bg-brand-700 transition-colors">
            <Compass className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
              CareerCompass
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-slate-100 text-slate-600 border border-slate-200">
              AI
            </span>
          </div>
        </div>

        {/* Center: Primary Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = currentView === link.id;

            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-sm font-medium transition-colors cursor-pointer relative py-1 ${
                  isActive
                    ? 'text-brand-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Authentication or Authenticated Profile Menu */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 py-1.5 pl-2.5 pr-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-800 cursor-pointer shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-[11px]">
                  {getUserInitial()}
                </div>
                <span className="max-w-[140px] truncate">{currentUser?.name || 'Student Account'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    profileMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3.5 py-2.5 border-b border-slate-100">
                    <p className="font-bold text-slate-900 truncate">{currentUser?.name || 'Student'}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{currentUser?.email}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        if (onEditProfile) onEditProfile();
                        else setCurrentView('assessment');
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Sliders className="w-3.5 h-3.5 text-slate-400" />
                      <span>Edit Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        setCurrentView('assessment');
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                      <span>Retake Assessment</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      <span className="font-semibold">Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 animate-in fade-in duration-100">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium cursor-pointer ${
                currentView === link.id
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}

          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
              <div className="px-3 py-1 font-bold text-slate-900">{currentUser?.name}</div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onEditProfile) onEditProfile();
                  else setCurrentView('assessment');
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Edit Profile
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-semibold"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="flex-1 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('signup');
                }}
                className="flex-1 py-2 rounded-lg bg-brand-600 text-white text-xs font-semibold"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
