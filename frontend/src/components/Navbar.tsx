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
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/dashboard" className="brand-link">
            <div className="brand-icon">
              <Building2 className="w-8 h-8" />
            </div>
            <span className="brand-text">RecruitPro</span>
          </Link>
        </div>

        <div className="navbar-nav">
          <Link to="/dashboard" className="nav-link">
            <Briefcase className="w-5 h-5" />
            Dashboard
          </Link>
          
          <Link to="/jobs" className="nav-link">
            <Briefcase className="w-5 h-5" />
            Vagas
          </Link>
          
          <Link to="/applications" className="nav-link">
            <UserCheck className="w-5 h-5" />
            Candidaturas
          </Link>
          
          <Link to="/create-job" className="nav-link">
            <Plus className="w-5 h-5" />
            Criar Vaga
          </Link>
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <div className="user-avatar">
              <User className="w-6 h-6" />
            </div>
            <span className="user-name-nav">{user.name}</span>
          </div>
          
          <button onClick={handleLogout} className="logout-btn">
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </div>


    </nav>
  );
};

export default Navbar;
