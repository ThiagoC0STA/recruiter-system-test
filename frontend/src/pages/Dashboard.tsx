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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-5">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 text-lg">Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Olá, <span className="text-primary-600">{user?.name}</span>! 👋
            </h1>
            <p className="text-xl text-gray-600">
              Bem-vindo ao seu painel de controle de recrutamento
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              to="/create-job" 
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Criar Nova Vaga
            </Link>
            
            <Link 
              to="/jobs" 
              className="bg-white text-primary-600 border border-primary-600 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-primary-50 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Ver Todas as Vagas
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center text-white">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">{myJobs.length}</h3>
                <p className="text-gray-600 font-medium">Minhas Vagas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">{acceptedApplications.length}</h3>
                <p className="text-gray-600 font-medium">Candidaturas Aprovadas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center text-white">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">{pendingApplications.length}</h3>
                <p className="text-gray-600 font-medium">Candidaturas Pendentes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">{rejectedApplications.length}</h3>
                <p className="text-gray-600 font-medium">Candidaturas Rejeitadas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Minhas Vagas */}
          <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Minhas Vagas</h2>
              <Link 
                to="/jobs" 
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 underline-offset-2 hover:underline"
              >
                Ver todas
              </Link>
            </div>
            
            {myJobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma vaga criada</h3>
                <p className="text-gray-500 mb-6">Crie sua primeira vaga para começar a recrutar candidatos</p>
                <Link 
                  to="/create-job" 
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-primary-700 hover:shadow-md hover:-translate-y-0.5 inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Criar Primeira Vaga
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition-all duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-4">{job.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        job.type === 'full-time' ? 'bg-green-100 text-green-700' :
                        job.type === 'part-time' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {job.type === 'full-time' ? 'Tempo Integral' : 
                         job.type === 'part-time' ? 'Meio Período' : 'Contrato'}
                      </span>
                    </div>
                    <p className="text-gray-700 font-medium mb-1">{job.company}</p>
                    <p className="text-gray-500 text-sm mb-4">{job.location}</p>
                    <div className="flex justify-end">
                      <Link 
                        to={`/jobs/${job.id}`} 
                        className="bg-white text-primary-600 border border-primary-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary-50"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Minhas Candidaturas */}
          <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Minhas Candidaturas</h2>
              <Link 
                to="/applications" 
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 underline-offset-2 hover:underline"
              >
                Ver todas
              </Link>
            </div>
            
            {myApplications.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma candidatura</h3>
                <p className="text-gray-500 mb-6">Candidate-se a vagas para acompanhar seu progresso</p>
                <Link 
                  to="/jobs" 
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-primary-700 hover:shadow-md hover:-translate-y-0.5 inline-flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Ver Vagas Disponíveis
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myApplications.slice(0, 3).map((application) => {
                  const job = jobs.find(j => j.id === application.job_id);
                  return (
                    <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition-all duration-200">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{job?.title || 'Vaga não encontrada'}</h4>
                          <p className="text-gray-600 text-sm">{job?.company || 'Empresa não encontrada'}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          application.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          application.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {application.status === 'pending' ? 'Pendente' :
                           application.status === 'accepted' ? 'Aprovada' : 'Rejeitada'}
                        </span>
                      </div>
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
