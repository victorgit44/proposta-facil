import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit2, Trash2, FileSignature, Calendar, ShieldCheck } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'assinado':
      return {
        label: 'Assinado',
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        dot: 'bg-emerald-400'
      };
    case 'enviado':
      return {
        label: 'Em Assinatura',
        bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        dot: 'bg-blue-400'
      };
    case 'rascunho':
      return {
        label: 'Minuta',
        bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
        dot: 'bg-slate-400'
      };
    case 'rejeitado':
    case 'cancelado':
      return {
        label: 'Cancelado',
        bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        dot: 'bg-rose-400'
      };
    default:
      return {
        label: status || 'Pendente',
        bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
        dot: 'bg-indigo-400'
      };
  }
};

export function ContractCard({ contrato, onExcluir }) {
  const {
    id,
    contratante_nome,
    objeto_contrato,
    numero_contrato,
    status,
    valor_contrato,
    data_assinatura,
    created_date,
  } = contrato;

  const dataFormatada = formatDate(data_assinatura || created_date);
  const badge = getStatusBadge(status);

  return (
    <div className="group rounded-2xl bg-slate-900/90 border border-slate-800/80 p-5 backdrop-blur-xl shadow-lg hover:border-slate-700/90 hover:shadow-2xl transition duration-300 relative overflow-hidden flex flex-col justify-between">
      {/* Header Info */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-md shadow-purple-600/20 shrink-0">
              <FileSignature className="w-5 h-5 text-purple-200" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-white tracking-tight truncate group-hover:text-purple-400 transition-colors">
                {contratante_nome || 'Contratante não especificado'}
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-[220px] sm:max-w-xs">
                {objeto_contrato || 'Contrato de prestação de serviços'}
              </p>
            </div>
          </div>

          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
            {badge.label}
          </span>
        </div>

        {/* Details row */}
        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 my-3 pt-3 border-t border-slate-800/60">
          <span className="font-semibold text-slate-300">Nº {numero_contrato || 'CONTR-001'}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-500" />
            {dataFormatada}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
            <ShieldCheck className="w-3 h-3" />
            Validade Jurídica
          </span>
        </div>
      </div>

      {/* Bottom row */}
      <div className="pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Valor do Contrato</span>
          <span className="text-xl font-extrabold text-white tracking-tight">
            {formatCurrency(valor_contrato)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/contratos/ver/${id}`}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-purple-600 hover:text-white px-3 py-2 rounded-xl transition duration-200"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver</span>
          </Link>

          <Link
            to={`/contratos/editar/${id}`}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-xl transition duration-200"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Editar</span>
          </Link>

          <button
            onClick={() => onExcluir(id)}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition duration-200 cursor-pointer"
            title="Excluir contrato"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}