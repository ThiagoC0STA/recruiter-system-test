import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Applications from './pages/Applications';
import CreateJob from './pages/CreateJob';
import JobDetails from './pages/JobDetails';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {user && <Navbar />}
      <div className="container">
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/dashboard" /> : <Register />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/jobs" 
            element={user ? <Jobs /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/jobs/:id" 
            element={user ? <JobDetails /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/applications" 
            element={user ? <Applications /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/create-job" 
            element={user ? <CreateJob /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
