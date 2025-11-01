import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { base44 } from '../api/supabaseClient'
import { queryClient } from '../queryClient'
import { formatCurrency } from '../utils/formatters'
import { Loader2, AlertCircle, TrendingUp, FileText, CheckSquare, Target, MessageSquare, Briefcase, Crown, ShoppingCart, Wallet } from 'lucide-react'
import { StatCard } from '../components/StatCard'
import { UsageCard } from '../components/UsageCard'
import { ProposalCard } from '../components/ProposalCard'
import { useAuth } from '../context/AuthContext' // Importa o hook de auth simplificado
import { PLAN_LIMITS } from '@/config' // Importa os limites do config

// (Removemos o hook useDashboardData, vamos buscar tudo aqui)

// Definição do plano padrão/fallback
const defaultSubscription = {
  plano: 'Gratuito',
  propostas_criadas_mes: 0,
  contratos_criados_mes: 0,
  mensagens_ia_mes: 0,
};
const defaultLimits = PLAN_LIMITS['Gratuito'];


// Componente principal do Dashboard
function Home() {
  // 1. Pega o usuário do AuthContext
  const { user } = useAuth(); // 'loading' do auth já foi tratado pelo provider

  // 2. Busca Propostas (só roda se 'user' existir, habilitado por padrão)
  const {
    data: propostasData,
    isLoading: loadingPropostas,
    error: errorPropostas
  } = useQuery({
    queryKey: ['propostas'],
    queryFn: () => base44.entities.Proposta.list(),
    enabled: !!user, // Só busca se o usuário estiver logado
  });
  const propostas = propostasData || [];

  // 3. Busca Assinatura (só roda se 'user' existir)
  const {
    data: assinaturaData,
    isLoading: loadingAssinatura,
    error: errorAssinatura
  } = useQuery({
    queryKey: ['assinatura'],
    queryFn: async () => {
      const data = await base44.entities.Assinatura.list(); // list() chama getUserId() que agora é seguro
      return data[0] || defaultSubscription;
    },
    enabled: !!user, // Só busca se o usuário estiver logado
  });
  const assinatura = assinaturaData || defaultSubscription;

  // 4. Combina os estados
  const isLoading = loadingPropostas || loadingAssinatura;
  const error = errorPropostas || errorAssinatura;

  // 5. Calcula stats e recentes (sem alteração)
  const stats = useMemo(() => {
    // ... (lógica do useMemo stats) ...
    const totalPropostas = propostas.length;
    const aprovadas = propostas.filter(p => p.status === 'Aprovada');
    const totalAprovadas = aprovadas.length;
    const valorTotalAprovadas = aprovadas.reduce((sum, p) => sum + (parseFloat(p.valor_total) || 0), 0);
    const taxaAprovacao = totalPropostas > 0 ? (totalAprovadas / totalPropostas) * 100 : 0;
    return {
      totalPropostas, totalAprovadas,
      valorTotal: formatCurrency(valorTotalAprovadas), 
      taxaAprovacao: `${taxaAprovacao.toFixed(0)}%`,
    }
  }, [propostas]);

  const recentes = useMemo(() => {
    if (!Array.isArray(propostas)) return []; 
    return [...propostas]
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
      .slice(0, 3);
  }, [propostas]);
  
  // 6. Lógica de Exclusão (sem alteração)
   const deleteMutation = useMutation({
       mutationFn: (id) => base44.entities.Proposta.delete(id),
       onSuccess: () => {
           queryClient.invalidateQueries({ queryKey: ['propostas'] })
           queryClient.invalidateQueries({ queryKey: ['assinatura'] }) // Invalida assinatura se excluir afeta contagem
       },
       onError: (err) => alert(`Erro ao excluir: ${err.message}`),
   });
   const handleExcluir = (id) => {
       if (window.confirm('Tem certeza?')) {
           deleteMutation.mutate(id);
       }
   };

  // 7. Renderiza Loading/Error
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

  // 8. Pega limites (agora localmente)
  const currentPlanName = assinatura?.plano || 'Gratuito';
  const limits = PLAN_LIMITS[currentPlanName] || PLAN_LIMITS['Gratuito'];


  // 9. Renderiza o JSX (sem alteração no JSX)
  return (
    <div className="p-4 md:p-8 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-white mb-2">
          Bem-vindo, {user?.full_name || user?.email?.split('@')[0] || 'Usuário'}!
        </h1>
        <p className="text-slate-400 mb-8">Aqui está o resumo da sua conta.</p>

        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-8 flex justify-between items-center shadow-lg">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown size={20} className="text-yellow-300" />
              <h2 className="text-xl font-bold text-white">
                Plano {currentPlanName}
              </h2>
            </div>
            <p className="text-blue-100">Acompanhe seu uso mensal</p>
          </div>
          <Link to="/planos">
            <button className="bg-black/30 hover:bg-black/50 text-white font-semibold px-5 py-2 rounded-lg transition text-sm">
              <TrendingUp size={16} className="inline mr-1.5" />
              Fazer Upgrade
            </button>
          </Link>
        </div>

        {/* Cards de Uso */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <UsageCard
            title="Propostas"
            icon={FileText}
            count={assinatura?.propostas_criadas_mes ?? 0}
            limit={limits.propostas}
            colorClass="text-blue-400"
          />
          <UsageCard
            title="Contratos"
            icon={Briefcase}
            count={assinatura?.contratos_criadas_mes ?? 0}
            limit={limits.contratos}
            colorClass="text-purple-400"
          />
          <UsageCard
            title="Chat IA"
            icon={MessageSquare}
            count={assinatura?.mensagens_ia_mes ?? 0}
            limit={limits.ia}
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
            title="Valor Aprovado"
            icon={Wallet}
            value={stats.valorTotal}
            subtext="Em propostas aprovadas"
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

        {/* Propostas Recentes */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Propostas Recentes</h2> 
          {recentes.length > 0 ? (
            <div className="space-y-6">
              {recentes.map((proposta) => (
                <ProposalCard
                  key={proposta.id}
                  proposta={proposta}
                  onExcluir={handleExcluir}
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center mt-8">
               <FileText size={48} className="mx-auto text-slate-500 mb-4" />
               <p className="text-slate-400">Nenhuma proposta criada ainda.</p>
               <Link to="/propostas/criar" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                  Criar Primeira Proposta
               </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home;