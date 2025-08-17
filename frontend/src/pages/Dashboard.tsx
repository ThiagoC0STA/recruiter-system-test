import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Plus, 
  Search,
  User,
  Building2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Job, Application } from '../types';
import { getJobs, getApplications } from '../utils/api';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsData, applicationsData] = await Promise.all([
          getJobs(),
          getApplications()
        ]);
        setJobs(jobsData);
        setApplications(applicationsData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const myJobs = jobs.filter(job => job.user_id === user?.id);
  const myApplications = applications.filter(app => app.user_id === user?.id);
  
  const pendingApplications = myApplications.filter(app => app.status === 'pending');
  const acceptedApplications = myApplications.filter(app => app.status === 'accepted');
  const rejectedApplications = myApplications.filter(app => app.status === 'rejected');

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1 className="welcome-title">
            Olá, <span className="user-name">{user?.name}</span>! 👋
          </h1>
          <p className="welcome-subtitle">
            Bem-vindo ao seu painel de controle de recrutamento
          </p>
        </div>
        
        <div className="quick-actions">
          <Link to="/create-job" className="btn btn-primary">
            <Plus className="w-5 h-5" />
            Criar Nova Vaga
          </Link>
          
          <Link to="/jobs" className="btn btn-outline">
            <Search className="w-5 h-5" />
            Ver Todas as Vagas
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue">
            <Briefcase className="w-8 h-8" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{myJobs.length}</h3>
            <p className="stat-label">Minhas Vagas</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-green">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{acceptedApplications.length}</h3>
            <p className="stat-label">Candidaturas Aprovadas</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-yellow">
            <Clock className="w-8 h-8" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{pendingApplications.length}</h3>
            <p className="stat-label">Candidaturas Pendentes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-red">
            <XCircle className="w-8 h-8" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{rejectedApplications.length}</h3>
            <p className="stat-label">Candidaturas Rejeitadas</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-grid">
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Minhas Vagas</h2>
              <Link to="/jobs" className="section-link">Ver todas</Link>
            </div>
            
            {myJobs.length === 0 ? (
              <div className="empty-state">
                <Briefcase className="w-16 h-16" />
                <h3>Nenhuma vaga criada</h3>
                <p>Crie sua primeira vaga para começar a recrutar candidatos</p>
                <Link to="/create-job" className="btn btn-primary">
                  Criar Primeira Vaga
                </Link>
              </div>
            ) : (
              <div className="jobs-grid">
                {myJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="job-card">
                    <div className="job-header">
                      <h3 className="job-title">{job.title}</h3>
                      <span className={`job-type job-type-${job.type}`}>
                        {job.type === 'full-time' ? 'Tempo Integral' : 
                         job.type === 'part-time' ? 'Meio Período' : 'Contrato'}
                      </span>
                    </div>
                    <p className="job-company">{job.company}</p>
                    <p className="job-location">{job.location}</p>
                    <div className="job-actions">
                      <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm">
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Minhas Candidaturas</h2>
              <Link to="/applications" className="section-link">Ver todas</Link>
            </div>
            
            {myApplications.length === 0 ? (
              <div className="empty-state">
                <User className="w-16 h-16" />
                <h3>Nenhuma candidatura</h3>
                <p>Candidate-se a vagas para acompanhar seu progresso</p>
                <Link to="/jobs" className="btn btn-primary">
                  Ver Vagas Disponíveis
                </Link>
              </div>
            ) : (
              <div className="applications-list">
                {myApplications.slice(0, 3).map((application) => {
                  const job = jobs.find(j => j.id === application.job_id);
                  return (
                    <div key={application.id} className="application-item">
                      <div className="application-info">
                        <h4>{job?.title || 'Vaga não encontrada'}</h4>
                        <p className="application-company">{job?.company || 'Empresa não encontrada'}</p>
                      </div>
                      <span className={`status-badge status-${application.status}`}>
                        {application.status === 'pending' ? 'Pendente' :
                         application.status === 'accepted' ? 'Aprovada' : 'Rejeitada'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
