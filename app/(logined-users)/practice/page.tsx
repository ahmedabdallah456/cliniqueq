'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiBookOpen, FiAward, FiZap, FiStar, FiArrowRight } from 'react-icons/fi';
import { FaHeartbeat, FaBrain, FaLungs, FaSyringe } from 'react-icons/fa';
import { GiKidneys, GiStomach, GiHeartOrgan, GiMicroscope, GiMuscleUp, GiShieldEchoes } from 'react-icons/gi';
import { AiOutlineMedicineBox } from 'react-icons/ai';
import { MdPsychology } from 'react-icons/md';
import Link from 'next/link';
import { BsFillHeartPulseFill } from 'react-icons/bs';
import NavBar from '@/components/NavBar';


interface Topic {
  id: string;
  title: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  examType: string[];
  year: number; // Added year property
  solvedCount: number;
  xp: number;
  rating: number;
  url: string; // URL to the question page
  icon?: any;
  color?: string;
  path?: string; // Added to store the file path
}

const getTopicIcon = (id: string) => {
  switch (id) {
    case 'HEM': return { icon: GiHeartOrgan, color: '#c0392b' };
    case 'MSK': return { icon: GiMuscleUp, color: '#f39c12' };
    case 'GI': return { icon: GiStomach, color: '#f39c12' };
    case 'NEURO': return { icon: FaBrain, color: '#9b59b6' };
    case 'PULM': return { icon: FaLungs, color: '#3498db' };
    case 'RENAL': return { icon: GiKidneys, color: '#2ecc71' };
    case 'ENDO': return { icon: FaSyringe, color: '#16a085' };
    case 'CARDIO': return { icon: FaHeartbeat, color: '#e74c3c' };
    case 'RHEUM': return { icon: GiMicroscope, color: '#8e44ad' };
    case 'INFECT': return { icon: AiOutlineMedicineBox, color: '#c1d11b' };
    case 'DERM': return { icon: FiBookOpen, color: '#27ae60' };
    case 'PSYCH': return { icon: MdPsychology, color: '#2980b9' };
    case 'IMMU': return { icon: GiShieldEchoes, color: '#e58e26' };
    default: return { icon: FiBookOpen, color: '#34495e' };
  }
};

// Subject color mapping
const getSubjectColor = (subject: string) => {
  const subjectColors: { [key: string]: string } = {
    // Anatomy & Physiology
    'Anatomy': '#8e44ad',
    'Physiology': '#3498db',
    'Pathophysiology': '#e74c3c',
    
    // Clinical Sciences
    'Internal Medicine': '#2c3e50',
    'Surgery': '#c0392b',
    'Pediatrics': '#f39c12',
    'Obstetrics & Gynecology': '#e91e63',
    'Psychiatry': '#9c27b0',
    'Neurology': '#673ab7',
    'Dermatology': '#4caf50',
    'Ophthalmology': '#ff9800',
    'ENT': '#795548',
    'Orthopedics': '#607d8b',
    'Radiology': '#37474f',
    'Pathology': '#b71c1c',
    'Pharmacology': '#1976d2',
    'Microbiology': '#388e3c',
    'Immunology': '#f57c00',
    'Biochemistry': '#7b1fa2',
    'Public Health': '#00796b',
    'Emergency Medicine': '#d32f2f',
    'Family Medicine': '#689f38',
    'Cardiology': '#c62828',
    'Gastroenterology': '#ef6c00',
    'Pulmonology': '#1565c0',
    'Nephrology': '#2e7d32',
    'Endocrinology': '#00838f',
    'Hematology': '#ad1457',
    'Oncology': '#5e35b1',
    'Rheumatology': '#e65100',
    'Infectious Diseases': '#558b2f',
    
    // Basic Sciences
    'Molecular Biology': '#6a1b9a',
    'Cell Biology': '#00695c',
    'Genetics': '#bf360c',
    'Embryology': '#4e342e',
    'Histology': '#424242',
  };
  
  return subjectColors[subject] || '#34495e';
};

const difficultyStyles = {
  easy: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  hard: 'bg-red-100 text-red-800 border-red-200'
};

// Function to recursively scan the Modules directory
const scanModulesDirectory = async (): Promise<Topic[]> => {
  const topics: Topic[] = [];
  
  try {
    // Get all module folders (HEM, CARDIO, IMMU, etc.)
    const moduleResponse = await fetch('/api/scan-modules');
    if (!moduleResponse.ok) {
      throw new Error('Failed to fetch modules');
    }
    
    const modules = await moduleResponse.json();
    
    for (const module of modules) {
      try {
        // Get all subjects for this module
        const subjectResponse = await fetch(`/api/scan-subjects?module=${module}`);
        if (!subjectResponse.ok) continue;
        
        const subjects = await subjectResponse.json();
        
        for (const subject of subjects) {
          try {
            // Get all topics for this subject
            const topicResponse = await fetch(`/api/scan-topics?module=${module}&subject=${subject}`);
            if (!topicResponse.ok) continue;
            
            const topicFolders = await topicResponse.json();
            
            for (const topicFolder of topicFolders) {
              try {
                // Fetch the info.json for this topic
                const infoResponse = await fetch(`/Modules/${module}/${subject}/${topicFolder}/info.json`);
                if (!infoResponse.ok) continue;
                
                const topicInfo = await infoResponse.json();
                
                // Add icon and color based on module ID
                const { icon, color } = getTopicIcon(topicInfo.id || module);
                
                topics.push({
                  ...topicInfo,
                  icon,
                  color,
                  path: `/Modules/${module}/${subject}/${topicFolder}/${topicFolder}.json`
                });
              } catch (error) {
                console.warn(`Failed to load topic info for ${module}/${subject}/${topicFolder}:`, error);
              }
            }
          } catch (error) {
            console.warn(`Failed to scan topics for ${module}/${subject}:`, error);
          }
        }
      } catch (error) {
        console.warn(`Failed to scan subjects for ${module}:`, error);
      }
    }
  } catch (error) {
    console.error('Failed to scan modules directory:', error);
  }
  
  return topics;
};

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [examFilter, setExamFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all'); // State for year filter
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const loadTopics = async () => {
      setLoading(true);
      try {
        const discoveredTopics = await scanModulesDirectory();
        setTopics(discoveredTopics);
      } catch (error) {
        console.error('Error loading topics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTopics();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || topic.difficulty === difficultyFilter;
    const matchesExam = examFilter === 'all' || topic.examType.includes(examFilter);
    const matchesSubject = subjectFilter === 'all' || topic.subject === subjectFilter;
    const matchesYear = yearFilter === 'all' || topic.year === parseInt(yearFilter, 10); // Year filter logic
    return matchesSearch && matchesDifficulty && matchesExam && matchesSubject && matchesYear;
  });

  // Get unique exam types and subjects from all topics
  const uniqueExamTypes = [...new Set(topics.flatMap(topic => topic.examType))];
  const uniqueSubjects = [...new Set(topics.map(topic => topic.subject))].sort();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white font-sans">
        <div className="relative h-48 md:h-64 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-700/90" />
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Topics</h1>
            <p className="text-lg text-blue-100 mt-2">Loading medical topics from modules...</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Loading topics...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white font-sans">
      
      <div className="relative h-48 md:h-64 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80')",
            backgroundSize: 'cover',
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-700/90" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Topics</h1>
          <p className="text-lg text-blue-100 mt-2">
            Explore {topics.length} medical topics, that will prepare you for your USMLE, PLAP, Facility of Medicine NUB Exams.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <motion.div 
            className="w-full md:w-64 space-y-6"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="sticky top-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Filters</h2>
                <div className="relative mb-5">
                  <input
                    type="text"
                    placeholder="Search topics..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FiSearch className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                   {/* Year Filter Dropdown */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Year</label>
                    <select
                      className="w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50"
                      value={yearFilter}
                      onChange={(e) => setYearFilter(e.target.value)}
                    >
                      <option value="all">All Years</option>
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
                      <option value="5">Year 5</option>
                      <option value="6">Year 6</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Subject</label>
                    <select 
                      className="w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50"
                      value={subjectFilter}
                      onChange={(e) => setSubjectFilter(e.target.value)}
                    >
                      <option value="all">All Subjects</option>
                      {uniqueSubjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Difficulty</label>
                    <select 
                      className="w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50"
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                    >
                      <option value="all">All Difficulties</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Exam Type</label>
                    <select 
                      className="w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50"
                      value={examFilter}
                      onChange={(e) => setExamFilter(e.target.value)}
                    >
                      <option value="all">All Exam Types</option>
                      {uniqueExamTypes.map(examType => (
                        <option key={examType} value={examType}>{examType}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between mb-2">
                      <span>Total Topics:</span>
                      <span className="font-semibold">{topics.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Filtered:</span>
                      <span className="font-semibold">{filteredTopics.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex-1">
            {filteredTopics.length === 0 ? (
              <div className="text-center py-20">
                <FiSearch className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No topics found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredTopics.map((topic, index) => {
                  const IconComponent = topic.icon;
                  const subjectColor = getSubjectColor(topic.subject);
                  return (
                    <motion.div
                      key={`${topic.id}-${topic.title}-${index}`}
                      variants={itemVariants}
                      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                    >
                      {/* Subject color stripe at the top */}
                      <div 
                        className="h-1 w-full"
                        style={{ backgroundColor: subjectColor }}
                      />
                      
                      <div className="p-5 border-b border-gray-100">
                        <div className="flex flex-col gap-2 mb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0"
                                style={{ backgroundColor: `${topic.color}20` }}
                              >
                                <IconComponent size={20} color={topic.color} />
                              </div>
                              <h3 className="text-lg font-bold text-gray-800 break-words">{topic.title}</h3>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyStyles[topic.difficulty]} flex-shrink-0`}>
                              {topic.difficulty}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 pl-[52px]">
                            <span 
                              className="font-medium px-2 py-1 rounded-md text-white text-xs"
                              style={{ backgroundColor: subjectColor }}
                            >
                              {topic.subject}
                            </span>
                            <span className="mx-2">•</span>
                            <span className="text-blue-600 font-semibold">{topic.id}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-5 space-y-4">
                        <div>
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Community progress</span>
                            <span>{Math.round((topic.solvedCount / 2000) * 100)}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full" 
                              style={{ 
                                width: `${Math.min((topic.solvedCount / 2000) * 100, 100)}%`,
                                backgroundColor: topic.color
                              }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center text-gray-700">
                            <FiAward className="mr-1" />
                            <span>{topic.solvedCount} solved</span>
                          </div>
                          <div className="flex items-center font-medium" style={{ color: topic.color }}>
                            <FiZap className="mr-1" />
                            <span>{topic.xp} XP</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm">
                            {[...Array(5)].map((_, i) => (
                              <FiStar 
                                key={i} 
                                className={`${i < Math.floor(topic.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                            <span className="ml-1 text-gray-700">{topic.rating}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            {/* Updated Link to use the URL from info.json */}
                            <Link 
                              href={topic.url || `/topics/${topic.id}/${topic.title.toLowerCase().replace(/\s+/g, '-')}`} 
                              passHref
                              legacyBehavior
                            >
                              <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 flex items-center rounded-lg text-white font-medium transition-all duration-200 cursor-pointer"
                                style={{ backgroundColor: topic.color }}
                              >
                                Start <FiArrowRight className="ml-1" />
                              </motion.a>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}