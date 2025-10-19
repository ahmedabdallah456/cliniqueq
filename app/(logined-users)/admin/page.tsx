"use client";
import React, { useState } from 'react';
import { Search, Plus, Clipboard, Info, ChevronDown } from 'lucide-react';

interface CreateFormData {
  module: string;
  subject: string;
  topic: string;
}

interface InfoCardData {
  id: string;
  title: string;
  year: string;
  subject: string;
  difficulty: string;
  examType: string;
  solvedCount: string;
  xp: string;
  rating: string;
  url: string;
}

const QuestionBankAdmin: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  
  const [createForm, setCreateForm] = useState<CreateFormData>({
    module: '',
    subject: '',
    topic: ''
  });
  
  const [infoCard, setInfoCard] = useState<InfoCardData>({
    id: '',
    title: '',
    year: '',
    subject: '',
    difficulty: '',
    examType: '',
    solvedCount: '',
    xp: '',
    rating: '',
    url: ''
  });

  // Mock data for dropdowns
  const modules = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];
  const subjects = ['Algebra', 'Calculus', 'Geometry', 'Statistics', 'Mechanics'];
  const topics = ['Linear Equations', 'Derivatives', 'Integrals', 'Probability', 'Forces'];
  const difficulties = ['Easy', 'Medium', 'Hard', 'Expert'];
  const examTypes = ['Multiple Choice', 'Short Answer', 'Essay', 'Problem Solving'];

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setTextContent(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      // Fallback for browsers that don't support clipboard API
      alert('Please paste manually or use Ctrl+V');
    }
  };

  const handleCreateSubmit = () => {
    console.log('Creating new items:', createForm);
    setCreateForm({ module: '', subject: '', topic: '' });
    setShowCreateModal(false);
    alert('Items created successfully!');
  };

  const handleInfoCardSubmit = () => {
    console.log('Info card data:', infoCard);
    setShowInfoModal(false);
    alert('Info card saved successfully!');
  };

  const handleUpdate = () => {
    const data = {
      searchQuery,
      textContent,
      selectedModule,
      selectedSubject,
      selectedTopic,
      infoCard
    };
    console.log('Updating with data:', data);
    alert('Data updated successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">

      <div className="max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-8xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search questions, modules, subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white shadow-lg"
            />
          </div>
        </div>

        {/* Create New Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-12 py-4 rounded-xl text-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
          >
            <Plus className="w-6 h-6" />
            Create New
          </button>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          {/* Text Area with Paste Button */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              MCQs
            </label>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Enter or paste question content here..."
                  className="w-200 h-80 p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
                />
              </div>
              <button
                onClick={handlePaste}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition-colors flex items-center justify-center text-2xl font-mono h-80 w-100"
              >
                <Clipboard className="w-10 h-10" />
                Paste
              </button>
            </div>
          </div>

          {/* Dropdown Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Module</label>
              <div className="relative">
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white"
                >
                  <option value="">Select Module</option>
                  {modules.map((module) => (
                    <option key={module} value={module}>{module}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
              <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Topic</label>
              <div className="relative">
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white"
                >
                  <option value="">Select Topic</option>
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setShowInfoModal(true)}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Info className="w-5 h-5" />
                Info Card
              </button>
            </div>
          </div>
        </div>

        {/* Update Button */}
        <div className="flex justify-center">
          <button
            onClick={handleUpdate}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-16 py-4 rounded-xl text-xl font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            UPDATE
          </button>
        </div>
      </div>

      {/* Create New Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create New</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Module</label>
                <input
                  type="text"
                  value={createForm.module}
                  onChange={(e) => setCreateForm({...createForm, module: e.target.value})}
                  placeholder="Enter module name"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={createForm.subject}
                  onChange={(e) => setCreateForm({...createForm, subject: e.target.value})}
                  placeholder="Enter subject name"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Topic</label>
                <input
                  type="text"
                  value={createForm.topic}
                  onChange={(e) => setCreateForm({...createForm, topic: e.target.value})}
                  placeholder="Enter topic name"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSubmit}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Card Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Question Info Card</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ID</label>
                <input
                  type="text"
                  value={infoCard.id}
                  onChange={(e) => setInfoCard({...infoCard, id: e.target.value})}
                  placeholder="Question ID"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={infoCard.title}
                  onChange={(e) => setInfoCard({...infoCard, title: e.target.value})}
                  placeholder="Question title"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                <input
                  type="text"
                  value={infoCard.year}
                  onChange={(e) => setInfoCard({...infoCard, year: e.target.value})}
                  placeholder="Year"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={infoCard.subject}
                  onChange={(e) => setInfoCard({...infoCard, subject: e.target.value})}
                  placeholder="Subject"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
                <select
                  value={infoCard.difficulty}
                  onChange={(e) => setInfoCard({...infoCard, difficulty: e.target.value})}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">Select Difficulty</option>
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Type</label>
                <select
                  value={infoCard.examType}
                  onChange={(e) => setInfoCard({...infoCard, examType: e.target.value})}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">Select Exam Type</option>
                  {examTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Solved Count</label>
                <input
                  type="number"
                  value={infoCard.solvedCount}
                  onChange={(e) => setInfoCard({...infoCard, solvedCount: e.target.value})}
                  placeholder="Number of times solved"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">XP</label>
                <input
                  type="number"
                  value={infoCard.xp}
                  onChange={(e) => setInfoCard({...infoCard, xp: e.target.value})}
                  placeholder="Experience points"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={infoCard.rating}
                  onChange={(e) => setInfoCard({...infoCard, rating: e.target.value})}
                  placeholder="Rating (0-5)"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">URL</label>
                <input
                  type="url"
                  value={infoCard.url}
                  onChange={(e) => setInfoCard({...infoCard, url: e.target.value})}
                  placeholder="Question URL"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowInfoModal(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInfoCardSubmit}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Save Info
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBankAdmin;