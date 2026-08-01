import React, { useState } from 'react';
import { 
  Workflow, Plus, Zap, Clock, MessageSquare, Mail, CheckCircle2, 
  ChevronRight, ToggleLeft, ToggleRight, Trash2, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function Automacoes() {
  const [automacoes, setAutomacoes] = useState([
    {
      id: 1,
      nome: 'Régua de Follow-up para Propostas Visualizadas',
      trigger: 'Cliente visualizou a proposta pública',
      delay: 'Após 2 horas',
      action: 'Gerar lembrete no WhatsApp do Vendedor',
      active: true
    },
    {
      id: 2,
      nome: 'Cobrança de Propostas Pendentes (3 dias)',
      trigger: 'Proposta com status "Enviada" sem resposta',
      delay: 'Após 3 dias',
      action: 'Enviar e-mail automático de acompanhamento',
      active: true
    },
    {
      id: 3,
      nome: 'Geração Automática de Contrato',
      trigger: 'Proposta aprovada pelo cliente',
      delay: 'Instantâneo',
      action: 'Criar rascunho de Contrato pré-preenchido',
      active: true
    }
  ]);

  const toggleActive = (id) => {
    setAutomacoes(prev => prev.map(a => {
      if (a.id === id) {
        const updated = !a.active;
        toast.info(`Automação ${updated ? 'ativada' : 'desativada'}.`);
        return { ...a, active: updated };
      }
      return a;
    }));
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Automações & Réguas de Vendas</h1>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
              Workflow Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Crie réguas automáticas de follow-up e gatilhos para não perder nenhuma oportunidade.</p>
        </div>

        <button
          onClick={() => toast.success('Construtor de nova automação pronto!')}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Automação</span>
        </button>
      </div>

      {/* Lista de Automações Ativas */}
      <div className="space-y-4">
        {automacoes.map((item) => (
          <div key={item.id} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                  <Workflow className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{item.nome}</h3>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${item.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    {item.active ? 'Ativa' : 'Pausada'}
                  </span>
                </div>
              </div>

              {/* Workflow Flow Steps */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
                <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 font-semibold text-slate-300">{item.trigger}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 font-semibold text-slate-300">{item.delay}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 font-semibold text-blue-400">{item.action}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
              <button
                onClick={() => toggleActive(item.id)}
                className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
              >
                {item.active ? (
                  <ToggleRight className="w-7 h-7 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-600" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
