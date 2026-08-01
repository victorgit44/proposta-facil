import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44, supabase } from '@/api/supabaseClient';
import { Loader2, AlertCircle, Check, Zap, Crown, Sparkles, ShieldCheck, HelpCircle, ArrowRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const planosDisponiveis = [
  {
    nome: 'Gratuito',
    precoMensal: 'R$ 0',
    precoAnual: 'R$ 0',
    subtexto: 'Ideal para experimentar',
    features: ['3 propostas/mês', '1 contrato/mês', '10 mensagens IA/mês', 'Suporte por e-mail'],
    color: 'from-slate-700 to-slate-800',
    badgeColor: 'bg-slate-800 text-slate-300',
    icon: Sparkles
  },
  {
    nome: 'Profissional',
    precoMensal: 'R$ 49,90',
    precoAnual: 'R$ 39,90',
    subtexto: 'Cobrado anualmente ou R$ 49,90/mês',
    features: ['100 propostas/mês', '50 contratos/mês', '500 mensagens IA/mês', 'Sem marca d\'água', 'Download em PDF de alta qualidade', 'Suporte Prioritário'],
    color: 'from-blue-600 to-indigo-600',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: Zap,
    popular: true
  },
  {
    nome: 'Business',
    precoMensal: 'R$ 149,90',
    precoAnual: 'R$ 119,90',
    subtexto: 'Cobrado anualmente ou R$ 149,90/mês',
    features: ['Propostas ilimitadas', 'Contratos ilimitados', 'IA sem restrições', 'Sem marca d\'água', 'Integração de Logo Corporativa', 'Suporte VIP via WhatsApp'],
    color: 'from-purple-600 to-pink-600',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    icon: Crown
  }
];

const faqs = [
  {
    q: 'Posso cancelar a assinatura quando quiser?',
    a: 'Sim! Não há fidelidade nos planos mensais. Você pode cancelar sua assinatura com 1 clique a qualquer momento no seu painel.'
  },
  {
    q: 'O que acontece se eu ultrapassar o limite de propostas?',
    a: 'No plano gratuito, o sistema avisa quando atingir o limite. Ao fazer o upgrade para o plano Profissional ou Business, você ganha liberação imediata de mais limite.'
  },
  {
    q: 'Os contratos gerados têm validade jurídica no Brasil?',
    a: 'Sim, todos os contratos emitidos no PropostaFácil respeitam a Medida Provisória nº 2.200-2/2001 e possuem validade legal de acordo com a legislação brasileira.'
  }
];

export default function Planos() {
  const [isAnnual, setIsAnnual] = useState(true);

  const { data: assinatura, isLoading, error } = useQuery({
    queryKey: ['assinatura'],
    queryFn: async () => {
      const data = await base44.entities.Assinatura.list();
      return data[0] || { plano: 'Gratuito' };
    },
    staleTime: 5 * 60 * 1000,
  });

  const planoAtualNome = assinatura?.plano || 'Gratuito';

  const handleAssinar = async (planoNome) => {
    if (planoNome === 'Gratuito') return;

    const priceIds = {
      'Profissional': 'price_1SL9hxKubJXy1S0w2qiNkWL3',
      'Business': 'price_1SL9jfKubJXy1S0wP3QqKYJD'
    };

    const priceId = priceIds[planoNome];

    if (!priceId) {
      alert(`Erro: ID do plano ${planoNome} não encontrado.`);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('checkout', {
        body: { priceId }
      });

      if (error) {
        console.error('Erro retornado pela Edge Function:', error);
        throw error;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de checkout não retornada.');
      }

    } catch (err) {
      console.error('Erro detalhado ao iniciar checkout:', err);
      alert('Erro ao iniciar pagamento. Verifique se o serviço de pagamento está ativo.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] text-red-400 p-8 text-center">
        <AlertCircle className="w-12 h-12 mb-3" />
        <p className="text-base">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-16 animate-in fade-in duration-300">
      {/* ------------------------------------------------------------- */}
      {/* HEADER PRINCIPAL COM CONVERSÃO E TOGGLE                       */}
      {/* ------------------------------------------------------------- */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          <span>Planos & Investimento</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Aumente sua taxa de fechamento com o plano ideal
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Sem taxas escondidas. Crie propostas irrecusáveis e gerencie contratos jurídicos em um só lugar.
        </p>

        {/* Annual / Monthly Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span className={`text-xs font-bold ${!isAnnual ? 'text-white' : 'text-slate-400'}`}>Mensal</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-8 rounded-full bg-slate-800 border border-slate-700 p-1 relative transition duration-300 cursor-pointer"
          >
            <div className={`w-6 h-6 rounded-full bg-blue-500 transition-transform duration-300 ${isAnnual ? 'translate-x-6 bg-gradient-to-r from-blue-500 to-indigo-500' : 'translate-x-0'}`} />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-bold ${isAnnual ? 'text-white' : 'text-slate-400'}`}>Anual</span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
              Economize 20%
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PRICING CARDS                                                 */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {planosDisponiveis.map((plano, index) => {
          const isCurrentPlan = plano.nome === planoAtualNome;
          const Icon = plano.icon;
          const preco = isAnnual ? plano.precoAnual : plano.precoMensal;

          return (
            <div
              key={index}
              className={`relative rounded-3xl p-8 bg-slate-900/90 backdrop-blur-xl border flex flex-col justify-between transition-all duration-300 ${
                isCurrentPlan
                  ? 'border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-2xl'
                  : plano.popular
                  ? 'border-blue-500/60 shadow-2xl shadow-blue-500/10 scale-102 lg:-translate-y-2'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Badges */}
              {plano.popular && !isCurrentPlan && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-white" />
                  <span>Mais Escolhido</span>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Seu Plano Ativo</span>
                </div>
              )}

              {/* Icon & Name */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${plano.color} flex items-center justify-center text-white shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${plano.badgeColor}`}>
                    {plano.nome}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-slate-800/80">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white tracking-tight">{preco}</span>
                    <span className="text-slate-400 text-xs font-medium">/mês</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">{plano.subtexto}</p>
                </div>

                {/* Features Checklist */}
                <ul className="space-y-3 mb-8">
                  {plano.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-slate-300">
                      <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleAssinar(plano.nome)}
                disabled={isCurrentPlan}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition duration-200 shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  isCurrentPlan
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    : plano.popular
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                <span>{isCurrentPlan ? 'Plano em Uso' : index === 0 ? 'Começar Grátis' : 'Assinar Agora'}</span>
                {!isCurrentPlan && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TRUST BADGES                                                  */}
      {/* ------------------------------------------------------------- */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-xs text-slate-400">
        <div className="flex items-center justify-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Garantia incondicional de 7 dias</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Lock className="w-5 h-5 text-blue-400 shrink-0" />
          <span>Pagamento 100% seguro via Stripe</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Zap className="w-5 h-5 text-amber-400 shrink-0" />
          <span>Ativação instantânea na conta</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FAQ ACCORDION                                                 */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-3xl mx-auto space-y-6 pt-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white tracking-tight">Perguntas Frequentes</h3>
          <p className="text-xs text-slate-400 mt-1">Dúvidas comuns sobre planos e pagamento</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}