import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Trash2, ArrowUp, ArrowDown, Copy, Eye, Edit3, Save, Sparkles,
  Layout, Type, DollarSign, ShieldCheck, FileText, CheckCircle2,
  Palette, Image as ImageIcon, Sliders, Layers, ChevronRight, Check, X, ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

const BLOCK_TYPES = [
  { id: 'cover', name: 'Capa Executiva', icon: Layout, desc: 'Título principal, subtítulo, dados da empresa e cliente' },
  { id: 'summary', name: 'Resumo Executivo', icon: Type, desc: 'Apresentação da solução e visão do projeto' },
  { id: 'scope', name: 'Escopo & Entregáveis', icon: FileText, desc: 'Lista detalhada de etapas e fases do projeto' },
  { id: 'pricing', name: 'Tabela de Investimento', icon: DollarSign, desc: 'Itens, quantidades, valores e cálculo automático' },
  { id: 'timeline', name: 'Cronograma', icon: Layers, desc: 'Etapas de execução com prazos e entregáveis' },
  { id: 'terms', name: 'Termos & Condições', icon: ShieldCheck, desc: 'Condições de pagamento e validade da proposta' },
  { id: 'signature', name: 'Carimbo de Aceite Digital', icon: CheckCircle2, desc: 'Espaço de validação e aceite com IP/data' }
];

const PRESET_TEMPLATES = [
  {
    id: 'preset-b2b',
    name: 'Consultoria B2B SaaS',
    color: '#2563eb',
    blocks: [
      {
        id: 'b-1',
        type: 'cover',
        data: {
          title: 'Proposta Comercial - Transformação Digital',
          subtitle: 'Preparado especialmente para ACME Corp',
          companyName: 'PropostaFácil Tech Solutions',
          clientName: 'ACME Corporation',
          date: 'Agosto de 2026'
        }
      },
      {
        id: 'b-2',
        type: 'summary',
        data: {
          heading: '1. Resumo Executivo',
          content: 'Esta proposta apresenta o plano estratégico para automação comercial e otimização dos fluxos de vendas da ACME Corporation, visando aumentar a taxa de conversão em até 35% nos primeiros 90 dias.'
        }
      },
      {
        id: 'b-3',
        type: 'scope',
        data: {
          heading: '2. Escopo dos Serviços',
          items: [
            'Implantação de Plataforma Comercial B2B',
            'Integração de Inteligência Artificial para Geração de Propostas',
            'Treinamento da Equipe de Vendas (10 colaboradores)',
            'Suporte Técnico Dedicado 24/7'
          ]
        }
      },
      {
        id: 'b-4',
        type: 'pricing',
        data: {
          heading: '3. Investimento & Condições',
          items: [
            { desc: 'Licenciamento Anual SaaS', qty: 1, val: 12000 },
            { desc: 'Setup & Treinamento Inicial', qty: 1, val: 3500 }
          ]
        }
      },
      {
        id: 'b-5',
        type: 'signature',
        data: {
          heading: '4. Aceite Digital',
          terms: 'Ao clicar em Aceitar, o contratante concorda com todos os termos desta proposta comercial com carimbo de data/hora e IP registrado.'
        }
      }
    ]
  },
  {
    id: 'preset-catering',
    name: 'Gastronomia & Eventos',
    color: '#d97706',
    blocks: [
      {
        id: 'c-1',
        type: 'cover',
        data: {
          title: 'Proposta de Catering & Buffet Executivo',
          subtitle: 'Evento Anual de Premiação 2026',
          companyName: 'Gourmet Events',
          clientName: 'Grupo Vanguarda',
          date: 'Setembro de 2026'
        }
      },
      {
        id: 'c-2',
        type: 'pricing',
        data: {
          heading: 'Orçamento do Buffet (200 Pessoas)',
          items: [
            { desc: 'Coquetel Completo + Bebidas Premium', qty: 200, val: 120 },
            { desc: 'Equipe de Garçons e Barman (8h)', qty: 1, val: 2800 }
          ]
        }
      }
    ]
  }
];

export function ProposalCanvasEditor({ initialData, onSave }) {
  const navigate = useNavigate();

  const [templateName, setTemplateName] = useState(initialData?.name || 'Novo Template de Proposta');
  const [accentColor, setAccentColor] = useState(initialData?.color || '#2563eb');
  const [blocks, setBlocks] = useState(initialData?.blocks || PRESET_TEMPLATES[0].blocks);
  const [selectedBlockId, setSelectedBlockId] = useState(blocks[0]?.id || null);
  const [isPreview, setIsPreview] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  // Adicionar bloco
  const handleAddBlock = (type) => {
    const newId = `b-${Date.now()}`;
    let defaultData = {};

    switch (type) {
      case 'cover':
        defaultData = { title: 'Título da Proposta Comercial', subtitle: 'Subtítulo descritivo', companyName: 'Sua Empresa', clientName: 'Nome do Cliente', date: 'Data Atual' };
        break;
      case 'summary':
        defaultData = { heading: 'Resumo Executivo', content: 'Escreva aqui o contexto do projeto e por que sua solução é a ideal para o cliente.' };
        break;
      case 'scope':
        defaultData = { heading: 'Escopo de Entregáveis', items: ['Entregável 1: Análise e Diagnóstico', 'Entregável 2: Execução Técnica', 'Entregável 3: Relatório Final'] };
        break;
      case 'pricing':
        defaultData = { heading: 'Investimento Comercial', items: [{ desc: 'Serviço Principal', qty: 1, val: 5000 }] };
        break;
      case 'timeline':
        defaultData = { heading: 'Cronograma de Execução', items: ['Fase 1: Kickoff (Semana 1)', 'Fase 2: Desenvolvimento (Semanas 2 a 4)', 'Fase 3: Entrega (Semana 5)'] };
        break;
      case 'terms':
        defaultData = { heading: 'Termos & Validade', content: 'Esta proposta tem validade de 15 dias corridos. Condições de pagamento: 50% no aceite e 50% na conclusão.' };
        break;
      case 'signature':
        defaultData = { heading: 'Aceite Digital da Proposta', terms: 'Ao assinar, ambas as partes confirmam o início imediato do escopo acima descrito.' };
        break;
      default:
        break;
    }

    const newBlock = { id: newId, type, data: defaultData };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newId);
    toast.success('Bloco adicionado ao Canvas');
  };

  // Mover bloco
  const handleMoveBlock = (index, direction) => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;

    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;

    setBlocks(newBlocks);
  };

  // Excluir bloco
  const handleDeleteBlock = (id) => {
    if (blocks.length <= 1) {
      toast.error('O template precisa ter pelo menos 1 bloco.');
      return;
    }
    const filtered = blocks.filter(b => b.id !== id);
    setBlocks(filtered);
    if (selectedBlockId === id) {
      setSelectedBlockId(filtered[0]?.id || null);
    }
    toast.success('Bloco removido');
  };

  // Duplicar bloco
  const handleDuplicateBlock = (block) => {
    const newId = `b-${Date.now()}`;
    const clone = { ...block, id: newId, data: JSON.parse(JSON.stringify(block.data)) };
    const index = blocks.findIndex(b => b.id === block.id);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, clone);
    setBlocks(newBlocks);
    setSelectedBlockId(newId);
    toast.success('Bloco duplicado');
  };

  // Atualizar campo de dados do bloco selecionado
  const handleUpdateBlockData = (field, value) => {
    setBlocks(blocks.map(b => {
      if (b.id === selectedBlockId) {
        return { ...b, data: { ...b.data, [field]: value } };
      }
      return b;
    }));
  };

  // Gerar escopo com IA
  const handleGenerateAiScope = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setBlocks(blocks.map(b => {
        if (b.type === 'scope') {
          return {
            ...b,
            data: {
              ...b.data,
              heading: 'Escopo Otimizado por Inteligência Artificial',
              items: [
                'Diagnóstico de Arquitetura Comercial e Análise de Gargalos',
                'Implementação de Sistema SaaS de Alta Conversão',
                'Desenvolvimento de Templates Personalizados por Nicho',
                'Treinamento e Capacitação de Liderança de Vendas',
                'Monitoramento Semanal de KPIs e Taxa de Aceite'
              ]
            }
          };
        }
        return b;
      }));
      setIsAiLoading(false);
      toast.success('Escopo enriquecido com IA com sucesso!');
    }, 1200);
  };

  // Salvar
  const handleSave = () => {
    const payload = { name: templateName, color: accentColor, blocks };
    if (onSave) {
      onSave(payload);
    } else {
      toast.success('Template salvo com sucesso no Canvas!');
      navigate('/propostas');
    }
  };

  // Calcular total de um bloco de tabela de preços
  const calculateBlockTotal = (items = []) => {
    return items.reduce((acc, item) => acc + ((parseFloat(item.qty) || 0) * (parseFloat(item.val) || 0)), 0);
  };

  return (
    <div className="min-h-screen bg-[#090d14] text-[#e2e8f0] flex flex-col font-sans selection:bg-blue-600/30 selection:text-white">
      {/* ── Top Bar ── */}
      <header className="h-14 border-b border-[#1b2434] bg-[#0c121e] px-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/propostas')}
            className="p-1.5 rounded-md hover:bg-white/5 text-[#94a3b8] hover:text-white transition"
            title="Voltar para Propostas"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-blue-500" />
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="bg-transparent text-sm font-semibold text-white focus:outline-none focus:border-b border-blue-500 px-1 py-0.5"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Preset templates dropdown */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#141c2c] p-1 rounded-lg border border-[#1e293b]">
            <span className="text-[11px] text-[#94a3b8] px-2 font-medium">Modelos Prontos:</span>
            {PRESET_TEMPLATES.map(preset => (
              <button
                key={preset.id}
                onClick={() => {
                  setBlocks(preset.blocks);
                  setAccentColor(preset.color);
                  setTemplateName(preset.name);
                  toast.success(`Modelo "${preset.name}" carregado!`);
                }}
                className="px-2.5 py-1 text-xs rounded font-medium text-white hover:bg-white/10 transition"
              >
                {preset.name}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerateAiScope}
            disabled={isAiLoading}
            className="px-3 py-1.5 rounded-md text-xs font-semibold text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 hover:bg-cyan-900/60 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span>{isAiLoading ? 'Gerando...' : 'Preencher por IA'}</span>
          </button>

          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
              isPreview ? 'bg-blue-600 text-white' : 'bg-[#1b2536] text-[#94a3b8] hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isPreview ? 'Modo Edição' : 'Pré-visualizar'}</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar Template</span>
          </button>
        </div>
      </header>

      {/* ── Main Canvas Workspace ── */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ── Left Panel: Block Library ── */}
        {!isPreview && (
          <aside className="w-64 border-r border-[#1b2434] bg-[#0c121e] flex flex-col shrink-0">
            <div className="p-3 border-b border-[#1b2434] flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-blue-400" />
                Adicionar Blocos
              </span>
              <span className="text-[10px] text-[#64748b]">{blocks.length} blocos</span>
            </div>

            <div className="p-2 space-y-1.5 overflow-y-auto flex-1">
              {BLOCK_TYPES.map(bt => {
                const IconComp = bt.icon;
                return (
                  <button
                    key={bt.id}
                    onClick={() => handleAddBlock(bt.id)}
                    className="w-full p-2.5 rounded-lg bg-[#111927] border border-[#1b2434] hover:border-blue-500/40 hover:bg-[#162032] text-left transition group flex items-start gap-2.5 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded bg-blue-600/10 text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-blue-300 transition">{bt.name}</div>
                      <div className="text-[10px] text-[#64748b] leading-tight mt-0.5">{bt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selector de Cor de Destaque */}
            <div className="p-3 border-t border-[#1b2434] space-y-2 bg-[#090e17]">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-cyan-400" /> Cor do Tema
              </span>
              <div className="flex items-center gap-2">
                {['#2563eb', '#10b981', '#7c3aed', '#d97706', '#ec4899', '#06b6d4'].map(color => (
                  <button
                    key={color}
                    onClick={() => setAccentColor(color)}
                    className={`w-6 h-6 rounded-full transition cursor-pointer border ${accentColor === color ? 'border-white scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* ── Center Panel: Document Canvas Sheet ── */}
        <main className="flex-1 bg-[#05080e] overflow-y-auto p-4 md:p-8 flex justify-center">
          <div className="w-full max-w-3xl bg-[#0f172a] border border-[#1e293b] rounded-xl shadow-2xl overflow-hidden min-h-[850px] flex flex-col justify-between my-auto">
            
            {/* Cabeçalho superior da folha do documento */}
            <div className="h-2" style={{ backgroundColor: accentColor }} />

            <div className="p-6 md:p-10 space-y-8 flex-1">
              {blocks.map((block, idx) => {
                const isSelected = selectedBlockId === block.id && !isPreview;

                return (
                  <div
                    key={block.id}
                    onClick={() => !isPreview && setSelectedBlockId(block.id)}
                    className={`relative rounded-lg transition-all duration-200 ${
                      isPreview 
                        ? 'p-2'
                        : isSelected 
                          ? 'ring-2 ring-blue-500 bg-[#162032]/80 p-4 shadow-lg' 
                          : 'p-4 hover:bg-[#141d2d]/50 border border-dashed border-[#1e293b] cursor-pointer'
                    }`}
                  >
                    {/* Barra de ações do bloco (no modo edição) */}
                    {!isPreview && isSelected && (
                      <div className="absolute -top-3.5 right-3 bg-[#1e293b] border border-[#334155] rounded-md px-2 py-1 flex items-center gap-1 shadow-md z-20 text-xs">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMoveBlock(idx, 'up'); }}
                          disabled={idx === 0}
                          className="p-1 hover:text-white text-[#94a3b8] disabled:opacity-30"
                          title="Subir bloco"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMoveBlock(idx, 'down'); }}
                          disabled={idx === blocks.length - 1}
                          className="p-1 hover:text-white text-[#94a3b8] disabled:opacity-30"
                          title="Descer bloco"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <div className="h-3 w-px bg-white/10" />
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDuplicateBlock(block); }}
                          className="p-1 hover:text-white text-[#94a3b8]"
                          title="Duplicar"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id); }}
                          className="p-1 hover:text-red-400 text-[#94a3b8]"
                          title="Remover"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Renderização do conteúdo por tipo de bloco */}
                    {block.type === 'cover' && (
                      <div className="space-y-4 py-4 border-b border-[#1e293b]">
                        <div className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded inline-block text-white" style={{ backgroundColor: accentColor }}>
                          {block.data.companyName || 'Sua Empresa'}
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                          {block.data.title}
                        </h1>
                        <p className="text-sm text-[#94a3b8] font-medium">{block.data.subtitle}</p>
                        <div className="pt-4 flex flex-wrap gap-4 text-xs text-[#64748b]">
                          <div>Cliente: <span className="text-white font-semibold">{block.data.clientName}</span></div>
                          <div>Data: <span className="text-white font-semibold">{block.data.date}</span></div>
                        </div>
                      </div>
                    )}

                    {block.type === 'summary' && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white tracking-tight" style={{ color: accentColor }}>
                          {block.data.heading}
                        </h3>
                        <p className="text-sm text-[#cbd5e1] leading-relaxed whitespace-pre-line">
                          {block.data.content}
                        </p>
                      </div>
                    )}

                    {block.type === 'scope' && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-white tracking-tight" style={{ color: accentColor }}>
                          {block.data.heading}
                        </h3>
                        <div className="grid grid-cols-1 gap-2 pt-1">
                          {(block.data.items || []).map((item, i) => (
                            <div key={i} className="flex items-start gap-2.5 p-2.5 rounded bg-[#131c2e] border border-[#1e293b]">
                              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: accentColor }} />
                              <span className="text-xs text-[#e2e8f0] font-medium">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {block.type === 'pricing' && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-white tracking-tight" style={{ color: accentColor }}>
                          {block.data.heading}
                        </h3>
                        <div className="overflow-x-auto rounded-lg border border-[#1e293b] bg-[#111827]">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-[#1e293b] text-[#94a3b8]">
                              <tr>
                                <th className="p-2.5">Item / Descrição</th>
                                <th className="p-2.5 text-center">Qtd</th>
                                <th className="p-2.5 text-right">Valor Unitário</th>
                                <th className="p-2.5 text-right">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1e293b]">
                              {(block.data.items || []).map((item, i) => {
                                const sub = (parseFloat(item.qty) || 0) * (parseFloat(item.val) || 0);
                                return (
                                  <tr key={i} className="hover:bg-white/5 text-[#e2e8f0]">
                                    <td className="p-2.5 font-medium">{item.desc}</td>
                                    <td className="p-2.5 text-center">{item.qty}</td>
                                    <td className="p-2.5 text-right">R$ {(parseFloat(item.val) || 0).toLocaleString('pt-BR')}</td>
                                    <td className="p-2.5 text-right font-bold text-white">R$ {sub.toLocaleString('pt-BR')}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-[#141e30] border border-[#1e293b]">
                          <span className="text-xs font-semibold text-[#94a3b8]">Investimento Total Estimado:</span>
                          <span className="text-lg font-extrabold text-white" style={{ color: accentColor }}>
                            R$ {calculateBlockTotal(block.data.items).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    )}

                    {block.type === 'timeline' && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-white tracking-tight" style={{ color: accentColor }}>
                          {block.data.heading}
                        </h3>
                        <div className="space-y-2 pl-2 border-l-2" style={{ borderColor: accentColor }}>
                          {(block.data.items || []).map((step, i) => (
                            <div key={i} className="text-xs text-[#cbd5e1] font-medium pl-3 relative">
                              <span className="w-2 h-2 rounded-full absolute -left-[17px] top-1" style={{ backgroundColor: accentColor }} />
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {block.type === 'terms' && (
                      <div className="space-y-2 p-3 rounded-lg bg-[#111927] border border-[#1e293b]">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white" style={{ color: accentColor }}>
                          {block.data.heading}
                        </h4>
                        <p className="text-xs text-[#94a3b8] leading-relaxed">
                          {block.data.content}
                        </p>
                      </div>
                    )}

                    {block.type === 'signature' && (
                      <div className="space-y-4 pt-4 border-t border-[#1e293b]">
                        <h4 className="text-sm font-bold text-white">{block.data.heading}</h4>
                        <p className="text-xs text-[#64748b] leading-relaxed">{block.data.terms}</p>
                        <div className="p-4 rounded-lg bg-[#131c2e] border border-blue-500/30 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-white block">Aceite Digital Pendente</span>
                            <span className="text-[10px] text-[#94a3b8]">Será gravado com IP, Nome e Registro Temporal</span>
                          </div>
                          <div className="px-3 py-1.5 rounded text-xs font-semibold text-white bg-blue-600 opacity-90 cursor-not-allowed">
                            Assinar Proposta
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Rodapé da folha */}
            <div className="p-4 border-t border-[#1e293b] bg-[#0c121e] flex items-center justify-between text-[11px] text-[#64748b]">
              <span>Documento gerado via PropostaFácil</span>
              <span>Página 1 de 1</span>
            </div>
          </div>
        </main>

        {/* ── Right Panel: Selected Block Inspector ── */}
        {!isPreview && selectedBlock && (
          <aside className="w-72 border-l border-[#1b2434] bg-[#0c121e] flex flex-col shrink-0">
            <div className="p-3 border-b border-[#1b2434] flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                Editar Conteúdo
              </span>
              <span className="text-[10px] uppercase font-bold text-blue-400 px-1.5 py-0.5 bg-blue-500/10 rounded">
                {selectedBlock.type}
              </span>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Controles para Cover */}
              {selectedBlock.type === 'cover' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[#94a3b8] font-medium">Nome da Empresa</label>
                    <input
                      type="text"
                      value={selectedBlock.data.companyName || ''}
                      onChange={(e) => handleUpdateBlockData('companyName', e.target.value)}
                      className="w-full p-2 rounded bg-[#141d2d] border border-[#1e293b] text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[#94a3b8] font-medium">Título Principal</label>
                    <textarea
                      rows={2}
                      value={selectedBlock.data.title || ''}
                      onChange={(e) => handleUpdateBlockData('title', e.target.value)}
                      className="w-full p-2 rounded bg-[#141d2d] border border-[#1e293b] text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[#94a3b8] font-medium">Subtítulo</label>
                    <input
                      type="text"
                      value={selectedBlock.data.subtitle || ''}
                      onChange={(e) => handleUpdateBlockData('subtitle', e.target.value)}
                      className="w-full p-2 rounded bg-[#141d2d] border border-[#1e293b] text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[#94a3b8] font-medium">Nome do Cliente</label>
                    <input
                      type="text"
                      value={selectedBlock.data.clientName || ''}
                      onChange={(e) => handleUpdateBlockData('clientName', e.target.value)}
                      className="w-full p-2 rounded bg-[#141d2d] border border-[#1e293b] text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {/* Controles para Summary & Terms */}
              {(selectedBlock.type === 'summary' || selectedBlock.type === 'terms') && (
                <>
                  <div className="space-y-1">
                    <label className="text-[#94a3b8] font-medium">Título da Seção</label>
                    <input
                      type="text"
                      value={selectedBlock.data.heading || ''}
                      onChange={(e) => handleUpdateBlockData('heading', e.target.value)}
                      className="w-full p-2 rounded bg-[#141d2d] border border-[#1e293b] text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[#94a3b8] font-medium">Texto do Conteúdo</label>
                    <textarea
                      rows={6}
                      value={selectedBlock.data.content || ''}
                      onChange={(e) => handleUpdateBlockData('content', e.target.value)}
                      className="w-full p-2 rounded bg-[#141d2d] border border-[#1e293b] text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                    />
                  </div>
                </>
              )}

              {/* Controles para Escopo & Timeline */}
              {(selectedBlock.type === 'scope' || selectedBlock.type === 'timeline') && (
                <>
                  <div className="space-y-1">
                    <label className="text-[#94a3b8] font-medium">Título da Seção</label>
                    <input
                      type="text"
                      value={selectedBlock.data.heading || ''}
                      onChange={(e) => handleUpdateBlockData('heading', e.target.value)}
                      className="w-full p-2 rounded bg-[#141d2d] border border-[#1e293b] text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#94a3b8] font-medium block">Itens da Lista ({selectedBlock.data.items?.length || 0})</label>
                    {(selectedBlock.data.items || []).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const newItems = [...selectedBlock.data.items];
                            newItems[idx] = e.target.value;
                            handleUpdateBlockData('items', newItems);
                          }}
                          className="flex-1 p-1.5 rounded bg-[#141d2d] border border-[#1e293b] text-white focus:outline-none focus:border-blue-500 text-xs"
                        />
                        <button
                          onClick={() => {
                            const newItems = selectedBlock.data.items.filter((_, i) => i !== idx);
                            handleUpdateBlockData('items', newItems);
                          }}
                          className="p-1 text-red-400 hover:bg-white/5 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newItems = [...(selectedBlock.data.items || []), 'Novo item de entregável'];
                        handleUpdateBlockData('items', newItems);
                      }}
                      className="w-full py-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded hover:bg-blue-500/20 transition flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Adicionar Item
                    </button>
                  </div>
                </>
              )}

              {/* Controles para Tabela de Preços */}
              {selectedBlock.type === 'pricing' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[#94a3b8] font-medium">Título da Tabela</label>
                    <input
                      type="text"
                      value={selectedBlock.data.heading || ''}
                      onChange={(e) => handleUpdateBlockData('heading', e.target.value)}
                      className="w-full p-2 rounded bg-[#141d2d] border border-[#1e293b] text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[#94a3b8] font-medium block">Linhas de Preço</label>
                    {(selectedBlock.data.items || []).map((item, idx) => (
                      <div key={idx} className="p-2 rounded bg-[#141d2d] border border-[#1e293b] space-y-1.5">
                        <input
                          type="text"
                          placeholder="Descrição"
                          value={item.desc}
                          onChange={(e) => {
                            const newItems = [...selectedBlock.data.items];
                            newItems[idx].desc = e.target.value;
                            handleUpdateBlockData('items', newItems);
                          }}
                          className="w-full p-1 rounded bg-[#0f172a] border border-[#1e293b] text-white text-xs"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            placeholder="Qtd"
                            value={item.qty}
                            onChange={(e) => {
                              const newItems = [...selectedBlock.data.items];
                              newItems[idx].qty = parseFloat(e.target.value) || 0;
                              handleUpdateBlockData('items', newItems);
                            }}
                            className="w-16 p-1 rounded bg-[#0f172a] border border-[#1e293b] text-white text-xs"
                          />
                          <input
                            type="number"
                            placeholder="Valor"
                            value={item.val}
                            onChange={(e) => {
                              const newItems = [...selectedBlock.data.items];
                              newItems[idx].val = parseFloat(e.target.value) || 0;
                              handleUpdateBlockData('items', newItems);
                            }}
                            className="flex-1 p-1 rounded bg-[#0f172a] border border-[#1e293b] text-white text-xs"
                          />
                          <button
                            onClick={() => {
                              const newItems = selectedBlock.data.items.filter((_, i) => i !== idx);
                              handleUpdateBlockData('items', newItems);
                            }}
                            className="p-1 text-red-400 hover:bg-white/5 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newItems = [...(selectedBlock.data.items || []), { desc: 'Novo Serviço', qty: 1, val: 1000 }];
                        handleUpdateBlockData('items', newItems);
                      }}
                      className="w-full py-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded hover:bg-blue-500/20 transition flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Adicionar Linha de Valor
                    </button>
                  </div>
                </>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
