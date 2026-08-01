import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/supabaseClient';
import { 
  Kanban, Plus, DollarSign, Calendar, Building2, User, ChevronRight, 
  ArrowRight, Search, Filter, MoreHorizontal, FileText, CheckCircle2
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

export default function CRM() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: propostas = [] } = useQuery({
    queryKey: ['propostas'],
    queryFn: () => base44.entities.Proposta.list(),
  });

  const columns = [
    { id: 'lead', name: 'Leads Qualificados', color: 'border-slate-700 text-slate-400 bg-slate-900/60' },
    { id: 'contato', name: 'Em Contato', color: 'border-blue-500/30 text-blue-400 bg-blue-500/10' },
    { id: 'proposta', name: 'Proposta Enviada', color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10' },
    { id: 'negociacao', name: 'Em Negociação', color: 'border-amber-500/30 text-amber-400 bg-amber-500/10' },
    { id: 'contrato', name: 'Contrato Assinado', color: 'border-purple-500/30 text-purple-400 bg-purple-500/10' },
    { id: 'fechado', name: 'Venda Fechada', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' },
  ];

  // Mapeamento dinâmico de propostas para o Kanban
  const getDealsForColumn = (columnId) => {
    return propostas.filter(p => {
      const matchSearch = p.nome_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.numero_proposta?.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;

      if (columnId === 'proposta') return p.status === 'enviada' || p.status === 'rascunho';
      if (columnId === 'fechado') return p.status === 'aprovada';
      if (columnId === 'lead') return p.status === 'lead';
      return false;
    });
  };

  return (
    <div className="p-6 md:p-10 max-w-full mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">CRM & Pipeline Kanban</h1>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
              Pipeline Comercial
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Gerencie a evolução das negociações desde o primeiro contato até o contrato fechado.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar oportunidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 w-64"
            />
          </div>

          <button
            onClick={() => navigate('/propostas/criar')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Oportunidade</span>
          </button>
        </div>
      </div>

      {/* Board Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-6">
        {columns.map((col) => {
          const deals = getDealsForColumn(col.id);
          const colTotal = deals.reduce((sum, d) => sum + (parseFloat(d.valor_total) || 0), 0);

          return (
            <div key={col.id} className="min-w-[260px] bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between space-y-4">
              {/* Column Header */}
              <div className="space-y-2 pb-3 border-b border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${col.color}`}>
                    {col.name}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{deals.length}</span>
                </div>
                <p className="text-xs font-black text-slate-300 tracking-tight">{formatCurrency(colTotal)}</p>
              </div>

              {/* Deal Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                {deals.length === 0 ? (
                  <div className="p-6 text-center text-slate-600 text-xs border border-dashed border-slate-800/80 rounded-xl">
                    Sem oportunidades nesta etapa
                  </div>
                ) : (
                  deals.map((deal) => (
                    <div
                      key={deal.id}
                      onClick={() => navigate(`/propostas/ver/${deal.id}`)}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 transition space-y-3 cursor-pointer group shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition">{deal.nome_cliente}</h4>
                          <p className="text-[10px] text-slate-400 truncate max-w-[170px]">{deal.servico_prestado || 'Serviço Comercial'}</p>
                        </div>
                        <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      </div>

                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-400">{formatCurrency(deal.valor_total)}</span>
                        <span className="text-[10px] text-slate-500">Nº {deal.numero_proposta}</span>
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
