import React from 'react'
import { Link } from 'react-router-dom'
import { Eye, Edit2, Trash2 } from 'lucide-react'

// Helper para formatar moeda
const formatCurrency = (value) => {
  if (typeof value !== 'number') {
    value = parseFloat(value) || 0;
  }
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

// Helper para o "chip" de status
const getStatusChip = (status) => {
  switch (status) {
    case 'Aprovada':
      return 'bg-green-500/20 text-green-400 border border-green-500/30'
    case 'Enviada':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    case 'Rascunho':
      return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
    case 'Rejeitada':
      return 'bg-red-500/20 text-red-400 border border-red-500/30'
    default:
      return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
  }
}

export function ProposalCard({ proposta, onExcluir }) {
  // Ajuste os nomes dos campos se forem diferentes no seu banco
  const {
    id,
    nome_cliente,
    descricao,
    numero_proposta,
    status,
    valor_total,
    prazo_entrega,
    updated_at,
  } = proposta

  const dataFormatada = new Date(updated_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        {/* Lado Esquerdo: Infos */}
        <div className="flex-1 mb-4 md:mb-0">
          <div className="flex items-center gap-4 mb-3">
             {/* Usei a primeira letra do cliente para o ícone */}
            <div className="bg-blue-600 w-12 h-12 p-3 rounded-lg flex-shrink-0 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {nome_cliente?.charAt(0).toUpperCase() || 'P'}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{nome_cliente || 'Nome do Cliente'}</h3>
              <p className="text-sm text-slate-400 line-clamp-1">{descricao || 'Descrição do serviço'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-400 mt-4">
            <span>Nº {numero_proposta || 'PROP-001'}</span>
            <span>•</span>
            <span>{dataFormatada}</span>
            <span>•</span>
            <span>Prazo: {prazo_entrega || 'N/D'} dias</span>
          </div>
        </div>

        {/* Lado Direito: Valor e Botões */}
        <div className="flex flex-col items-start md:items-end w-full md:w-auto">
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusChip(status)}`}>
              {status || 'Status'}
            </span>
          </div>

          <div className="text-3xl font-bold text-white mt-8 md:mt-12 mb-4">
            {formatCurrency(valor_total)}
          </div>

          <div className="flex items-center gap-3">
            <Link to={`/propostas/ver/${id}`}>
              <button className="flex items-center gap-2 text-sm text-slate-300 bg-slate-700/50 hover:bg-slate-700 px-4 py-2 rounded-lg transition">
                <Eye size={16} /> Ver
              </button>
            </Link>
            <Link to={`/propostas/editar/${id}`}>
              <button className="flex items-center gap-2 text-sm text-slate-300 bg-slate-700/50 hover:bg-slate-700 px-4 py-2 rounded-lg transition">
                <Edit2 size={16} /> Editar
              </button>
            </Link>
            <button
              onClick={() => onExcluir(id)}
              className="flex items-center gap-2 text-sm text-red-400 bg-red-900/30 hover:bg-red-900/60 px-4 py-2 rounded-lg transition"
            >
              <Trash2 size={16} /> Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}