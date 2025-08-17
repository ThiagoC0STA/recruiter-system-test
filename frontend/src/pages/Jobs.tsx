import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Plus,
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Eye,
  Trash2,
  UserCheck,
  Loader2,
  CheckCircle,
  Clock as ClockIcon,
  XCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../utils/api";
import { Job, Application } from "../types";

const Jobs: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [userApplications, setUserApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    fetchJobs();
    if (user) {
      fetchUserApplications();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const response = await api.get("/api/jobs");
      setJobs(response.data.jobs);
    } catch (error) {
      console.error("Erro ao buscar vagas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserApplications = async () => {
    try {
      const response = await api.get("/api/applications");
      setUserApplications(response.data.applications || []);
    } catch (error) {
      console.error("Erro ao buscar candidaturas:", error);
    }
  };

  const handleApply = async (jobId: number) => {
    try {
      const response = await api.post("/api/applications", { job_id: jobId });
      alert("Candidatura realizada com sucesso!");
      
      // Atualizar imediatamente o estado local
      const newApplication: Application = {
        id: response.data.application_id || Date.now(),
        job_id: jobId,
        user_id: user!.id,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        job_title: jobs.find(j => j.id === jobId)?.title || '',
        job_company: jobs.find(j => j.id === jobId)?.company || '',
        job_location: jobs.find(j => j.id === jobId)?.location || '',
        user_name: user!.name
      };
      
      setUserApplications(prev => [...prev, newApplication]);
    } catch (error: any) {
      alert(error.response?.data?.error || "Erro ao se candidatar");
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (confirm("Tem certeza que deseja excluir esta vaga?")) {
      try {
        await api.delete(`/api/jobs/${jobId}`);
        alert("Vaga excluída com sucesso!");
        fetchJobs();
      } catch (error: any) {
        alert(error.response?.data?.error || "Erro ao excluir vaga");
      }
    }
  };

  const isApplied = (jobId: number) => {
    return userApplications.some(app => app.job_id === jobId);
  };

  const getApplicationStatus = (jobId: number) => {
    const application = userApplications.find(app => app.job_id === jobId);
    return application?.status || null;
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          text: 'Candidatura Enviada',
          icon: ClockIcon,
          className: 'bg-yellow-100 text-yellow-700 border-yellow-200'
        };
      case 'accepted':
        return {
          text: 'Candidatura Aceita',
          icon: CheckCircle,
          className: 'bg-green-100 text-green-700 border-green-200'
        };
      case 'rejected':
        return {
          text: 'Candidatura Rejeitada',
          icon: XCircle,
          className: 'bg-red-100 text-red-700 border-red-200'
        };
      default:
        return {
          text: 'Candidatura Enviada',
          icon: ClockIcon,
          className: 'bg-yellow-100 text-yellow-700 border-yellow-200'
        };
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || job.type === filterType;
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-5">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <p className="text-gray-600 text-lg">Carregando vagas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-primary-600" />
              Vagas Disponíveis
            </h1>
            <p className="text-xl text-gray-600">
              Encontre a oportunidade perfeita para sua carreira
            </p>
          </div>

          <Link 
            to="/create-job" 
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Criar Nova Vaga
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 placeholder:text-gray-400"
              placeholder="Buscar por título, empresa ou localização..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 appearance-none"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Todos os tipos</option>
              <option value="full-time">Tempo Integral</option>
              <option value="part-time">Meio Período</option>
              <option value="contract">Contrato</option>
            </select>
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma vaga encontrada</h3>
            <p className="text-gray-500">Tente ajustar os filtros de busca ou criar uma nova vaga</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow-soft border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                {/* Job Header */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-4">{job.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    job.type === "full-time" ? "bg-green-100 text-green-700" :
                    job.type === "part-time" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {job.type === "full-time"
                      ? "Tempo Integral"
                      : job.type === "part-time"
                      ? "Meio Período"
                      : "Contrato"}
                  </span>
                </div>

                {/* Job Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span>{job.company}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{job.location}</span>
                  </div>

                  {job.salary && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span>{job.salary}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Publicada há 2 dias</span>
                  </div>
                </div>

                {/* Job Description */}
                <p className="text-gray-700 text-sm mb-6 leading-relaxed">
                  {job.description.length > 150
                    ? `${job.description.substring(0, 150)}...`
                    : job.description}
                </p>

                {/* Job Actions */}
                <div className="flex gap-3">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="flex-1 bg-white text-primary-600 border border-primary-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary-50 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalhes
                  </Link>

                  {isApplied(job.id) ? (
                    (() => {
                      const status = getApplicationStatus(job.id);
                      const statusDisplay = getStatusDisplay(status || 'pending');
                      const StatusIcon = statusDisplay.icon;
                      
                      return (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${statusDisplay.className}`}>
                          <StatusIcon className="w-4 h-4" />
                          {statusDisplay.text}
                        </div>
                      );
                    })()
                  ) : (
                    <button
                      onClick={() => handleApply(job.id)}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary-700 hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      Candidatar-se
                    </button>
                  )}

                  {job.user_id === user?.id ? (
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-red-700 hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
