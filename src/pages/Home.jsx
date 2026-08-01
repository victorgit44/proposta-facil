import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/supabaseClient';
import {
  TrendingUp, FileText, FileSignature, DollarSign, Clock, AlertCircle,
  Plus, Eye, ArrowRight, Zap, Sparkles, ChevronRight, BarChart3, ShieldCheck
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

  // Métricas
  const totalPropostas = propostas.length;
  const aprovadas = propostas.filter(p => p.status === 'aprovada');
  const enviadas = propostas.filter(p => p.status === 'enviada');
  const rascunhos = propostas.filter(p => p.status === 'rascunho');
  const recusadas = propostas.filter(p => p.status === 'recusada');

  const receitaConfirmada = aprovadas.reduce((sum, p) => sum + (parseFloat(p.valor_total) || 0), 0);
  const receitaPrevista = propostas.reduce((sum, p) => sum + (parseFloat(p.valor_total) || 0), 0);
  const ticketMedio = totalPropostas > 0 ? receitaPrevista / totalPropostas : 0;
  const taxaConversao = totalPropostas > 0 ? Math.round((aprovadas.length / totalPropostas) * 100) : 0;

  // Funil
  const funnelStages = [
    { label: 'Rascunhos', count: rascunhos.length, color: 'bg-[#555568]' },
    { label: 'Enviadas', count: enviadas.length, color: 'bg-blue-500' },
    { label: 'Aprovadas', count: aprovadas.length, color: 'bg-emerald-500' },
    { label: 'Contratos', count: contratos.length, color: 'bg-violet-500' },
    { label: 'Recusadas', count: recusadas.length, color: 'bg-red-400' },
  ];
  const funnelTotal = funnelStages.reduce((s, f) => s + f.count, 0) || 1;

  // Timeline
  const activityTimeline = [
    {
      title: 'Proposta visualizada pelo cliente',
      description: 'O cliente abriu a proposta pública 2 vezes.',
      time: 'Há 15 min',
      dotColor: 'bg-blue-400',
    },
    {
      title: 'Contrato assinado',
      description: 'Empresa GIC assinou o contrato #CONT-102.',
      time: 'Há 2 horas',
      dotColor: 'bg-emerald-400',
    },
    {
      title: 'Nova proposta criada',
      description: 'Proposta de Consultoria B2B gerada com sucesso.',
      time: 'Há 5 horas',
      dotColor: 'bg-violet-400',
    },
  ];

  // Insights
  const smartInsights = [
    {
      text: 'Uma proposta foi visualizada recentemente mas ainda sem resposta. Considere um follow-up.',
      actionText: 'Ver proposta',
      action: () => navigate('/propostas'),
    },
    {
      text: `${enviadas.length} proposta(s) enviada(s) aguardando confirmação há mais de 3 dias.`,
      actionText: 'Ver enviadas',
      action: () => navigate('/propostas'),
    },
  ];

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#1e1e2e]">
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight">Painel</h1>
          <p className="text-[13px] text-[#555568] mt-0.5">Visão consolidada de vendas, propostas e contratos.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/propostas/criar')}
            className="px-3 py-1.5 rounded-md text-[13px] font-medium text-white bg-blue-600 hover:bg-blue-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Nova Proposta
          </button>
          <button
            onClick={() => navigate('/contratos/criar')}
            className="px-3 py-1.5 rounded-md text-[13px] font-medium text-[#8888a0] bg-[#111118] border border-[#1e1e2e] hover:text-white hover:border-[#2a2a3e] transition flex items-center gap-1.5 cursor-pointer"
          >
            <FileSignature className="w-3.5 h-3.5" />
            Novo Contrato
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Receita confirmada', value: formatCurrency(receitaConfirmada), sub: `${aprovadas.length} fechadas`, icon: DollarSign, subColor: 'text-emerald-400' },
          { label: 'Pipeline', value: formatCurrency(receitaPrevista), sub: 'Total orçado', icon: BarChart3, subColor: 'text-[#555568]' },
          { label: 'Conversão', value: `${taxaConversao}%`, sub: `Ticket: ${formatCurrency(ticketMedio)}`, icon: Zap, subColor: 'text-[#555568]' },
          { label: 'Contratos', value: String(contratos.length), sub: 'Registrados', icon: ShieldCheck, subColor: 'text-[#555568]' },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="p-4 rounded-lg bg-[#111118] border border-[#1e1e2e] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#555568]">{kpi.label}</span>
                <Icon className="w-4 h-4 text-[#555568]" />
              </div>
              <h3 className="text-2xl font-semibold text-white tabular-nums tracking-tight">{kpi.value}</h3>
              <p className={`text-[11px] font-medium ${kpi.subColor}`}>{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Funil horizontal */}
      <div className="p-5 rounded-lg bg-[#111118] border border-[#1e1e2e] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-medium text-white">Funil de vendas</h2>
          <span className="text-[11px] font-medium text-[#555568]">{totalPropostas} total</span>
        </div>

        {/* Bar */}
        <div className="flex h-2 rounded-full overflow-hidden bg-[#1a1a24]">
          {funnelStages.map((stage, idx) => (
            stage.count > 0 && (
              <div
                key={idx}
                className={`${stage.color} transition-all`}
                style={{ width: `${(stage.count / funnelTotal) * 100}%` }}
              />
            )
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          {funnelStages.map((stage, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${stage.color}`} />
              <span className="text-[11px] text-[#8888a0]">{stage.label}</span>
              <span className="text-[11px] font-semibold text-white">{stage.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Insights + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Insights + Propostas */}
        <div className="lg:col-span-7 space-y-5">

          {/* Insights */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#555568]" />
              <h2 className="text-[13px] font-medium text-white">Sugestões</h2>
            </div>
            {smartInsights.map((insight, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-[#111118] border border-[#1e1e2e] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-[13px] text-[#8888a0] leading-relaxed">{insight.text}</p>
                <button
                  onClick={insight.action}
                  className="px-3 py-1.5 rounded-md text-[12px] font-medium text-blue-400 bg-blue-500/8 hover:bg-blue-500/15 border border-blue-500/15 transition shrink-0 cursor-pointer"
                >
                  {insight.actionText}
                </button>
              </div>
            ))}
          </div>

          {/* Propostas recentes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-medium text-white">Propostas recentes</h2>
              <button onClick={() => navigate('/propostas')} className="text-[12px] font-medium text-blue-400 hover:text-blue-300 transition flex items-center gap-1 cursor-pointer">
                Ver todas <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            {propostas.slice(0, 3).map((p) => (
              <ProposalCard key={p.id} proposta={p} onExcluir={() => {}} />
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-[13px] font-medium text-white">Atividade recente</h2>
          <div className="p-5 rounded-lg bg-[#111118] border border-[#1e1e2e]">
            <div className="space-y-5 relative">
              {/* Vertical line */}
              <div className="absolute left-[5px] top-2 bottom-2 w-px bg-[#1e1e2e]" />

              {activityTimeline.map((act, idx) => (
                <div key={idx} className="flex gap-3 relative">
                  <div className={`w-[10px] h-[10px] rounded-full ${act.dotColor} mt-1 shrink-0 relative z-10 ring-2 ring-[#111118]`} />
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-[13px] font-medium text-[#c0c0d0] leading-snug">{act.title}</p>
                    <p className="text-[12px] text-[#555568] leading-normal">{act.description}</p>
                    <span className="text-[11px] text-[#555568] block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}