import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/supabaseClient';
import { queryClient } from '@/queryClient';
import { 
  Kanban, Plus, Search, Filter, MoreHorizontal, FileText, 
  CheckCircle2, DollarSign, ArrowRight, TrendingUp, Building2, 
  Clock, RefreshCw, UserCheck
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

export default function CRM() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: propostas = [], isLoading } = useQuery({
    queryKey: ['propostas'],
    queryFn: () => base44.entities.Proposta.list(),
  });

  const columns = [
    { id: 'rascunho', name: 'Rascunhos', badgeColor: 'bg-[#1a1a24] text-[#8888a0] border border-[#1e1e2e]' },
    { id: 'enviada', name: 'Proposta Enviada', badgeColor: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
    { id: 'negociacao', name: 'Em Negociação', badgeColor: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
    { id: 'aprovada', name: 'Proposta Aceita', badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
    { id: 'recusada', name: 'Perdida / Recusada', badgeColor: 'bg-red-500/10 text-red-400 border border-red-500/20' },
  ];

  // Mutation para atualizar status da proposta (Mover estágio)
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Proposta.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
      toast.success('Estágio da negociação atualizado!');
    },
    onError: (err) => toast.error(`Erro ao mover oportunidade: ${err.message}`)
  });

  // Mapeamento dinâmico de propostas para o Kanban
  const getDealsForColumn = (columnId) => {
    return propostas.filter(p => {
      const matchSearch = p.nome_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.servico_prestado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.numero_proposta?.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;

      const pStatus = p.status?.toLowerCase() || 'rascunho';
      if (columnId === 'rascunho') return pStatus === 'rascunho';
      if (columnId === 'enviada') return pStatus === 'enviada';
      if (columnId === 'negociacao') return pStatus === 'negociacao' || pStatus === 'ajustes_solicitados';
      if (columnId === 'aprovada') return pStatus === 'aprovada' || pStatus === 'contrato_gerado';
      if (columnId === 'recusada') return pStatus === 'recusada' || pStatus === 'cancelada';
      return false;
    });
  };

  // KPIs do Pipeline
  const stats = useMemo(() => {
    const totalPipeline = propostas.reduce((sum, p) => sum + (parseFloat(p.valor_total) || 0), 0);
    const aprovadas = propostas.filter(p => p.status === 'aprovada');
    const valorFechado = aprovadas.reduce((sum, p) => sum + (parseFloat(p.valor_total) || 0), 0);
    const taxaConversao = propostas.length > 0 ? ((aprovadas.length / propostas.length) * 100).toFixed(0) : 0;

    return { totalPipeline, valorFechado, taxaConversao, totalCount: propostas.length };
  }, [propostas]);

  return (
    <div className="p-6 md:p-10 max-w-full mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1e1e2e]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Pipeline Comercial & CRM</h1>
            <span className="px-2.5 py-1 text-xs font-semibold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
              Visão Kanban
            </span>
          </div>
          <p className="text-sm text-[#8888a0] mt-1">Acompanhe a evolução de propostas e contratos por etapas de negociação.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#555568] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar cliente ou proposta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#555568] focus:outline-none focus:border-blue-600 w-72 md:w-80"
            />
          </div>

          <button
            onClick={() => navigate('/propostas/criar')}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Proposta</span>
          </button>
        </div>
      </div>

      {/* KPI Cards em Tamanho Expandido */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="p-5 md:p-6 rounded-xl bg-[#111118] border border-[#1e1e2e] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#555568]">Pipeline Total</span>
            <DollarSign className="w-5 h-5 text-[#555568]" />
          </div>
          <h3 className="text-3xl font-extrabold text-white tabular-nums tracking-tight">{formatCurrency(stats.totalPipeline)}</h3>
          <p className="text-xs text-[#8888a0] font-medium">{stats.totalCount} oportunidades ativas</p>
        </div>

        <div className="p-5 md:p-6 rounded-xl bg-[#111118] border border-[#1e1e2e] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#555568]">Receita Confirmada</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-white tabular-nums tracking-tight">{formatCurrency(stats.valorFechado)}</h3>
          <p className="text-xs text-emerald-400 font-medium">Propostas aprovadas</p>
        </div>

        <div className="p-5 md:p-6 rounded-xl bg-[#111118] border border-[#1e1e2e] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#555568]">Taxa de Conversão</span>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-white tabular-nums tracking-tight">{stats.taxaConversao}%</h3>
          <p className="text-xs text-[#8888a0] font-medium">Taxa de aceite digital</p>
        </div>

        <div className="p-5 md:p-6 rounded-xl bg-[#111118] border border-[#1e1e2e] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#555568]">Ticket Médio</span>
            <Building2 className="w-5 h-5 text-[#555568]" />
          </div>
          <h3 className="text-3xl font-extrabold text-white tabular-nums tracking-tight">
            {formatCurrency(stats.totalCount > 0 ? stats.totalPipeline / stats.totalCount : 0)}
          </h3>
          <p className="text-xs text-[#8888a0] font-medium">Por proposta comercial</p>
        </div>
      </div>

      {/* Board Kanban em Largura Confortável */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 overflow-x-auto pb-8">
        {columns.map((col) => {
          const deals = getDealsForColumn(col.id);
          const colTotal = deals.reduce((sum, d) => sum + (parseFloat(d.valor_total) || 0), 0);

          return (
            <div 
              key={col.id} 
              className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5 flex flex-col justify-between space-y-4 min-w-[280px] lg:min-w-[310px]"
            >
              {/* Column Header */}
              <div className="space-y-3 pb-3 border-b border-[#1e1e2e]">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md ${col.badgeColor}`}>
                    {col.name}
                  </span>
                  <span className="text-xs font-bold text-white bg-[#1a1a24] px-2.5 py-1 rounded-md border border-[#1e1e2e]">{deals.length}</span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xs text-[#8888a0] font-medium uppercase tracking-wider">Subtotal:</span>
                  <span className="text-sm font-bold text-white tabular-nums tracking-tight">{formatCurrency(colTotal)}</span>
                </div>
              </div>

              {/* Deal Cards Container */}
              <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[650px] pr-0.5">
                {deals.length === 0 ? (
                  <div className="p-8 text-center text-[#555568] text-xs font-medium border border-dashed border-[#1e1e2e] rounded-xl bg-[#0a0a0f]">
                    Nenhuma proposta nesta etapa
                  </div>
                ) : (
                  deals.map((deal) => (
                    <div
                      key={deal.id}
                      className="p-5 rounded-xl bg-[#0a0a0f] border border-[#1e1e2e] hover:border-[#2a2a3e] transition space-y-4 group relative shadow-md"
                    >
                      <div 
                        onClick={() => navigate(`/propostas/ver/${deal.id}`)}
                        className="cursor-pointer space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition tracking-tight">
                            {deal.nome_cliente}
                          </h4>
                          <FileText className="w-4 h-4 text-[#555568] shrink-0" />
                        </div>
                        <p className="text-xs text-[#8888a0] line-clamp-2 leading-relaxed">
                          {deal.servico_prestado || 'Proposta Comercial'}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#1e1e2e] flex items-center justify-between gap-2">
                        <span className="text-sm font-extrabold text-white tabular-nums">
                          {formatCurrency(deal.valor_total)}
                        </span>

                        {/* Seletor rápido de estágio */}
                        <select
                          value={col.id}
                          onChange={(e) => updateStatusMutation.mutate({ id: deal.id, status: e.target.value })}
                          className="bg-[#1a1a24] text-xs font-medium text-[#8888a0] hover:text-white border border-[#1e1e2e] rounded-lg px-2 py-1 focus:outline-none focus:border-blue-600 cursor-pointer"
                        >
                          <option value="rascunho">Rascunho</option>
                          <option value="enviada">Enviada</option>
                          <option value="negociacao">Negociação</option>
                          <option value="aprovada">Aceita</option>
                          <option value="recusada">Recusada</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
