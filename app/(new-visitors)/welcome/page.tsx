// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { HeartPulse, BrainCircuit, BookOpen, Award, Users, ChevronDown } from 'lucide-react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';


export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  // Simpler load animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white font-poppins">

      {/* Simplified Hero Section */}
      <section className="relative py-24 min-h-[700px] flex items-center"> 
        {/* Static Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="h-full w-full absolute">
            <img 
              src="/img/background.png" 
              alt="Background" 
              className="w-full h-full object-cover object-center"
            />
          </div>
          {/* Simple Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className={`mb-16 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              For NUB students
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Medical Mastery Through<br />
              <span className="text-cyan-300">
                Gamified Learning
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Transform your study sessions into engaging challenges. Designed exclusively for medical students 
              by education experts.
            </p>
            <div className="flex flex-col items-center space-y-4">
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg transition-colors text-lg"
              >
                Start Learning Free Now
              </button>
              <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-white font-medium">No credit card required</span>
              </div>
            </div>
          </div>
        </div>

        {/* Static scroll indicator */}
        <div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
          onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
        >
          <ChevronDown className="w-8 h-8 text-white" />
        </div>
      </section>

      {/* Simplified Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className={`${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
            <h2 className="text-3xl font-bold text-center mb-6 text-black">
              Our Innovative Approach
            </h2>
            <p className="text-center max-w-2xl mx-auto mb-16 text-black/70">
              Scientifically designed learning techniques that match how your brain works, optimized for medical education
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Adaptive Challenges",
                desc: "Questions evolve with your progress, maintaining optimal difficulty for maximum memory retention",
                icon: "/img/OP_1.png",
                IconComponent: BrainCircuit
              },
              {
                title: "Virtual Study Groups",
                desc: "Collaborate with peers in timed problem-solving sessions to simulate clinical rounds",
                icon: "/img/OP_2.png",
                IconComponent: Users
              },
              {
                title: "Knowledge Mapping",
                desc: "Visualize your understanding across medical disciplines with interactive neural networks",
                icon: "/img/OP_3.png",
                IconComponent: BookOpen
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="p-8 border border-blue-100 rounded-xl hover:border-blue-300 transition-colors text-center bg-white shadow-sm hover:shadow-md"
              >
                {/* Simplified icon */}
                <div className="flex justify-center mb-6">
                  <img 
                    src={feature.icon} 
                    alt={feature.title} 
                    className="w-20 h-20 object-contain" 
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black">{feature.title}</h3>
                <p className="text-black/70">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Static Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Why Medical Students Choose Us</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 98, label: "Exam pass rate", icon: Award },
              { value: 10000, label: "Practice questions", icon: BookOpen },
              { value: 85, label: "Less study time", icon: HeartPulse },
              { value: 94, label: "Student satisfaction", icon: Users }
            ].map((stat, index) => (
              <div 
                key={index}
                className="text-center p-4 bg-white/10 rounded-lg"
              >
                <div className="flex justify-center mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold mb-1">
                  {stat.value > 100 ? stat.value.toLocaleString() : `${stat.value}%`}
                </h3>
                <p className="text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simplified How It Works Section */}
      <section id="how-it-works" className="py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-black">
            Simple 3-Step Journey
          </h2>
          <p className="text-center max-w-2xl mx-auto mb-16 text-black/70">
            Our platform adapts to your learning style and helps you master medical concepts quickly
          </p>

          {/* Desktop view */}
          <div className="hidden md:block relative">
            {/* Timeline line */}
            <div className="absolute top-24 left-0 w-full h-1 bg-blue-200 z-0"></div>
            
            <div className="grid grid-cols-3 gap-8 relative z-10">
              {[
                {
                  step: "1",
                  title: "Daily Challenge",
                  desc: "10 curated questions matching your level with spaced repetition technology",
                  icon: "/img/OP_4.png"
                },
                {
                  step: "2",
                  title: "Earn XP", 
                  desc: "Gain points, unlock achievements, and compete in specialty leaderboards",
                  icon: "/img/OP_5.png"
                },
                {
                  step: "3",
                  title: "Track Progress",
                  desc: "Detailed analytics and weak area identification with AI-driven recommendations",
                  icon: "/img/OP_6.png"
                }
              ].map((item, index) => (
                <div key={index} className="relative">
                  {/* Step circle */}
                  <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4 relative z-20">
                    <span className="text-white font-bold">{item.step}</span>
                  </div>

                  <div className="bg-white p-8 rounded-xl shadow-md text-center">
                    <div className="flex justify-center mb-6">
                      <img 
                        src={item.icon}
                        alt={item.title}
                        className="w-32 h-32 object-contain"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-black">{item.title}</h3>
                    <p className="text-black/70">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile card slider - Simplified */}
          <div className="md:hidden">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
              className="pb-12"
            >
              {[
                {
                  step: "1",
                  title: "Daily Challenge",
                  desc: "10 curated questions matching your level with spaced repetition technology",
                  icon: "/img/OP_4.png"
                },
                {
                  step: "2",
                  title: "Earn XP", 
                  desc: "Gain points, unlock achievements, and compete in specialty leaderboards",
                  icon: "/img/OP_5.png"
                },
                {
                  step: "3",
                  title: "Track Progress",
                  desc: "Detailed analytics and weak area identification with AI-driven recommendations",
                  icon: "/img/OP_6.png"
                }
              ].map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-white p-8 rounded-xl shadow-md text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-white font-bold">{item.step}</span>
                    </div>
                    <div className="flex justify-center mb-6">
                      <img 
                        src={item.icon}
                        alt={item.title}
                        className="w-32 h-32 object-contain"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-black">{item.title}</h3>
                    <p className="text-black/70">{item.desc}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* Simplified Feature Demo Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-black">Experience Our Platform</h2>
            <p className="text-black/70 max-w-2xl mx-auto">
              Try a sample of our interactive learning experience designed specifically for medical students
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-8 md:p-12 shadow-lg border border-blue-100">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-black">Sample Question</h3>
                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                  <p className="text-black font-medium mb-4">
                    Which of the following is NOT a branch of the external carotid artery?
                  </p>
                  
                  <div className="space-y-3">
                    {[
                      "Superior thyroid artery",
                      "Facial artery",
                      "Ophthalmic artery",
                      "Occipital artery"].map((option, idx) => (
                        <div 
                          key={idx}
                          className={`p-3 rounded-lg border ${idx === 2 ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-blue-300'} cursor-pointer transition-colors`}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${idx === 2 ? 'bg-green-500' : 'bg-gray-100'}`}>
                              {idx === 2 && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className="text-black">{option}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="bg-blue-600/10 p-4 rounded-lg">
                  <h4 className="font-semibold text-black mb-2">Explanation:</h4>
                  <p className="text-black/70">
                    The ophthalmic artery is a branch of the internal carotid artery, not the external carotid. All other options listed are branches of the external carotid artery.
                  </p>
                </div>
              </div>
              
              <div>
                <div className="bg-white p-6 rounded-xl shadow-sm relative border border-blue-100">
                  <h3 className="text-xl font-bold mb-4 text-black flex items-center">
                    <BrainCircuit className="w-5 h-5 mr-2 text-blue-500" />
                    Knowledge Map
                  </h3>
                  
                  {/* Simplified SVG map */}
                  <svg width="100%" height="240" viewBox="0 0 400 240">
                    {/* Central node */}
                    <circle cx="200" cy="120" r="20" fill="#3b82f6" />
                    <text x="200" y="125" textAnchor="middle" fill="#fff" fontSize="10">Carotid</text>
                    
                    {/* Connection lines and nodes */}
                    {[
                      { x: 120, y: 80, label: "Internal" },
                      { x: 280, y: 80, label: "External" },
                      { x: 90, y: 150, label: "Ophthalmic", highlight: true },
                      { x: 310, y: 120, label: "Superior Thyroid" },
                      { x: 300, y: 170, label: "Facial" },
                      { x: 260, y: 200, label: "Occipital" }
                    ].map((node, idx) => (
                      <g key={idx}>
                        <line 
                          x1="200" y1="120" 
                          x2={node.x} y2={node.y} 
                          stroke="#64748b" 
                          strokeWidth="2"
                        />
                        <circle 
                          cx={node.x} cy={node.y} r="15" 
                          fill={node.highlight ? "#22c55e" : "#3b82f6"} 
                        />
                        <text x={node.x} y={node.y + 4} textAnchor="middle" fill="#fff" fontSize="9">
                          {node.label}
                        </text>
                      </g>
                    ))}
                  </svg>
                  
                  <div className="mt-4 text-black/70 text-sm">
                    <p>This knowledge map helps you visualize how arteries connect and branch, making complex anatomy easier to remember.</p>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                  <div>
                    <span className="text-black font-medium">Your current streak:</span>
                    <div className="flex items-center">
                      <HeartPulse className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-2xl font-bold text-black">7 days</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-sm text-black/70">Next review:</span>
                    <span className="font-semibold text-black">8 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      {/* Simplified CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white/10 p-8 md:p-12 rounded-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Start Your Medical Journey Today
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of medical students who are transforming their education experience with our innovative learning platform.
            </p>
            <div className="space-y-6">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg hover:bg-blue-50 transition-colors w-full max-w-xs shadow-lg">
                Begin Free Trial
              </button>
              <div className="flex items-center justify-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-200" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-blue-100 font-medium text-lg">No credit card required • 7-day premium access</span>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      {/* Simplified Footer */}
      <footer className="bg-slate-900 text-slate-200 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold">Q</span>
                </div>
                CliniqueQBank
              </h3>
              <p className="text-slate-400">Making medical education engaging and effective through innovative learning technology</p>
              <div className="mt-4 flex space-x-4">
                {["facebook", "twitter", "instagram", "linkedin"].map((social, idx) => (
                  <a 
                    key={idx} 
                    href="#" 
                    className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            
            {[
              {
                title: "Subjects",
                links: ["Anatomy", "Pharmacology", "Pathology", "Physiology", "Biochemistry"]
              },
              {
                title: "Resources",
                links: ["Study Guides", "Progress Tracker", "Mobile App", "Study Groups", "Flashcards"]
              },
              {
                title: "Company",
                links: ["About Us", "Contact", "Careers", "Blog", "Support"]
              }
            ].map((column, colIdx) => (
              <div key={colIdx}>
                <h3 className="text-lg font-semibold mb-4">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a href="#" className="text-slate-400 hover:text-cyan-300 transition-colors block">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 flex flex-col md:flex-row justify-between items-center">
            <p>© 2024 CliniqueQ. Committed to medical education excellence.</p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-4 text-sm">
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Simple Floating Action Button */}
      <button 
        className="fixed bottom-8 right-8 bg-blue-600 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </div>
  );
}