import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Application } from '../types';

const Applications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/api/applications');
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Erro ao buscar candidaturas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (appId: number, newStatus: string) => {
    try {
      await api.put(`/api/applications/${appId}`, { status: newStatus });
      alert('Status atualizado com sucesso!');
      fetchApplications();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao atualizar status');
    }
  };

  const handleDeleteApplication = async (appId: number) => {
    if (confirm('Tem certeza que deseja cancelar esta candidatura?')) {
      try {
        await api.delete(`/api/applications/${appId}`);
        alert('Candidatura cancelada com sucesso!');
        fetchApplications();
      } catch (error: any) {
        alert(error.response?.data?.error || 'Erro ao cancelar candidatura');
      }
    }
  };

  const filteredApplications = applications.filter(app => {
    return !filterStatus || app.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'orange';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'accepted':
        return 'Aceita';
      case 'rejected':
        return 'Rejeitada';
      default:
        return status;
    }
  };

  if (isLoading) {
    return <div>Carregando candidaturas...</div>;
  }

  return (
    <div>
      <h1>Minhas Candidaturas</h1>

      <div style={{ marginBottom: '2rem' }}>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '0.5rem' }}
        >
          <option value="">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="accepted">Aceita</option>
          <option value="rejected">Rejeitada</option>
        </select>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="card">
          <p>Você ainda não se candidatou para nenhuma vaga.</p>
        </div>
      ) : (
        <div>
          {filteredApplications.map((app) => (
            <div key={app.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3>{app.job_title}</h3>
                  <p><strong>Empresa:</strong> {app.job_company}</p>
                  <p><strong>Localização:</strong> {app.job_location}</p>
                  <p><strong>Status:</strong> 
                    <span style={{ color: getStatusColor(app.status), marginLeft: '0.5rem' }}>
                      {getStatusText(app.status)}
                    </span>
                  </p>
                  <p><strong>Data da candidatura:</strong> {new Date(app.created_at).toLocaleDateString('pt-BR')}</p>
                  <p><strong>Última atualização:</strong> {new Date(app.updated_at).toLocaleDateString('pt-BR')}</p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '1rem' }}>
                  <select
                    value={app.status}
                    onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                    style={{ padding: '0.5rem' }}
                  >
                    <option value="pending">Pendente</option>
                    <option value="accepted">Aceita</option>
                    <option value="rejected">Rejeitada</option>
                  </select>
                  
                  <button 
                    onClick={() => handleDeleteApplication(app.id)} 
                    className="btn btn-danger"
                  >
                    Cancelar Candidatura
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p>Total de candidaturas: {filteredApplications.length}</p>
      </div>
    </div>
  );
};

export default Applications;
