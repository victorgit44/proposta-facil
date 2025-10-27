import React from 'react';
// import { Link } from 'react-router-dom'; // Descomente se precisar de links para assinatura

// Componente da Página de Planos
export default function Planos() { // Renomeado para 'Planos' para seguir o padrão
  const planos = [
    {
      nome: 'Gratuito',
      preco: 'R$ 0',
      features: ['3 propostas/mês', '1 contrato/mês', '10 mensagens IA/mês'],
      color: 'from-slate-600 to-slate-700', // Gradiente de cor para o botão/ícone
      icon: '✨' // Ícone
    },
    {
      nome: 'Profissional',
      preco: 'R$ 49,90',
      features: ['100 propostas/mês', '50 contratos/mês', '500 mensagens IA/mês', 'Sem marca d\'água'],
      color: 'from-blue-600 to-blue-700',
      icon: '⚡',
      popular: true // Indica que este é o plano popular
    },
    {
      nome: 'Business',
      preco: 'R$ 149,90',
      features: ['Propostas ilimitadas', 'Contratos ilimitados', 'IA ilimitada', 'Multi-usuários'],
      color: 'from-purple-600 to-purple-700',
      icon: '👑'
    }
  ];

  // Placeholder para a função de assinatura
  const handleAssinar = (planoNome) => {
      alert(`Função de assinatura para o plano "${planoNome}" ainda não implementada.`);
      // Aqui você integraria com Stripe, PagSeguro, etc.
  };


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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"> {/* items-stretch para cards terem mesma altura */}
          {planos.map((plano, index) => (
            <div
              key={index}
              className={`flex flex-col bg-slate-800/50 border-2 ${ // Adicionado flex flex-col
                plano.popular ? 'border-blue-500 transform md:scale-105 shadow-blue-500/20' : 'border-slate-700'
              } rounded-xl p-8 relative hover:border-blue-400 transition shadow-xl`} // Adicionado shadow-xl
            >
              {/* Selo Popular */}
              {plano.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">
                  ⭐ Mais Popular
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
              <ul className="space-y-3 mb-10 flex-grow"> {/* Adicionado flex-grow */}
                {plano.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <span className="text-green-500 mt-1 flex-shrink-0">✓</span> {/* Adicionado flex-shrink-0 */}
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Botão */}
              <button 
                onClick={() => handleAssinar(plano.nome)}
                className={`w-full mt-auto bg-gradient-to-r ${plano.color} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-md hover:shadow-lg`}
              >
                {index === 0 ? 'Começar Grátis' : 'Assinar Agora'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}