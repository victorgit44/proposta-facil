import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '../api/supabaseClient';
import { queryClient } from '../queryClient';
import { ProposalCard } from '../components/ProposalCard';
import { 
  Loader2, AlertCircle, FileText, Search, Plus, 
  TrendingUp, CheckCircle2, DollarSign, Sparkles, Filter 
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { PLAN_LIMITS } from '@/config';

const defaultSubscription = {
  plano: 'Gratuito',
  propostas_criadas_mes: 0,
};

export default function Propostas() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const {
    data: propostasData,
    isLoading: loadingPropostas,
    error: errorPropostas,
  } = useQuery({
    queryKey: ['propostas'],
    queryFn: () => base44.entities.Proposta.list(),
    enabled: !!user,
  });
  const propostas = propostasData || [];

  const {
    data: assinaturaData,
    isLoading: loadingAssinatura,
    error: errorAssinatura,
  } = useQuery({
    queryKey: ['assinatura'],
    queryFn: async () => {
      const data = await base44.entities.Assinatura.list();
      return data[0] || defaultSubscription;
    },
    enabled: !!user,
  });
  const assinatura = assinaturaData || defaultSubscription;

  const stats = useMemo(() => {
    if (!propostas) return { totalPropostas: 0, totalAprovadas: 0, valorTotal: 'R$ 0,00', taxaAprovacao: '0%' };
    
    const totalPropostas = propostas.length;
    const aprovadas = propostas.filter(p => p.status === 'aprovada');
    const totalAprovadas = aprovadas.length;
    const valorTotalAprovadas = aprovadas.reduce((sum, p) => sum + (parseFloat(p.valor_total) || 0), 0);
    const taxaAprovacao = totalPropostas > 0 ? (totalAprovadas / totalPropostas) * 100 : 0;

    return {
      totalPropostas,
      totalAprovadas,
      valorTotal: formatCurrency(valorTotalAprovadas),
      taxaAprovacao: `${taxaAprovacao.toFixed(0)}%`,
    };
  }, [propostas]);

  const filteredPropostas = useMemo(() => {
    return propostas.filter((p) => {
      const matchesSearch = 
        p.nome_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.servico_prestado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.numero_proposta?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'todos' || (p.status?.toLowerCase() === statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [propostas, searchTerm, statusFilter]);

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

  const isLoading = loadingPropostas || loadingAssinatura;
  const error = errorPropostas || errorAssinatura;

  const limits = PLAN_LIMITS[assinatura.plano] || PLAN_LIMITS['Gratuito'];
  const isLimitReached = (assinatura.propostas_criadas_mes ?? 0) >= (limits.propostas ?? 0);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-400" />
            <span>Gestão de Propostas</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Crie, envie e acompanhe o fechamento de propostas comerciais.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/propostas/canvas">
            <button
              className="px-4 py-3 rounded-xl font-bold text-sm text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 hover:bg-cyan-900/60 transition duration-200 shadow-lg shadow-cyan-950/40 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Montar no Canvas Visual</span>
            </button>
          </Link>

          <Link
            to="/propostas/criar"
            className={isLimitReached ? 'pointer-events-none' : ''}
          >
            <button
              disabled={isLimitReached || isLoading}
              className="px-5 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 transition duration-200 shadow-lg shadow-blue-600/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Proposta</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Warning for limit */}
      {isLimitReached && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-center justify-between gap-4">
          <span>Você atingiu o limite de {limits.propostas} propostas do seu plano atual.</span>
          <Link to="/planos" className="font-bold underline text-amber-400 hover:text-white shrink-0">
            Fazer Upgrade ⚡
          </Link>
        </div>
      )}

      {/* KPI Stats em estrito alinhamento com o Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-[#111118] border border-[#1e1e2e] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#555568]">Total Propostas</span>
            <FileText className="w-4 h-4 text-[#555568]" />
          </div>
          <h3 className="text-2xl font-semibold text-white tabular-nums tracking-tight">{stats.totalPropostas}</h3>
          <p className="text-[11px] text-[#555568] font-medium">{stats.totalAprovadas} aprovadas</p>
        </div>

        <div className="p-4 rounded-lg bg-[#111118] border border-[#1e1e2e] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#555568]">Receita Fechada</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-semibold text-white tabular-nums tracking-tight">{stats.valorTotal}</h3>
          <p className="text-[11px] text-emerald-400 font-medium">Em propostas aprovadas</p>
        </div>

        <div className="p-4 rounded-lg bg-[#111118] border border-[#1e1e2e] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#555568]">Taxa de Sucesso</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className="text-2xl font-semibold text-white tabular-nums tracking-tight">{stats.taxaAprovacao}</h3>
          <p className="text-[11px] text-[#555568] font-medium">Aprovação comercial</p>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111118] p-4 rounded-lg border border-[#1e1e2e]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#555568] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, serviço ou Nº..."
            className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-[#555568] focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* Status Tab Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'todos', label: 'Todas' },
            { id: 'aprovada', label: 'Aprovadas' },
            { id: 'enviada', label: 'Enviadas' },
            { id: 'rascunho', label: 'Rascunhos' },
            { id: 'recusada', label: 'Recusadas' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-[#8888a0] hover:text-white hover:bg-[#1a1a24]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Listing Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="p-8 rounded-2xl bg-red-500/10 border border-red-500/30 text-center text-red-400">
          <AlertCircle className="w-10 h-10 mx-auto mb-2" />
          <p>{error.message}</p>
        </div>
      ) : filteredPropostas.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">Nenhuma proposta encontrada</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {searchTerm || statusFilter !== 'todos'
              ? 'Nenhum resultado corresponde aos filtros selecionados.'
              : 'Comece a gerar propostas profissionais para seus clientes agora mesmo.'}
          </p>
          <Link
            to="/propostas/criar"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Primeira Proposta</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPropostas.map((proposta) => (
            <ProposalCard
              key={proposta.id}
              proposta={proposta}
              onExcluir={handleExcluir}
            />
          ))}
        </div>
      )}
    </div>
  );
}