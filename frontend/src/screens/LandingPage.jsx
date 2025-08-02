import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 lg:px-12">
        <div className="text-2xl font-bold tracking-wide">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            CollabSpace
          </span>
        </div>
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-6 py-2 text-white border border-white/20 rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Collaborate
            </span>
            <br />
            <span className="text-white">In Real-Time</span>
          </h1>
          
          <p className="text-xl lg:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Create projects, invite team members, and collaborate seamlessly with real-time messaging and project management.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 transform"
            >
              Start Collaborating Now
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border border-white/20 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Sign In
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Chat</h3>
              <p className="text-gray-300">Communicate instantly with your team members in project-specific chat rooms.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-3xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Team Management</h3>
              <p className="text-gray-300">Easily add and manage team members across multiple projects.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Project Organization</h3>
              <p className="text-gray-300">Keep all your projects organized and accessible in one place.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;