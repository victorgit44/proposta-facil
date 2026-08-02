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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1e1e2e]">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-400" />
            <span>Gestão de Propostas</span>
          </h1>
          <p className="text-sm text-[#8888a0] mt-1.5">
            Crie, envie e acompanhe o fechamento de propostas comerciais B2B.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/propostas/canvas">
            <button
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#8888a0] bg-[#1a1a24] hover:bg-white/10 hover:text-white border border-[#1e1e2e] transition flex items-center gap-2 cursor-pointer"
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
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Proposta</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Warning for limit */}
      {isLimitReached && (
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex items-center justify-between gap-4">
          <span>Você atingiu o limite de {limits.propostas} propostas do seu plano atual.</span>
          <Link to="/planos" className="font-semibold underline text-amber-400 hover:text-white shrink-0">
            Fazer Upgrade
          </Link>
        </div>
      )}

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-lg bg-[#111118] border border-[#1e1e2e] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium uppercase tracking-wider text-[#555568]">Total de Propostas</span>
            <FileText className="w-5 h-5 text-[#555568]" />
          </div>
          <h3 className="text-3xl font-semibold text-white tabular-nums tracking-tight">{stats.totalPropostas}</h3>
          <p className="text-xs text-[#8888a0] font-medium">{stats.totalAprovadas} aprovadas</p>
        </div>

        <div className="p-6 rounded-lg bg-[#111118] border border-[#1e1e2e] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium uppercase tracking-wider text-[#555568]">Receita Confirmada</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-3xl font-semibold text-white tabular-nums tracking-tight">{stats.valorTotal}</h3>
          <p className="text-xs text-emerald-400 font-medium">Em propostas fechadas</p>
        </div>

        <div className="p-6 rounded-lg bg-[#111118] border border-[#1e1e2e] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium uppercase tracking-wider text-[#555568]">Taxa de Sucesso</span>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-3xl font-semibold text-white tabular-nums tracking-tight">{stats.taxaAprovacao}</h3>
          <p className="text-xs text-[#8888a0] font-medium">Conversão comercial</p>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#111118] p-5 rounded-lg border border-[#1e1e2e]">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#555568] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, serviço ou N.º..."
            className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#555568] focus:outline-none focus:border-blue-600 transition"
          />
        </div>

        {/* Status Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
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
              className={`px-4 py-2 rounded-lg text-xs font-medium uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[#1a1a24] text-[#8888a0] hover:text-white border border-[#1e1e2e]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Listing Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-xs text-[#8888a0]">Carregando propostas comercial...</p>
        </div>
      ) : error ? (
        <div className="p-8 rounded-lg bg-red-500/10 border border-red-500/20 text-center text-red-400">
          <AlertCircle className="w-10 h-10 mx-auto mb-2" />
          <p>{error.message}</p>
        </div>
      ) : filteredPropostas.length === 0 ? (
        <div className="p-12 rounded-lg bg-[#111118] border border-[#1e1e2e] text-center space-y-4">
          <div className="w-14 h-14 rounded-lg bg-[#1a1a24] border border-[#1e1e2e] flex items-center justify-center mx-auto text-[#555568]">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-semibold text-white tracking-tight">Nenhuma proposta encontrada</h3>
          <p className="text-sm text-[#8888a0] max-w-md mx-auto">
            {searchTerm || statusFilter !== 'todos'
              ? 'Nenhum resultado atende aos filtros de busca selecionados.'
              : 'Comece criando sua primeira proposta comercial B2B para seus clientes.'}
          </p>
          <Link
            to="/propostas/criar"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Primeira Proposta</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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