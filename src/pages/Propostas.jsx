import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { base44 } from '../api/supabaseClient' // Ajuste o caminho se necessário
import { queryClient } from '../queryClient' // Ajuste o caminho se necessário
import { ProposalCard } from '../components/ProposalCard' // Ajuste o caminho se necessário
import { Loader2, AlertCircle } from 'lucide-react'

// Este é o estado de "Nenhuma proposta ainda"
function EmptyState() {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center mt-8">
      <div className="text-6xl mb-4">📝</div>
      <h3 className="text-2xl font-bold text-white mb-2">Nenhuma proposta ainda</h3>
      <p className="text-slate-400 mb-6">Comece criando sua primeira proposta comercial</p>
      <Link to="/propostas/criar">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          Criar Primeira Proposta
        </button>
      </Link>
    </div>
  )
}

// Renomeei a função para 'Propostas' para bater com o nome do arquivo
function Propostas() {
  // 1. Buscar os dados
  const {
    data: propostas,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['propostas'],
    queryFn: () => base44.entities.Proposta.list(),
  })

  // 2. Criar a "mutação" para excluir
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Proposta.delete(id),
    onSuccess: () => {
      // 3. Atualizar a lista após excluir
      queryClient.invalidateQueries({ queryKey: ['propostas'] })
    },
    onError: (err) => {
      alert(`Erro ao excluir: ${err.message}`)
    },
  })

  const handleExcluir = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta proposta?')) {
      deleteMutation.mutate(id)
    }
  }

  // 4. Renderizar estados
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 size={48} className="text-blue-500 animate-spin" />
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-64 text-red-400">
          <AlertCircle size={48} className="mr-4" />
          <p>Erro ao carregar propostas: {error.message}</p>
        </div>
      )
    }

    if (!propostas || propostas.length === 0) {
      return <EmptyState />
    }

    return (
      <div className="space-y-6 mt-8">
        {propostas.map((proposta) => (
          <ProposalCard
            key={proposta.id}
            proposta={proposta}
            onExcluir={handleExcluir}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">📄 Minhas Propostas</h1>
            <p className="text-slate-400">Gerencie suas propostas comerciais</p>
          </div>
          <Link to="/propostas/criar">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition">
              + Nova Proposta
            </button>
          </Link>
        </div>

        {renderContent()}
      </div>
    </div>
  )
}

export default Propostas