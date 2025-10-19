// app/topics/[...slug]/page.tsx
'use client';
import { useState, useEffect, useRef } from 'react'; // Import useRef
import { motion, AnimatePresence, animate } from 'framer-motion';
import { CheckCircle, XCircle, ChevronRight, Award, Clock, BookOpen, Brain, Image as ImageIcon, ZoomIn, AlertCircle } from 'lucide-react';

type QuestionType = 'standard' | 'datashow';

type Question = {
  id: string;
  type: QuestionType;
  questionText: string;
  imageUrl?: string;
  imageAlt?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  references?: string[];
  difficulty?: string;
};

type TopicData = {
  title: string;
  module: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  examTypes: string[];
  description?: string;
  questions: Question[];
};

// Copy protection styles
const copyProtectionStyles = `
  /* Disable text selection */
  .no-select {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
  }
  
  /* Disable highlighting */
  .no-select::selection {
    background: transparent;
  }
  
  .no-select::-moz-selection {
    background: transparent;
  }
  
  /* Disable drag */
  .no-drag {
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
    pointer-events: auto;
  }
  
  /* Disable right click context menu */
  .no-context {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  
  /* Disable print styling */
  @media print {
    .no-print {
      display: none !important;
    }
  }
`;

// Copy protection component
const CopyProtection = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = copyProtectionStyles;
    document.head.appendChild(style);
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 's' || e.key === 'p' || e.key === 'u')) ||
          e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J'))) {
        e.preventDefault();
        return false;
      }
    };
    const handleContextMenu = (e: MouseEvent) => { e.preventDefault(); return false; };
    const handleSelectStart = (e: Event) => { e.preventDefault(); return false; };
    const handleDragStart = (e: DragEvent) => { e.preventDefault(); return false; };
    const clearClipboard = () => { try { if (navigator.clipboard) { navigator.clipboard.writeText(''); } } catch (e) { /* Silently fail */ } };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    const clipboardInterval = setInterval(clearClipboard, 2000);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      clearInterval(clipboardInterval);
      if (document.head.contains(style)) document.head.removeChild(style);
    };
  }, []);
  return <div className="no-select no-drag no-context no-print">{children}</div>;
};

// Image zoom modal component
const ImageZoomModal = ({ imageUrl, imageAlt, isOpen, onClose }: {
  imageUrl: string;
  imageAlt: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 no-select"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="max-w-4xl max-h-full bg-white rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">Image View</h3>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-800 p-1">
            <XCircle size={24} />
          </button>
        </div>
        <img src={imageUrl} alt={imageAlt} className="w-full h-auto max-h-[80vh] object-contain no-drag" draggable={false} />
      </motion.div>
    </motion.div>
  );
};

// Custom hook for timer
const useTimer = (isActive: boolean) => {
  const [time, setTime] = useState(0);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => setTime(prevTime => prevTime + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);
  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  const resetTimer = () => setTime(0);
  return { time, formatTime, resetTimer };
};

// Difficulty color mapper
const getDifficultyColor = (difficulty: string) => {
  switch(difficulty) {
    case 'easy': return 'bg-emerald-500';
    case 'medium': return 'bg-amber-500';
    case 'hard': return 'bg-rose-500';
    default: return 'bg-slate-500';
  }
};

// Error component
const ErrorDisplay = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 flex items-center justify-center p-6">
    <motion.div  
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-2xl w-full"
    >
      <div className="bg-gradient-to-r from-rose-600 to-red-500 p-8 text-white">
        <AlertCircle size={48} className="mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-center">Error Loading Topic</h1>
      </div>
      <div className="p-8 text-center">
        <p className="text-slate-600 mb-6">{message}</p>
        <button  
          onClick={onRetry}
          className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-300"
        >
          Try Again
        </button>
      </div>
    </motion.div>
  </div>
);

// Subject-Color Mapping & Function (as defined in Step 1)
const subjectColorMap: {
  [key: string]: { iconColor: string; borderColor: string; MutedBgColor: string; };
} = {
  'Anatomy': { iconColor: 'text-sky-600', borderColor: 'border-sky-500', MutedBgColor: 'bg-sky-100' },
  'Physiology': { iconColor: 'text-lime-600', borderColor: 'border-lime-500', MutedBgColor: 'bg-lime-100' },
  'Pharmacology': { iconColor: 'text-violet-600', borderColor: 'border-violet-500', MutedBgColor: 'bg-violet-100' },
  'Pathology': { iconColor: 'text-rose-600', borderColor: 'border-rose-500', MutedBgColor: 'bg-rose-100' },
  'Biochemistry': { iconColor: 'text-amber-600', borderColor: 'border-amber-500', MutedBgColor: 'bg-amber-100' },
  'Microbiology': { iconColor: 'text-teal-600', borderColor: 'border-teal-500', MutedBgColor: 'bg-teal-100' },
  'Default': { iconColor: 'text-slate-600', borderColor: 'border-slate-500', MutedBgColor: 'bg-slate-100' }
};

const getSubjectStyling = (subject?: string | null) => {
  if (subject && subjectColorMap[subject]) {
    return subjectColorMap[subject];
  }
  return subjectColorMap['Default'];
};


// ⭐️ START: Added custom hook for detecting mobile/tablet screens
/**
 * Custom hook to detect if the screen width is below a given breakpoint.
 * @param breakpoint - The width in pixels to check against (defaults to 768).
 * @returns {boolean} - True if the window width is less than the breakpoint.
 */
const useIsMobile = (breakpoint = 768): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // This check ensures the code doesn't break during server-side rendering
    if (typeof window === 'undefined') {
      return;
    }

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, [breakpoint]);

  return isMobile;
};
// ⭐️ END: Added custom hook


export default function TopicPage({ params }: { params: { slug: string[] } }) {
  const [topicData, setTopicData] = useState<TopicData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [imageZoomOpen, setImageZoomOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { formatTime, resetTimer } = useTimer(quizStarted && !quizCompleted);

  // ⭐️ START: Added ref and hooks for auto-scrolling
  const explanationRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile(); // Checks for screen width < 768px

  useEffect(() => {
    // If an answer is selected on a mobile/tablet device...
    if (selectedAnswer && isMobile && explanationRef.current) {
      // ...wait for the explanation animation to finish, then scroll.
      const timer = setTimeout(() => {
        const explanationElement = explanationRef.current;
        if (!explanationElement) return;

        // Calculate the target scroll position
        const elementRect = explanationElement.getBoundingClientRect();
        const absoluteElementBottom = window.scrollY + elementRect.bottom;
        const targetScrollY = absoluteElementBottom - window.innerHeight;

        // Use Framer Motion's animate function for a controlled, slower scroll
        animate(window.scrollY, targetScrollY, {
          duration: 1, // 👈 CHANGE THIS VALUE (in seconds) to make it slower or faster
          ease: "easeInOut", // This makes the scroll start and end gently
          onUpdate: (value) => {
            window.scrollTo(0, value);
          },
        });
      }, 300); // Delay matches the animation duration

      return () => clearTimeout(timer);
    }
  }, [selectedAnswer, isMobile]);
  // ⭐️ END: Updated useEffect


  const parseSlug = () => {
    if (!params.slug || params.slug.length !== 4) return null;
    return {
      module: params.slug[0],
      subject: params.slug[1],
      topicFolder: params.slug[2],
      topicFile: params.slug[3]
    };
  };

  const loadTopicData = async () => {
    const slugData = parseSlug();
    if (!slugData) {
      setError('Invalid URL format. Expected: /topics/[module]/[subject]/[topic_folder]/[topic_file]');
      setLoading(false);
      return;
    }
    const { module, subject, topicFolder, topicFile } = slugData;
    try {
      setLoading(true);
      setError(null);
      const jsonPath = `/Modules/${module}/${subject}/${topicFolder}/${topicFile}.json`;
      const response = await fetch(jsonPath);
      if (!response.ok) {
        if (response.status === 404) throw new Error(`Topic file not found: ${jsonPath}`);
        throw new Error(`Failed to load topic data: ${response.statusText}`);
      }
      const data: TopicData = await response.json();
      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('Invalid topic data: No questions found');
      }
      setTopicData(data);
    } catch (err) {
      console.error('Error loading topic:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopicData();
  }, [params.slug]);

  const handleAnswer = (answer: string) => {
    if (!topicData) return;
    const correct = answer === topicData.questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    setSelectedAnswer(answer);
    if (correct) setScore(score + 1);
  };

  const nextQuestion = () => {
    if (!topicData) return;
    const isLastQuestion = currentQuestion === topicData.questions.length - 1;
    if (isLastQuestion) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    resetTimer();
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setQuizCompleted(false);
    setQuizStarted(true);
    resetTimer();
  };

  if (loading) {
    return (
      <CopyProtection>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-pulse">
              <Brain size={64} className="text-indigo-500 mx-auto mb-4" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700">Loading Questions...</h2>
            <p className="text-slate-500">Preparing your medical knowledge assessment</p>
          </div>
        </div>
      </CopyProtection>
    );
  }

  if (error) {
    return (
      <CopyProtection>
        <ErrorDisplay message={error} onRetry={loadTopicData} />
      </CopyProtection>
    );
  }

  if (!topicData) {
    return (
      <CopyProtection>
        <ErrorDisplay message="Topic data could not be loaded" onRetry={loadTopicData} />
      </CopyProtection>
    );
  }

  // Get subject styling once topicData is available
  const subjectStyling = getSubjectStyling(topicData.subject);

  if (quizCompleted) {
    const percentage = Math.round((score / topicData.questions.length) * 100);
    let message = '';
    let messageColor = '';
    if (percentage >= 80) {
      message = "Outstanding! You're ready for the boards!";
      messageColor = 'text-emerald-600';
    } else if (percentage >= 60) {
      message = "Good work! Keep reinforcing your knowledge.";
      messageColor = 'text-blue-600';
    } else {
      message = "Keep studying. You'll get there!";
      messageColor = 'text-amber-600';
    }
    return (
      <CopyProtection>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 p-6 flex items-center justify-center">
          <motion.div  
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-3xl shadow-xl overflow-hidden max-w-2xl w-full border-t-4 ${subjectStyling.borderColor}`}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-8 text-white">
              <h1 className="text-3xl font-bold">Quiz Completed!</h1>
              <p className="opacity-80">{topicData.title}</p>
              <p className="text-sm opacity-70">{topicData.module} → {topicData.subject}</p>
            </div>
            <div className="p-8">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <svg className="w-40 h-40">
                    <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                    <circle className={subjectStyling.iconColor} strokeWidth="8" strokeDasharray={440} strokeDashoffset={440 - (440 * percentage) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className="text-4xl font-bold text-slate-700">{percentage}%</span>
                  </div>
                </div>
              </div>
              <div className="text-center mb-8">
                <h2 className={`text-2xl font-bold mb-2 ${messageColor}`}>{message}</h2>
                <p className="text-slate-600">You answered {score} out of {topicData.questions.length} questions correctly.</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className={`rounded-xl p-4 text-center ${subjectStyling.MutedBgColor}`}>
                  <Clock className={`inline-block ${subjectStyling.iconColor} mb-2`} size={24} />
                  <p className="text-slate-700"><span className="font-bold">Time:</span> {formatTime()}</p>
                </div>
                <div className={`rounded-xl p-4 text-center ${subjectStyling.MutedBgColor}`}>
                  <Award className={`inline-block ${subjectStyling.iconColor} mb-2`} size={24} />
                  <p className="text-slate-700"><span className="font-bold">Score:</span> {score}/{topicData.questions.length}</p>
                </div>
              </div>
              <div className="flex justify-center">
                <button  
                  onClick={resetQuiz}
                  className="flex items-center justify-center bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-300"
                >
                  <BookOpen className="mr-2" size={18} />
                  Restart Quiz
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </CopyProtection>
    );
  }

  if (!quizStarted) {
    const standardQuestions = topicData.questions.filter(q => q.type === 'standard').length;
    const datashowQuestions = topicData.questions.filter(q => q.type === 'datashow').length;
    return (
      <CopyProtection>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 p-6 flex items-center justify-center">
          <motion.div  
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-3xl shadow-xl overflow-hidden max-w-2xl w-full border-t-8 ${subjectStyling.borderColor}`}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-8 text-white">
              <div className="mb-2">
                <span className="bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full">
                  {topicData.module} → {topicData.subject}
                </span>
              </div>
              <h1 className="text-3xl font-bold">{topicData.title}</h1>
              <div className="flex flex-wrap gap-2 mt-3">
                {topicData.examTypes.map((type, i) => (
                  <span key={i} className="bg-white/20 text-white text-xs font-medium px-2 py-1 rounded-full">
                    {type}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-8">
              <div className="mb-8">
                <div className={`inline-block ${getDifficultyColor(topicData.difficulty)} text-white text-sm font-medium px-3 py-1 rounded-full`}>
                  {topicData.difficulty.charAt(0).toUpperCase() + topicData.difficulty.slice(1)}
                </div>
                {topicData.description && (
                  <p className="mt-4 text-slate-600">{topicData.description}</p>
                )}
                <h2 className="text-2xl font-bold mt-6 text-slate-800">Quiz Details</h2>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-center text-slate-600">
                    <span className={`${subjectStyling.MutedBgColor} p-1.5 rounded-full mr-3`}>
                      <BookOpen className={subjectStyling.iconColor} size={18} />
                    </span>
                    {topicData.questions.length} Questions on {topicData.title}
                  </li>
                  <li className="flex items-center text-slate-600">
                    <span className={`${subjectStyling.MutedBgColor} p-1.5 rounded-full mr-3`}>
                      <ImageIcon className={subjectStyling.iconColor} size={18} />
                    </span>
                    {datashowQuestions} Image-based questions, {standardQuestions} Text questions
                  </li>
                  <li className="flex items-center text-slate-600">
                    <span className={`${subjectStyling.MutedBgColor} p-1.5 rounded-full mr-3`}>
                      <Clock className={subjectStyling.iconColor} size={18} />
                    </span>
                    Untimed - Work at your own pace
                  </li>
                  <li className="flex items-center text-slate-600">
                    <span className={`${subjectStyling.MutedBgColor} p-1.5 rounded-full mr-3`}>
                      <Award className={subjectStyling.iconColor} size={18} />
                    </span>
                    Complete explanations for every question
                  </li>
                </ul>
              </div>
              <div className="flex justify-center">
                <button  
                  onClick={startQuiz}
                  className="flex items-center justify-center bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-300"
                >
                  Start Quiz
                  <ChevronRight className="ml-1" size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </CopyProtection>
    );
  }

  const currentQ = topicData.questions[currentQuestion];

  return (
    <CopyProtection>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className={`bg-white rounded-2xl shadow-md p-6 mb-6 border-t-4 ${subjectStyling.borderColor}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2">
                  <span className="text-sm text-slate-500">
                    {topicData.module} → {topicData.subject}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{topicData.title}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`${getDifficultyColor(topicData.difficulty)} text-white text-xs font-medium px-2 py-1 rounded-full`}>
                    {topicData.difficulty.charAt(0).toUpperCase() + topicData.difficulty.slice(1)}
                  </span>
                  <span className={`${currentQ.type === 'datashow' ? 'bg-purple-500' : 'bg-slate-500'} text-white text-xs font-medium px-2 py-1 rounded-full`}>
                    {currentQ.type === 'datashow' ? 'Image Question' : 'Text Question'}
                  </span>
                  {topicData.examTypes.map((type, i) => (
                    <span key={i} className="bg-slate-200 text-slate-700 text-xs font-medium px-2 py-1 rounded-full">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex gap-4">
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-blue-500 font-medium">TIME</p>
                  <p className="text-slate-700 font-bold">{formatTime()}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-amber-500 font-medium">QUESTION</p>
                  <p className="text-slate-700 font-bold">{currentQuestion + 1}/{topicData.questions.length}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-emerald-500 font-medium">SCORE</p>
                  <p className="text-slate-700 font-bold">{score}/{currentQuestion + (selectedAnswer ? 1 : 0)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-white rounded-full h-2 mb-6 overflow-hidden">
            <div  
              className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${((currentQuestion + (selectedAnswer ? 1 : 0)) / topicData.questions.length) * 100}%` }}
            ></div>
          </div>
          
          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`bg-white rounded-3xl shadow-xl overflow-hidden border-t-8 ${subjectStyling.borderColor}`}
            >
              <div className="p-6 md:p-8">
                {currentQ.type === 'datashow' && currentQ.imageUrl && (
                  <div className="mb-6">
                    <div className="relative group">
                      <img
                        src={currentQ.imageUrl}
                        alt={currentQ.imageAlt || 'Medical image for question'}
                        className="w-full h-64 md:h-80 object-cover rounded-xl border-2 border-slate-200 cursor-zoom-in no-drag"
                        onClick={() => setImageZoomOpen(true)}
                        draggable={false}
                      />
                    </div>
                    <p className="text-xs mt-2 text-center text-slate-500 animate-pulse transition-colors duration-1000 hover:text-black">
                      Click image to zoom ↗
                    </p>  
                  </div>
                )}

                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">
                  {currentQ.questionText}
                </h2>
                
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => {
                    let optionClass = "border-2 border-slate-200 hover:border-indigo-300 bg-white text-slate-700";
                    if (selectedAnswer) {
                      if (option === currentQ.correctAnswer) {
                        optionClass = "border-2 border-emerald-500 bg-emerald-50 text-emerald-700";
                      } else if (option === selectedAnswer) {
                        optionClass = "border-2 border-rose-500 bg-rose-50 text-rose-700";
                      }
                    }
                    return (
                      <button
                        key={index}
                        className={`w-full text-left p-4 rounded-xl flex items-center transition-all duration-200 ${optionClass}`}
                        onClick={() => !selectedAnswer && handleAnswer(option)}
                        disabled={!!selectedAnswer}
                      >
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 font-medium text-slate-600">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="flex-grow">{option}</span>
                        {selectedAnswer && option === currentQ.correctAnswer && (
                          <CheckCircle className="text-emerald-500 ml-2 flex-shrink-0" size={20} />
                        )}
                        {selectedAnswer && option === selectedAnswer && option !== currentQ.correctAnswer && (
                          <XCircle className="text-rose-500 ml-2 flex-shrink-0" size={20} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedAnswer && (
                  // ⭐️ Added the ref to this container ⭐️
                  <motion.div
                    ref={explanationRef} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100"
                  >
                    <div className="flex items-center mb-3">
                      <div className={`p-1.5 rounded-full ${isCorrect ? 'bg-emerald-100' : 'bg-rose-100'} mr-2`}>
                        {isCorrect ? (
                          <CheckCircle className="text-emerald-500" size={18} />
                        ) : (
                          <XCircle className="text-rose-500" size={18} />
                        )}
                      </div>
                      <h3 className={`text-lg font-semibold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {isCorrect ? 'Correct!' : 'Incorrect'}
                      </h3>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-medium text-slate-700 mb-2">Explanation:</h4>
                      <p className="text-slate-600">{currentQ.explanation}</p>
                      {currentQ.references && currentQ.references.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium text-slate-700 mb-2">References:</h4>
                          <ul className="text-sm text-slate-600 space-y-1">
                            {currentQ.references.map((ref, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>{ref}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <button  
                      className="flex items-center justify-center w-full md:w-auto bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-3 px-6 rounded-xl shadow hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200"
                      onClick={nextQuestion}
                    >
                      {currentQuestion === topicData.questions.length - 1 ? (
                        <>Complete Quiz</>
                      ) : (
                        <>Next Question <ChevronRight className="ml-1" size={18} /></>
                      )}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {imageZoomOpen && currentQ.type === 'datashow' && currentQ.imageUrl && (
              <ImageZoomModal
                imageUrl={currentQ.imageUrl}
                imageAlt={currentQ.imageAlt || 'Medical image'}
                isOpen={imageZoomOpen}
                onClose={() => setImageZoomOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </CopyProtection>
  );
}