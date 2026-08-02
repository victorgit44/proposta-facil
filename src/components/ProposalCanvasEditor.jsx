import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Plus, Trash2, ArrowUp, ArrowDown, Copy, Eye, Edit3, Save, Sparkles,
  Layout, Type, DollarSign, ShieldCheck, FileText, CheckCircle2,
  Palette, Image as ImageIcon, Sliders, Layers, ChevronRight, Check, X, ArrowLeft,
  GripVertical, HelpCircle, Upload, Play, Move, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';
import { base44, fetchApi, supabase } from '@/api/supabaseClient';
import { queryClient } from '@/queryClient';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/formatters';

const SECTIONS = [
  { id: 'cover', name: 'Capa Executiva', icon: Layout },
  { id: 'summary', name: 'Resumo Executivo', icon: Type },
  { id: 'scope', name: 'Escopo & Entregáveis', icon: FileText },
  { id: 'pricing', name: 'Tabela de Investimento', icon: DollarSign },
  { id: 'terms', name: 'Termos & Condições', icon: ShieldCheck },
  { id: 'signature', name: 'Assinatura Digital', icon: CheckCircle2 }
];

const PRESET_TEMPLATES = [
  {
    id: 'preset-b2b',
    name: 'Proposta Comercial Proposify SaaS',
    color: '#1e3a8a', // Deep Blue Proposify
    blocks: [
      {
        id: 'b-1',
        type: 'cover',
        data: {
          title: 'PROJECT QUOTE PROPOSAL',
          subtitle: 'Preparado especialmente para client_name',
          companyName: 'PropostaFácil Technologies',
          clientName: 'ACME Corp',
          logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
          logoAlign: 'left',
          logoSize: 120
        }
      },
      {
        id: 'b-2',
        type: 'summary',
        data: {
          heading: '1. Resumo Executivo',
          content: 'Apresentamos a solução de aceleração comercial e emissão inteligente de propostas digitais para escalar as vendas B2B da sua empresa com carimbo de aceite jurídico.'
        }
      },
      {
        id: 'b-3',
        type: 'scope',
        data: {
          heading: '2. Escopo de Serviços & Solução',
          items: [
            'Implantação de Editor de Propostas Interativo (Canvas Drag & Drop)',
            'Integração com Inteligência Artificial para Geração Automática de Conteúdo',
            'Treinamento da Equipe Comercial e Onboarding de Vendedores',
            'Configuração de Assinatura Digital e Rastreamento de Visualizações'
          ]
        }
      },
      {
        id: 'b-4',
        type: 'pricing',
        data: {
          heading: '3. Tabela de Investimento',
          items: [
            { desc: 'Licenciamento Anual da Plataforma SaaS', qty: 1, val: 12000 },
            { desc: 'Setup Inicial & Personalização de Templates', qty: 1, val: 3000 }
          ]
        }
      },
      {
        id: 'b-5',
        type: 'terms',
        data: {
          heading: '4. Termos & Validade',
          content: 'Esta proposta possui validade de 15 dias úteis. Condições de pagamento: 50% na aprovação e 50% na entrega final do projeto.'
        }
      },
      {
        id: 'b-6',
        type: 'signature',
        data: {
          heading: '5. Aceite Digital da Proposta',
          terms: 'Ao assinar digitalmente abaixo, o contratante valida o início dos serviços com registro de IP, data e hora.'
        }
      }
    ]
  }
];

export function ProposalCanvasEditor() {
  const navigate = useNavigate();
  const { id: editId } = useParams();

  const [templateName, setTemplateName] = useState('Projeto de Proposta Comercial');
  const [clientName, setClientName] = useState('ACME Corporation');
  const [clientEmail, setClientEmail] = useState('roberto@acme.com');
  const [accentColor, setAccentColor] = useState('#1e3a8a');
  const [blocks, setBlocks] = useState(PRESET_TEMPLATES[0].blocks);
  const [activeSection, setActiveSection] = useState('cover');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Tutorial Guiado Onboarding (Estilo Proposify)
  const [tutorialStep, setTutorialStep] = useState(1);
  const [showTutorial, setShowTutorial] = useState(true);

  const tutorialSteps = [
    {
      title: 'Bem-vindo ao Canvas Visual Proposify! 🚀',
      content: 'Este é o novo editor visual interativo do PropostaFácil. Monte propostas corporativas incríveis arrastando e personalizando blocos sem depender de formulários estáticos.'
    },
    {
      title: 'Navegador de Seções (Esquerda) 📄',
      content: 'Navegue rapidamente entre a Capa, o Escopo, a Tabela de Preços e a Assinatura Digital. Você pode adicionar novas seções ou reordená-las a qualquer momento.'
    },
    {
      title: 'Painel Build & Ferramentas (Direita) 🛠️',
      content: 'Insira novos blocos de Texto, Imagens, Logos, Tabelas de Preços, Vídeos ou utilize a IA Copilot para preencher o escopo automaticamente.'
    },
    {
      title: 'Reordenação Drag & Drop ↕️',
      content: 'Clique nos manipuladores verticais no lado esquerdo de qualquer bloco e arraste para cima ou para baixo para ajustar a ordem da proposta.'
    },
    {
      title: 'Salvar e Emitir Proposta 💾',
      content: 'Quando sua proposta estiver pronta, clique em "Salvar e Emitir Proposta" no topo para gravar no banco de dados MariaDB!'
    }
  ];

  // Carregar dados de proposta existente se estiver no modo de edição
  const { data: propostaExistente } = useQuery({
    queryKey: ['proposta', editId],
    queryFn: () => fetchApi(`/api/propostas/${editId}`),
    enabled: !!editId,
  });

  useEffect(() => {
    if (propostaExistente) {
      if (propostaExistente.nome_cliente) setClientName(propostaExistente.nome_cliente);
      if (propostaExistente.email_cliente) setClientEmail(propostaExistente.email_cliente);
      if (propostaExistente.numero_proposta) setTemplateName(`Proposta ${propostaExistente.numero_proposta}`);
      if (propostaExistente.canvas_data?.blocks) {
        setBlocks(propostaExistente.canvas_data.blocks);
        if (propostaExistente.canvas_data.accentColor) setAccentColor(propostaExistente.canvas_data.accentColor);
      }
    }
  }, [propostaExistente]);

  // Cálculo do total da proposta
  const calculateTotalProposalValue = () => {
    return blocks.reduce((acc, b) => {
      if (b.type === 'pricing' && b.data?.items) {
        const blockSum = b.data.items.reduce((sum, item) => sum + ((parseFloat(item.qty) || 0) * (parseFloat(item.val) || 0)), 0);
        return acc + blockSum;
      }
      return acc;
    }, 0);
  };

  // Adicionar Bloco ao Canvas
  const handleAddBlock = (type) => {
    const newId = `b-${Date.now()}`;
    let defaultData = {};

    switch (type) {
      case 'cover':
        defaultData = { title: 'TÍTULO DA PROPOSTA COMERCIAL', subtitle: `Preparado para ${clientName}`, companyName: 'PropostaFácil Tech', clientName, logoUrl: '', logoAlign: 'left', logoSize: 100 };
        break;
      case 'summary':
        defaultData = { heading: 'Resumo Executivo', content: 'Descreva a visão geral do projeto e os objetivos estratégicos.' };
        break;
      case 'scope':
        defaultData = { heading: 'Escopo de Entregáveis', items: ['Diagnóstico e Levantamento de Requisitos', 'Execução Técnica e Configuração', 'Entrega e Suporte'] };
        break;
      case 'pricing':
        defaultData = { heading: 'Investimento Comercial', items: [{ desc: 'Serviço Principal de Consultoria', qty: 1, val: 5000 }] };
        break;
      case 'terms':
        defaultData = { heading: 'Termos & Validade', content: 'Esta proposta é válida por 15 dias a contar da data de emissão.' };
        break;
      case 'signature':
        defaultData = { heading: 'Aceite Digital da Proposta', terms: 'Ao clicar em assinar, ambas as partes confirmam o acordo contratual.' };
        break;
      default:
        break;
    }

    const newBlock = { id: newId, type, data: defaultData };
    setBlocks(prev => [...prev, newBlock]);
    toast.success('Bloco adicionado ao Canvas!');
  };

  // Drag & Drop Handlers para reordenação de blocos
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedBlocks = [...blocks];
    const itemToMove = updatedBlocks[draggedIndex];
    updatedBlocks.splice(draggedIndex, 1);
    updatedBlocks.splice(index, 0, itemToMove);

    setDraggedIndex(index);
    setBlocks(updatedBlocks);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Atualizar dados de um bloco específico
  const updateBlockData = (blockId, field, value) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId) {
        return { ...b, data: { ...b.data, [field]: value } };
      }
      return b;
    }));
  };

  // Upload local de imagem/logo para um bloco
  const handleImageUpload = (blockId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBlockData(blockId, 'logoUrl', reader.result);
        toast.success('Imagem enviada para a proposta!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Salvar Proposta Comercial no MariaDB Backend
  const handleSaveProposal = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Gravando proposta no banco de dados...');

    try {
      const valorTotal = calculateTotalProposalValue();
      const payload = {
        numero_proposta: templateName.replace(/\s+/g, '-').toUpperCase().slice(0, 15),
        nome_cliente: clientName || 'Cliente Proposify',
        email_cliente: clientEmail,
        valor_total: valorTotal,
        status: 'rascunho',
        servico_prestado: blocks.find(b => b.type === 'summary')?.data?.content || 'Proposta montada no Canvas Visual Proposify',
        canvas_data: {
          blocks,
          accentColor,
          templateName
        }
      };

      if (editId) {
        await base44.entities.Proposta.update(editId, payload);
      } else {
        await base44.entities.Proposta.create(payload);
      }

      await supabase.rpc('increment_usage', { item_type: 'proposta' });
      queryClient.invalidateQueries({ queryKey: ['propostas'] });

      toast.success('Proposta salva e emitida com sucesso!', { id: toastId });
      navigate('/propostas');
    } catch (error) {
      console.error('Erro ao salvar proposta:', error);
      toast.error(`Erro ao salvar: ${error.message || 'Falha de rede'}`, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5] flex flex-col font-sans selection:bg-blue-600/30 selection:text-white">
      
      {/* ── 1. Header Bar estilo Proposify ── */}
      <header className="h-16 border-b border-[#1e1e2e] bg-[#111118] px-6 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/propostas')}
            className="p-2 rounded-lg bg-[#1a1a24] border border-[#1e1e2e] hover:bg-white/10 text-[#8888a0] hover:text-white transition cursor-pointer"
            title="Voltar para Propostas"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="h-5 w-px bg-[#1e1e2e]" />
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="bg-transparent text-sm font-semibold text-white focus:outline-none focus:border-b border-blue-600 px-1 py-0.5"
              />
              <span className="px-2 py-0.5 text-[10px] font-medium uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded">
                DRAFT
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#8888a0] mt-0.5">
              <span>Cliente: <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="bg-transparent text-white font-medium focus:outline-none border-b border-[#1e1e2e]" /></span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold tabular-nums">{formatCurrency(calculateTotalProposalValue())}</span>
              <span>•</span>
              <span className="text-[11px] text-[#555568]">Salvo no MariaDB</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTutorial(true)}
            className="p-2 rounded-lg bg-[#1a1a24] text-amber-400 hover:bg-white/10 border border-[#1e1e2e] transition cursor-pointer flex items-center gap-1.5 text-xs font-medium"
            title="Ver Tutorial Guiado"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Ajuda</span>
          </button>

          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
              isPreview ? 'bg-blue-600 text-white' : 'bg-[#1a1a24] text-[#8888a0] hover:text-white border border-[#1e1e2e]'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{isPreview ? 'Modo Edição' : 'Pré-visualizar'}</span>
          </button>

          <button
            onClick={handleSaveProposal}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Salvando...' : 'Salvar e Emitir Proposta'}</span>
          </button>
        </div>
      </header>

      {/* ── Workspace ── */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ── 2. Left Panel: Sections Navigation (Proposify Style) ── */}
        {!isPreview && (
          <aside className="w-64 border-r border-[#1e1e2e] bg-[#111118] flex flex-col shrink-0">
            <div className="p-4 border-b border-[#1e1e2e] flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#555568]">Seções da Proposta</span>
              <span className="text-[10px] font-semibold text-[#8888a0] bg-[#1a1a24] px-2 py-0.5 rounded">{blocks.length}</span>
            </div>

            <div className="p-3 space-y-2 overflow-y-auto flex-1">
              {SECTIONS.map((sec) => {
                const IconComp = sec.icon;
                const active = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setActiveSection(sec.id);
                      handleAddBlock(sec.id);
                    }}
                    className={`w-full p-3 rounded-lg border transition text-left flex items-center justify-between group cursor-pointer ${
                      active
                        ? 'bg-blue-600/10 border-blue-600 text-white'
                        : 'bg-[#0a0a0f] border-[#1e1e2e] hover:border-[#2a2a3e] text-[#8888a0] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComp className={`w-4 h-4 ${active ? 'text-blue-400' : 'text-[#555568]'}`} />
                      <span className="text-xs font-medium">{sec.name}</span>
                    </div>
                    <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-blue-400 transition" />
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* ── 3. Central Interactive Canvas Area ── */}
        <main className="flex-1 bg-[#0a0a0f] overflow-y-auto p-6 md:p-10 flex flex-col items-center">
          
          {/* Tutorial Tooltip (Balão flutuante estilo Proposify) */}
          {showTutorial && (
            <div className="mb-6 max-w-2xl w-full p-5 rounded-lg bg-[#111118] border border-blue-600/50 shadow-2xl relative animate-in fade-in slide-in-from-top-4 duration-300">
              <button
                onClick={() => setShowTutorial(false)}
                className="absolute top-3 right-3 text-[#555568] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white shrink-0 font-bold">
                  {tutorialStep}
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-sm font-semibold text-white tracking-tight">
                    {tutorialSteps[tutorialStep - 1].title}
                  </h4>
                  <p className="text-xs text-[#8888a0] leading-relaxed">
                    {tutorialSteps[tutorialStep - 1].content}
                  </p>

                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-[#555568] uppercase tracking-wider">
                      Passo {tutorialStep} de {tutorialSteps.length}
                    </span>

                    <div className="flex items-center gap-2">
                      {tutorialStep > 1 && (
                        <button
                          onClick={() => setTutorialStep(prev => prev - 1)}
                          className="px-3 py-1 bg-[#1a1a24] hover:bg-white/10 text-xs font-medium text-[#8888a0] rounded border border-[#1e1e2e] cursor-pointer"
                        >
                          Anterior
                        </button>
                      )}
                      {tutorialStep < tutorialSteps.length ? (
                        <button
                          onClick={() => setTutorialStep(prev => prev + 1)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white rounded cursor-pointer"
                        >
                          Próximo
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowTutorial(false)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-xs font-medium text-white rounded cursor-pointer"
                        >
                          Entendi, começar!
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Document Canvas Sheet (Folha de Papel Visual A4) */}
          <div className="w-full max-w-4xl bg-[#111118] border border-[#1e1e2e] rounded-lg shadow-2xl min-h-[900px] p-8 md:p-12 space-y-8">
            
            {blocks.map((block, index) => (
              <div
                key={block.id}
                draggable={!isPreview}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative group rounded-lg p-6 transition-all duration-200 border ${
                  !isPreview
                    ? 'border-[#1e1e2e] hover:border-blue-600/60 bg-[#0a0a0f]'
                    : 'border-transparent bg-transparent'
                }`}
              >
                {/* Drag Handle & Floating Controls */}
                {!isPreview && (
                  <div className="absolute left-3 top-3 opacity-0 group-hover:opacity-100 transition flex items-center gap-2 z-10">
                    <span className="p-1 rounded bg-[#1a1a24] border border-[#1e1e2e] text-[#8888a0] cursor-grab active:cursor-grabbing" title="Clique e arraste para reordenar">
                      <GripVertical className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-medium uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                      {block.type}
                    </span>
                  </div>
                )}

                {!isPreview && (
                  <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition flex items-center gap-1 z-10">
                    <button
                      onClick={() => {
                        const updated = blocks.filter(b => b.id !== block.id);
                        setBlocks(updated);
                        toast.success('Bloco removido!');
                      }}
                      className="p-1.5 rounded bg-[#1a1a24] text-rose-400 hover:bg-rose-500/10 border border-[#1e1e2e] transition"
                      title="Excluir bloco"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* ── BLOCO 1: COVER ── */}
                {block.type === 'cover' && (
                  <div className={`p-8 md:p-12 rounded-lg border text-white space-y-6 transition duration-300 ${
                    block.data.coverTheme === 'purple'
                      ? 'bg-gradient-to-br from-[#2e1065] to-[#0a0a0f] border-purple-900/40'
                      : block.data.coverTheme === 'emerald'
                      ? 'bg-gradient-to-br from-[#064e3b] to-[#0a0a0f] border-emerald-900/40'
                      : block.data.coverTheme === 'slate'
                      ? 'bg-gradient-to-br from-[#1e293b] to-[#0a0a0f] border-slate-700/40'
                      : 'bg-gradient-to-br from-[#1b2a4a] to-[#0a0a0f] border-blue-900/40'
                  }`}>
                    {/* Controles de Estilo de Capa e Logo (no modo edição) */}
                    {!isPreview && (
                      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-[#0a0a0f]/80 border border-white/10 text-xs">
                        <div className="flex items-center gap-2">
                          <Palette className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-[11px] font-medium text-[#8888a0]">Tema da Capa:</span>
                          <div className="flex items-center gap-1">
                            {[
                              { id: 'blue', name: 'Azul B2B', color: 'bg-blue-600' },
                              { id: 'purple', name: 'Roxo SaaS', color: 'bg-purple-600' },
                              { id: 'emerald', name: 'Verde Executivo', color: 'bg-emerald-600' },
                              { id: 'slate', name: 'Cinza Corporativo', color: 'bg-slate-700' },
                            ].map(t => (
                              <button
                                key={t.id}
                                onClick={() => updateBlockData(block.id, 'coverTheme', t.id)}
                                className={`w-4 h-4 rounded-full ${t.color} border border-white/20 cursor-pointer ${
                                  block.data.coverTheme === t.id ? 'ring-2 ring-white scale-110' : ''
                                }`}
                                title={t.name}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Alinhamento da Logo */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-medium text-[#8888a0]">Alinhamento Logo:</span>
                          <div className="flex items-center gap-1 bg-[#1a1a24] p-0.5 rounded border border-[#1e1e2e]">
                            <button
                              onClick={() => updateBlockData(block.id, 'logoAlign', 'left')}
                              className={`p-1 rounded text-xs ${block.data.logoAlign === 'left' || !block.data.logoAlign ? 'bg-blue-600 text-white' : 'text-[#8888a0]'}`}
                            >
                              <AlignLeft className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => updateBlockData(block.id, 'logoAlign', 'center')}
                              className={`p-1 rounded text-xs ${block.data.logoAlign === 'center' ? 'bg-blue-600 text-white' : 'text-[#8888a0]'}`}
                            >
                              <AlignCenter className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => updateBlockData(block.id, 'logoAlign', 'right')}
                              className={`p-1 rounded text-xs ${block.data.logoAlign === 'right' ? 'bg-blue-600 text-white' : 'text-[#8888a0]'}`}
                            >
                              <AlignRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Logo Display & Position */}
                    <div className="border-b border-white/10 pb-6">
                      <div className={`flex flex-col items-${
                        block.data.logoAlign === 'center'
                          ? 'center'
                          : block.data.logoAlign === 'right'
                          ? 'end'
                          : 'start'
                      } space-y-2`}>
                        {block.data.logoUrl ? (
                          <img
                            src={block.data.logoUrl}
                            alt="Logo da Marca"
                            style={{ width: `${block.data.logoSize || 140}px` }}
                            className="object-contain max-h-28 rounded p-1 bg-white/5 border border-white/10"
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-[#8888a0]">
                            <ImageIcon className="w-5 h-5 text-blue-400" />
                            <span>Logo da Marca / Empresa</span>
                          </div>
                        )}

                        {!isPreview && (
                          <div className="flex items-center gap-3 pt-1">
                            <label className="px-3 py-1 rounded bg-[#1a1a24] border border-[#1e1e2e] text-xs font-medium text-[#8888a0] hover:text-white cursor-pointer flex items-center gap-1.5 transition">
                              <Upload className="w-3.5 h-3.5 text-blue-400" />
                              <span>{block.data.logoUrl ? 'Alterar Logo' : 'Fazer Upload da Logo'}</span>
                              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(block.id, e)} className="hidden" />
                            </label>

                            {block.data.logoUrl && (
                              <div className="flex items-center gap-1 text-[11px] text-[#8888a0]">
                                <span>Tamanho:</span>
                                <input
                                  type="range"
                                  min="60"
                                  max="260"
                                  value={block.data.logoSize || 140}
                                  onChange={(e) => updateBlockData(block.id, 'logoSize', e.target.value)}
                                  className="w-20 accent-blue-600 cursor-pointer"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <input
                        type="text"
                        disabled={isPreview}
                        value={block.data.title}
                        onChange={(e) => updateBlockData(block.id, 'title', e.target.value)}
                        className="w-full bg-transparent text-2xl md:text-4xl font-extrabold text-white tracking-tight focus:outline-none border-b border-transparent focus:border-blue-500"
                        placeholder="TÍTULO DA PROPOSTA"
                      />
                      <input
                        type="text"
                        disabled={isPreview}
                        value={block.data.subtitle}
                        onChange={(e) => updateBlockData(block.id, 'subtitle', e.target.value)}
                        className="w-full bg-transparent text-sm md:text-base font-medium text-emerald-400 focus:outline-none border-b border-transparent focus:border-emerald-500"
                        placeholder="Subtítulo ou nome do cliente"
                      />
                    </div>
                  </div>
                )}

                {/* ── BLOCO 2: SUMMARY ── */}
                {block.type === 'summary' && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      disabled={isPreview}
                      value={block.data.heading}
                      onChange={(e) => updateBlockData(block.id, 'heading', e.target.value)}
                      className="w-full bg-transparent text-lg font-semibold text-white tracking-tight focus:outline-none border-b border-transparent focus:border-blue-600"
                    />
                    <textarea
                      disabled={isPreview}
                      value={block.data.content}
                      onChange={(e) => updateBlockData(block.id, 'content', e.target.value)}
                      rows={3}
                      className="w-full bg-transparent text-xs text-[#8888a0] leading-relaxed focus:outline-none border border-transparent focus:border-[#1e1e2e] rounded p-1"
                    />
                  </div>
                )}

                {/* ── BLOCO 3: SCOPE ── */}
                {block.type === 'scope' && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      disabled={isPreview}
                      value={block.data.heading}
                      onChange={(e) => updateBlockData(block.id, 'heading', e.target.value)}
                      className="w-full bg-transparent text-lg font-semibold text-white tracking-tight focus:outline-none border-b border-transparent focus:border-blue-600"
                    />
                    <ul className="space-y-2">
                      {block.data.items?.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-[#8888a0]">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <input
                            type="text"
                            disabled={isPreview}
                            value={item}
                            onChange={(e) => {
                              const updated = [...block.data.items];
                              updated[i] = e.target.value;
                              updateBlockData(block.id, 'items', updated);
                            }}
                            className="w-full bg-transparent text-xs text-[#8888a0] focus:outline-none focus:text-white border-b border-transparent focus:border-blue-600"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* ── BLOCO 4: PRICING ── */}
                {block.type === 'pricing' && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      disabled={isPreview}
                      value={block.data.heading}
                      onChange={(e) => updateBlockData(block.id, 'heading', e.target.value)}
                      className="w-full bg-transparent text-lg font-semibold text-white tracking-tight focus:outline-none border-b border-transparent focus:border-blue-600"
                    />

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-[#1e1e2e] text-[#555568] uppercase text-[10px] tracking-wider">
                            <th className="pb-2">Descrição do Item</th>
                            <th className="pb-2 w-20 text-center">Qtd</th>
                            <th className="pb-2 w-32 text-right">Valor Unit.</th>
                            <th className="pb-2 w-32 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e1e2e]">
                          {block.data.items?.map((item, idx) => (
                            <tr key={idx}>
                              <td className="py-2.5 pr-2">
                                <input
                                  type="text"
                                  disabled={isPreview}
                                  value={item.desc}
                                  onChange={(e) => {
                                    const updated = [...block.data.items];
                                    updated[idx].desc = e.target.value;
                                    updateBlockData(block.id, 'items', updated);
                                  }}
                                  className="w-full bg-transparent text-xs text-white focus:outline-none"
                                />
                              </td>
                              <td className="py-2.5 text-center">
                                <input
                                  type="number"
                                  disabled={isPreview}
                                  value={item.qty}
                                  onChange={(e) => {
                                    const updated = [...block.data.items];
                                    updated[idx].qty = parseFloat(e.target.value) || 0;
                                    updateBlockData(block.id, 'items', updated);
                                  }}
                                  className="w-16 bg-[#1a1a24] border border-[#1e1e2e] rounded px-1.5 py-0.5 text-center text-xs text-white focus:outline-none"
                                />
                              </td>
                              <td className="py-2.5 text-right">
                                <input
                                  type="number"
                                  disabled={isPreview}
                                  value={item.val}
                                  onChange={(e) => {
                                    const updated = [...block.data.items];
                                    updated[idx].val = parseFloat(e.target.value) || 0;
                                    updateBlockData(block.id, 'items', updated);
                                  }}
                                  className="w-24 bg-[#1a1a24] border border-[#1e1e2e] rounded px-1.5 py-0.5 text-right text-xs text-white focus:outline-none"
                                />
                              </td>
                              <td className="py-2.5 text-right font-semibold text-emerald-400 tabular-nums">
                                {formatCurrency((item.qty || 0) * (item.val || 0))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="pt-3 border-t border-[#1e1e2e] flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-wider text-[#555568]">Total Investimento</span>
                      <span className="text-xl font-semibold text-emerald-400 tabular-nums">
                        {formatCurrency(block.data.items?.reduce((acc, i) => acc + ((i.qty || 0) * (i.val || 0)), 0))}
                      </span>
                    </div>
                  </div>
                )}

                {/* ── BLOCO 5: TERMS ── */}
                {block.type === 'terms' && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      disabled={isPreview}
                      value={block.data.heading}
                      onChange={(e) => updateBlockData(block.id, 'heading', e.target.value)}
                      className="w-full bg-transparent text-lg font-semibold text-white tracking-tight focus:outline-none border-b border-transparent focus:border-blue-600"
                    />
                    <textarea
                      disabled={isPreview}
                      value={block.data.content}
                      onChange={(e) => updateBlockData(block.id, 'content', e.target.value)}
                      rows={3}
                      className="w-full bg-transparent text-xs text-[#8888a0] leading-relaxed focus:outline-none border border-transparent focus:border-[#1e1e2e] rounded p-1"
                    />
                  </div>
                )}

                {/* ── BLOCO 6: SIGNATURE ── */}
                {block.type === 'signature' && (
                  <div className="p-6 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] space-y-4">
                    <h4 className="text-sm font-semibold text-white tracking-tight">{block.data.heading}</h4>
                    <p className="text-xs text-[#8888a0]">{block.data.terms}</p>
                    <div className="pt-4 border-t border-dashed border-[#1e1e2e] flex items-center justify-between text-xs text-[#555568]">
                      <span>Carimbo de Aceite Digital PropostaFácil</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium text-[10px] uppercase">
                        Aguardando Assinatura
                      </span>
                    </div>
                  </div>
                )}

              </div>
            ))}

          </div>
        </main>

        {/* ── 4. Right Panel: Build & Tool Drawer (Proposify Style) ── */}
        {!isPreview && (
          <aside className="w-72 border-l border-[#1e1e2e] bg-[#111118] flex flex-col shrink-0">
            <div className="p-4 border-b border-[#1e1e2e] flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#555568]">Build / Ferramentas</span>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleAddBlock('summary')}
                  className="p-3 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] hover:border-blue-600 transition flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer group"
                >
                  <Type className="w-5 h-5 text-blue-400 group-hover:scale-110 transition" />
                  <span className="text-xs font-medium text-white">Texto</span>
                </button>

                <button
                  onClick={() => handleAddBlock('cover')}
                  className="p-3 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] hover:border-blue-600 transition flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer group"
                >
                  <ImageIcon className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
                  <span className="text-xs font-medium text-white">Imagem / Logo</span>
                </button>

                <button
                  onClick={() => handleAddBlock('pricing')}
                  className="p-3 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] hover:border-blue-600 transition flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer group"
                >
                  <DollarSign className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
                  <span className="text-xs font-medium text-white">Tabela Preços</span>
                </button>

                <button
                  onClick={() => handleAddBlock('signature')}
                  className="p-3 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] hover:border-blue-600 transition flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer group"
                >
                  <CheckCircle2 className="w-5 h-5 text-purple-400 group-hover:scale-110 transition" />
                  <span className="text-xs font-medium text-white">Assinatura</span>
                </button>
              </div>

              {/* Botão de Preenchimento por IA Copilot */}
              <div className="pt-4 border-t border-[#1e1e2e]">
                <button
                  onClick={() => {
                    toast.info('IA gerando e otimizando o escopo comercial...');
                    setTimeout(() => {
                      setBlocks(prev => prev.map(b => {
                        if (b.type === 'scope') {
                          return {
                            ...b,
                            data: {
                              ...b.data,
                              heading: 'Escopo Otimizado por Inteligência Artificial',
                              items: [
                                'Diagnóstico de Arquitetura Comercial e Levantamento de Requisitos',
                                'Configuração de Editor Canvas Drag & Drop para Propostas',
                                'Treinamento e Capacitação da Equipe Comercial',
                                'Monitoramento e Rastreamento de Aceites Digitais'
                              ]
                            }
                          };
                        }
                        return b;
                      }));
                      toast.success('Escopo preenchido com IA!');
                    }, 1000);
                  }}
                  className="w-full py-2.5 px-3 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white transition flex items-center justify-center gap-2 text-xs font-medium cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Assistente IA Copilot</span>
                </button>
              </div>
            </div>
          </aside>
        )}

      </div>
    </div>
  );
}

export default ProposalCanvasEditor;
