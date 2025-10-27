import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
// Import useMutation
import { useQuery, useMutation } from '@tanstack/react-query' 
import { base44 } from '../api/supabaseClient'
import { queryClient } from '../queryClient'
import { formatCurrency } from '../utils/formatters'
// Importar Wallet e CheckSquare
import { Loader2, AlertCircle, TrendingUp, FileText, CheckSquare, Target, MessageSquare, Briefcase, Crown, ShoppingCart, Wallet } from 'lucide-react' 
import { StatCard } from '../components/StatCard'
import { UsageCard } from '../components/UsageCard'
import { ProposalCard } from '../components/ProposalCard'

// Hook customizado para buscar todos os dados do dashboard
function useDashboardData() {
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity, // Dados do usuário raramente mudam
  })

  const proposalsQuery = useQuery({
    queryKey: ['propostas'], // Busca apenas as propostas do usuário logado
    queryFn: () => base44.entities.Proposta.list(),
  })

  // --- MODIFICADO: Busca a assinatura DO usuário logado ---
  const subscriptionQuery = useQuery({
    queryKey: ['assinatura'], // Chave de query filtrada por usuário implicitamente
    queryFn: async () => {
      // O client 'createOwnedEntityClient' para Assinatura já filtra por user_id
      const data = await base44.entities.Assinatura.list();
      // Retorna a primeira (e única) assinatura do usuário, ou um objeto padrão
      return data[0] || { plano: 'Gratuito', propostas_criadas_mes: 0, contratos_criados_mes: 0, mensagens_ia_mes: 0 };
    },
    // staleTime: 5 * 60 * 1000, // Ex: Cache por 5 minutos
  })
  // --- FIM DA MODIFICAÇÃO ---


  return {
    user: userQuery.data,
    propostas: proposalsQuery.data || [],
    assinatura: subscriptionQuery.data, // Contém a assinatura do usuário ou o padrão
    // Verifica loading de todas as queries
    isLoading: userQuery.isLoading || proposalsQuery.isLoading || subscriptionQuery.isLoading,
    // Pega o primeiro erro que ocorrer
    error: userQuery.error || proposalsQuery.error || subscriptionQuery.error,
  }
}

// --- Definição dos Limites dos Planos ---
const PLAN_LIMITS = {
    'Gratuito': { propostas: 3, contratos: 1, ia: 10 },
    'Profissional': { propostas: 100, contratos: 50, ia: 500 },
    'Business': { propostas: Infinity, contratos: Infinity, ia: Infinity },
    // Adicione outros planos se houver
};
// --- Fim da Definição dos Limites ---

// Componente principal do Dashboard
function Home() {
  const { user, propostas, assinatura, isLoading, error } = useDashboardData()

  // Calcula as estatísticas
  const stats = useMemo(() => {
    const totalPropostas = propostas.length;
    const aprovadas = propostas.filter(p => p.status === 'Aprovada'); // Use 'Aprovada' se for o status correto
    const totalAprovadas = aprovadas.length;
    // Soma apenas o valor das propostas APROVADAS
    const valorTotalAprovadas = aprovadas.reduce((sum, p) => sum + (parseFloat(p.valor_total) || 0), 0);
    const taxaAprovacao = totalPropostas > 0 ? (totalAprovadas / totalPropostas) * 100 : 0;

    return {
      totalPropostas,
      totalAprovadas,
      // Usar o valor total das aprovadas para o StatCard "Valor Total"
      valorTotal: formatCurrency(valorTotalAprovadas), 
      taxaAprovacao: `${taxaAprovacao.toFixed(0)}%`,
    }
  }, [propostas])

  // Pega as 3 propostas mais recentes
  const recentes = useMemo(() => {
    // Garante que propostas é um array antes de ordenar
    if (!Array.isArray(propostas)) return []; 
    return [...propostas]
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
      .slice(0, 3);
  }, [propostas])
  
  // --- Lógica de Exclusão Implementada ---
   const deleteMutation = useMutation({
       mutationFn: (id) => base44.entities.Proposta.delete(id),
       onSuccess: () => {
           // Invalida a query 'propostas' para atualizar a lista e os stats
           queryClient.invalidateQueries({ queryKey: ['propostas'] }) 
           // Poderia invalidar 'assinatura' se a exclusão afetasse a contagem,
           // mas a contagem geralmente é atualizada no backend.
           // queryClient.invalidateQueries({ queryKey: ['assinatura'] }) 
           console.log("Proposta excluída, query 'propostas' invalidada.")
       },
       onError: (err) => { 
           console.error("Erro ao excluir proposta:", err);
           alert(`Erro ao excluir proposta: ${err.message}`) 
       },
   });

   const handleExcluir = (id) => {
       if (window.confirm('Tem certeza de que deseja excluir esta proposta? Esta ação não pode ser desfeita.')) {
           console.log("Iniciando exclusão da proposta ID:", id);
           deleteMutation.mutate(id);
       }
   };
   // --- Fim da Lógica de Exclusão ---

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
        {/* Mostra a mensagem de erro específica */}
        <p className="text-xl mb-4">Erro ao carregar dashboard: {error.message}</p> 
      </div>
    )
  }

  // --- Obtém os limites do plano atual ---
  const currentPlanName = assinatura?.plano || 'Gratuito'; // Usa 'Gratuito' como fallback
  const limits = PLAN_LIMITS[currentPlanName] || PLAN_LIMITS['Gratuito']; // Usa limites do Gratuito como fallback
  // --- Fim da obtenção dos limites ---


  return (
    <div className="p-4 md:p-8 text-white"> {/* Adicionado text-white aqui */}
      <div className="max-w-7xl mx-auto">
        {/* Header do Dashboard */}
        <h1 className="text-4xl font-bold text-white mb-2">
          Bem-vindo, {user?.full_name || user?.email?.split('@')[0] || 'Usuário'}! {/* Tenta usar full_name */}
        </h1>
        <p className="text-slate-400 mb-8">Aqui está o resumo da sua conta.</p>

        {/* Banner do Plano */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-8 flex justify-between items-center shadow-lg">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown size={20} className="text-yellow-300" />
              <h2 className="text-xl font-bold text-white">
                Plano {currentPlanName} {/* Usa nome do plano real */}
              </h2>
            </div>
            <p className="text-blue-100">Acompanhe seu uso mensal</p>
          </div>
          <Link to="/planos">
            <button className="bg-black/30 hover:bg-black/50 text-white font-semibold px-5 py-2 rounded-lg transition text-sm"> {/* Tamanho do texto ajustado */}
              <TrendingUp size={16} className="inline mr-1.5" /> {/* Espaçamento ajustado */}
              Fazer Upgrade
            </button>
          </Link>
        </div>

        {/* Cards de Uso (com limites dinâmicos) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <UsageCard
            title="Propostas"
            icon={FileText}
            count={assinatura?.propostas_criadas_mes ?? 0} // Usa ?? 0 para fallback
            limit={limits.propostas} // Usa limite do plano
            colorClass="text-blue-400"
          />
          <UsageCard
            title="Contratos"
            icon={Briefcase}
            count={assinatura?.contratos_criados_mes ?? 0}
            limit={limits.contratos} // Usa limite do plano
            colorClass="text-purple-400"
          />
          <UsageCard
            title="Chat IA"
            icon={MessageSquare}
            count={assinatura?.mensagens_ia_mes ?? 0}
            limit={limits.ia} // Usa limite do plano
            colorClass="text-pink-400"
          />
        </div>

        {/* Cards de Estatística (com ícones atualizados) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total de Propostas"
            icon={FileText}
            value={stats.totalPropostas}
            subtext={`${stats.totalAprovadas} aprovadas`}
            colorClass="text-blue-400"
          />
          <StatCard
            title="Valor Aprovado" // Título mais claro
            icon={Wallet} // Ícone atualizado
            value={stats.valorTotal} // Agora é o valor das APROVADAS
            subtext="Em propostas aprovadas" // Subtexto atualizado
            colorClass="text-green-400"
          />
          <StatCard
            title="Taxa de Aprovação"
            icon={Target} // CheckSquare poderia ser usado também
            value={stats.taxaAprovacao}
            subtext="Propostas aprovadas"
            colorClass="text-purple-400" // Ou text-green-400 se preferir
          />
        </div>

        {/* Lista de Propostas Recentes (com onExcluir funcional) */}
        <div>
          {/* Título ajustado para clareza */}
          <h2 className="text-2xl font-bold text-white mb-6">Propostas Recentes</h2> 
          {recentes.length > 0 ? (
            <div className="space-y-6">
              {recentes.map((proposta) => (
                <ProposalCard
                  key={proposta.id}
                  proposta={proposta}
                  onExcluir={handleExcluir} // Passa a função real
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

// Nota: Certifique-se que StatCard, UsageCard, ProposalCard são importados corretamente
// dos seus respectivos arquivos em src/components/