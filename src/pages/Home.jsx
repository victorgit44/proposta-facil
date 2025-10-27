import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { base44 } from '../api/supabaseClient'
import { queryClient } from '../queryClient' // Importe para o 'onExcluir'
import { formatCurrency } from '../utils/formatters'
import { Loader2, AlertCircle, TrendingUp, FileText, FileCheck, Target, MessageSquare, Briefcase, Crown, ShoppingCart } from 'lucide-react'
import { StatCard } from '../components/StatCard'
import { UsageCard } from '../components/UsageCard'
import { ProposalCard } from '../components/ProposalCard' // Reutilizando o card da lista

// Hook customizado para buscar todos os dados do dashboard
function useDashboardData() {
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  })

  const proposalsQuery = useQuery({
    queryKey: ['propostas'],
    queryFn: () => base44.entities.Proposta.list(),
  })

  const subscriptionQuery = useQuery({
    queryKey: ['assinatura'],
    queryFn: async () => {
      const data = await base44.entities.Assinatura.list();
      // Retorna a primeira assinatura encontrada
      return data[0] || {};
    },
  })

  return {
    user: userQuery.data,
    propostas: proposalsQuery.data || [],
    assinatura: subscriptionQuery.data,
    isLoading: userQuery.isLoading || proposalsQuery.isLoading || subscriptionQuery.isLoading,
    error: userQuery.error || proposalsQuery.error || subscriptionQuery.error,
  }
}

// Componente principal do Dashboard
function Home() {
  const { user, propostas, assinatura, isLoading, error } = useDashboardData()

  // Calcula as estatísticas
  const stats = useMemo(() => {
    const totalPropostas = propostas.length;
    const aprovadas = propostas.filter(p => p.status === 'Aprovada');
    const totalAprovadas = aprovadas.length;
    const valorTotal = aprovadas.reduce((sum, p) => sum + (parseFloat(p.valor_total) || 0), 0);
    const taxaAprovacao = totalPropostas > 0 ? (totalAprovadas / totalPropostas) * 100 : 0;

    return {
      totalPropostas,
      totalAprovadas,
      valorTotal: formatCurrency(valorTotal),
      taxaAprovacao: `${taxaAprovacao.toFixed(0)}%`,
    }
  }, [propostas])

  // Pega as 3 propostas mais recentes
  const recentes = useMemo(() => {
    return [...propostas]
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
      .slice(0, 3);
  }, [propostas])
  
  // (O 'onExcluir' do ProposalCard ainda precisa ser implementado)
  const handleExcluir = (id) => {
    // Implemente a lógica de exclusão se quiser o botão funcionando aqui
    console.warn(`Excluir ${id} não implementado no dashboard`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 size={48} className="text-blue-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-400">
        <AlertCircle size={48} className="mb-4" />
        <p className="text-xl mb-4">Erro ao carregar dashboard: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header do Dashboard */}
        <h1 className="text-4xl font-bold text-white mb-2">
          Bem-vindo, {user?.full_name || 'Usuário'}!
        </h1>
        <p className="text-slate-400 mb-8">Aqui está o resumo da sua conta.</p>

        {/* Banner do Plano */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-8 flex justify-between items-center shadow-lg">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown size={20} className="text-yellow-300" />
              <h2 className="text-xl font-bold text-white">
                Plano {assinatura?.plano || 'Profissional'}
              </h2>
            </div>
            {/* LINHA CORRIGIDA ABAIXO */}
            <p className="text-blue-100">Acompanhe seu uso mensal</p>
          </div>
          <Link to="/planos">
            <button className="bg-black/30 hover:bg-black/50 text-white font-semibold px-5 py-2 rounded-lg transition">
              <TrendingUp size={16} className="inline mr-2" />
              Fazer Upgrade
            </button>
          </Link>
        </div>

        {/* Cards de Uso */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <UsageCard
            title="Propostas"
            icon={FileText}
            count={assinatura?.propostas_criadas_mes || 0}
            limit={100} // TODO: Pegar o limite real do plano
            colorClass="text-blue-400"
          />
          <UsageCard
            title="Contratos"
            icon={Briefcase}
            count={assinatura?.contratos_criados_mes || 0}
            limit={50} // TODO: Pegar o limite real do plano
            colorClass="text-purple-400"
          />
          <UsageCard
            title="Chat IA"
            icon={MessageSquare}
            count={assinatura?.mensagens_ia_mes || 0}
            limit={500} // TODO: Pegar o limite real do plano
            colorClass="text-pink-400"
          />
        </div>

        {/* Cards de Estatística */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total de Propostas"
            icon={FileText}
            value={stats.totalPropostas}
            subtext={`${stats.totalAprovadas} aprovadas`}
            colorClass="text-blue-400"
          />
          <StatCard
            title="Valor Total"
            icon={ShoppingCart}
            value={stats.valorTotal}
            subtext="Em todas as propostas"
            colorClass="text-green-400"
          />
          <StatCard
            title="Taxa de Aprovação"
            icon={Target}
            value={stats.taxaAprovacao}
            subtext="Propostas aprovadas"
            colorClass="text-purple-400"
          />
        </div>

        {/* Lista de Propostas Recentes */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Lista de Propostas</h2>
          {recentes.length > 0 ? (
            <div className="space-y-6">
              {recentes.map((proposta) => (
                <ProposalCard
                  key={proposta.id}
                  proposta={proposta}
                  onExcluir={handleExcluir} // Botão de excluir não terá ação aqui
                />
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">Nenhuma proposta criada ainda.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home