import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, FileText, ShieldCheck, Layers, ArrowRight, Loader2, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
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

  // Processar Login ou Cadastro
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (isSignup) {
        // Cadastro
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: { full_name: fullName.trim() }
          }
        });

        if (signUpError) throw signUpError;

        setSuccessMsg('Conta criada com sucesso! Redirecionando...');
        setTimeout(() => {
          navigate('/');
        }, 1200);

      } else {
        // Login
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
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* ELEMENTOS VISUAIS DE FUNDO (ELEGANT GLOW SUTIL)               */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-blue-900/15 via-indigo-900/15 to-slate-900/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-slate-800/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid sutil de fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* ------------------------------------------------------------- */}
      {/* CONTAINER PRINCIPAL SPLIT SCREEN CORPORATIVO                  */}
      {/* ------------------------------------------------------------- */}
      <div className="relative w-full max-w-5xl grid lg:grid-cols-12 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-10">

        {/* =========================================================== */}
        {/* COLUNA ESQUERDA - FORMULÁRIO DE AUTENTICAÇÃO CORPORATIVO    */}
        {/* =========================================================== */}
        <div className="lg:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            {/* Header da Marca */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md shadow-blue-600/20">
                  <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div>
                  <span className="font-bold text-xl tracking-tight text-white">
                    PropostaFácil
                  </span>
                  <span className="ml-2.5 px-2 py-0.5 text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/80 rounded-md">
                    B2B SaaS
                  </span>
                </div>
              </div>
            </div>

            {/* Alternador de Abas (Entrar / Criar Conta) */}
            <div className="flex bg-slate-950/70 p-1 rounded-xl border border-slate-800 mb-8">
              <button
                type="button"
                onClick={() => { setIsSignup(false); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${!isSignup
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                Entrar na Conta
              </button>
              <button
                type="button"
                onClick={() => { setIsSignup(true); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${isSignup
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                Criar Nova Conta
              </button>
            </div>

            {/* Título da Seção */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {isSignup ? 'Criar sua conta profissional' : 'Acessar a plataforma'}
              </h1>
              <p className="text-sm text-slate-400 mt-1.5">
                {isSignup
                  ? 'Cadastre-se para gerar e gerenciar propostas comerciais com facilidade.'
                  : 'Insira suas credenciais corporativas para acessar o painel.'}
              </p>
            </div>

            {/* Alertas de Erro e Sucesso */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm animate-in fade-in duration-150">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-400 text-sm animate-in fade-in duration-150">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required={isSignup}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: João Victor"
                      disabled={loading}
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition disabled:opacity-50"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Endereço de E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@empresa.com"
                    disabled={loading}
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Senha
                  </label>
                  {!isSignup && (
                    <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition font-medium">
                      Esqueceu a senha?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Botão de Envio */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-6 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 transition duration-200 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <>
                    <span>{isSignup ? 'Criar Conta' : 'Acessar Conta'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>


          </div>

          {/* Rodapé */}
          <div className="mt-8 text-center text-xs text-slate-500">
            Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade.
          </div>
        </div>

        {/* =========================================================== */}
        {/* COLUNA DIREITA - PAINEL SHOWCASE CORPORATIVO (DESKTOP)      */}
        {/* =========================================================== */}
        <div className="hidden lg:flex lg:col-span-6 bg-slate-950/90 p-12 flex-col justify-between relative overflow-hidden border-l border-slate-800/80">

          {/* Brilho decorativo sutil */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Topo Showcase */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Gestão Comercial Inteligente</span>
            </div>

            <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">
              Agilidade e precisão para suas <br />
              <span className="text-blue-400">
                propostas e contratos.
              </span>
            </h2>

            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Centralize a criação de propostas, formalização de contratos e controle de clientes em um ambiente seguro e de alta performance.
            </p>
          </div>

          {/* Recurso Corporativo */}
          <div className="relative z-10 space-y-4 my-8">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Geração Ágil de Documentos</h4>
                <p className="text-xs text-slate-400 mt-0.5">Padronização de propostas comerciais e contratos com cálculo automatizado de valores.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Infraestrutura Segura</h4>
                <p className="text-xs text-slate-400 mt-0.5">Armazenamento isolado no banco de dados MariaDB com encriptação e autenticação JWT.</p>
              </div>
            </div>
          </div>

          {/* Widget de Estatísticas */}
          <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-slate-400 text-xs">
            <div>
              <span className="block text-xl font-bold text-white">100%</span>
              <span>Seguro e Privado</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="block text-xl font-bold text-white">99.9%</span>
              <span>Disponibilidade</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="block text-xl font-bold text-white">B2B</span>
              <span>SaaS Profissional</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}