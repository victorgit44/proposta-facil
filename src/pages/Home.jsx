import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '../api/supabaseClient';
import { queryClient } from '../queryClient';
import { formatCurrency } from '../utils/formatters';
import { 
  Loader2, AlertCircle, TrendingUp, FileText, 
  Sparkles, Plus, ArrowUpRight, CheckCircle2, 
  Clock, DollarSign, Layers, ShieldCheck, Zap,
  Briefcase, MessageSquare, ChevronRight, User
} from 'lucide-react';
import { ProposalCard } from '../components/ProposalCard';
import { useAuth } from '../context/AuthContext';
import { PLAN_LIMITS } from '@/config';

const defaultSubscription = {
  plano: 'Gratuito',
  propostas_criadas_mes: 0,
  contratos_criadas_mes: 0,
  mensagens_ia_mes: 0,
};

export default function Home() {
  const { user } = useAuth();

  const {
    data: propostasData,
    isLoading: loadingPropostas,
    error: errorPropostas
  } = useQuery({
    queryKey: ['propostas'],
    queryFn: () => base44.entities.Proposta.list(),
    enabled: !!user,
  });
  const propostas = propostasData || [];

  const {
    data: assinaturaData,
    isLoading: loadingAssinatura,
    error: errorAssinatura
  } = useQuery({
    queryKey: ['assinatura'],
    queryFn: async () => {
      const data = await base44.entities.Assinatura.list();
      return data[0] || defaultSubscription;
    },
    enabled: !!user,
  });
  const assinatura = assinaturaData || defaultSubscription;

  const isLoading = loadingPropostas || loadingAssinatura;
  const error = errorPropostas || errorAssinatura;

  const stats = useMemo(() => {
    const totalPropostas = propostas.length;
    const aprovadas = propostas.filter(p => p.status === 'aprovada');
    const pendentes = propostas.filter(p => p.status === 'enviada' || p.status === 'rascunho' || !p.status);
    const totalAprovadas = aprovadas.length;
    const valorTotalAprovadas = aprovadas.reduce((sum, p) => sum + (parseFloat(p.valor_total) || 0), 0);
    const valorTotalEmAberto = pendentes.reduce((sum, p) => sum + (parseFloat(p.valor_total) || 0), 0);
    const taxaAprovacao = totalPropostas > 0 ? (totalAprovadas / totalPropostas) * 100 : 0;
    return {
      totalPropostas,
      totalAprovadas,
      valorTotal: formatCurrency(valorTotalAprovadas),
      valorEmAberto: formatCurrency(valorTotalEmAberto),
      taxaAprovacao: `${taxaAprovacao.toFixed(0)}%`,
    };
  }, [propostas]);

  const recentes = useMemo(() => {
    if (!Array.isArray(propostas)) return [];
    return [...propostas]
      .sort((a, b) => new Date(b.created_date || Date.now()) - new Date(a.created_date || Date.now()))
      .slice(0, 4);
  }, [propostas]);

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Proposta.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
      queryClient.invalidateQueries({ queryKey: ['assinatura'] });
    },
    onError: (err) => alert(`Erro ao excluir: ${err.message}`),
  });

  const handleExcluir = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta proposta?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh] gap-3">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Carregando dados do painel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] text-red-400 p-6 text-center">
        <AlertCircle className="w-12 h-12 mb-3 text-red-400" />
        <h3 className="text-lg font-bold text-white mb-1">Erro ao carregar o dashboard</h3>
        <p className="text-sm text-slate-400 max-w-md mb-4">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  const currentPlanName = assinatura?.plano || 'Gratuito';
  const limits = PLAN_LIMITS[currentPlanName] || PLAN_LIMITS['Gratuito'];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* ------------------------------------------------------------- */}
      {/* HEADER DE BOAS-VINDAS COM AÇÕES RÁPIDAS DE CONVERSÃO           */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>Painel de Alta Performance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Olá, {user?.full_name || user?.email?.split('@')[0] || 'Gestor'} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Acompanhe o desempenho comercial das suas propostas e contratos em tempo real.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/propostas/criar"
            className="px-5 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 transition duration-200 shadow-lg shadow-blue-600/20 flex items-center gap-2 group cursor-pointer"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Nova Proposta</span>
          </Link>

          <Link
            to="/chat-ia"
            className="px-4 py-3 rounded-xl font-bold text-sm text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition duration-200 flex items-center gap-2 group cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
            <span>Gerar com IA</span>
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* EXECUTIVE KPI CARDS METRICS                                   */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden group hover:border-slate-700/80 transition duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Propostas</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white tracking-tight">{stats.totalPropostas}</span>
            <span className="text-xs font-semibold text-slate-400">criadas</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-emerald-400 font-bold">{stats.totalAprovadas}</span> aprovadas com sucesso
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden group hover:border-slate-700/80 transition duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Receita Aprovada</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white tracking-tight">{stats.valorTotal}</span>
          </div>
          <p className="text-xs text-emerald-400 mt-2 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Convertido em vendas</span>
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden group hover:border-slate-700/80 transition duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Em Negociação</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white tracking-tight">{stats.valorEmAberto}</span>
          </div>
          <p className="text-xs text-amber-400/90 mt-2 font-medium">
            Propostas aguardando resposta
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden group hover:border-slate-700/80 transition duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Taxa de Conversão</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white tracking-tight">{stats.taxaAprovacao}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Média de fechamento comercial
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* USAGE AND CONVERSION CTA BANNER                                */}
      {/* ------------------------------------------------------------- */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
              <span>Plano {currentPlanName}</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Aumente suas vendas com propostas sem limites
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Você utilizou <strong className="text-white">{assinatura?.propostas_criadas_mes ?? 0} de {limits.propostas}</strong> propostas neste mês. Faça o upgrade para ter propostas ilimitadas e marca d'água personalizada.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link
              to="/planos"
              className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition duration-200 shadow-lg shadow-blue-600/30 flex items-center gap-2 group cursor-pointer"
            >
              <span>Fazer Upgrade Agora</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* RECENT PROPOSALS LISTING                                       */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Propostas Recentes</h2>
            <p className="text-xs text-slate-400">Últimas propostas geradas no sistema</p>
          </div>
          <Link
            to="/propostas"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
          >
            <span>Ver Todas</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentes.map((proposta) => (
              <ProposalCard
                key={proposta.id}
                proposta={proposta}
                onExcluir={handleExcluir}
              />
            ))}
          </div>
        ) : (
          <div className="p-10 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Nenhuma proposta criada ainda</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Crie sua primeira proposta comercial em segundos utilizando nossos modelos profissionais.
            </p>
            <Link
              to="/propostas/criar"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 transition shadow-md shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Primeia Proposta</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}