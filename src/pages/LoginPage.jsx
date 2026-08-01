import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, FileText, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/api/supabaseClient';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (isSignup) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: { full_name: fullName.trim() }
          }
        });
        if (signUpError) throw signUpError;
        setSuccessMsg('Conta criada com sucesso! Redirecionando...');
        setTimeout(() => { navigate('/'); }, 1200);
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });
        if (signInError) throw signInError;
        navigate('/');
      }
    } catch (err) {
      console.error('Erro na autenticação:', err);
      setError(err.message || 'Falha na autenticação. Verifique os dados informados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5] flex items-center justify-center px-4 py-12 font-sans">

      <div className="w-full max-w-[380px] space-y-8">

        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-white tracking-tight">PropostaFácil</h1>
            <p className="text-[13px] text-[#555568] mt-0.5">Plataforma Comercial B2B</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#1e1e2e]">
          <button
            type="button"
            onClick={() => { setIsSignup(false); setError(''); setSuccessMsg(''); }}
            className={`flex-1 pb-2.5 text-sm font-medium transition cursor-pointer ${!isSignup
              ? 'text-white border-b-2 border-blue-500'
              : 'text-[#555568] hover:text-[#8888a0]'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setIsSignup(true); setError(''); setSuccessMsg(''); }}
            className={`flex-1 pb-2.5 text-sm font-medium transition cursor-pointer ${isSignup
              ? 'text-white border-b-2 border-blue-500'
              : 'text-[#555568] hover:text-[#8888a0]'
            }`}
          >
            Criar conta
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3 rounded-md bg-red-500/8 border border-red-500/20 flex items-start gap-2.5 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-md bg-emerald-500/8 border border-emerald-500/20 flex items-start gap-2.5 text-emerald-400 text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[#8888a0]">Nome completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555568]" />
                <input
                  type="text"
                  required={isSignup}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="João Victor"
                  disabled={loading}
                  className="w-full bg-transparent border border-[#1e1e2e] rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder-[#555568] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition disabled:opacity-50"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-[#8888a0]">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555568]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@empresa.com"
                disabled={loading}
                className="w-full bg-transparent border border-[#1e1e2e] rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder-[#555568] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[13px] font-medium text-[#8888a0]">Senha</label>
              {!isSignup && (
                <Link to="/forgot-password" className="text-[12px] text-blue-400 hover:text-blue-300 transition font-medium">
                  Esqueceu a senha?
                </Link>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555568]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full bg-transparent border border-[#1e1e2e] rounded-md pl-9 pr-9 py-2 text-sm text-white placeholder-[#555568] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555568] hover:text-[#8888a0] transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 py-2 rounded-md font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : (
              <>
                <span>{isSignup ? 'Criar conta' : 'Entrar'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="text-center space-y-3">
          <p className="text-[12px] text-[#555568]">
            Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade.
          </p>
          <Link to="/landing" className="text-[13px] font-medium text-[#8888a0] hover:text-white transition inline-flex items-center gap-1">
            <span>Conhecer a plataforma</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}