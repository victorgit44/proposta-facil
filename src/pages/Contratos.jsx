import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { base44, supabase } from '@/api/supabaseClient' // Importar supabase (para o RPC no futuro, se necessário)
import { queryClient } from '@/queryClient'
import { ContractCard } from '../components/ContractCard' // Certifique-se que o caminho está correto
import { Loader2, AlertCircle, FileSignature, Wallet, CheckSquare } from 'lucide-react'
import { StatCard } from '../components/StatCard'
import { formatCurrency } from '../utils/formatters'
import { useAuth } from '../context/AuthContext'; // <-- 1. Importar useAuth
import { PLAN_LIMITS } from '@/config'; // <-- 2. Importar PLAN_LIMITS

// Definição do plano padrão/fallback
const defaultSubscription = {
  plano: 'Gratuito',
  contratos_criadas_mes: 0,
};
const defaultLimits = PLAN_LIMITS['Gratuito'];

// Estado de "Nenhum contrato ainda"
function EmptyState() {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center mt-8">
      <FileSignature size={48} className="mx-auto text-slate-500 mb-4" />
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
  // --- 3. PEGAR O USUÁRIO DO CONTEXTO ---
  const { user } = useAuth(); // 'loading' do auth já foi tratado pelo AuthProvider

  // --- 4. BUSCAR CONTRATOS (habilitado PÓS login) ---
  const {
    data: contratos,
    isLoading: loadingContratos,
    error: errorContratos,
  } = useQuery({
    queryKey: ['contratos'],
    queryFn: () => base44.entities.Contrato.list(),
    enabled: !!user, // Só busca se o usuário estiver logado
  })

  // --- 5. BUSCAR ASSINATURA (habilitado PÓS login) ---
  const {
    data: assinaturaData,
    isLoading: loadingAssinatura,
    error: errorAssinatura,
  } = useQuery({
    queryKey: ['assinatura'],
    queryFn: async () => {
      const data = await base44.entities.Assinatura.list(); 
      return data[0] || defaultSubscription;
    },
    enabled: !!user, // Só busca se o usuário estiver logado
  });
  const assinatura = assinaturaData || defaultSubscription;

  // 6. Calcular estatísticas
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

  // 7. Mutação para excluir
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Contrato.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] })
      queryClient.invalidateQueries({ queryKey: ['assinatura'] }) // Invalida assinatura
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

  // Combina os estados de loading
  const isLoading = loadingContratos || loadingAssinatura;
  const error = errorContratos || errorAssinatura;

  // --- 8. VERIFIQUE O LIMITE ---
  const limits = PLAN_LIMITS[assinatura.plano] || defaultLimits;
  const isLimitReached = (assinatura.contratos_criadas_mes ?? 0) >= (limits.contratos ?? 0);

  // 9. Renderizar estados
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 size={48} className="text-purple-500 animate-spin" />
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-64 text-red-400 p-4 text-center">
          <AlertCircle size={48} className="mr-4" />
          <p>Erro ao carregar contratos: {error.message}</p>
        </div>
      )
    }

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
    <div className="p-4 md:p-8 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">📝 Meus Contratos</h1>
            <p className="text-slate-400">Gerencie seus contratos de prestação de serviços</p>
          </div>
          
          {/* --- 10. APLIQUE O BLOQUEIO --- */}
          <Link 
            to="/contratos/criar" 
            className={isLimitReached ? 'pointer-events-none' : ''}
          >
            <button 
              disabled={isLimitReached || isLoading}
              title={isLimitReached ? "Limite de contratos atingido" : "Criar novo contrato"}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Novo Contrato
            </button>
          </Link>
        </div>

        {/* Aviso de Limite Atingido */}
        {isLimitReached && (
            <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-500/50 text-yellow-300 rounded-lg text-sm">
                Você atingiu o limite de {limits.contratos} contratos do seu plano. 
                <Link to="/planos" className="font-bold underline hover:text-yellow-200 ml-1">Faça um upgrade</Link> para criar mais.
            </div>
        )}

        {/* StatCards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total de Contratos"
            icon={FileSignature}
            value={stats.total}
            subtext={stats.subtext}
            colorClass="text-purple-400"
          />
          <StatCard
            title="Valor Assinado"
            icon={Wallet}
            value={stats.valor}
            subtext="Em contratos assinados"
            colorClass="text-green-400"
          />
          <StatCard
            title="Taxa de Assinatura"
            icon={CheckSquare}
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