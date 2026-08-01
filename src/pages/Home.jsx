import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/supabaseClient';
import {
  TrendingUp, FileText, FileSignature, DollarSign, Clock, AlertCircle,
  Plus, CheckCircle2, Eye, ArrowUpRight, ArrowRight, Zap, Sparkles,
  Users, ChevronRight, MessageCircle, RefreshCw, BarChart3, ShieldCheck
} from 'lucide-react';
import { ProposalCard } from '@/components/ProposalCard';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

export default function Home() {
  const navigate = useNavigate();

  const { data: propostas = [], isLoading: isLoadingPropostas } = useQuery({
    queryKey: ['propostas'],
    queryFn: () => base44.entities.Proposta.list(),
  });

  const { data: contratos = [], isLoading: isLoadingContratos } = useQuery({
    queryKey: ['contratos'],
    queryFn: () => base44.entities.Contrato.list(),
  });

  // Cálculo de Métricas Executivas
  const totalPropostas = propostas.length;
  const aprovadas = propostas.filter(p => p.status === 'aprovada');
  const enviadas = propostas.filter(p => p.status === 'enviada');
  const rascunhos = propostas.filter(p => p.status === 'rascunho');
  const recusadas = propostas.filter(p => p.status === 'recusada');

  const receitaConfirmada = aprovadas.reduce((sum, p) => sum + (parseFloat(p.valor_total) || 0), 0);
  const receitaPrevista = propostas.reduce((sum, p) => sum + (parseFloat(p.valor_total) || 0), 0);
  const ticketMedio = totalPropostas > 0 ? receitaPrevista / totalPropostas : 0;
  const taxaConversao = totalPropostas > 0 ? Math.round((aprovadas.length / totalPropostas) * 100) : 0;

  // Timeline de Atividades Comerciais Simulação/Dados Reais
  const activityTimeline = [
    {
      id: 1,
      title: 'Proposta #PROP-697262 visualizada pelo cliente',
      description: 'O cliente Victor abriu a proposta pública 2 vezes.',
      time: 'Há 15 minutos',
      type: 'view',
      icon: Eye,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      id: 2,
      title: 'Contrato de Prestação de Serviços assinado',
      description: 'Empresa Eventos GIC assinou o contrato #CONT-102.',
      time: 'Há 2 horas',
      type: 'sign',
      icon: ShieldCheck,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      id: 3,
      title: 'Nova proposta gerada com Inteligência Artificial',
      description: 'Proposta de Consultoria de Vendas B2B criada com sucesso.',
      time: 'Há 5 horas',
      type: 'create',
      icon: Sparkles,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
    }
  ];

  // Ações de Recomendação Inteligente da IA (Assistente Invisível)
  const smartInsights = [
    {
      title: 'Oportunidade Quente de Fechamento',
      text: 'A proposta #PROP-697262 foi visualizada recentemente. Recomendamos realizar um contato comercial hoje.',
      actionText: 'Enviar WhatsApp',
      action: () => toast.info('Abrindo modelo de mensagem comercial no WhatsApp...')
    },
    {
      title: 'Revisão de Prazos',
      text: `${enviadas.length} propostas enviadas estão aguardando confirmação do cliente há mais de 3 dias.`,
      actionText: 'Ver Enviadas',
      action: () => navigate('/propostas')
    }
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Superior */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Centro de Comando Comercial</h1>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
              High Performance
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Visão consolidada de receitas, funil de propostas e ações de vendas.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/propostas/criar')}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Proposta</span>
          </button>

          <button
            onClick={() => navigate('/contratos/criar')}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition flex items-center gap-2 cursor-pointer"
          >
            <FileSignature className="w-4 h-4 text-purple-400" />
            <span>Novo Contrato</span>
          </button>
        </div>
      </div>

      {/* Grid de KPIs Executivos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Receita Confirmada</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">{formatCurrency(receitaConfirmada)}</h3>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{aprovadas.length} propostas fechadas</span>
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pipeline de Receita</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">{formatCurrency(receitaPrevista)}</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Total orçado no sistema</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Taxa de Conversão</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">{taxaConversao}%</h3>
            <p className="text-[11px] text-indigo-400 font-semibold mt-1">Ticket Médio: {formatCurrency(ticketMedio)}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Contratos Ativos</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">{contratos.length}</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Contratos registrados</p>
          </div>
        </div>

      </div>

      {/* Funil Comercial Visual (7 Etapas) */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Funil de Vendas Comercial</h2>
            <p className="text-xs text-slate-400">Distribuição das propostas pelas etapas de negociação</p>
          </div>
          <span className="text-xs font-bold text-slate-400">{totalPropostas} Total</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-500">Rascunhos</span>
            <h4 className="text-lg font-black text-white">{rascunhos.length}</h4>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase text-blue-400">Enviadas</span>
            <h4 className="text-lg font-black text-white">{enviadas.length}</h4>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase text-indigo-400">Visualizadas</span>
            <h4 className="text-lg font-black text-white">1</h4>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase text-amber-400">Negociação</span>
            <h4 className="text-lg font-black text-white">0</h4>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase text-emerald-400">Aprovadas</span>
            <h4 className="text-lg font-black text-white">{aprovadas.length}</h4>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase text-purple-400">Contratos</span>
            <h4 className="text-lg font-black text-white">{contratos.length}</h4>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-center space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold uppercase text-rose-400">Recusadas</span>
            <h4 className="text-lg font-black text-white">{recusadas.length}</h4>
          </div>
        </div>
      </div>

      {/* Grid Duplo: Insights da IA + Timeline de Atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Coluna Esquerda: Insights Inteligentes de IA */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Insights Comerciais de IA</h2>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Assistente Invisível</span>
          </div>

          <div className="space-y-4">
            {smartInsights.map((insight, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">{insight.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{insight.text}</p>
                </div>
                <button
                  onClick={insight.action}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition shrink-0 self-start sm:self-center cursor-pointer"
                >
                  {insight.actionText}
                </button>
              </div>
            ))}
          </div>

          {/* Propostas Recentes */}
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Propostas Recentes</h2>
              <button onClick={() => navigate('/propostas')} className="text-xs font-bold text-blue-400 hover:text-blue-300 transition flex items-center gap-1">
                <span>Ver Todas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {propostas.slice(0, 3).map((p) => (
              <ProposalCard key={p.id} proposta={p} onExcluir={() => {}} />
            ))}
          </div>
        </div>

        {/* Coluna Direita: Timeline de Atividades em Tempo Real */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Timeline de Atividades</h2>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Tempo Real</span>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 space-y-6">
            {activityTimeline.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="flex gap-4 relative">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${act.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs font-bold text-white leading-tight">{act.title}</p>
                    <p className="text-[11px] text-slate-400 leading-normal">{act.description}</p>
                    <span className="text-[10px] font-bold text-slate-500 block pt-0.5">{act.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}