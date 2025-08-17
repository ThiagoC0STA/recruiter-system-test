import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2, AlertCircle, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validação do email
    if (!email.trim()) {
      setError('Email é obrigatório');
      setIsLoading(false);
      return;
    }

    // Regex para validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Email inválido. Use o formato: seu@email.com');
      setIsLoading(false);
      return;
    }

    // Verificar se o email não parece ser um nome
    if (email.trim().length < 5 || !email.includes('@')) {
      setError('Parece que você colocou um nome no campo de email. Verifique os campos!');
      setIsLoading(false);
      return;
    }

    // Validação da senha
    if (!password) {
      setError('Senha é obrigatória');
      setIsLoading(false);
      return;
    }

    // Verificar se a senha não parece ser um email
    if (password.includes('@')) {
      setError('Parece que você colocou um email no campo de senha. Verifique os campos!');
      setIsLoading(false);
      return;
    }

    try {
      await login(email.trim().toLowerCase(), password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Building2 className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta!</h1>
            <p className="text-gray-600">Entre com suas credenciais para continuar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3 animate-pulse">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2 text-gray-500" />
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 placeholder:text-gray-400"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2 text-gray-500" />
                Senha
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 placeholder:text-gray-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-primary-700 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  Entrar
                </>
              )}
            </button>

            <div className="text-center pt-4">
              <p className="text-gray-600 text-sm">
                Não tem uma conta?{' '}
                <Link 
                  to="/register" 
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 underline-offset-2 hover:underline"
                >
                  Registre-se aqui
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
