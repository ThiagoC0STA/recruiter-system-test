import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign, 
  FileText, 
  Plus, 
  X,
  Loader2
} from 'lucide-react';
import { api } from '../utils/api';

const CreateJob: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [type, setType] = useState('full-time');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('/api/jobs', {
        title,
        description,
        company,
        location,
        salary,
        type
      });
      
      navigate('/jobs');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Erro ao criar vaga');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="create-job-container">
        <div className="create-job-header">
          <div className="header-content">
            <h1 className="page-title">
              <Briefcase className="w-8 h-8" />
              Criar Nova Vaga
            </h1>
            <p className="page-subtitle">
              Publique uma nova oportunidade de emprego
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/jobs')}
            className="btn btn-outline"
          >
            <X className="w-5 h-5" />
            Cancelar
          </button>
        </div>

        <div className="create-job-card">
          {error && (
            <div className="alert alert-error">
              <X className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="create-job-form">
            <div className="form-grid">
              <div className="input-group">
                <label className="input-label">
                  <Briefcase className="w-4 h-4" />
                  Título da Vaga *
                </label>
                <input
                  type="text"
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Ex: Desenvolvedor Full Stack"
                />
              </div>

              <div className="input-group">
                <label className="input-label">
                  <Building2 className="w-4 h-4" />
                  Empresa *
                </label>
                <input
                  type="text"
                  className="input"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  placeholder="Ex: TechCorp Ltda"
                />
              </div>

              <div className="input-group">
                <label className="input-label">
                  <MapPin className="w-4 h-4" />
                  Localização *
                </label>
                <input
                  type="text"
                  className="input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  placeholder="Ex: São Paulo, SP"
                />
              </div>

              <div className="input-group">
                <label className="input-label">
                  <Clock className="w-4 h-4" />
                  Tipo de Contrato *
                </label>
                <select
                  className="input"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="full-time">Tempo Integral</option>
                  <option value="part-time">Meio Período</option>
                  <option value="contract">Contrato</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">
                  <DollarSign className="w-4 h-4" />
                  Salário (opcional)
                </label>
                <input
                  type="text"
                  className="input"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="Ex: R$ 5.000 - R$ 8.000"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <FileText className="w-4 h-4" />
                Descrição da Vaga *
              </label>
              <textarea
                className="input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={8}
                placeholder="Descreva as responsabilidades, requisitos e benefícios da vaga..."
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Criando Vaga...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Criar Vaga
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
