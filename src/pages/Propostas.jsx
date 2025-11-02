import React, { useMemo } from 'react' // <-- 1. Adicionado useMemo
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { base44 } from '../api/supabaseClient'
import { queryClient } from '../queryClient'
import { ProposalCard } from '../components/ProposalCard'
// --- 2. Adicionado StatCard, formatters e novos ícones ---
import { Loader2, AlertCircle, FileText, Wallet, CheckSquare, TrendingUp } from 'lucide-react' 
import { StatCard } from '../components/StatCard'
import { formatCurrency } from '../utils/formatters'
// --- Fim das adições ---
import { useAuth } from '../context/AuthContext';
import { PLAN_LIMITS } from '@/config'; 

// Definição do plano padrão/fallback
const defaultSubscription = {
  plano: 'Gratuito',
  propostas_criadas_mes: 0,
};
const defaultLimits = PLAN_LIMITS['Gratuito'];

// Componente EmptyState (sem mudanças)
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
  const { user } = useAuth(); 

  // Busca Propostas (sem mudanças)
  const {
    data: propostasData, // Renomeado para evitar conflito
    isLoading: loadingPropostas,
    error: errorPropostas,
  } = useQuery({
    queryKey: ['propostas'],
    queryFn: () => base44.entities.Proposta.list(),
    enabled: !!user, 
  })
  const propostas = propostasData || []; // Garante que é um array

  // Busca Assinatura (sem mudanças)
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
    enabled: !!user, 
  });
  const assinatura = assinaturaData || defaultSubscription;

  // --- 3. ADICIONADO CÁLCULO DE ESTATÍSTICAS ---
  const stats = useMemo(() => {
    if (!propostas) return { totalPropostas: 0, totalAprovadas: 0, valorTotal: 'R$ 0,00', taxaAprovacao: '0%' };
    
    const totalPropostas = propostas.length;
    const aprovadas = propostas.filter(p => p.status === 'aprovada');
    const totalAprovadas = aprovadas.length;
    // Usa o valor total das APROVADAS, como no design
    const valorTotalAprovadas = aprovadas.reduce((sum, p) => sum + (parseFloat(p.valor_total) || 0), 0);
    const taxaAprovacao = totalPropostas > 0 ? (totalAprovadas / totalPropostas) * 100 : 0;

    return {
      totalPropostas,
      totalAprovadas,
      valorTotal: formatCurrency(valorTotalAprovadas), 
      taxaAprovacao: `${taxaAprovacao.toFixed(0)}%`,
    }
  }, [propostas]);
  // --- FIM DA ADIÇÃO ---

  // Mutação para excluir (sem mudanças)
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Proposta.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] })
      queryClient.invalidateQueries({ queryKey: ['assinatura'] }) 
    },
    onError: (err) => { alert(`Erro ao excluir: ${err.message}`) },
  })

  const handleExcluir = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta proposta?')) {
      deleteMutation.mutate(id)
    }
  }
  
  // Combina estados de loading e erro (sem mudanças)
  const isLoading = loadingPropostas || loadingAssinatura;
  const error = errorPropostas || errorAssinatura;

  // Verifica Limite (sem mudanças)
  const limits = PLAN_LIMITS[assinatura.plano] || defaultLimits;
  const isLimitReached = (assinatura.propostas_criadas_mes ?? 0) >= (limits.propostas ?? 0);

  // Renderizar estados (sem mudanças)
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">📄 Minhas Propostas</h1>
            <p className="text-slate-400">Gerencie suas propostas comerciais</p>
          </div>
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
        
        {/* Aviso de Limite Atingido (sem mudanças) */}
        {isLimitReached && (
            <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-500/50 text-yellow-300 rounded-lg text-sm">
                Você atingiu o limite de {limits.propostas} propostas do seu plano. 
                <Link to="/planos" className="font-bold underline hover:text-yellow-200 ml-1">Faça um upgrade</Link> para criar mais.
            </div>
        )}

        {/* --- 4. ADICIONADO JSX DOS STATCARDS --- */}
        {/* (Baseado no design da imagem 'image_f9e1ac.png') */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total de Propostas"
            icon={FileText} // Ícone de 'image_f9e1ac.png'
            value={stats.totalPropostas}
            subtext={`${stats.totalAprovadas} aprovadas`}
            colorClass="text-blue-400"
          />
          <StatCard
            title="Valor Aprovado" // Nomeado como 'Valor Total' em 'f9e1ac.png'
            icon={TrendingUp} // Ícone de 'image_f9e1ac.png'
            value={stats.valorTotal}
            subtext="Em propostas aprovadas"
            colorClass="text-green-400"
          />
          <StatCard
            title="Taxa de Aprovação"
            icon={CheckSquare} // Ícone de 'image_f9e1ac.png' (é um check roxo)
            value={stats.taxaAprovacao}
            subtext="Propostas aprovadas"
            colorClass="text-purple-400"
          />
        </div>
        {/* --- FIM DO JSX --- */}


        <h2 className="text-2xl font-bold text-white mb-6">Lista de Propostas</h2>
        {renderContent()} {/* Sua lista de propostas */}
      </div>
    </div>
  )
}

export default Propostas