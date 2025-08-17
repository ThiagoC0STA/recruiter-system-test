import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle, Plus, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validação do nome
    if (!name.trim()) {
      setError('Nome é obrigatório');
      setIsLoading(false);
      return;
    }

    if (name.trim().length < 2) {
      setError('Nome deve ter pelo menos 2 caracteres');
      setIsLoading(false);
      return;
    }

    // Verificar se o nome não parece ser um email
    if (name.includes('@')) {
      setError('Parece que você colocou um email no campo de nome. Verifique os campos!');
      setIsLoading(false);
      return;
    }

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

    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    // Verificar se a senha não parece ser um email
    if (password.includes('@')) {
      setError('Parece que você colocou um email no campo de senha. Verifique os campos!');
      setIsLoading(false);
      return;
    }

    // Validação da confirmação de senha
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
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
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <h1 className="card-title">Crie sua conta</h1>
            <p className="card-subtitle">Junte-se à nossa plataforma de recrutamento</p>
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
                <User className="w-4 h-4 inline mr-2" />
                Nome completo
              </label>
              <input
                type="text"
                className="input"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Senha
              </label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Confirmar senha
              </label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="btn btn-secondary w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Criando conta...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Criar conta
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-secondary hover:text-primary font-medium transition-colors">
                  Faça login aqui
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>


    </div>
  );
};

export default Register;
