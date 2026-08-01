import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit2, Trash2, FileSignature, Calendar, ShieldCheck } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'assinado':
      return { label: 'Assinado', dotColor: 'bg-emerald-400', textColor: 'text-emerald-400' };
    case 'enviado':
      return { label: 'Em Assinatura', dotColor: 'bg-blue-400', textColor: 'text-blue-400' };
    case 'rascunho':
      return { label: 'Minuta', dotColor: 'bg-[#555568]', textColor: 'text-[#8888a0]' };
    case 'rejeitado':
    case 'cancelado':
      return { label: 'Cancelado', dotColor: 'bg-red-400', textColor: 'text-red-400' };
    default:
      return { label: status || 'Pendente', dotColor: 'bg-violet-400', textColor: 'text-violet-400' };
  }
};

export function ContractCard({ contrato, onExcluir }) {
  const {
    id, contratante_nome, objeto_contrato, numero_contrato,
    status, valor_contrato, data_assinatura, created_date,
  } = contrato;

  const dataFormatada = formatDate(data_assinatura || created_date);
  const badge = getStatusBadge(status);

  return (
    <div className="group rounded-lg bg-[#111118] border border-[#1e1e2e] hover:border-[#2a2a3e] transition p-4">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-md bg-[#1a1a24] border border-[#1e1e2e] flex items-center justify-center text-[#8888a0] shrink-0">
            <FileSignature className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition-colors">
              {contratante_nome || 'Contratante não especificado'}
            </h3>
            <p className="text-[12px] text-[#555568] truncate">
              {objeto_contrato || 'Contrato de prestação de serviços'}
            </p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${badge.textColor} shrink-0`}>
          <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
          {badge.label}
        </span>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-[11px] text-[#555568] mb-3 pb-3 border-b border-[#1e1e2e]">
        <span className="font-medium text-[#8888a0]">N.{numero_contrato || 'CONTR-001'}</span>
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{dataFormatada}</span>
        <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" />Validade jurídica</span>
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#555568] block">Valor</span>
          <span className="text-lg font-semibold text-white tabular-nums">{formatCurrency(valor_contrato)}</span>
        </div>

        <div className="flex items-center gap-1">
          <Link
            to={`/contratos/ver/${id}`}
            className="p-1.5 text-[#555568] hover:text-white rounded-md transition"
            title="Visualizar"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
          <Link
            to={`/contratos/editar/${id}`}
            className="p-1.5 text-[#555568] hover:text-white rounded-md transition"
            title="Editar"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => onExcluir(id)}
            className="p-1.5 text-[#555568] hover:text-red-400 rounded-md transition cursor-pointer"
            title="Excluir"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}