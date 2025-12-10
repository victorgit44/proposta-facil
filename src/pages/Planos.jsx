import React from 'react';
import { useQuery } from '@tanstack/react-query'; 
import { base44, supabase } from '@/api/supabaseClient'; 
import { Loader2, AlertCircle, Check } from 'lucide-react'; 
import { motion } from 'framer-motion'; // <--- 1. Importação da animação

// Definição dos planos
const planosDisponiveis = [
  {
    nome: 'Gratuito',
    preco: 'R$ 0',
    features: ['3 propostas/mês', '1 contrato/mês', '10 mensagens IA/mês'],
    color: 'from-slate-600 to-slate-700',
    shadowColor: 'shadow-slate-500/20',
    icon: '✨'
  },
  {
    nome: 'Profissional',
    preco: 'R$ 49,90', 
    features: ['100 propostas/mês', '50 contratos/mês', '500 mensagens IA/mês', 'Sem marca d\'água'],
    color: 'from-blue-600 to-blue-700',
    shadowColor: 'shadow-blue-500/40',
    icon: '⚡',
    popular: true
  },
  {
    nome: 'Business',
    preco: 'R$ 149,90', 
    features: ['Propostas ilimitadas', 'Contratos ilimitados', 'IA ilimitada', 'Multi-usuários'],
    color: 'from-purple-600 to-purple-700',
    shadowColor: 'shadow-purple-500/40',
    icon: '👑'
  }
];

// Variáveis de Animação (Stagger)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2 // Atraso entre cada card aparecendo
    }
  }
};

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

export default function Planos() {

  // --- BUSCAR ASSINATURA ---
  const { data: assinatura, isLoading, error } = useQuery({
    queryKey: ['assinatura'], 
    queryFn: async () => {
      const data = await base44.entities.Assinatura.list();
      return data[0] || { plano: 'Gratuito' };
    },
    staleTime: 5 * 60 * 1000, 
  });

  const planoAtualNome = assinatura?.plano || 'Gratuito';

  // --- FUNÇÃO DE CHECKOUT ---
  const handleAssinar = async (planoNome) => {
      if (planoNome === 'Gratuito') return; 

      // !!! IDs REAIS DO STRIPE !!!
      const priceIds = {
          'Profissional': 'price_1Qxxxxxxxxxxxxxxxxxx', // <--- SEUS IDS AQUI
          'Business': 'price_YYYYYYYYYYYYYYYYYYYY'      
      };

      const priceId = priceIds[planoNome];

      if (!priceId || priceId.includes('1Qxxxxxxxx')) {
          alert(`Erro de Configuração: Adicione o ID do preço no arquivo Planos.jsx`);
          return;
      }

      try {
          const { data, error } = await supabase.functions.invoke('checkout', {
              body: { priceId }
          });

          if (error) throw error;
          
          if (data?.url) {
              window.location.href = data.url;
          } else {
              throw new Error('URL de checkout não retornada.');
          }

      } catch (err) {
          console.error('Erro ao iniciar checkout:', err);
          alert('Erro ao iniciar pagamento.');
      }
  };

  // --- LOADING / ERROR ---
  if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 size={48} className="text-blue-500 animate-spin" /></div>
  if (error) return <div className="flex flex-col justify-center items-center h-screen text-red-400 p-8 text-center"><AlertCircle size={48} className="mb-4" /><p>{error.message}</p></div>


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Cabeçalho Animado */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Escolha seu poder
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Desbloqueie todo o potencial da plataforma com planos feitos para crescer com você.
          </p>
        </motion.div>

        {/* Grid de Planos Animado */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
        >
          {planosDisponiveis.map((plano, index) => {
            const isCurrentPlan = plano.nome === planoAtualNome;
            
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }} // Sobe ao passar o mouse
                className={`flex flex-col bg-slate-900/80 backdrop-blur-xl border-2 rounded-2xl p-8 relative transition-all duration-300 ${
                  isCurrentPlan 
                    ? 'border-green-500 ring-2 ring-green-500/20 shadow-2xl shadow-green-900/20' 
                    : plano.popular 
                      ? 'border-blue-500/50 hover:border-blue-400 shadow-2xl shadow-blue-900/20' 
                      : 'border-slate-800 hover:border-slate-600'
                }`}
              >
                {/* Selos Flutuantes */}
                {plano.popular && !isCurrentPlan && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg"
                  >
                    ⭐ Mais Popular
                  </motion.div>
                )}
                {isCurrentPlan && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg"
                  >
                    ✓ Seu Plano
                  </motion.div>
                )}

                {/* Ícone e Nome */}
                <div className="mb-8 text-center">
                   <motion.div 
                     animate={{ y: [0, -5, 0] }} // Flutuação suave
                     transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                     className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${plano.color} flex items-center justify-center text-4xl mb-6 shadow-lg ${plano.shadowColor}`}
                   >
                     {plano.icon}
                   </motion.div>
                   <h3 className="text-2xl font-bold text-white mb-2">{plano.nome}</h3>
                </div>

                {/* Preço */}
                <div className="text-center mb-8 pb-8 border-b border-slate-800">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-5xl font-bold text-white tracking-tight">{plano.preco}</span>
                  </div>
                    <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">/mês</span>
                </div>

                {/* Lista de Features */}
                <ul className="space-y-4 mb-10 flex-grow">
                  {plano.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <div className={`mt-1 p-1 rounded-full bg-slate-800 ${isCurrentPlan ? 'text-green-400' : 'text-blue-400'}`}>
                        <Check size={12} strokeWidth={4} />
                      </div>
                      <span className="text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Botão Interativo */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAssinar(plano.nome)}
                  disabled={isCurrentPlan}
                  className={`w-full mt-auto py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg ${
                    isCurrentPlan
                      ? 'bg-slate-800 text-slate-400 cursor-default' 
                      : `bg-gradient-to-r ${plano.color} text-white hover:brightness-110 hover:shadow-xl`
                  }`}
                >
                  {isCurrentPlan ? 'Plano Ativo' : (index === 0 ? 'Começar Grátis' : 'Assinar Agora')}
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      
      {/* Background Glow Effects (Opcional - Efeito de fundo) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl mix-blend-screen animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl mix-blend-screen animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
    </div>
  );
}