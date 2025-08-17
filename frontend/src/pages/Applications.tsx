import React, { useState, useEffect } from 'react';
import { UserCheck, Filter, Calendar, Building2, MapPin, Clock, Trash2, Loader2 } from 'lucide-react';
import { api } from '../utils/api';
import { Application } from '../types';

const Applications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Applications component mounted');
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      console.log('Fetching applications...');
      const response = await api.get('/api/applications');
      console.log('Applications response:', response);
      setApplications(response.data.applications || []);
    } catch (error: any) {
      console.error('Erro ao buscar candidaturas:', error);
      setError(error.response?.data?.error || 'Erro ao carregar candidaturas');
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

  console.log('Applications state:', applications);
  console.log('Filtered applications:', filteredApplications);
  console.log('Is loading:', isLoading);
  console.log('Error:', error);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-5">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <p className="text-gray-600 text-lg">Carregando candidaturas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-5">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar candidaturas</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchApplications}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-primary-700 hover:shadow-md hover:-translate-y-0.5"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-primary-600" />
            Minhas Candidaturas
          </h1>
          <p className="text-xl text-gray-600">
            Acompanhe o status de todas as suas candidaturas
          </p>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 appearance-none"
            >
              <option value="">Todos os status</option>
              <option value="pending">Pendente</option>
              <option value="accepted">Aceita</option>
              <option value="rejected">Rejeitada</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-12 text-center">
            <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma candidatura encontrada</h3>
            <p className="text-gray-500">Você ainda não se candidatou para nenhuma vaga.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((app) => (
              <div key={app.id} className="bg-white rounded-xl shadow-soft border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  {/* Application Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{app.job_title}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{app.job_company}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{app.job_location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">Candidatura: {new Date(app.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">Atualizado: {new Date(app.updated_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        app.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {app.status === 'pending' ? 'Pendente' :
                         app.status === 'accepted' ? 'Aceita' : 'Rejeitada'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-3 lg:w-48">
                    <select
                      value={app.status}
                      onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    >
                      <option value="pending">Pendente</option>
                      <option value="accepted">Aceita</option>
                      <option value="rejected">Rejeitada</option>
                    </select>
                    
                    <button 
                      onClick={() => handleDeleteApplication(app.id)} 
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-red-700 hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 font-medium">
            Total de candidaturas: <span className="text-primary-600 font-semibold">{filteredApplications.length}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Applications;
