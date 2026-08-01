import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Sparkles, ShieldCheck, TrendingUp, Zap, Check, ArrowRight, 
  ChevronDown, Clock, BarChart3, Lock, Users, Star, CheckCircle2, 
  HelpCircle, Eye, RefreshCw, Send, Layers, Building2, ChevronRight, X, Copy, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('annual');
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "O PropostaFácil substitui o Word e o gerador de PDF tradicional?",
      answer: "Sim. Em vez de enviar arquivos em PDF estáticos sem rastreamento, você envia um link interativo seguro onde o cliente lê, escolhe itens, aceita digitalmente e você acompanha quantas vezes ele visualizou a proposta."
    },
    {
      question: "Os contratos e aceites digitais têm validade jurídica no Brasil?",
      answer: "Sim. Todos os aceites gravam o Nome do Responsável, Data/Hora exata, Endereço IP do dispositivo e Hash SHA-256 de integridade em conformidade com a MP 2.200-2/2001 e o Código Civil Brasileiro."
    },
    {
      question: "Como a plataforma acelera a criação das propostas?",
      answer: "Você pode utilizar nossa Biblioteca de Modelos pré-formatados (estilo Business-in-a-Box) ou preencher o escopo automaticamente com auxílio da nossa IA em menos de 2 minutos."
    },
    {
      question: "Posso personalizar com a minha própria logomarca e marca?",
      answer: "Com certeza. Você pode incluir sua logo, dados da empresa, CNPJ, termos contratuais padrão e cores da sua marca comercial."
    },
    {
      question: "Como funciona o cancelamento da assinatura?",
      answer: "O cancelamento pode ser realizado a qualquer momento no painel de configurações da sua conta, sem multas ou taxas de permanência."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* Glow de Fundo Sutil */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent rounded-full blur-[180px] pointer-events-none z-0"
      />

      {/* Navbar Superior Linear Style */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md shadow-blue-600/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">PropostaFácil</span>
              <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                Plataforma Comercial
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-300">
            <a href="#problema" className="hover:text-blue-400 transition">O Problema</a>
            <a href="#recursos" className="hover:text-blue-400 transition">Recursos</a>
            <a href="#comparativo" className="hover:text-blue-400 transition">Comparativo</a>
            <a href="#templates" className="hover:text-blue-400 transition">Modelos</a>
            <a href="#precos" className="hover:text-blue-400 transition">Preços</a>
            <a href="#faq" className="hover:text-blue-400 transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/25 flex items-center gap-2 cursor-pointer"
            >
              <span>Testar Agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section (Vendas & Conversão) */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider shadow-inner">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>A Plataforma Comercial que Leva sua Negociação até a Assinatura</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
            Transforme Propostas Comerciais em <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">Contratos Assinados</span> em Minutos
          </h1>

          <p className="text-slate-400 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            Elimine a perda de vendas por falta de acompanhamento. Crie propostas irrecusáveis, acompanhe a leitura do cliente em tempo real e colha o aceite digital instantâneo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition duration-200 shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 cursor-pointer group"
            >
              <span>Criar Minha Primeira Proposta</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#comparativo"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex items-center justify-center gap-2"
            >
              <span>Ver Comparativo com Word/PDF</span>
            </a>
          </div>

          {/* Screenshot Real do Sistema */}
          <div className="pt-8 relative max-w-6xl mx-auto">
            <div className="relative rounded-3xl p-2 bg-gradient-to-b from-blue-500/20 via-slate-800/40 to-slate-900/60 border border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden">
              <img
                src="/images/landing_hero_mockup.png"
                alt="Interface do PropostaFácil"
                className="w-full h-auto rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problema vs Solução */}
      <section id="problema" className="py-24 bg-slate-900/50 border-y border-slate-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-rose-400">O Gargalo Comercial</h2>
            <p className="text-3xl sm:text-5xl font-black tracking-tight text-white">Por que você está perdendo vendas no fechamento?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-slate-950 border border-rose-500/20 space-y-6">
              <div className="flex items-center gap-3 text-rose-400">
                <X className="w-6 h-6" />
                <h3 className="text-lg font-bold text-white">O Modelo Tradicional (Word / PDF)</h3>
              </div>
              <ul className="space-y-4 text-xs text-slate-400">
                <li className="flex items-start gap-3"><span className="text-rose-400 font-bold">✕</span> Demora de 2 a 4 horas para montar cada proposta do zero.</li>
                <li className="flex items-start gap-3"><span className="text-rose-400 font-bold">✕</span> Zero visibilidade: você não sabe se o cliente abriu ou ignorou o PDF.</li>
                <li className="flex items-start gap-3"><span className="text-rose-400 font-bold">✕</span> Processo burocrático de impressão, assinatura física e escaneamento.</li>
                <li className="flex items-start gap-3"><span className="text-rose-400 font-bold">✕</span> Propostas paradas por semanas sem qualquer acompanhamento comercial.</li>
              </ul>
            </div>

            <div className="p-8 rounded-3xl bg-slate-950 border border-emerald-500/30 space-y-6">
              <div className="flex items-center gap-3 text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
                <h3 className="text-lg font-bold text-white">Com a Plataforma PropostaFácil</h3>
              </div>
              <ul className="space-y-4 text-xs text-slate-300">
                <li className="flex items-start gap-3"><span className="text-emerald-400 font-bold">✓</span> Propostas e escopos gerados em menos de 2 minutos via Templates ou IA.</li>
                <li className="flex items-start gap-3"><span className="text-emerald-400 font-bold">✓</span> Rastreamento de visualizações em tempo real com alerta de follow-up.</li>
                <li className="flex items-start gap-3"><span className="text-emerald-400 font-bold">✓</span> Aceite digital instantâneo com registro de IP, data/hora e nome do cliente.</li>
                <li className="flex items-start gap-3"><span className="text-emerald-400 font-bold">✓</span> Conversão automática da proposta em contrato de prestação de serviço.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tabela Comparativa direta */}
      <section id="comparativo" className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-400">Comparação Comercial</h2>
          <p className="text-3xl sm:text-4xl font-black tracking-tight text-white">PropostaFácil vs PDF Tradicional</p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/80">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 uppercase text-[10px] tracking-wider text-slate-400 bg-slate-950">
                <th className="p-4 font-extrabold">Funcionalidade Comercial</th>
                <th className="p-4 font-extrabold text-slate-400">PDF / Word Tradicional</th>
                <th className="p-4 font-extrabold text-blue-400">PropostaFácil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              <tr>
                <td className="p-4 font-bold">Tempo Médio de Elaboração</td>
                <td className="p-4 text-slate-500">2 a 4 Horas</td>
                <td className="p-4 text-emerald-400 font-extrabold">Menos de 2 Minutos</td>
              </tr>
              <tr>
                <td className="p-4 font-bold">Rastreamento de Leitura do Cliente</td>
                <td className="p-4 text-rose-400 font-bold">Impossível (Estático)</td>
                <td className="p-4 text-emerald-400 font-extrabold">Tempo Real (Alerta de Leitura)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold">Aceite Digital Instantâneo com IP</td>
                <td className="p-4 text-rose-400 font-bold">Não Possui</td>
                <td className="p-4 text-emerald-400 font-extrabold">Sim (Link Rastreável /p/:id)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold">Conversão Automática em Contrato</td>
                <td className="p-4 text-rose-400 font-bold">Não Possui</td>
                <td className="p-4 text-emerald-400 font-extrabold">Sim (1-Clique)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold">Modelos Pré-Formatados (Business-in-a-Box)</td>
                <td className="p-4 text-slate-500">Arquivos Desorganizados</td>
                <td className="p-4 text-emerald-400 font-extrabold">Biblioteca Integrada por Nicho</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Modelos de Documentos (Inspirado no Business-in-a-Box) */}
      <section id="templates" className="py-24 bg-slate-900/40 border-y border-slate-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Biblioteca de Documentos</h2>
            <p className="text-3xl sm:text-5xl font-black tracking-tight text-white">Modelos Prontos inspirados no Business-in-a-Box</p>
            <p className="text-slate-400 text-sm">Acesse uma estrutura completa de documentos comerciais e minutas contratuais pré-formatadas para o seu setor.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                Tecnologia & SaaS
              </span>
              <h3 className="text-base font-bold text-white">Propostas de Desenvolvimento & TI</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Escopos pré-definidos para desenvolvimento web, softwares sob medida, aplicativos e infraestrutura de TI.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded">
                Consultoria & Serviços
              </span>
              <h3 className="text-base font-bold text-white">Consultoria Empresarial & Vendas</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Modelos de diagnóstico estratégico, assessoria em processos comerciais e treinamento de equipes.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded">
                Jurídico & Contratos
              </span>
              <h3 className="text-base font-bold text-white">Contratos de Serviços & NDAs</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Minutas de contratos com validade jurídica, termos de confidencialidade e aditivos contratuais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Preços (Faturamento R$99 a R$399/mês) */}
      <section id="precos" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-400">Investimento com Retorno Rápido</h2>
          <p className="text-3xl sm:text-5xl font-black tracking-tight text-white">Planos Comerciais de Alta Performance</p>
          
          <div className="pt-4 flex items-center justify-center gap-4">
            <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>Mensal</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'annual' ? 'monthly' : 'annual')}
              className="w-14 h-8 rounded-full bg-slate-800 p-1 relative border border-slate-700 transition cursor-pointer"
            >
              <div className={`w-6 h-6 rounded-full bg-blue-500 transition-transform ${billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${billingCycle === 'annual' ? 'text-white' : 'text-slate-400'}`}>Anual</span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">20% OFF</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Starter */}
          <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Starter</h3>
              <p className="text-xs text-slate-400">Para profissionais autônomos e pequenos consultores.</p>
              <div className="pt-2">
                <span className="text-4xl font-black text-white">
                  R$ {billingCycle === 'annual' ? '79' : '99'}
                </span>
                <span className="text-xs text-slate-400"> /mês</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 pt-4">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Até 15 propostas comerciais/mês</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Aceite Digital via Link Público (/p/:id)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Exportação em PDF Executivo</li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 bg-slate-900 border border-slate-800 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              Começar Agora
            </button>
          </div>

          {/* Professional (Destaque) */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border-2 border-blue-500 space-y-6 flex flex-col justify-between relative shadow-2xl shadow-blue-500/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
              Recomendado
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Professional</h3>
              <p className="text-xs text-slate-400">Para empresas e agências em crescimento comercial.</p>
              <div className="pt-2">
                <span className="text-4xl font-black text-white">
                  R$ {billingCycle === 'annual' ? '159' : '199'}
                </span>
                <span className="text-xs text-slate-400"> /mês</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 pt-4">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" /> Propostas e Contratos Ilimitados</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" /> CRM Kanban & Funil de Oportunidades</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" /> Assistente de Vendas com IA</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" /> Biblioteca Business-in-a-Box</li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              Assinar Plano Professional
            </button>
          </div>

          {/* Scale Enterprise */}
          <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Scale Enterprise</h3>
              <p className="text-xs text-slate-400">Para equipes de vendas comerciais de alta demanda.</p>
              <div className="pt-2">
                <span className="text-4xl font-black text-white">
                  R$ {billingCycle === 'annual' ? '319' : '399'}
                </span>
                <span className="text-xs text-slate-400"> /mês</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 pt-4">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Múltiplos Usuários & Equipes</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Construtor de Automações & Réguas</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Gerente de Conta Dedicado</li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 bg-slate-900 border border-slate-800 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              Falar com Vendas
            </button>
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-400">Esclarecimentos</h2>
          <p className="text-3xl sm:text-4xl font-black tracking-tight text-white">Perguntas Frequentes</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl bg-slate-900/80 border border-slate-800/80 overflow-hidden transition"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-blue-400 transition cursor-pointer"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${activeFaq === index ? 'rotate-180 text-blue-400' : 'text-slate-500'}`} />
              </button>
              <AnimatePresence>
                {activeFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40 pt-4"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-10 md:p-16 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-slate-900 border border-blue-500/30 text-center space-y-8 shadow-2xl shadow-blue-600/20 relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Leve seu Processo Comercial ao Próximo Nível</h2>
            <p className="text-blue-100 text-sm sm:text-base">Acelere seus fechamentos de vendas com propostas de alto padrão e contratos integrados.</p>
          </div>
          <div className="relative z-10 pt-4">
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-slate-950 bg-white hover:bg-slate-100 transition shadow-xl flex items-center justify-center gap-3 mx-auto cursor-pointer"
            >
              <span>Criar Minha Primeira Proposta Agora</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 border-t border-slate-800/80 text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">PF</div>
            <span className="font-bold text-slate-300">PropostaFácil B2B Commercial Platform</span>
          </div>
          <p>© 2026 PropostaFácil. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
