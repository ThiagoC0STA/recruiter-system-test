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
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../utils/api";
import { Job } from "../types";

const Jobs: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

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

  const handleApply = async (jobId: number) => {
    try {
      await api.post("/api/applications", { job_id: jobId });
      alert("Candidatura realizada com sucesso!");
      fetchJobs();
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
      <div className="jobs-loading">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p>Carregando vagas...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="jobs-container">
        <div className="jobs-header">
          <div className="header-content">
            <h1 className="page-title">
              <Building2 className="w-8 h-8" />
              Vagas Disponíveis
            </h1>
            <p className="page-subtitle">
              Encontre a oportunidade perfeita para sua carreira
            </p>
          </div>

          <Link to="/create-job" className="btn btn-primary">
            <Plus className="w-5 h-5" />
            Criar Nova Vaga
          </Link>
        </div>

        <div className="search-filters">
          <div className="search-box">
            <Search className="w-5 h-5" />
            <input
              type="text"
              className="input"
              placeholder="Buscar por título, empresa ou localização..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="search-box">
            <Filter className="w-5 h-5" />
            <select
              className="input"
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

        {filteredJobs.length === 0 ? (
          <div className="empty-state">
            <Building2 className="w-16 h-16" />
            <h3>Nenhuma vaga encontrada</h3>
            <p>Tente ajustar os filtros de busca ou criar uma nova vaga</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {filteredJobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <h3 className="job-title">{job.title}</h3>
                  <span className={`job-type job-type-${job.type}`}>
                    {job.type === "full-time"
                      ? "Tempo Integral"
                      : job.type === "part-time"
                      ? "Meio Período"
                      : "Contrato"}
                  </span>
                </div>

                <div className="job-details">
                  <div className="job-info">
                    <Building2 className="w-4 h-4" />
                    <span>{job.company}</span>
                  </div>

                  <div className="job-info">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>

                  {job.salary && (
                    <div className="job-info">
                      <DollarSign className="w-4 h-4" />
                      <span>{job.salary}</span>
                    </div>
                  )}

                  <div className="job-info">
                    <Clock className="w-4 h-4" />
                    <span>Publicada há 2 dias</span>
                  </div>
                </div>

                <p className="job-description">
                  {job.description.length > 150
                    ? `${job.description.substring(0, 150)}...`
                    : job.description}
                </p>

                <div className="job-actions">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="btn btn-outline btn-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalhes
                  </Link>

                  {job.user_id === user?.id ? (
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="btn btn-danger btn-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApply(job.id)}
                      className="btn btn-primary btn-sm"
                    >
                      <UserCheck className="w-4 h-4" />
                      Candidatar-se
                    </button>
                  )}
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
