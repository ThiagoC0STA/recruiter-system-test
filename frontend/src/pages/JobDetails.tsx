import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  Loader2,
  CheckCircle,
  Clock as ClockIcon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../utils/api";
import { Job, Application } from "../types";

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [userApplication, setUserApplication] = useState<Application | null>(
    null
  );
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJobDetails(parseInt(id));
      if (user) {
        fetchUserApplication(parseInt(id));
      }
    }
  }, [id, user]);

  // Recarregar candidatura quando a página for focada novamente
  useEffect(() => {
    const handleFocus = () => {
      if (id && user && !isLoading) {
        fetchUserApplication(parseInt(id));
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [id, user, isLoading]);

  const fetchJobDetails = async (jobId: number) => {
    try {
      const response = await api.get(`/api/jobs/${jobId}`);
      setJob(response.data.job);
    } catch (error: any) {
      setError("Erro ao carregar detalhes da vaga");
      console.error("Erro ao buscar vaga:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserApplication = async (jobId: number) => {
    try {
      console.log('Buscando candidatura do usuário para job:', jobId);
      const response = await api.get('/api/applications');
      console.log('Resposta das candidaturas:', response.data);
      
      const applications = response.data.applications || [];
      const userApp = applications.find((app: Application) => app.job_id === jobId);
      
      console.log('Candidatura encontrada:', userApp);
      setUserApplication(userApp || null);
    } catch (error) {
      console.error('Erro ao buscar candidatura do usuário:', error);
      setUserApplication(null);
    }
  };

  const handleApply = async () => {
    if (!job) return;
    
    setIsApplying(true);
    try {
      const response = await api.post('/api/applications', { job_id: job.id });
      console.log('Candidatura criada:', response.data);
      
      // Criar uma candidatura local para mostrar imediatamente
      const newApplication: Application = {
        id: response.data.application_id || Date.now(), // Fallback se não tiver ID
        job_id: job.id,
        user_id: user!.id,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        job_title: job.title,
        job_company: job.company,
        job_location: job.location,
        user_name: user!.name
      };
      
      setUserApplication(newApplication);
      alert('Candidatura realizada com sucesso!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao se candidatar');
    } finally {
      setIsApplying(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!job || !confirm("Tem certeza que deseja excluir esta vaga?")) return;

    try {
      await api.delete(`/api/jobs/${job.id}`);
      alert("Vaga excluída com sucesso!");
      navigate("/jobs");
    } catch (error: any) {
      alert(error.response?.data?.error || "Erro ao excluir vaga");
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "accepted":
        return "Aprovada";
      case "rejected":
        return "Rejeitada";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-5 h-5" />;
      case "rejected":
        return <ClockIcon className="w-5 h-5" />;
      default:
        return <ClockIcon className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  console.log("Job Details Debug:", {
    job,
    user,
    jobUserId: job?.user_id,
    currentUserId: user?.id,
    shouldShowApplyButton: job?.user_id !== user?.id,
    userApplication,
    jobUserIdType: typeof job?.user_id,
    currentUserIdType: typeof user?.id,
  });

  // Verificação mais robusta para determinar se deve mostrar o botão
  const shouldShowApplyButton = user && job && job.user_id !== user.id;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-5">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <p className="text-gray-600 text-lg">Carregando detalhes da vaga...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Erro ao carregar vaga
          </h2>
          <p className="text-gray-600 mb-6">{error || "Vaga não encontrada"}</p>
          <Link
            to="/jobs"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-primary-700 hover:shadow-md hover:-translate-y-0.5 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Vagas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <button
            onClick={() => navigate("/jobs")}
            className="bg-white text-gray-600 border border-gray-300 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para Vagas
          </button>

          {job.user_id === user?.id && (
            <div className="flex gap-3">
              <Link
                to={`/jobs/${job.id}/edit`}
                className="bg-white text-primary-600 border border-primary-600 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-primary-50 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar
              </Link>
              <button
                onClick={handleDeleteJob}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-red-700 hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Excluir
              </button>
            </div>
          )}
        </div>

        {/* Job Details Card */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8">
          {/* Job Title Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
            <h1 className="text-4xl font-bold text-gray-900 flex-1">
              {job.title}
            </h1>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider ${
                job.type === "full-time"
                  ? "bg-green-100 text-green-700"
                  : job.type === "part-time"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {job.type === "full-time"
                ? "Tempo Integral"
                : job.type === "part-time"
                ? "Meio Período"
                : "Contrato"}
            </span>
          </div>

          {/* Job Meta */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-gray-500" />
              <div>
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Empresa
                </span>
                <span className="text-lg font-medium text-gray-900">
                  {job.company}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Localização
                </span>
                <span className="text-lg font-medium text-gray-900">
                  {job.location}
                </span>
              </div>
            </div>

            {job.salary && (
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-500" />
                <div>
                  <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Salário
                  </span>
                  <span className="text-lg font-medium text-gray-900">
                    {job.salary}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Publicada em
                </span>
                <span className="text-lg font-medium text-gray-900">
                  {new Date(job.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-500" />
              <div>
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Publicada por
                </span>
                <span className="text-lg font-medium text-gray-900">
                  {job.user_name || "Usuário"}
                </span>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Descrição da Vaga
            </h2>
            <div className="prose prose-gray max-w-none">
              {job.description.split("\n").map((paragraph, index) => (
                <p
                  key={index}
                  className="text-gray-700 leading-relaxed mb-4 last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Apply Section */}
          {shouldShowApplyButton && (
            <div className="pt-8 border-t border-gray-200 text-center">
              {userApplication ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    {getStatusIcon(userApplication.status)}
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider ${getStatusColor(
                        userApplication.status
                      )}`}
                    >
                      {getStatusText(userApplication.status)}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    Você já se candidatou para esta vaga em{" "}
                    {new Date(userApplication.created_at).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                  <Link
                    to="/applications"
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-primary-700 hover:shadow-md hover:-translate-y-0.5 inline-flex items-center gap-2"
                  >
                    Ver Minhas Candidaturas
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 text-lg">
                    Interessado nesta vaga?
                  </p>
                  <button
                    onClick={handleApply}
                    disabled={isApplying}
                    className="bg-primary-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none flex items-center gap-3 mx-auto"
                  >
                    {isApplying ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Candidatando...
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-6 h-6" />
                        Candidatar-se a esta Vaga
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
