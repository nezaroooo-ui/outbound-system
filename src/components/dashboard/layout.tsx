'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  FileText, 
  Settings,
  Activity,
  Bell,
  MessageSquare,
  Home,
  Moon,
  Sun,
  Zap,
  Search,
  Filter,
  Plus,
  Download,
  Save,
  RefreshCw,
  ExternalLink,
  Send,
  Play,
  Pause,
  Settings as SettingsIcon,
  User,
  Shield,
  Link2,
  Bell as BellIcon,
  Calendar,
  Mail,
  TrendingUp,
  ChevronRight,
  CheckCircle,
  XCircle,
  Target,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Force dark mode - COMPREHENSIVE READABILITY FIX
const FORCE_DARK = true;

// Design Tokens - High Contrast Dark Mode
const tokens = {
  // Backgrounds
  bgPrimary: 'bg-gray-950',
  bgSecondary: 'bg-gray-900',
  bgTertiary: 'bg-gray-800',
  bgCard: 'bg-gray-900',
  
  // Borders
  borderDefault: 'border-gray-800',
  borderHover: 'border-gray-700',
  borderActive: 'border-blue-500',
  
  // Text - High Contrast
  textPrimary: 'text-white',
  textSecondary: 'text-gray-200',
  textMuted: 'text-gray-400',
  textDisabled: 'text-gray-500',
  
  // Accent colors
  accent: 'text-blue-400',
  accentBg: 'bg-blue-600',
  accentHover: 'hover:bg-blue-700',
  
  // Status colors - HIGH CONTRAST
  success: 'text-green-400',
  successBg: 'bg-green-500',
  warning: 'text-yellow-400',
  warningBg: 'bg-yellow-500',
  error: 'text-red-400',
  errorBg: 'bg-red-500',
  
  // Interactive
  hover: 'hover:bg-gray-800',
  active: 'bg-blue-600',
  
  // Inputs
  inputBg: 'bg-gray-800',
  inputBorder: 'border-gray-700',
  inputText: 'text-white',
  inputPlaceholder: 'placeholder-gray-500',
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(FORCE_DARK);

  useEffect(() => {
    setDarkMode(FORCE_DARK);
    if (FORCE_DARK) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navigation = [
    { name: 'لوحة التحكم', href: '/', icon: Home },
    { name: 'العملاء المحتملين', href: '/pipeline', icon: Users },
    { name: 'الرسائل', href: '/templates', icon: MessageSquare },
    { name: 'التقارير', href: '/reports', icon: FileText },
  ];

  const agentStatus = [
    { name: 'Kareem', status: 'active', color: 'bg-green-500' },
    { name: 'Mazen', status: 'idle', color: 'bg-gray-500' },
    { name: 'Layan', status: 'idle', color: 'bg-gray-500' },
    { name: 'Sara', status: 'idle', color: 'bg-gray-500' },
    { name: 'Hala', status: 'idle', color: 'bg-gray-500' },
    { name: 'Saleem', status: 'active', color: 'bg-green-500' },
  ];

  return (
    <div className={cn('min-h-screen transition-colors duration-200', tokens.bgPrimary)}>
      {/* Top Header */}
      <header className={cn('border-b sticky top-0 z-50 transition-colors duration-200', tokens.bgSecondary, tokens.borderDefault)}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Logo - Click to go home */}
              <button 
                onClick={() => router.push('/')}
                className="flex items-center gap-2 group cursor-pointer"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className={cn('text-lg font-bold transition-colors', tokens.textPrimary, 'group-hover:text-blue-400')}>NK-AI Video</span>
                  <span className={cn('text-xs -mt-1', tokens.textMuted)}>AI Video Production</span>
                </div>
              </button>
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className="text-gray-600">•</span>
                <span className={tokens.textSecondary}>Nezar Kamel</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={cn('p-2 rounded-lg transition-colors', tokens.hover, tokens.textMuted)}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {/* Agent Status */}
              <div className="hidden lg:flex items-center gap-2">
                {agentStatus.slice(0, 5).map((agent) => (
                  <div 
                    key={agent.name}
                    className={cn('flex items-center gap-1.5 px-2 py-1 rounded-full text-xs', tokens.bgTertiary)}
                    title={`${agent.name}: ${agent.status}`}
                  >
                    <div className={cn('w-2 h-2 rounded-full', agent.color)} />
                    <span className={tokens.textSecondary}>{agent.name}</span>
                  </div>
                ))}
                {agentStatus.length > 5 && (
                  <span className={cn('text-xs', tokens.textDisabled)}>+{agentStatus.length - 5}</span>
                )}
              </div>
              
              {/* Notifications */}
              <button className={cn('relative p-2 rounded-lg transition-colors', tokens.hover, tokens.textMuted)}>
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className={cn('flex-1 flex flex-col min-h-0 border-r transition-colors duration-200', tokens.bgSecondary, tokens.borderDefault)}>
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? cn(tokens.accentBg, 'text-white')
                        : cn(tokens.textSecondary, tokens.hover)
                    )}
                  >
                    <item.icon className={cn('w-5 h-5', isActive ? 'text-white' : 'text-gray-400')} />
                    {item.name}
                  </button>
                );
              })}
            </nav>
            
            {/* System Status */}
            <div className={cn('px-4 py-4 border-t transition-colors duration-200', tokens.borderDefault)}>
              <div className={cn('text-xs font-medium mb-3', tokens.textMuted)}>System Health</div>
              <div className="space-y-2">
                {['Sheets', 'Gmail', 'Telegram', 'Database'].map((system) => (
                  <div key={system} className="flex items-center justify-between text-sm">
                    <span className={tokens.textSecondary}>{system}</span>
                    <span className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-green-400">Healthy</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:pl-64">
          <div className={cn('min-h-screen transition-colors duration-200', tokens.bgPrimary)}>
            <div className="px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Export tokens for use in other components
export const designTokens = tokens;

// Export icons for use in pages
export { 
  Users, Search, Target, MessageSquare, CheckCircle, Send, BarChart3, Settings, 
  Activity, Clock, Play, Pause, RefreshCw, ExternalLink, Mail, TrendingUp, Zap,
  Filter, Plus, Download, Save, User, Shield, Link2, Bell as BellIcon, Calendar,
  ChevronRight, XCircle
};