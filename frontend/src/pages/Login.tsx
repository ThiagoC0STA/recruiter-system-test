import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';
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
            <div className="auth-container">


      <div className="auth-card animate-fade-in">
        <div className="card">
          <div className="card-header">
            <div className="logo-container">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12">
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <h1 className="card-title">Bem-vindo de volta!</h1>
            <p className="card-subtitle">Entre com suas credenciais para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="alert alert-error animate-pulse">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <div className="input-group">
              <label className="input-label">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                className="input"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                <Lock className="w-4 h-4 inline mr-2" />
                Senha
              </label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
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

            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Não tem uma conta?{' '}
                <Link to="/register" className="text-primary hover:text-primary-dark font-medium transition-colors">
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
