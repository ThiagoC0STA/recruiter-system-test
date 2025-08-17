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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-primary-600" />
              Criar Nova Vaga
            </h1>
            <p className="text-lg text-gray-600">
              Publique uma nova oportunidade de emprego
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/jobs')}
            className="bg-white text-gray-600 border border-gray-300 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            Cancelar
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3 mb-6">
              <X className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Grid Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2 text-gray-500" />
                  Título da Vaga *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 placeholder:text-gray-400"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Ex: Desenvolvedor Full Stack"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4 inline mr-2 text-gray-500" />
                  Empresa *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 placeholder:text-gray-400"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  placeholder="Ex: TechCorp Ltda"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2 text-gray-500" />
                  Localização *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 placeholder:text-gray-400"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  placeholder="Ex: São Paulo, SP"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2 text-gray-500" />
                  Tipo de Contrato *
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="full-time">Tempo Integral</option>
                  <option value="part-time">Meio Período</option>
                  <option value="contract">Contrato</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2 text-gray-500" />
                  Salário (opcional)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 placeholder:text-gray-400"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="Ex: R$ 5.000 - R$ 8.000"
                />
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2 text-gray-500" />
                Descrição da Vaga *
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 placeholder:text-gray-400 resize-vertical"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={8}
                placeholder="Descreva as responsabilidades, requisitos e benefícios da vaga..."
              />
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-gray-200">
              <button 
                type="submit" 
                className="bg-primary-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none flex items-center justify-center gap-2"
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
