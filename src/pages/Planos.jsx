import React from 'react';
import { useQuery } from '@tanstack/react-query'; // Importar useQuery
import { base44 } from '@/api/supabaseClient'; // Importar base44 (ajuste o caminho se necessário)
import { Loader2, AlertCircle } from 'lucide-react'; // Para loading/error states

// Definição dos planos (pode mover para um arquivo separado se preferir)
const planosDisponiveis = [
  {
    nome: 'Gratuito',
    preco: 'R$ 0',
    features: ['3 propostas/mês', '1 contrato/mês', '10 mensagens IA/mês'],
    color: 'from-slate-600 to-slate-700',
    icon: '✨'
  },
  {
    nome: 'Profissional',
    preco: 'R$ 49,90', // Exemplo de preço
    features: ['100 propostas/mês', '50 contratos/mês', '500 mensagens IA/mês', 'Sem marca d\'água'],
    color: 'from-blue-600 to-blue-700',
    icon: '⚡',
    popular: true
  },
  {
    nome: 'Business',
    preco: 'R$ 149,90', // Exemplo de preço
    features: ['Propostas ilimitadas', 'Contratos ilimitados', 'IA ilimitada', 'Multi-usuários'],
    color: 'from-purple-600 to-purple-700',
    icon: '👑'
  }
];


export default function Planos() {

  // --- BUSCAR ASSINATURA ATUAL ---
  const {
    data: assinatura,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['assinatura'], // Reutiliza a chave, pois é filtrada por usuário
    queryFn: async () => {
      const data = await base44.entities.Assinatura.list();
      // Retorna a assinatura ou um objeto com plano 'Gratuito' como fallback
      return data[0] || { plano: 'Gratuito' };
    },
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
  });
  // --- FIM DA BUSCA ---

  const planoAtualNome = assinatura?.plano || 'Gratuito';

  // Placeholder para a função de assinatura/upgrade
  const handleAssinar = (planoNome) => {
      alert(`Função de assinatura/upgrade para o plano "${planoNome}" ainda não implementada.`);
      // Aqui você integraria com Stripe, etc.
  };

  // --- ESTADOS DE LOADING E ERRO ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-theme(space.16))]"> {/* Altura ajustada */}
        <Loader2 size={48} className="text-blue-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-theme(space.16))] text-red-400 p-8 text-center">
        <AlertCircle size={48} className="mb-4" />
        <p>Erro ao carregar informações da assinatura: {error.message}</p>
      </div>
    )
  }
  // --- FIM DOS ESTADOS ---


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">💎 Escolha seu plano ideal</h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Comece grátis e faça upgrade quando precisar para desbloquear todo o potencial.
          </p>
        </div>

        {/* Grid de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {planosDisponiveis.map((plano, index) => {
            const isCurrentPlan = plano.nome === planoAtualNome; // Verifica se é o plano atual
            
            return (
              <div
                key={index}
                className={`flex flex-col bg-slate-800/50 border-2 rounded-xl p-8 relative transition shadow-xl ${ // Estilos base
                  // Estilos condicionais
                  isCurrentPlan 
                    ? 'border-green-500 ring-2 ring-green-500/50 shadow-green-500/10' // Estilo do plano atual
                    : plano.popular 
                      ? 'border-blue-500 transform md:scale-105 shadow-blue-500/20 hover:border-blue-400' // Estilo popular
                      : 'border-slate-700 hover:border-slate-500' // Estilo padrão
                }`}
              >
                {/* Selo Popular (não mostra se for o plano atual) */}
                {plano.popular && !isCurrentPlan && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">
                    ⭐ Mais Popular
                  </div>
                )}
                 {/* Selo Plano Atual */}
                {isCurrentPlan && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">
                    ✓ Plano Atual
                  </div>
                )}

                {/* Ícone e Nome */}
                <div className="mb-6 text-center">
                   <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${plano.color} flex items-center justify-center text-3xl mb-4 shadow-md`}>
                     {plano.icon}
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-2">{plano.nome}</h3>
                </div>

                {/* Preço */}
                <div className="text-center mb-8">
                  <span className="text-4xl font-bold text-white">{plano.preco}</span>
                  <span className="text-lg text-slate-400">/mês</span>
                </div>

                {/* Lista de Features */}
                <ul className="space-y-3 mb-10 flex-grow">
                  {plano.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Botão (com texto diferente para plano atual) */}
                <button
                  onClick={() => handleAssinar(plano.nome)}
                  disabled={isCurrentPlan} // Desabilita o botão do plano atual
                  className={`w-full mt-auto text-white py-3 rounded-lg font-semibold transition shadow-md ${
                    isCurrentPlan
                      ? 'bg-slate-700 cursor-default opacity-70' // Estilo botão plano atual
                      : `bg-gradient-to-r ${plano.color} hover:opacity-90 hover:shadow-lg` // Estilo botão outros planos
                  }`}
                >
                  {isCurrentPlan ? 'Seu Plano Atual' : (index === 0 ? 'Começar Grátis' : 'Assinar Agora')}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}