import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, ShieldCheck, TrendingUp, Zap, Check, ArrowRight,
  ChevronDown, Clock, BarChart3, Users, Eye, Send, Layers,
  X, BookOpen, ChevronRight, Workflow, Package
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

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5] font-sans selection:bg-blue-600/30 selection:text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-sm border-b border-[#1e1e2e]">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/images/logo.webp" alt="PropostaFácil Logo" className="w-8 h-8 object-contain rounded-md" />
            <span className="font-semibold text-[15px] text-white tracking-tight">PropostaFácil</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-[#8888a0]">
            <a href="#recursos" className="hover:text-white transition">Recursos</a>
            <a href="#comparativo" className="hover:text-white transition">Comparativo</a>
            <a href="#modelos" className="hover:text-white transition">Modelos</a>
            <a href="#precos" className="hover:text-white transition">Precos</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/login')}
              className="px-3 py-1.5 text-[13px] font-medium text-[#8888a0] hover:text-white transition"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-3.5 py-1.5 rounded-md text-[13px] font-medium text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer"
            >
              Começar grátis
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24 relative z-10">
        <div className="max-w-3xl mx-auto px-5 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/8 border border-blue-500/15 text-blue-400 text-xs font-medium">
            <Zap className="w-3 h-3" />
            <span>Plataforma comercial para equipes de vendas</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-tight text-white leading-[1.15]">
            Transforme propostas comerciais em contratos assinados
          </h1>

          <p className="text-[#8888a0] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Crie, envie e rastreie propostas profissionais. Acompanhe a leitura do cliente em tempo real e receba o aceite digital instantâneo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-md font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Criar minha primeira proposta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#comparativo"
              className="w-full sm:w-auto px-5 py-2.5 rounded-md font-medium text-sm text-[#8888a0] hover:text-white bg-transparent border border-[#1e1e2e] hover:border-[#2a2a3e] transition flex items-center justify-center gap-2"
            >
              Ver comparativo
            </a>
          </div>
        </div>

        {/* Screenshot */}
        <div className="pt-12 max-w-5xl mx-auto px-5">
          <div className="rounded-lg border border-[#1e1e2e] overflow-hidden bg-[#111118]">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[#1e1e2e]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2a2a3e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#2a2a3e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#2a2a3e]" />
            </div>
            <img
              src="/images/landing_hero_mockup.png"
              alt="Interface do PropostaFácil"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Problema vs Solução ── */}
      <section className="py-20 border-y border-[#1e1e2e] bg-[#0d0d14]">
        <div className="max-w-5xl mx-auto px-5 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <p className="text-xs font-medium uppercase tracking-widest text-[#555568]">O gargalo comercial</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Por que você está perdendo vendas no fechamento?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg bg-[#111118] border border-[#1e1e2e] space-y-5">
              <div className="flex items-center gap-2.5">
                <X className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-semibold text-white">O modelo tradicional (Word / PDF)</h3>
              </div>
              <ul className="space-y-3 text-sm text-[#8888a0]">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400/70 mt-0.5 shrink-0">—</span>
                  Demora de 2 a 4 horas para montar cada proposta do zero
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400/70 mt-0.5 shrink-0">—</span>
                  Zero visibilidade: você não sabe se o cliente abriu ou ignorou
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400/70 mt-0.5 shrink-0">—</span>
                  Processo burocrático de impressão, assinatura e escaneamento
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400/70 mt-0.5 shrink-0">—</span>
                  Propostas paradas por semanas sem acompanhamento
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-lg bg-[#111118] border border-[#1e1e2e] space-y-5">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Com o PropostaFácil</h3>
              </div>
              <ul className="space-y-3 text-sm text-[#c0c0d0]">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400/70 mt-0.5 shrink-0">—</span>
                  Propostas geradas em menos de 2 minutos via templates ou IA
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400/70 mt-0.5 shrink-0">—</span>
                  Rastreamento de visualizações com alerta de follow-up
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400/70 mt-0.5 shrink-0">—</span>
                  Aceite digital instantâneo com registro de IP e data/hora
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400/70 mt-0.5 shrink-0">—</span>
                  Conversão automática da proposta em contrato
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Recursos ── */}
      <section id="recursos" className="py-20">
        <div className="max-w-5xl mx-auto px-5 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <p className="text-xs font-medium uppercase tracking-widest text-[#555568]">Recursos</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Tudo que sua equipe comercial precisa em um lugar
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="p-5 rounded-lg bg-[#111118] border border-[#1e1e2e] hover:border-[#2a2a3e] transition space-y-3">
                  <Icon className="w-4 h-4 text-[#8888a0]" />
                  <h3 className="text-sm font-semibold text-white">{feat.title}</h3>
                  <p className="text-[13px] text-[#8888a0] leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Comparativo ── */}
      <section id="comparativo" className="py-20 border-y border-[#1e1e2e] bg-[#0d0d14]">
        <div className="max-w-4xl mx-auto px-5 space-y-10">
          <div className="text-center space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest text-[#555568]">Comparativo</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              PropostaFácil vs PDF tradicional
            </h2>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#1e1e2e]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#1e1e2e] text-xs text-[#555568] uppercase tracking-wider bg-[#111118]">
                  <th className="p-4 font-medium">Funcionalidade</th>
                  <th className="p-4 font-medium">PDF / Word</th>
                  <th className="p-4 font-medium text-blue-400">PropostaFácil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e2e] text-[#8888a0]">
                <tr className="bg-[#0a0a0f]">
                  <td className="p-4 font-medium text-[#c0c0d0]">Tempo de elaboração</td>
                  <td className="p-4">2 a 4 horas</td>
                  <td className="p-4 text-emerald-400 font-medium">Menos de 2 min</td>
                </tr>
                <tr className="bg-[#111118]">
                  <td className="p-4 font-medium text-[#c0c0d0]">Rastreamento de leitura</td>
                  <td className="p-4 text-[#555568]">Impossível</td>
                  <td className="p-4 text-emerald-400 font-medium">Tempo real</td>
                </tr>
                <tr className="bg-[#0a0a0f]">
                  <td className="p-4 font-medium text-[#c0c0d0]">Aceite digital com IP</td>
                  <td className="p-4 text-[#555568]">Não possui</td>
                  <td className="p-4 text-emerald-400 font-medium">Sim</td>
                </tr>
                <tr className="bg-[#111118]">
                  <td className="p-4 font-medium text-[#c0c0d0]">Conversão em contrato</td>
                  <td className="p-4 text-[#555568]">Manual</td>
                  <td className="p-4 text-emerald-400 font-medium">1 clique</td>
                </tr>
                <tr className="bg-[#0a0a0f]">
                  <td className="p-4 font-medium text-[#c0c0d0]">Modelos por nicho</td>
                  <td className="p-4 text-[#555568]">Desorganizados</td>
                  <td className="p-4 text-emerald-400 font-medium">Biblioteca integrada</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Business Proposal Templates (Galeria de Modelos de Propostas) ── */}
      <section id="modelos" className="py-24 bg-[#060e18] relative text-white overflow-hidden border-t border-[#132338]">
        {/* Fundo sutil com gradiente escuro */}
        <div className="absolute inset-0 bg-radial from-blue-900/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto px-5 relative z-10 space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Business Proposal Templates
            </h2>
            <p className="text-sm md:text-base text-[#94a3b8] max-w-xl mx-auto leading-relaxed">
              Explore nossa vasta galeria de templates de propostas comerciais profissionalmente redigidos e desenhados para fechar contratos com agilidade.
            </p>
            <div className="pt-1">
              <a href="#precos" className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition border-b border-cyan-400/40 pb-0.5">
                <span>Encontre o template perfeito para o seu segmento</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Grid de Capas de Templates estilo Canva/Gallery */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 pt-4">
            {[
              {
                id: 'b2b-agency',
                title: 'Business Proposal',
                subtitle: 'Agências & Consultorias',
                bg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950',
                badge: 'Popular',
                accent: 'border-blue-500/40',
                preview: 'Capa elegante com fotografia executiva, índice de escopo e cronograma de entregáveis.'
              },
              {
                id: 'catering',
                title: 'Catering Proposal',
                subtitle: 'Gastronomia & Eventos',
                bg: 'bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950',
                badge: 'Eventos',
                accent: 'border-amber-500/40',
                preview: 'Apresentação de menus, lista de insumos e orçamento discriminado por convidado.'
              },
              {
                id: 'commercial-leasing',
                title: 'Commercial Leasing',
                subtitle: 'Imobiliário & Espaços',
                bg: 'bg-gradient-to-br from-stone-900 via-stone-800 to-slate-950',
                badge: 'Real Estate',
                accent: 'border-emerald-500/40',
                preview: 'Proposta de locação comercial com mapas de espaço, garantias e tabela de aluguéis.'
              },
              {
                id: 'construction-bid',
                title: 'Construction Bid',
                subtitle: 'Engenharia & Obras',
                bg: 'bg-gradient-to-br from-cyan-950 via-slate-900 to-blue-950',
                badge: 'Engenharia',
                accent: 'border-cyan-500/40',
                preview: 'Orçamento de obra civil, cronograma físico-financeiro e memorial descritivo.'
              },
              {
                id: 'cybersecurity',
                title: 'Cyber Security Proposal',
                subtitle: 'TI & Cibersegurança',
                bg: 'bg-gradient-to-br from-blue-950 via-slate-900 to-violet-950',
                badge: 'TI & SaaS',
                accent: 'border-violet-500/40',
                preview: 'Relatório de auditoria de segurança, plano de mitigação e planos recorrentes.'
              },
              {
                id: 'influencer',
                title: 'Influencer & Media Kit',
                subtitle: 'Marketing & Influencers',
                bg: 'bg-gradient-to-br from-purple-950 via-slate-900 to-pink-950',
                badge: 'Marketing',
                accent: 'border-pink-500/40',
                preview: 'Métricas de alcance, formatos de publipost e pacotes de patrocínio comercial.'
              },
              {
                id: 'cleaning-service',
                title: 'Facility & Clean Service',
                subtitle: 'Serviços Terceirizados',
                bg: 'bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950',
                badge: 'Serviços',
                accent: 'border-teal-500/40',
                preview: 'Planilha de escala de equipes, SLA de atendimento e fornecimento de materiais.'
              },
              {
                id: 'custom-workshop',
                title: 'Customized Workshops',
                subtitle: 'Educação & Treinamentos',
                bg: 'bg-gradient-to-br from-slate-900 via-zinc-900 to-blue-950',
                badge: 'Treinamento',
                accent: 'border-blue-400/40',
                preview: 'Proposta pedagógica, programa de horas e investimento corporativo por turma.'
              }
            ].map((tmpl) => (
              <div 
                key={tmpl.id}
                onClick={() => navigate('/login')}
                className={`group relative rounded-xl ${tmpl.bg} border ${tmpl.accent} p-4 h-64 flex flex-col justify-between shadow-xl cursor-pointer hover:-translate-y-1.5 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10`}
              >
                {/* Elemento gráfico de folha de papel no card */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
                
                <div className="space-y-2 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white backdrop-blur-md">
                      {tmpl.badge}
                    </span>
                    <FileText className="w-4 h-4 text-white/50 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight leading-snug group-hover:text-cyan-300 transition-colors">
                    {tmpl.title}
                  </h3>
                  <p className="text-[11px] text-[#94a3b8] font-medium">{tmpl.subtitle}</p>
                </div>

                {/* Thumbnail Simulado de Documento */}
                <div className="my-auto bg-black/40 rounded-lg p-2.5 border border-white/10 space-y-1.5 backdrop-blur-sm">
                  <div className="w-3/4 h-2 bg-white/30 rounded-full" />
                  <div className="w-1/2 h-1.5 bg-white/20 rounded-full" />
                  <div className="w-full h-1 bg-white/10 rounded-full" />
                  <div className="w-5/6 h-1 bg-white/10 rounded-full" />
                </div>

                <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-[11px] text-white/70 group-hover:text-white transition">Usar modelo</span>
                  <div className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-blue-600 flex items-center justify-center transition">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-6">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/25 flex items-center gap-2 mx-auto cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              Ver Todos os Templates no Canvas
            </button>
          </div>
        </div>

        {/* Divisor em Curva Orgânica idêntico à imagem de referência */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
          <svg className="relative block w-full h-16 md:h-24 text-[#0d0d14]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C300,90 800,120 1200,40 L1200,120 L0,120 Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>


      {/* ── Preços ── */}
      <section id="precos" className="py-20 border-y border-[#1e1e2e] bg-[#0d0d14]">
        <div className="max-w-5xl mx-auto px-5 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <p className="text-xs font-medium uppercase tracking-widest text-[#555568]">Precos</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Planos para cada momento da sua empresa
            </h2>

            <div className="pt-3 flex items-center justify-center gap-3">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-[#555568]'}`}>Mensal</span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'annual' ? 'monthly' : 'annual')}
                className="w-10 h-5 rounded-full bg-[#1e1e2e] p-0.5 relative cursor-pointer transition"
              >
                <div className={`w-4 h-4 rounded-full bg-blue-500 transition-transform ${billingCycle === 'annual' ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <div className="flex items-center gap-1.5">
                <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-white' : 'text-[#555568]'}`}>Anual</span>
                <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">-20%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Starter */}
            <div className="p-6 rounded-lg bg-[#111118] border border-[#1e1e2e] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white">Starter</h3>
                <p className="text-[13px] text-[#555568]">Para profissionais autônomos e pequenos consultores.</p>
                <div>
                  <span className="text-3xl font-semibold text-white">
                    R$ {billingCycle === 'annual' ? '79' : '99'}
                  </span>
                  <span className="text-sm text-[#555568] ml-1">/mês</span>
                </div>
                <ul className="space-y-2.5 text-sm text-[#8888a0] pt-2">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Até 15 propostas/mês</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Aceite digital via link</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Exportação em PDF</li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2 rounded-md text-sm font-medium text-[#8888a0] bg-[#1a1a24] border border-[#1e1e2e] hover:text-white hover:border-[#2a2a3e] transition cursor-pointer"
              >
                Começar agora
              </button>
            </div>

            {/* Professional */}
            <div className="p-6 rounded-lg bg-[#111118] border-2 border-blue-600/50 flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded text-[10px] font-medium bg-blue-600 text-white">
                Recomendado
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white">Professional</h3>
                <p className="text-[13px] text-[#555568]">Para empresas e agências em crescimento comercial.</p>
                <div>
                  <span className="text-3xl font-semibold text-white">
                    R$ {billingCycle === 'annual' ? '159' : '199'}
                  </span>
                  <span className="text-sm text-[#555568] ml-1">/mês</span>
                </div>
                <ul className="space-y-2.5 text-sm text-[#8888a0] pt-2">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Propostas e contratos ilimitados</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400 shrink-0" /> CRM Kanban e funil de vendas</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Assistente de vendas com IA</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Biblioteca de blocos</li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer"
              >
                Assinar Professional
              </button>
            </div>

            {/* Scale */}
            <div className="p-6 rounded-lg bg-[#111118] border border-[#1e1e2e] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white">Scale</h3>
                <p className="text-[13px] text-[#555568]">Para equipes de vendas de alta demanda.</p>
                <div>
                  <span className="text-3xl font-semibold text-white">
                    R$ {billingCycle === 'annual' ? '319' : '399'}
                  </span>
                  <span className="text-sm text-[#555568] ml-1">/mês</span>
                </div>
                <ul className="space-y-2.5 text-sm text-[#8888a0] pt-2">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Múltiplos usuários e equipes</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Automações e réguas</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Gerente de conta dedicado</li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2 rounded-md text-sm font-medium text-[#8888a0] bg-[#1a1a24] border border-[#1e1e2e] hover:text-white hover:border-[#2a2a3e] transition cursor-pointer"
              >
                Falar com vendas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20">
        <div className="max-w-3xl mx-auto px-5 space-y-10">
          <div className="text-center space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest text-[#555568]">FAQ</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Perguntas frequentes
            </h2>
          </div>

          <div className="divide-y divide-[#1e1e2e]">
            {faqs.map((faq, index) => (
              <div key={index}>
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full py-5 text-left flex items-center justify-between gap-4 text-sm font-medium text-[#c0c0d0] hover:text-white transition cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-[#555568] transition-transform duration-200 shrink-0 ${activeFaq === index ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pb-5 text-sm text-[#8888a0] leading-relaxed overflow-hidden"
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
      <section className="py-20 border-t border-[#1e1e2e]">
        <div className="max-w-2xl mx-auto px-5 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Leve seu processo comercial ao próximo nível
          </h2>
          <p className="text-[#8888a0] text-sm sm:text-base">
            Propostas profissionais, rastreamento inteligente e contratos integrados em uma só plataforma.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 rounded-md font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer inline-flex items-center gap-2"
          >
            <span>Criar minha primeira proposta</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 border-t border-[#1e1e2e] text-[13px] text-[#555568]">
        <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
              <FileText className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="font-medium text-[#8888a0]">PropostaFácil</span>
          </div>
          <p>© 2026 PropostaFácil. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
