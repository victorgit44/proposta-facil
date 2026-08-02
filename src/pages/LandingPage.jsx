import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, ShieldCheck, Zap, Check, ArrowRight,
  ChevronDown, BarChart3, Eye, Layers,
  X, BookOpen, ChevronRight, Workflow, Play, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import FrameScrollAnimation from '../components/FrameScrollAnimation';

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
      answer: "Você pode utilizar nossa Biblioteca de Modelos pré-formatados ou preencher o escopo automaticamente com auxílio da IA integrada em menos de 2 minutos."
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

  const features = [
    {
      icon: FileText,
      title: 'Propostas em 2 minutos',
      description: 'Monte propostas profissionais usando blocos reutilizáveis e modelos por nicho. Sem digitar do zero.'
    },
    {
      icon: Eye,
      title: 'Rastreamento de leitura',
      description: 'Saiba exatamente quando o cliente abriu, quanto tempo ficou em cada seção e quantas vezes revisitou.'
    },
    {
      icon: ShieldCheck,
      title: 'Aceite digital com validade jurídica',
      description: 'Registro automático de nome, IP, data/hora e hash SHA-256 em conformidade com a legislação brasileira.'
    },
    {
      icon: Workflow,
      title: 'Proposta vira contrato em 1 clique',
      description: 'Converta automaticamente a proposta aprovada em contrato de prestação de serviço sem retrabalho.'
    },
    {
      icon: BarChart3,
      title: 'Pipeline comercial completo',
      description: 'CRM Kanban integrado com funil de vendas, acompanhamento de negociações e previsão de receita.'
    },
    {
      icon: Layers,
      title: 'Biblioteca de conteúdo',
      description: 'Blocos de escopo, cláusulas, cases e termos jurídicos organizados para montar propostas sem escrever.'
    },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5] font-sans selection:bg-blue-600/30 selection:text-white overflow-x-hidden relative">

      {/* ── Fundo com Profundidade (Mesh Gradients & Precision Grid) ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Grid sutil estilo Raycast/Linear */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Glow Spheres sutis no topo e centro */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] left-1/4 w-[500px] h-[350px] bg-indigo-600/5 rounded-full blur-[160px]" />
        <div className="absolute top-[70%] right-1/4 w-[600px] h-[400px] bg-blue-900/10 rounded-full blur-[180px]" />
      </div>

      {/* ── Navbar Sticky Premium ── */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-[#1e1e2e]/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 p-0.5 shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <img src="/images/logo.webp" alt="PropostaFácil Logo" className="w-full h-full object-contain rounded-md" />
            </div>
            <span className="font-semibold text-base text-white tracking-tight group-hover:text-blue-400 transition-colors">
              PropostaFácil
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#8888a0]">
            <a href="#recursos" className="hover:text-white transition-colors duration-200">Recursos</a>
            <a href="#demonstracao" className="hover:text-white transition-colors duration-200">Demonstração</a>
            <a href="#comparativo" className="hover:text-white transition-colors duration-200">Comparativo</a>
            <a href="#modelos" className="hover:text-white transition-colors duration-200">Modelos</a>
            <a href="#precos" className="hover:text-white transition-colors duration-200">Preços</a>
            <a href="#faq" className="hover:text-white transition-colors duration-200">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-[13px] font-medium text-[#8888a0] hover:text-white transition-colors cursor-pointer"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate('/login')}
              className="relative group px-4 py-2 rounded-lg text-[13px] font-medium text-white bg-blue-600 hover:bg-blue-500 transition-all duration-200 cursor-pointer shadow-sm shadow-blue-600/30 hover:shadow-blue-600/50 active:scale-[0.98]"
            >
              <span>Começar grátis</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section (Estilo Nearo / Framer Premium) ── */}
      <section className="pt-24 pb-12 relative z-10">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="max-w-5xl mx-auto px-6 text-center space-y-8"
        >
          {/* Badge Nearo Style */}
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111118]/90 border border-[#1e1e2e] hover:border-blue-500/40 text-blue-400 text-xs font-semibold tracking-wide backdrop-blur-xl shadow-lg transition-all">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>PropostaFácil 2.0</span>
            <span className="w-1 h-1 rounded-full bg-[#3b82f6]" />
            <span className="text-[#8888a0] font-normal">Plataforma Comercial SaaS</span>
          </motion.div>

          {/* Título Principal Impactante Nearo */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05] max-w-4xl mx-auto"
          >
            Transforme propostas comerciais em contratos assinados
          </motion.h1>

          {/* Subtítulo Limpo & Legível */}
          <motion.p
            variants={fadeInUp}
            className="text-[#8888a0] text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Crie, envie e rastreie propostas profissionais com aceite digital e inteligência artificial. Tudo integrado em uma única experiência.
          </motion.p>

          {/* Botões de Ação Nearo */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 active:scale-[0.98]"
            >
              <span>Criar minha primeira proposta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#demonstracao"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-medium text-sm text-[#8888a0] hover:text-white bg-[#111118]/80 hover:bg-[#1a1a24] border border-[#1e1e2e] hover:border-[#2a2a3e] transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-xl active:scale-[0.98]"
            >
              <span>Explorar demonstração</span>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Divisor com Gradiente Neon ── */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1e1e2e] to-transparent my-4" />

      {/* ── Seção de Demonstração por Scroll (Nearo Showcase Frame) ── */}
      <section id="demonstracao" className="relative z-10">
        <FrameScrollAnimation />
      </section>

      {/* ── Divisor Suave ── */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1e1e2e] to-transparent" />

      {/* ── Problema vs Solução (Cards Glassmorphism Premium) ── */}
      <section className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6 space-y-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3 max-w-2xl mx-auto"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-[#555568]">O gargalo comercial</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Por que você está perdendo vendas no fechamento?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card Tradicional */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-xl bg-[#111118]/80 backdrop-blur-md border border-[#1e1e2e] space-y-6 hover:border-red-500/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                  <X className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">O modelo tradicional (Word / PDF)</h3>
                  <p className="text-xs text-[#555568]">Lento, burocrático e sem inteligência</p>
                </div>
              </div>
              <ul className="space-y-4 text-sm text-[#8888a0]">
                <li className="flex items-start gap-3">
                  <span className="text-red-400/80 font-bold shrink-0">—</span>
                  <span>Demora de 2 a 4 horas para montar cada proposta do zero</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400/80 font-bold shrink-0">—</span>
                  <span>Zero visibilidade: você não sabe se o cliente abriu ou ignorou</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400/80 font-bold shrink-0">—</span>
                  <span>Processo burocrático de impressão, assinatura e escaneamento</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400/80 font-bold shrink-0">—</span>
                  <span>Propostas paradas por semanas sem acompanhamento</span>
                </li>
              </ul>
            </motion.div>

            {/* Card PropostaFácil */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-xl bg-[#111118]/90 backdrop-blur-md border border-blue-600/30 space-y-6 shadow-xl shadow-blue-900/10 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-bl-full pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Com o PropostaFácil</h3>
                  <p className="text-xs text-blue-400">Rápido, rastreável e juridicamente seguro</p>
                </div>
              </div>
              <ul className="space-y-4 text-sm text-[#c0c0d0] relative z-10">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Propostas geradas em menos de 2 minutos via templates ou IA</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Rastreamento de visualizações com alerta de follow-up</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Aceite digital instantâneo com registro de IP e data/hora</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Conversão automática da proposta em contrato aprovado</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Divisor ── */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1e1e2e] to-transparent" />

      {/* ── Recursos (Grid com Ícones Padronizados & Glassmorphism) ── */}
      <section id="recursos" className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6 space-y-14">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#555568]">Recursos</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Tudo que sua equipe comercial precisa em um lugar
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="p-6 rounded-xl bg-[#111118]/80 backdrop-blur-md border border-[#1e1e2e] hover:border-[#2a2a3e] hover:-translate-y-1 transition-all duration-300 space-y-4 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#1a1a24] border border-[#1e1e2e] group-hover:border-blue-500/30 group-hover:bg-blue-600/10 flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5 text-[#8888a0] group-hover:text-blue-400 transition-colors" />
                  </div>
                  <h3 className="text-base font-semibold text-white tracking-tight">{feat.title}</h3>
                  <p className="text-sm text-[#8888a0] leading-relaxed">{feat.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Divisor ── */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1e1e2e] to-transparent" />

      {/* ── Comparativo (Tabela Executive Dark) ── */}
      <section id="comparativo" className="py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#555568]">Comparativo</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              PropostaFácil vs PDF tradicional
            </h2>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#1e1e2e] bg-[#111118]/90 backdrop-blur-md shadow-2xl">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#1e1e2e] text-xs text-[#555568] uppercase tracking-wider bg-[#0d0d14]">
                  <th className="py-4 px-6 font-semibold">Funcionalidade</th>
                  <th className="py-4 px-6 font-semibold">PDF / Word Tradicional</th>
                  <th className="py-4 px-6 font-semibold text-blue-400 bg-blue-950/20">PropostaFácil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e2e] text-[#8888a0]">
                <tr className="hover:bg-[#1a1a24]/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-white">Tempo de elaboração</td>
                  <td className="py-4 px-6">2 a 4 horas por proposta</td>
                  <td className="py-4 px-6 text-emerald-400 font-semibold bg-blue-950/10">Menos de 2 minutos</td>
                </tr>
                <tr className="hover:bg-[#1a1a24]/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-white">Rastreamento de leitura</td>
                  <td className="py-4 px-6 text-[#555568]">Impossível saber se leu</td>
                  <td className="py-4 px-6 text-emerald-400 font-semibold bg-blue-950/10">Notificação em tempo real</td>
                </tr>
                <tr className="hover:bg-[#1a1a24]/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-white">Aceite digital com IP</td>
                  <td className="py-4 px-6 text-[#555568]">Imprimir e assinar à mão</td>
                  <td className="py-4 px-6 text-emerald-400 font-semibold bg-blue-950/10">Aceite em 1 clique (IP + Hash)</td>
                </tr>
                <tr className="hover:bg-[#1a1a24]/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-white">Conversão em contrato</td>
                  <td className="py-4 px-6 text-[#555568]">Redigir outro documento</td>
                  <td className="py-4 px-6 text-emerald-400 font-semibold bg-blue-950/10">Conversão automática em 1 clique</td>
                </tr>
                <tr className="hover:bg-[#1a1a24]/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-white">Modelos por nicho</td>
                  <td className="py-4 px-6 text-[#555568]">Arquivos salvos no PC</td>
                  <td className="py-4 px-6 text-emerald-400 font-semibold bg-blue-950/10">Biblioteca cloud integrada</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Galeria de Modelos (Proposal Templates) ── */}
      <section id="modelos" className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#555568]">Modelos Prontos</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Business Proposal Templates
            </h2>
            <p className="text-sm md:text-base text-[#8888a0] max-w-xl mx-auto leading-relaxed">
              Explore nossa vasta galeria de templates de propostas comerciais profissionalmente redigidos e desenhados para fechar contratos com agilidade.
            </p>
          </div>

          {/* Grid de Templates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 'b2b-agency',
                title: 'Business Proposal',
                subtitle: 'Agências & Consultorias',
                bg: 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950',
                badge: 'Popular',
                accent: 'border-[#1e1e2e] hover:border-blue-500/40',
              },
              {
                id: 'catering',
                title: 'Catering Proposal',
                subtitle: 'Gastronomia & Eventos',
                bg: 'bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950',
                badge: 'Eventos',
                accent: 'border-[#1e1e2e] hover:border-amber-500/40',
              },
              {
                id: 'commercial-leasing',
                title: 'Commercial Leasing',
                subtitle: 'Imobiliário & Espaços',
                bg: 'bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950',
                badge: 'Real Estate',
                accent: 'border-[#1e1e2e] hover:border-emerald-500/40',
              },
              {
                id: 'construction-bid',
                title: 'Construction Bid',
                subtitle: 'Engenharia & Obras',
                bg: 'bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950',
                badge: 'Engenharia',
                accent: 'border-[#1e1e2e] hover:border-cyan-500/40',
              },
              {
                id: 'cybersecurity',
                title: 'Cyber Security Proposal',
                subtitle: 'TI & Cibersegurança',
                bg: 'bg-gradient-to-br from-slate-900 via-slate-900 to-violet-950',
                badge: 'TI & SaaS',
                accent: 'border-[#1e1e2e] hover:border-violet-500/40',
              },
              {
                id: 'influencer',
                title: 'Influencer & Media Kit',
                subtitle: 'Marketing & Influencers',
                bg: 'bg-gradient-to-br from-slate-900 via-slate-900 to-pink-950',
                badge: 'Marketing',
                accent: 'border-[#1e1e2e] hover:border-pink-500/40',
              },
              {
                id: 'cleaning-service',
                title: 'Facility & Clean Service',
                subtitle: 'Serviços Terceirizados',
                bg: 'bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950',
                badge: 'Serviços',
                accent: 'border-[#1e1e2e] hover:border-teal-500/40',
              },
              {
                id: 'custom-workshop',
                title: 'Customized Workshops',
                subtitle: 'Educação & Treinamentos',
                bg: 'bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950',
                badge: 'Treinamento',
                accent: 'border-[#1e1e2e] hover:border-blue-500/40',
              }
            ].map((tmpl, idx) => (
              <motion.div 
                key={tmpl.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => navigate('/login')}
                className={`group relative rounded-xl ${tmpl.bg} border ${tmpl.accent} p-5 h-64 flex flex-col justify-between shadow-lg cursor-pointer hover:-translate-y-1.5 transition-all duration-300 overflow-hidden backdrop-blur-md`}
              >
                <div className="space-y-2 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white backdrop-blur-md">
                      {tmpl.badge}
                    </span>
                    <FileText className="w-4 h-4 text-[#8888a0] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight leading-snug group-hover:text-blue-400 transition-colors">
                    {tmpl.title}
                  </h3>
                  <p className="text-xs text-[#8888a0] font-medium">{tmpl.subtitle}</p>
                </div>

                {/* Thumbnail Simulado */}
                <div className="my-auto bg-[#0a0a0f]/60 rounded-lg p-3 border border-white/10 space-y-1.5 backdrop-blur-sm">
                  <div className="w-3/4 h-2 bg-white/20 rounded-full" />
                  <div className="w-1/2 h-1.5 bg-white/15 rounded-full" />
                  <div className="w-full h-1 bg-white/10 rounded-full" />
                </div>

                <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-xs text-[#8888a0] group-hover:text-white transition-colors">Usar modelo</span>
                  <div className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-blue-600 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 transition-all duration-200 shadow-md shadow-blue-600/25 flex items-center gap-2 mx-auto cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Ver Todos os Templates</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Divisor ── */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1e1e2e] to-transparent" />

      {/* ── Preços ── */}
      <section id="precos" className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6 space-y-14">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#555568]">Preços</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Planos transparentes para o seu momento
            </h2>

            {/* Toggle Mensal/Anual */}
            <div className="pt-4 flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-[#555568]'}`}>Mensal</span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'annual' ? 'monthly' : 'annual')}
                className="w-12 h-6 rounded-full bg-[#1e1e2e] p-1 relative cursor-pointer transition-colors"
              >
                <div className={`w-4 h-4 rounded-full bg-blue-500 transition-transform duration-200 ${billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-white' : 'text-[#555568]'}`}>Anual</span>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">-20% desconto</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="p-8 rounded-xl bg-[#111118]/80 backdrop-blur-md border border-[#1e1e2e] flex flex-col justify-between space-y-8 hover:border-[#2a2a3e] transition-all duration-300"
            >
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-white">Starter</h3>
                <p className="text-xs text-[#8888a0]">Para profissionais autônomos e pequenos consultores.</p>
                <div>
                  <span className="text-4xl font-bold text-white tracking-tight">
                    R$ {billingCycle === 'annual' ? '79' : '99'}
                  </span>
                  <span className="text-sm text-[#555568] ml-1">/mês</span>
                </div>
                <ul className="space-y-3 text-sm text-[#8888a0] pt-2">
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Até 15 propostas/mês</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Aceite digital via link</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Exportação em PDF</li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-lg text-sm font-medium text-[#8888a0] bg-[#1a1a24] border border-[#1e1e2e] hover:text-white hover:border-[#2a2a3e] transition cursor-pointer"
              >
                Começar agora
              </button>
            </motion.div>

            {/* Professional */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="p-8 rounded-xl bg-[#111118]/90 backdrop-blur-md border-2 border-blue-600/60 flex flex-col justify-between space-y-8 relative shadow-xl shadow-blue-600/10 hover:border-blue-500 transition-all duration-300"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-md shadow-blue-600/40">
                Recomendado
              </div>
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-white">Professional</h3>
                <p className="text-xs text-[#8888a0]">Para empresas e agências em crescimento comercial.</p>
                <div>
                  <span className="text-4xl font-bold text-white tracking-tight">
                    R$ {billingCycle === 'annual' ? '159' : '199'}
                  </span>
                  <span className="text-sm text-[#555568] ml-1">/mês</span>
                </div>
                <ul className="space-y-3 text-sm text-[#8888a0] pt-2">
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-blue-400 shrink-0" /> Propostas e contratos ilimitados</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-blue-400 shrink-0" /> CRM Kanban e funil de vendas</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-blue-400 shrink-0" /> Assistente de vendas com IA</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-blue-400 shrink-0" /> Biblioteca de blocos ilimitada</li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition cursor-pointer shadow-md shadow-blue-600/25 active:scale-[0.98]"
              >
                Assinar Professional
              </button>
            </motion.div>

            {/* Scale */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="p-8 rounded-xl bg-[#111118]/80 backdrop-blur-md border border-[#1e1e2e] flex flex-col justify-between space-y-8 hover:border-[#2a2a3e] transition-all duration-300"
            >
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-white">Scale</h3>
                <p className="text-xs text-[#8888a0]">Para equipes de vendas de alta demanda e múltiplos vendedores.</p>
                <div>
                  <span className="text-4xl font-bold text-white tracking-tight">
                    R$ {billingCycle === 'annual' ? '319' : '399'}
                  </span>
                  <span className="text-sm text-[#555568] ml-1">/mês</span>
                </div>
                <ul className="space-y-3 text-sm text-[#8888a0] pt-2">
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Múltiplos usuários e equipes</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Automações e réguas comerciais</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Gerente de conta dedicado</li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-lg text-sm font-medium text-[#8888a0] bg-[#1a1a24] border border-[#1e1e2e] hover:text-white hover:border-[#2a2a3e] transition cursor-pointer"
              >
                Falar com vendas
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ Accordion ── */}
      <section id="faq" className="py-24 relative z-10">
        <div className="max-w-3xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#555568]">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Perguntas frequentes
            </h2>
          </div>

          <div className="divide-y divide-[#1e1e2e] border-t border-b border-[#1e1e2e]">
            {faqs.map((faq, index) => (
              <div key={index} className="py-2">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full py-4 text-left flex items-center justify-between gap-4 text-sm font-medium text-[#c0c0d0] hover:text-white transition cursor-pointer"
                >
                  <span className="font-semibold text-white text-base">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-[#8888a0] transition-transform duration-300 shrink-0 ${activeFaq === index ? 'rotate-180 text-blue-400' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="pb-4 text-sm text-[#8888a0] leading-relaxed overflow-hidden"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="p-12 rounded-2xl bg-[#111118]/90 backdrop-blur-xl border border-[#1e1e2e] space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-blue-600/15 rounded-full blur-[90px] pointer-events-none" />
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white relative z-10">
              Leve seu processo comercial ao próximo nível
            </h2>
            <p className="text-[#8888a0] text-base max-w-xl mx-auto relative z-10">
              Propostas profissionais, rastreamento inteligente e contratos integrados em uma só plataforma.
            </p>
            <div className="pt-2 relative z-10">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 rounded-lg font-medium text-sm text-white bg-blue-600 hover:bg-blue-500 transition-all duration-200 cursor-pointer inline-flex items-center gap-2.5 shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 active:scale-[0.98]"
              >
                <span>Criar minha primeira proposta</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 border-t border-[#1e1e2e] text-xs text-[#555568] relative z-10 bg-[#0a0a0f]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm text-white tracking-tight">PropostaFácil</span>
          </div>
          <p>© 2026 PropostaFácil. Todos os direitos reservados.</p>
        </div>
      </footer>

    </div>
  );
}

