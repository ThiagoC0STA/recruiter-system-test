import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  UserCheck, 
  Plus, 
  User, 
  LogOut,
  Building2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3 text-gray-900 hover:text-primary-600 transition-colors duration-200">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-semibold hidden sm:block">RecruitPro</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
            >
              <Briefcase className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              to="/jobs" 
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
            >
              <Briefcase className="w-4 h-4" />
              <span>Vagas</span>
            </Link>
            
            <Link 
              to="/applications" 
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
            >
              <UserCheck className="w-4 h-4" />
              <span>Candidaturas</span>
            </Link>
            
            <Link 
              to="/create-job" 
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Vaga</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center text-white">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
            </div>
            
            <button 
              onClick={handleLogout} 
              className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
