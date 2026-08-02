import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit2, Trash2, Calendar, Clock, Share2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { toast } from 'sonner';

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'aprovada':
      return { label: 'Aprovada', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dotColor: 'bg-emerald-400', textColor: 'text-emerald-400' };
    case 'enviada':
      return { label: 'Enviada', bg: 'bg-blue-500/10', border: 'border-blue-500/20', dotColor: 'bg-blue-400', textColor: 'text-blue-400' };
    case 'rascunho':
      return { label: 'Rascunho', bg: 'bg-[#1a1a24]', border: 'border-[#1e1e2e]', dotColor: 'bg-[#555568]', textColor: 'text-[#8888a0]' };
    case 'recusada':
      return { label: 'Recusada', bg: 'bg-red-500/10', border: 'border-red-500/20', dotColor: 'bg-red-400', textColor: 'text-red-400' };
    default:
      return { label: status || 'Pendente', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dotColor: 'bg-amber-400', textColor: 'text-amber-400' };
  }
};

export function ProposalCard({ proposta, onExcluir }) {
  const {
    id, nome_cliente, servico_prestado, numero_proposta,
    status, valor_total, prazo_entrega, updated_at, created_date,
  } = proposta;

  const dataFormatada = formatDate(updated_at || created_date);
  const badge = getStatusBadge(status);

  return (
    <div className="group rounded-lg bg-[#111118] border border-[#1e1e2e] hover:border-[#2a2a3e] transition-all duration-200 p-6 flex flex-col justify-between space-y-6">

      {/* Top: client avatar + status */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-lg bg-[#1a1a24] border border-[#1e1e2e] flex items-center justify-center text-white text-base font-semibold shrink-0">
              {nome_cliente?.charAt(0).toUpperCase() || 'P'}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-white tracking-tight truncate group-hover:text-blue-400 transition-colors">
                {nome_cliente || 'Cliente não especificado'}
              </h3>
              <p className="text-sm text-[#8888a0] truncate mt-0.5">
                {servico_prestado || 'Proposta comercial'}
              </p>
            </div>
          </div>

          <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium uppercase tracking-wider ${badge.bg} ${badge.border} border ${badge.textColor} rounded-md shrink-0`}>
            <span className={`w-2 h-2 rounded-full ${badge.dotColor}`} />
            {badge.label}
          </span>
        </div>

        {/* Meta details bar */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#8888a0] pt-3 pb-1 border-t border-[#1e1e2e]">
          <span className="font-semibold text-[#c0c0d0]">N.º {numero_proposta || 'PROP-001'}</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#555568]" />{dataFormatada}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#555568]" />{prazo_entrega || 'Em aberto'}</span>
        </div>
      </div>

      {/* Bottom: value + actions */}
      <div className="flex items-end justify-between pt-4 border-t border-[#1e1e2e]">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#555568] block">Valor Total</span>
          <span className="text-2xl font-semibold text-white tabular-nums tracking-tight">{formatCurrency(valor_total)}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              const publicUrl = `${window.location.origin}/p/${id}`;
              navigator.clipboard.writeText(publicUrl);
              toast.success('Link público copiado!');
            }}
            className="p-2.5 text-[#555568] hover:text-blue-400 hover:bg-[#1a1a24] rounded-lg border border-transparent hover:border-[#1e1e2e] transition cursor-pointer"
            title="Copiar link público"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <Link
            to={`/propostas/ver/${id}`}
            className="p-2.5 text-[#555568] hover:text-white hover:bg-[#1a1a24] rounded-lg border border-transparent hover:border-[#1e1e2e] transition"
            title="Visualizar"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <Link
            to={`/propostas/editar/${id}`}
            className="p-2.5 text-[#555568] hover:text-white hover:bg-[#1a1a24] rounded-lg border border-transparent hover:border-[#1e1e2e] transition"
            title="Editar"
          >
            <Edit2 className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onExcluir(id)}
            className="p-2.5 text-[#555568] hover:text-red-400 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/20 transition cursor-pointer"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}