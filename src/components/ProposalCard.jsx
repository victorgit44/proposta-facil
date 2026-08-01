import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit2, Trash2, Calendar, Clock, Share2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { toast } from 'sonner';

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'aprovada':
      return { label: 'Aprovada', dotColor: 'bg-emerald-400', textColor: 'text-emerald-400' };
    case 'enviada':
      return { label: 'Enviada', dotColor: 'bg-blue-400', textColor: 'text-blue-400' };
    case 'rascunho':
      return { label: 'Rascunho', dotColor: 'bg-[#555568]', textColor: 'text-[#8888a0]' };
    case 'recusada':
      return { label: 'Recusada', dotColor: 'bg-red-400', textColor: 'text-red-400' };
    default:
      return { label: status || 'Pendente', dotColor: 'bg-amber-400', textColor: 'text-amber-400' };
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
    <div className="group rounded-lg bg-[#111118] border border-[#1e1e2e] hover:border-[#2a2a3e] transition p-5">

      {/* Top: client + status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#1a1a24] border border-[#1e1e2e] flex items-center justify-center text-[#8888a0] text-sm font-semibold shrink-0">
            {nome_cliente?.charAt(0).toUpperCase() || 'P'}
          </div>
          <div className="min-w-0">
            <h3 className="text-[15px] font-medium text-white truncate group-hover:text-blue-400 transition-colors">
              {nome_cliente || 'Cliente não especificado'}
            </h3>
            <p className="text-sm text-[#8888a0] truncate">
              {servico_prestado || 'Proposta comercial'}
            </p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${badge.textColor} shrink-0`}>
          <span className={`w-2 h-2 rounded-full ${badge.dotColor}`} />
          {badge.label}
        </span>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-[#8888a0] mb-3 pb-3 border-b border-[#1e1e2e]">
        <span className="font-medium text-[#c0c0d0]">N.{numero_proposta || 'PROP-001'}</span>
        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{dataFormatada}</span>
        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{prazo_entrega || 'Em aberto'}</span>
      </div>

      {/* Bottom: value + actions */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-[#8888a0] block">Valor Total</span>
          <span className="text-xl font-semibold text-white tabular-nums">{formatCurrency(valor_total)}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const publicUrl = `${window.location.origin}/p/${id}`;
              navigator.clipboard.writeText(publicUrl);
              toast.success('Link público copiado!');
            }}
            className="p-2 text-[#555568] hover:text-blue-400 rounded-lg transition cursor-pointer"
            title="Copiar link público"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <Link
            to={`/propostas/ver/${id}`}
            className="p-2 text-[#555568] hover:text-white rounded-lg transition"
            title="Visualizar"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <Link
            to={`/propostas/editar/${id}`}
            className="p-2 text-[#555568] hover:text-white rounded-lg transition"
            title="Editar"
          >
            <Edit2 className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onExcluir(id)}
            className="p-2 text-[#555568] hover:text-red-400 rounded-lg transition cursor-pointer"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}