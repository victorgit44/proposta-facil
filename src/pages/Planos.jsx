import React from 'react';
import { useQuery } from '@tanstack/react-query'; 
import { base44, supabase } from '@/api/supabaseClient'; // Importar supabase também
import { Loader2, AlertCircle } from 'lucide-react'; 

// Definição dos planos
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
    preco: 'R$ 49,90', 
    features: ['100 propostas/mês', '50 contratos/mês', '500 mensagens IA/mês', 'Sem marca d\'água'],
    color: 'from-blue-600 to-blue-700',
    icon: '⚡',
    popular: true
  },
  {
    nome: 'Business',
    preco: 'R$ 149,90', 
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
    queryKey: ['assinatura'], 
    queryFn: async () => {
      const data = await base44.entities.Assinatura.list();
      return data[0] || { plano: 'Gratuito' };
    },
    staleTime: 5 * 60 * 1000, 
  });
  // --- FIM DA BUSCA ---

  const planoAtualNome = assinatura?.plano || 'Gratuito';

  // --- FUNÇÃO DE CHECKOUT INTEGRADA ---
  const handleAssinar = async (planoNome) => {
      if (planoNome === 'Gratuito') return; // Não faz nada para o gratuito

      // 1. Mapeie o nome do plano para o ID do PREÇO do Stripe (price_...)
      // VOCÊ PRECISA PEGAR ESSES IDs NO SEU DASHBOARD DO STRIPE
      const priceIds = {
          'Profissional': 'price_1SL9hxKubJXy1S0w2qiNkWL3', // <--- COLE O ID DO PREÇO PROFISSIONAL AQUI
          'Business': 'price_1SL9jfKubJXy1S0wP3QqKYJD'      // <--- COLE O ID DO PREÇO BUSINESS AQUI
      };

      const priceId = priceIds[planoNome];

      if (!priceId || priceId.includes('...')) {
          alert(`Configuração necessária: Adicione o ID do preço para o plano ${planoNome} no código.`);
          return;
      }

      try {
          // 2. Chama a Edge Function 'checkout'
          const { data, error } = await supabase.functions.invoke('checkout', {
              body: { priceId }
          });

          if (error) throw error;
          
          // 3. Redireciona o usuário para a página de pagamento do Stripe
          if (data?.url) {
              window.location.href = data.url;
          } else {
              throw new Error('URL de checkout não retornada pela função.');
          }

      } catch (err) {
          console.error('Erro ao iniciar checkout:', err);
          alert('Erro ao iniciar pagamento. Tente novamente mais tarde.');
      }
  };
  // --- FIM DA FUNÇÃO ---

  // --- ESTADOS DE LOADING E ERRO ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-theme(space.16))]">
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
            const isCurrentPlan = plano.nome === planoAtualNome;
            
            return (
              <div
                key={index}
                className={`flex flex-col bg-slate-800/50 border-2 rounded-xl p-8 relative transition shadow-xl ${
                  isCurrentPlan 
                    ? 'border-green-500 ring-2 ring-green-500/50 shadow-green-500/10' 
                    : plano.popular 
                      ? 'border-blue-500 transform md:scale-105 shadow-blue-500/20 hover:border-blue-400' 
                      : 'border-slate-700 hover:border-slate-500'
                }`}
              >
                {/* Selos */}
                {plano.popular && !isCurrentPlan && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">
                    ⭐ Mais Popular
                  </div>
                )}
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

                {/* Botão */}
                <button
                  onClick={() => handleAssinar(plano.nome)}
                  disabled={isCurrentPlan}
                  className={`w-full mt-auto text-white py-3 rounded-lg font-semibold transition shadow-md ${
                    isCurrentPlan
                      ? 'bg-slate-700 cursor-default opacity-70' 
                      : `bg-gradient-to-r ${plano.color} hover:opacity-90 hover:shadow-lg`
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