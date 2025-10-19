"use client";
import { useState, useEffect } from 'react';
import {
  Home, Book, BarChart2, Settings, ChevronLeft, ChevronRight,
  Sun, Moon, Bell, User, Search, PlayCircle, Clock, CheckCircle,
  LayoutGrid, MessageSquare, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Main Component
export default function StudyHubDashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('dark');

  // --- Theme Management ---
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // --- Data for the dashboard ---
  const user = { name: 'Alex' };
  const stats = [
    { title: 'Hours Studied', value: '42.5', icon: Clock, color: 'text-blue-500', change: '+10%' },
    { title: 'Courses Completed', value: '8', icon: CheckCircle, color: 'text-green-500', change: '+2' },
    { title: 'Active Courses', value: '3', icon: PlayCircle, color: 'text-yellow-500', change: '' },
  ];
  const courses = [
    { title: 'Advanced JavaScript', progress: 75 },
    { title: 'UI/UX Design Principles', progress: 40 },
    { title: 'Data Structures & Algorithms', progress: 90 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {/* --- Sidebar --- */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* --- Main Content --- */}
      <main className="flex-1 transition-all duration-300">
        {/* --- Header --- */}


        {/* --- Dashboard Grid --- */}
        <div className="p-6 mt-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-6"
          >
            Welcome back, {user.name}!
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {stats.map((stat, i) => (
              <StatCard key={stat.title} stat={stat} index={i} />
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* --- My Courses Section --- */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="xl:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4">My Courses</h2>
              <div className="space-y-4">
                {courses.map(course => (
                  <CourseProgress key={course.title} course={course} />
                ))}
              </div>
            </motion.div>

            {/* --- Quick Actions Section --- */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <QuickActionButton title="Browse New Courses" icon={LayoutGrid} />
                <QuickActionButton title="Community Chat" icon={MessageSquare} />
                <QuickActionButton title="View Your Profile" icon={User} />
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Sub-components ---

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navItems = [
    { name: 'Dashboard', icon: Home },
    { name: 'My Learning', icon: Book },
    { name: 'Analytics', icon: BarChart2 },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <motion.div
      animate={{ width: isCollapsed ? '5rem' : '16rem' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white dark:bg-slate-800/50 shadow-md relative flex flex-col"
    >
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-slate-200 dark:border-slate-700`}>
        {!isCollapsed && <h1 className="font-bold text-lg">Study Hub</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map(item => (
          <a
            key={item.name}
            href="#"
            className={`flex items-center p-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/20 ${isCollapsed ? 'justify-center' : ''} ${item.name === 'Dashboard' ? 'bg-indigo-100 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-300 font-semibold' : ''}`}
          >
            <item.icon size={20} />
            {!isCollapsed && <span className="ml-4">{item.name}</span>}
          </a>
        ))}
      </nav>
    </motion.div>
  );
};

const Header = ({ user, theme, onToggleTheme }) => (
  <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
    <div className="relative">
      <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        placeholder="Search..."
        className="bg-slate-100 dark:bg-slate-800 pl-10 pr-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <div className="flex items-center space-x-4">
      <button
        onClick={onToggleTheme}
        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </motion.div>
        </AnimatePresence>
      </button>
      <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 relative">
        <Bell size={20} />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
    </div>
  </header>
);

const StatCard = ({ stat, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm flex items-start justify-between"
  >
    <div>
      <p className="text-slate-500 dark:text-slate-400 text-sm">{stat.title}</p>
      <p className="text-3xl font-bold mt-1">{stat.value}</p>
      {stat.change && <p className="text-xs text-green-500 mt-2">{stat.change} vs last month</p>}
    </div>
    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
      <stat.icon size={24} className={stat.color} />
    </div>
  </motion.div>
);

const CourseProgress = ({ course }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <p className="font-medium">{course.title}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{course.progress}%</p>
    </div>
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${course.progress}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="bg-indigo-500 h-2 rounded-full"
      />
    </div>
  </div>
);

const QuickActionButton = ({ title, icon: Icon }) => (
    <button className="w-full flex items-center justify-between p-4 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700 transition-colors">
        <div className="flex items-center">
            <Icon size={20} className="text-indigo-500" />
            <span className="ml-3 font-medium">{title}</span>
        </div>
        <ArrowUpRight size={16} className="text-slate-400" />
    </button>
);