// components/NavBar.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, ChevronRight } from 'lucide-react';

import pagesData from '@/public/pages.json'

const mainPages : string[] = pagesData.pages;

interface NavBarProps {
  allPages: string[];
}

export default function NavBar({ allPages = [] }: NavBarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const currentRoute = pathname === '/' ? 'home' : pathname.split('/')[1];

  // Define the constant boolean for dark mode
  const isDarkMode = false; // Set to true for dark mode, false for light mode

  // Get available pages and separate them
  const otherPages = allPages.filter(page => !mainPages.includes(page));
  const availableMainPages = mainPages.filter(page => page !== currentRoute);
  
  // Determine which pages to show in main nav
  const displayedPages = mainPages.includes(currentRoute)
    ? [...availableMainPages, ...otherPages].slice(0, 4)
    : mainPages;

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Mount component to avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <nav className={`sticky top-0 z-50 ${isDarkMode ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-blue-100'} backdrop-blur-md border-b shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link 
            href="/dashboard" 
            className="flex items-center space-x-2 group"
          >
            <motion.span
              className={`text-xl font-bold ${isDarkMode ? 'bg-gradient-to-r from-white to-indigo-200' : 'bg-gradient-to-r from-blue-600 to-indigo-700'}  bg-clip-text text-transparent`}
              whileHover={{ scale: 1.05 }}
            >
              CliniqueQBank
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {displayedPages.map((page) => (
              <motion.div key={page} whileHover={{ y: -2 }}>
                <Link
                  href={page === 'home' ? '/home' : `/${page}`}
                  className={`relative px-3 py-2 ${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
                >
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                  {currentRoute === page && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"
                      layoutId="underline"
                    />
                  )}
                </Link>
              </motion.div>
            ))}
            
            {otherPages.length > 0 && (
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center ${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
                whileHover={{ scale: 1.05 }}
              >
                More <ChevronRight className="ml-1 h-4 w-4" />
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 ${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} rounded-lg`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`md:hidden absolute w-full ${isDarkMode ? 'bg-gray-900 shadow-gray-800' : 'bg-white shadow-lg'}`}
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              {[...displayedPages, ...otherPages].map((page) => (
                <Link
                  key={page}
                  href={page === 'home' ? '/' : `/${page}`}
                  className={`block px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-blue-50'} rounded-lg`}
                >
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <AnimatePresence>
        {isOpen && otherPages.length > 0 && (
          <motion.aside
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`hidden md:block fixed right-0 top-16 h-[calc(100vh-4rem)] w-64 ${isDarkMode ? 'bg-gray-900 border-gray-800 shadow-gray-800' : 'bg-white border-blue-100 shadow-xl'} border-l`}
          >
            <div className="p-4 space-y-2">
              <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                More Sections
              </h3>
              {otherPages.map((page) => (
                <Link
                  key={page}
                  href={`/${page}`}
                  className={`flex items-center px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-blue-50'} rounded-lg group`}
                >
                  <span>{page.charAt(0).toUpperCase() + page.slice(1)}</span>
                  <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </nav>
  );
}