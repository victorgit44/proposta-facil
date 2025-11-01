import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { base44 } from '../api/supabaseClient'
import { queryClient } from '../queryClient'
import { ProposalCard } from '../components/ProposalCard' // Certifique-se que o caminho está correto
import { Loader2, AlertCircle, FileText } from 'lucide-react'
import { useAuth } from '../context/AuthContext'; // <-- 1. Importar useAuth
import { PLAN_LIMITS } from '@/config'; // <-- 2. Importar PLAN_LIMITS (do src/config.js)

// Definição do plano padrão/fallback
const defaultSubscription = {
  plano: 'Gratuito',
  propostas_criadas_mes: 0,
};
const defaultLimits = PLAN_LIMITS['Gratuito'];


// Estado de "Nenhuma proposta ainda"
function EmptyState() {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center mt-8">
      <FileText size={48} className="mx-auto text-slate-500 mb-4" />
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

function Propostas() {
  // --- 3. PEGAR O USUÁRIO DO CONTEXTO ---
  const { user } = useAuth(); // 'loading' do auth já foi tratado pelo AuthProvider

  // --- 4. BUSCAR PROPOSTAS (habilitado PÓS login) ---
  const {
    data: propostas,
    isLoading: loadingPropostas,
    error: errorPropostas,
  } = useQuery({
    queryKey: ['propostas'],
    queryFn: () => base44.entities.Proposta.list(),
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
      // list() agora chama getUserId() que é seguro fora do AuthContext
      const data = await base44.entities.Assinatura.list(); 
      return data[0] || defaultSubscription;
    },
    enabled: !!user, // Só busca se o usuário estiver logado
  });
  const assinatura = assinaturaData || defaultSubscription;


  // 6. Mutação para excluir
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Proposta.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] })
      queryClient.invalidateQueries({ queryKey: ['assinatura'] }) // Invalida assinatura para decrementar contagem
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
  
  // Combina os estados de loading
  const isLoading = loadingPropostas || loadingAssinatura;
  const error = errorPropostas || errorAssinatura;

  // --- 7. VERIFIQUE O LIMITE ---
  const limits = PLAN_LIMITS[assinatura.plano] || defaultLimits;
  const isLimitReached = (assinatura.propostas_criadas_mes ?? 0) >= (limits.propostas ?? 0);


  // Renderizar estados
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
        <div className="flex justify-center items-center h-64 text-red-400 p-4 text-center">
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
    <div className="p-4 md:p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">📄 Minhas Propostas</h1>
            <p className="text-slate-400">Gerencie suas propostas comerciais</p>
          </div>
          
          {/* --- 8. APLIQUE O BLOQUEIO --- */}
          <Link 
            to="/propostas/criar" 
            className={isLimitReached ? 'pointer-events-none' : ''} 
          >
            <button 
              disabled={isLimitReached || isLoading} 
              title={isLimitReached ? "Limite de propostas atingido" : "Criar nova proposta"}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Nova Proposta
            </button>
          </Link>
        </div>
        
        {/* Aviso de Limite Atingido */}
        {isLimitReached && (
            <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-500/50 text-yellow-300 rounded-lg text-sm">
                Você atingiu o limite de {limits.propostas} propostas do seu plano. 
                <Link to="/planos" className="font-bold underline hover:text-yellow-200 ml-1">Faça um upgrade</Link> para criar mais.
            </div>
        )}

        {renderContent()} {/* Sua lista de propostas */}
      </div>
    </div>
  )
}

export default Propostas