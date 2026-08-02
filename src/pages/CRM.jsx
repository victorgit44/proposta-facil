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
  const [selectedStageFilter, setSelectedStageFilter] = useState('todos');

  const { data: propostas = [], isLoading } = useQuery({
    queryKey: ['propostas'],
    queryFn: () => base44.entities.Proposta.list(),
  });

  const columns = [
    { id: 'rascunho', name: 'Rascunhos', color: 'bg-slate-800 text-slate-300 border-slate-700', badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-700' },
    { id: 'enviada', name: 'Proposta Enviada', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { id: 'negociacao', name: 'Em Negociação', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30', badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    { id: 'aprovada', name: 'Proposta Aceita', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { id: 'recusada', name: 'Perdida / Recusada', color: 'bg-red-500/10 text-red-400 border-red-500/30', badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20' },
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
    <div className="p-6 md:p-8 max-w-full mx-auto space-y-6 animate-in fade-in duration-300 font-sans selection:bg-blue-600/30 selection:text-white">
      
      {/* Top Header - Estilo Linear/Mercury */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#1b2434]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Pipeline Comercial & CRM</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
              Visão Kanban Executive
            </span>
          </div>
          <p className="text-xs text-[#94a3b8] mt-1">Acompanhe a evolução de propostas e contratos por etapas de negociação.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar cliente ou proposta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#0f172a] border border-[#1e293b] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-blue-500 w-56 md:w-64"
            />
          </div>

          <button
            onClick={() => navigate('/propostas/criar')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Proposta</span>
          </button>
        </div>
      </div>

      {/* KPI Cards em Estilo Executive */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0f172a] border border-[#1e293b] space-y-1">
          <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">Pipeline Total</span>
          <div className="text-xl font-bold text-white tracking-tight">{formatCurrency(stats.totalPipeline)}</div>
          <p className="text-[10px] text-[#94a3b8]">{stats.totalCount} oportunidades ativas</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0f172a] border border-[#1e293b] space-y-1">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Receita Confirmada</span>
          <div className="text-xl font-bold text-white tracking-tight">{formatCurrency(stats.valorFechado)}</div>
          <p className="text-[10px] text-[#94a3b8]">Propostas aprovadas</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0f172a] border border-[#1e293b] space-y-1">
          <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">Taxa de Conversão</span>
          <div className="text-xl font-bold text-white tracking-tight">{stats.taxaConversao}%</div>
          <p className="text-[10px] text-[#94a3b8]">Taxa de aceite digital</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0f172a] border border-[#1e293b] space-y-1">
          <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">Ticket Médio</span>
          <div className="text-xl font-bold text-white tracking-tight">
            {formatCurrency(stats.totalCount > 0 ? stats.totalPipeline / stats.totalCount : 0)}
          </div>
          <p className="text-[10px] text-[#94a3b8]">Por proposta enviada</p>
        </div>
      </div>

      {/* Board Kanban */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-6 pt-2">
        {columns.map((col) => {
          const deals = getDealsForColumn(col.id);
          const colTotal = deals.reduce((sum, d) => sum + (parseFloat(d.valor_total) || 0), 0);

          return (
            <div 
              key={col.id} 
              className="bg-[#0b101b] border border-[#1b2434] rounded-xl p-3.5 flex flex-col justify-between space-y-3 min-w-[250px]"
            >
              {/* Column Header */}
              <div className="space-y-2 pb-2.5 border-b border-[#1b2434]">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${col.badgeColor}`}>
                    {col.name}
                  </span>
                  <span className="text-xs font-semibold text-[#64748b] bg-[#141c2c] px-2 py-0.5 rounded-full">{deals.length}</span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-[10px] text-[#64748b] font-medium">Subtotal:</span>
                  <span className="text-xs font-bold text-white tracking-tight">{formatCurrency(colTotal)}</span>
                </div>
              </div>

              {/* Deal Cards Container */}
              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[620px] pr-0.5">
                {deals.length === 0 ? (
                  <div className="p-6 text-center text-[#475569] text-xs border border-dashed border-[#1e293b] rounded-lg bg-[#0e1422]/50">
                    Nenhuma proposta nesta etapa
                  </div>
                ) : (
                  deals.map((deal) => (
                    <div
                      key={deal.id}
                      className="p-3.5 rounded-lg bg-[#111827] border border-[#1e293b] hover:border-blue-500/40 transition-all duration-200 space-y-2.5 shadow-sm group relative"
                    >
                      <div 
                        onClick={() => navigate(`/propostas/ver/${deal.id}`)}
                        className="cursor-pointer space-y-1"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition tracking-tight">
                            {deal.nome_cliente}
                          </h4>
                          <FileText className="w-3.5 h-3.5 text-[#64748b] shrink-0" />
                        </div>
                        <p className="text-[11px] text-[#94a3b8] line-clamp-1">
                          {deal.servico_prestado || 'Proposta Comercial'}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#1e293b] flex items-center justify-between">
                        <span className="text-xs font-extrabold text-white">
                          {formatCurrency(deal.valor_total)}
                        </span>

                        {/* Seletor rápido de estágio */}
                        <select
                          value={col.id}
                          onChange={(e) => updateStatusMutation.mutate({ id: deal.id, status: e.target.value })}
                          className="bg-[#1e293b] text-[10px] font-medium text-[#cbd5e1] border border-[#334155] rounded px-1.5 py-0.5 focus:outline-none focus:border-blue-500 cursor-pointer"
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
