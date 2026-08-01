import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Sparkles, ShieldCheck, TrendingUp, Zap, Check, ArrowRight, 
  ChevronDown, Clock, BarChart3, Lock, Users, Star, CheckCircle2, 
  HelpCircle, Eye, RefreshCw, Send, Layers, Building2, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('annual'); // 'annual' | 'monthly'
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Como a Inteligência Artificial auxilia na criação de propostas?",
      answer: "Nossa IA analisa o perfil do seu cliente, o escopo do serviço e gera automaticamente textos persuasivos, justificativas comerciais e estimativas de prazos otimizadas para aumentar a taxa de aprovação."
    },
    {
      question: "Os contratos gerados possuem validade jurídica legal no Brasil?",
      answer: "Sim. Nossos contratos seguem estritamente a MP 2.200-2/2001 e o Código Civil Brasileiro, com registro de IP, data/hora, hashes criptográficos de integridade e suporte a assinaturas digitais."
    },
    {
      question: "Posso personalizar a proposta com a logomarca da minha empresa?",
      answer: "Com certeza! Você pode carregar sua marca, personalizar cores, cabeçalhos, rodapés e modelos padrão de termos comerciais."
    },
    {
      question: "Preciso cadastrar cartão de crédito para testar?",
      answer: "Não. Você pode criar sua conta gratuitamente no plano Grátis e testar todas as funcionalidades essenciais sem compromisso."
    },
    {
      question: "Como funciona o cancelamento do plano Pro ou Enterprise?",
      answer: "O cancelamento pode ser feito a qualquer momento com apenas 1 clique no painel da sua conta, sem multas ou fidelidade contratual."
    }
  ];

  const testimonials = [
    {
      name: "Carlos Eduardo Mendes",
      role: "Diretor Comercial",
      company: "Mendes Consultoria & TI",
      avatar: "CE",
      rating: 5,
      comment: "Reduzimos o tempo de criação de propostas de 3 horas para 10 minutos. Nossa taxa de conversão aumentou 42% no primeiro mês de uso."
    },
    {
      name: "Mariana Oliveira",
      role: "Fundadora & CEO",
      company: "Studio Design B2B",
      avatar: "MO",
      rating: 5,
      comment: "A assinatura digital integrada facilitou todo o fechamento com clientes de outros estados. Transmite um profissionalismo absurdo."
    },
    {
      name: "Roberto Fontes",
      role: "Gestor de Vendas",
      company: "TechNexus Soluções",
      avatar: "RF",
      rating: 5,
      comment: "O painel de acompanhamento e o rastreamento de leitura nos dão o tempo exato para fazer o follow-up quando o cliente abre a proposta."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* ------------------------------------------------------------- */}
      {/* GLOW DE FUNDO ANIMADO                                         */}
      {/* ------------------------------------------------------------- */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-600/20 via-indigo-600/15 to-transparent rounded-full blur-[180px] pointer-events-none z-0"
      />

      {/* ------------------------------------------------------------- */}
      {/* NAVBAR FIXA ULTRA-MODERNA                                     */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md shadow-blue-600/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">PropostaFácil</span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
                B2B SaaS
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <a href="#recursos" className="hover:text-blue-400 transition-colors">Recursos</a>
            <a href="#como-funciona" className="hover:text-blue-400 transition-colors">Como Funciona</a>
            <a href="#depoimentos" className="hover:text-blue-400 transition-colors">Depoimentos</a>
            <a href="#precos" className="hover:text-blue-400 transition-colors">Preços</a>
            <a href="#faq" className="hover:text-blue-400 transition-colors">FAQ</a>
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
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/25 flex items-center gap-2 cursor-pointer"
            >
              <span>Começar Grátis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION                                                  */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider shadow-inner"
          >
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            <span>Plataforma Inteligente de Vendas B2B</span>
          </motion.div>

          {/* Headline Principal */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1]"
          >
            Crie Propostas Comerciais Irrecusáveis e Feche Negócios em <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">Minutos</span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Combine inteligência artificial, contratos com validade jurídica e acompanhamento em tempo real para acelerar seu ciclo de vendas e multiplicar suas conversões.
          </motion.p>

          {/* Call to Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition duration-200 shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 cursor-pointer group"
            >
              <span>Criar Minha Primeira Proposta</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#como-funciona"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex items-center justify-center gap-2"
            >
              <span>Ver Demonstração</span>
            </a>
          </motion.div>

          {/* Social Proof Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-400"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Sem necessidade de cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Configuração em menos de 2 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Conformidade com a legislação brasileira</span>
            </div>
          </motion.div>

          {/* Product Showcase Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="pt-8 relative max-w-6xl mx-auto"
          >
            <div className="relative rounded-3xl p-2 bg-gradient-to-b from-blue-500/20 via-slate-800/40 to-slate-900/60 border border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden">
              <img
                src="/images/landing_hero_mockup.png"
                alt="Painel do PropostaFácil em Alta Resolução"
                className="w-full h-auto rounded-2xl object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-30 pointer-events-none" />
            </div>
          </motion.div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* NUMBERS & METRICS DISPLAY                                     */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 bg-slate-900/50 border-y border-slate-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">+10.000</h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Propostas Geradas</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black text-blue-400 tracking-tight">3x Mais</h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Velocidade de Envio</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black text-indigo-400 tracking-tight">98.4%</h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Satisfação dos Clientes</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">100%</h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Validade Jurídica</p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* RECURSOS PRINCIPAIS (BENTO GRID FEATURE SHOWCASE)            */}
      {/* ------------------------------------------------------------- */}
      <section id="recursos" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-400">Recursos de Alta Performance</h2>
          <p className="text-3xl sm:text-5xl font-black tracking-tight text-white">Tudo o que Você Precisa para Fechar Mais Vendas</p>
          <p className="text-slate-400 text-base">Uma suíte completa projetada para transformar o processo comercial da sua empresa em uma máquina previsível.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: IA Assistente */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Gerador de Propostas com IA</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Nossa IA redige os textos da proposta comercial, escopo dos serviços e termos contratuais sob medida para o seu nicho.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-800/80">
              <img src="/images/landing_feature_ai.png" alt="Recurso IA" className="w-full h-48 object-cover group-hover:scale-105 transition duration-500" />
            </div>
          </div>

          {/* Card 2: Contratos & Validade Jurídica */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Contratos & Validade Jurídica</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Gere contratos automáticos vinculados às propostas aprovadas com suporte a cláusulas customizadas e assinatura digital.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-800/80">
              <img src="/images/landing_feature_contract.png" alt="Recurso Contrato" className="w-full h-48 object-cover group-hover:scale-105 transition duration-500" />
            </div>
          </div>

          {/* Card 3: Analytics & Gestão */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Dashboard & Métricas Comerciais</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Acompanhe o funil de propostas enviadas, receita prevista, taxa de aceite e receita recorrente em tempo real.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Propostas Aprovadas</span>
                <span className="text-emerald-400">84%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[84%]" />
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-300 pt-2">
                <span>Receita Este Mês</span>
                <span className="text-blue-400">R$ 48.500,00</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* PASSO A PASSO (COMO FUNCIONA)                                 */}
      {/* ------------------------------------------------------------- */}
      <section id="como-funciona" className="py-24 bg-slate-900/40 border-y border-slate-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">Fluxo Simplificado</h2>
            <p className="text-3xl sm:text-5xl font-black tracking-tight text-white">De Rascunho a Contrato Assinado em 3 Passos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 relative">
              <span className="text-4xl font-black text-blue-500/20">01</span>
              <h3 className="text-lg font-bold text-white">Insira os Dados ou Use a IA</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Preencha os dados do cliente e selecione os itens da proposta ou peça para a Inteligência Artificial gerar o escopo ideal.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 relative">
              <span className="text-4xl font-black text-indigo-500/20">02</span>
              <h3 className="text-lg font-bold text-white">Envie a Proposta & PDF</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gere um link interativo compartilhável ou faça o download de um PDF executivo pronto para impressão e envio por e-mail.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 relative">
              <span className="text-4xl font-black text-emerald-500/20">03</span>
              <h3 className="text-lg font-bold text-white">Acompanhe e Assine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receba confirmação quando o cliente aprovar e converta a proposta em um contrato comercial assinado digitalmente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* PROVA SOCIAL / DEPOIMENTOS                                   */}
      {/* ------------------------------------------------------------- */}
      <section id="depoimentos" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-400">Depoimentos de Quem Usa</h2>
          <p className="text-3xl sm:text-5xl font-black tracking-tight text-white">Aprovado por Líderes Comerciais</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 italic leading-relaxed">"{item.comment}"</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                  {item.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <p className="text-xs text-slate-400">{item.role} - {item.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SEÇÃO DE PREÇOS ALTA CONVERSÃO (PRICING)                       */}
      {/* ------------------------------------------------------------- */}
      <section id="precos" className="py-24 bg-slate-900/50 border-y border-slate-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-400">Investimento Transparente</h2>
            <p className="text-3xl sm:text-5xl font-black tracking-tight text-white">Planos que Cabem no Seu Negócio</p>
            
            {/* Cycle Toggle */}
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
            
            {/* Plano Grátis */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Grátis</h3>
                <p className="text-xs text-slate-400">Para profissionais e autônomos iniciando suas vendas.</p>
                <div className="pt-2">
                  <span className="text-4xl font-black text-white">R$ 0</span>
                  <span className="text-xs text-slate-400"> /mês</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300 pt-4">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Atabela de até 3 propostas/mês</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Exportação em PDF Padrão</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Suporte via comunidade</li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 bg-slate-900 border border-slate-800 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                Começar Grátis
              </button>
            </div>

            {/* Plano Profissional (Destaque) */}
            <div className="p-8 rounded-3xl bg-slate-900/90 border-2 border-blue-500 space-y-6 flex flex-col justify-between relative shadow-2xl shadow-blue-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
                Mais Popular
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Profissional</h3>
                <p className="text-xs text-slate-400">Para empresas e consultores em crescimento acelerado.</p>
                <div className="pt-2">
                  <span className="text-4xl font-black text-white">
                    R$ {billingCycle === 'annual' ? '79' : '99'}
                  </span>
                  <span className="text-xs text-slate-400"> /mês</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300 pt-4">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" /> Propostas ilimitadas</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" /> Geração de Propostas por IA</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" /> Módulo de Contratos & Assinaturas</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" /> Marca Personalizada (Logo & Cores)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400" /> Suporte Prioritário</li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                Assinar Plano Profissional
              </button>
            </div>

            {/* Plano Enterprise */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Enterprise</h3>
                <p className="text-xs text-slate-400">Para equipes de vendas comerciais de grande escala.</p>
                <div className="pt-2">
                  <span className="text-4xl font-black text-white">
                    R$ {billingCycle === 'annual' ? '199' : '249'}
                  </span>
                  <span className="text-xs text-slate-400"> /mês</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300 pt-4">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Múltiplos Usuários & Equipes</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Integrações com CRM via Webhook</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Gerente de Conta Dedicado</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> SLA de Atendimento Garantido</li>
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
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* PERGUNTAS FREQUENTES (FAQ ACCORDION)                          */}
      {/* ------------------------------------------------------------- */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-400">Dúvidas Comuns</h2>
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

      {/* ------------------------------------------------------------- */}
      {/* CALL TO ACTION FINAL                                           */}
      {/* ------------------------------------------------------------- */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-10 md:p-16 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-slate-900 border border-blue-500/30 text-center space-y-8 shadow-2xl shadow-blue-600/20 relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Pronto para Aumentar Suas Vendas?</h2>
            <p className="text-blue-100 text-sm sm:text-base">Junte-se a centenas de empresas que fecham negócios mais rápido com o PropostaFácil.</p>
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

      {/* ------------------------------------------------------------- */}
      {/* FOOTER CORPORATIVO                                             */}
      {/* ------------------------------------------------------------- */}
      <footer className="py-12 bg-slate-950 border-t border-slate-800/80 text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">PF</div>
            <span className="font-bold text-slate-300">PropostaFácil B2B SaaS</span>
          </div>
          <p>© 2026 PropostaFácil. Todos os direitos reservados. Feito para alta conversão comercial.</p>
          <div className="flex gap-6 font-semibold">
            <a href="#recursos" className="hover:text-slate-300 transition">Termos</a>
            <a href="#recursos" className="hover:text-slate-300 transition">Privacidade</a>
            <a href="#faq" className="hover:text-slate-300 transition">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
