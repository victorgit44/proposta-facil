import React, { useMemo } from 'react' // Importe useMemo
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { base44 } from '../api/supabaseClient'
import { queryClient } from '../queryClient'
import { ContractCard } from '../components/ContractCard'
import { Loader2, AlertCircle, FileText, CheckSquare, TrendingUp, Wallet } from 'lucide-react'
import { StatCard } from '../components/StatCard' // Reutilizando o StatCard
import { formatCurrency } from '../utils/formatters'

// Estado de "Nenhum contrato ainda"
function EmptyState() {
  // ... (O código desta função continua o mesmo da etapa anterior)
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center mt-8">
      <div className="text-6xl mb-4">📋</div>
      <h3 className="text-2xl font-bold text-white mb-2">Nenhum contrato ainda</h3>
      <p className="text-slate-400 mb-6">Comece criando seu primeiro contrato</p>
      <Link to="/contratos/criar">
        <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition">
          Criar Primeiro Contrato
        </button>
      </Link>
    </div>
  )
}

function Contratos() {
  // 1. Buscar os dados
  const {
    data: contratos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['contratos'],
    queryFn: () => base44.entities.Contrato.list(),
  })

  // 2. Calcular estatísticas (NOVO)
  const stats = useMemo(() => {
    if (!contratos) return { total: 0, valor: 'R$ 0,00', taxa: '0%' }
    
    const totalContratos = contratos.length;
    const assinados = contratos.filter(c => c.status === 'assinado');
    const totalAssinados = assinados.length;
    const valorTotal = assinados.reduce((sum, c) => sum + (parseFloat(c.valor_contrato) || 0), 0);
    const taxaAssinatura = totalContratos > 0 ? (totalAssinados / totalContratos) * 100 : 0;

    return {
      total: totalContratos,
      subtext: `${totalAssinados} assinados`,
      valor: formatCurrency(valorTotal),
      taxa: `${taxaAssinatura.toFixed(0)}%`,
    }
  }, [contratos])

  // 3. Mutação para excluir
  const deleteMutation = useMutation({
    // ... (código da mutação continua o mesmo)
    mutationFn: (id) => base44.entities.Contrato.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] })
    },
    onError: (err) => {
      alert(`Erro ao excluir: ${err.message}`)
    },
  })

  const handleExcluir = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este contrato?')) {
      deleteMutation.mutate(id)
    }
  }

  // 4. Renderizar loading/erro
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 size={48} className="text-purple-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-400">
        <AlertCircle size={48} className="mb-4" />
        <p>Erro ao carregar contratos: {error.message}</p>
      </div>
    )
  }

  // 5. Renderizar conteúdo da página
  const renderContent = () => {
    if (!contratos || contratos.length === 0) {
      return <EmptyState />
    }
    return (
      <div className="space-y-6 mt-8">
        {contratos.map((contrato) => (
          <ContractCard
            key={contrato.id}
            contrato={contrato}
            onExcluir={handleExcluir}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">📝 Meus Contratos</h1>
            <p className="text-slate-400">Gerencie seus contratos de prestação de serviços</p>
          </div>
          <Link to="/contratos/criar">
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition">
              + Novo Contrato
            </button>
          </Link>
        </div>

        {/* StatCards (NOVO) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total de Contratos"
            icon={FileText}
            value={stats.total}
            subtext={stats.subtext}
            colorClass="text-purple-400"
          />
          <StatCard
            title="Valor Total"
            icon={Wallet} // Ícone atualizado
            value={stats.valor}
            subtext="Em contratos assinados"
            colorClass="text-green-400"
          />
          <StatCard
            title="Taxa de Assinatura"
            icon={CheckSquare} // Ícone atualizado
            value={stats.taxa}
            subtext="Contratos assinados"
            colorClass="text-blue-400"
          />
        </div>

        {/* Lista de Contratos */}
        <h2 className="text-2xl font-bold text-white mb-6">Lista de Contratos</h2>
        {renderContent()}
      </div>
    </div>
  )
}

export default Contratos