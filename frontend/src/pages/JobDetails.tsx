import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar,
  User,
  Edit,
  Trash2,
  UserCheck,
  Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { Job } from '../types';

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchJobDetails(parseInt(id));
    }
  }, [id]);

  const fetchJobDetails = async (jobId: number) => {
    try {
      const response = await api.get(`/api/jobs/${jobId}`);
      setJob(response.data.job);
    } catch (error: any) {
      setError('Erro ao carregar detalhes da vaga');
      console.error('Erro ao buscar vaga:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    if (!job) return;
    
    try {
      await api.post('/api/applications', { job_id: job.id });
      alert('Candidatura realizada com sucesso!');
      navigate('/applications');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao se candidatar');
    }
  };

  const handleDeleteJob = async () => {
    if (!job || !confirm('Tem certeza que deseja excluir esta vaga?')) return;
    
    try {
      await api.delete(`/api/jobs/${job.id}`);
      alert('Vaga excluída com sucesso!');
      navigate('/jobs');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao excluir vaga');
    }
  };

  if (isLoading) {
    return (
      <div className="job-details-loading">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p>Carregando detalhes da vaga...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Erro ao carregar vaga</h2>
          <p>{error || 'Vaga não encontrada'}</p>
          <Link to="/jobs" className="btn btn-primary">
            <ArrowLeft className="w-4 h-4" />
            Voltar para Vagas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="job-details-container">
        <div className="job-details-header">
          <button 
            onClick={() => navigate('/jobs')} 
            className="btn btn-outline"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para Vagas
          </button>
          
          {job.user_id === user?.id && (
            <div className="job-owner-actions">
              <Link to={`/jobs/${job.id}/edit`} className="btn btn-outline">
                <Edit className="w-4 h-4" />
                Editar
              </Link>
              <button 
                onClick={handleDeleteJob} 
                className="btn btn-danger"
              >
                <Trash2 className="w-4 h-4" />
                Excluir
              </button>
            </div>
          )}
        </div>

        <div className="job-details-card">
          <div className="job-title-section">
            <h1 className="job-title">{job.title}</h1>
            <span className={`job-type job-type-${job.type}`}>
              {job.type === 'full-time' ? 'Tempo Integral' : 
               job.type === 'part-time' ? 'Meio Período' : 'Contrato'}
            </span>
          </div>

          <div className="job-meta">
            <div className="meta-item">
              <Building2 className="w-5 h-5" />
              <div>
                <span className="meta-label">Empresa</span>
                <span className="meta-value">{job.company}</span>
              </div>
            </div>

            <div className="meta-item">
              <MapPin className="w-5 h-5" />
              <div>
                <span className="meta-label">Localização</span>
                <span className="meta-value">{job.location}</span>
              </div>
            </div>

            {job.salary && (
              <div className="meta-item">
                <DollarSign className="w-5 h-5" />
                <div>
                  <span className="meta-label">Salário</span>
                  <span className="meta-value">{job.salary}</span>
                </div>
              </div>
            )}

            <div className="meta-item">
              <Calendar className="w-5 h-5" />
              <div>
                <span className="meta-label">Publicada em</span>
                <span className="meta-value">
                  {new Date(job.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            <div className="meta-item">
              <User className="w-5 h-5" />
              <div>
                <span className="meta-label">Publicada por</span>
                <span className="meta-value">{job.user_name || 'Usuário'}</span>
              </div>
            </div>
          </div>

          <div className="job-description-section">
            <h2>Descrição da Vaga</h2>
            <div className="job-description">
              {job.description.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {job.user_id !== user?.id && (
            <div className="job-apply-section">
              <button 
                onClick={handleApply} 
                className="btn btn-primary btn-large"
              >
                <UserCheck className="w-5 h-5" />
                Candidatar-se a esta Vaga
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
