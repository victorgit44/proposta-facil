import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Plus, Trash2, ArrowUp, ArrowDown, Copy, Eye, Edit3, Save, Sparkles,
  Layout, Type, DollarSign, ShieldCheck, FileText, CheckCircle2,
  Palette, Image as ImageIcon, Sliders, Layers, ChevronRight, Check, X, ArrowLeft,
  GripVertical, HelpCircle, Upload, Play, Move, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';
import { base44, fetchApi } from '@/api/supabaseClient';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/formatters';

import { CanvasHeader } from './canvas/CanvasHeader';
import { LeftSidebar } from './canvas/LeftSidebar';
import { RightInspector } from './canvas/RightInspector';
import { THEMES, getTheme } from './canvas/ThemeEngine';
import { DEFAULT_VARIABLES, interpolateVariables } from './canvas/VariableEngine';
import { PRESET_BLOCKS } from './canvas/PresetBlocks';

export function ProposalCanvasEditor() {
  const navigate = useNavigate();
  const { id: editId } = useParams();

  // Estados Principais do Documento
  const [proposalTitle, setProposalTitle] = useState('Projeto de Proposta Comercial');
  const [clientName, setClientName] = useState('ACME Corporation');
  const [clientEmail, setClientEmail] = useState('roberto@acme.com');
  const [activeTheme, setActiveTheme] = useState('dark-executive');
  const [blocks, setBlocks] = useState(PRESET_BLOCKS.filter(b => b.category === 'cover' || b.category === 'summary' || b.category === 'scope' || b.category === 'pricing' || b.category === 'terms' || b.category === 'signature'));
  const [selectedBlockId, setSelectedBlockId] = useState(null);

  // Histórico para Undo / Redo Stack (Figma Style)
  const [history, setHistory] = useState([blocks]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Estados de Interface & Canvas
  const [viewportMode, setViewportMode] = useState('desktop'); // 'desktop' (100%) | 'tablet' (768px) | 'mobile' (375px)
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Atualizar histórico de alterações
  const updateBlocksWithHistory = useCallback((newBlocks) => {
    setBlocks(newBlocks);
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, newBlocks]);
    setHistoryIndex(newHistory.length);
  }, [history, historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setBlocks(history[prevIndex]);
      toast.info('Ação desfeita (Undo)');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setBlocks(history[nextIndex]);
      toast.info('Ação refeita (Redo)');
    }
  };

  // Carregar dados de proposta existente se estiver editando
  const { data: propostaExistente } = useQuery({
    queryKey: ['proposta', editId],
    queryFn: () => fetchApi(`/api/propostas/${editId}`),
    enabled: !!editId,
  });

  useEffect(() => {
    if (propostaExistente) {
      if (propostaExistente.nome_cliente) setClientName(propostaExistente.nome_cliente);
      if (propostaExistente.email_cliente) setClientEmail(propostaExistente.email_cliente);
      if (propostaExistente.numero_proposta) setProposalTitle(`Proposta ${propostaExistente.numero_proposta}`);
      if (propostaExistente.canvas_data?.blocks) {
        setBlocks(propostaExistente.canvas_data.blocks);
        setHistory([propostaExistente.canvas_data.blocks]);
        setHistoryIndex(0);
        if (propostaExistente.canvas_data.theme) setActiveTheme(propostaExistente.canvas_data.theme);
      }
    }
  }, [propostaExistente]);

  // Atalhos Globais de Teclado (Figma / Canva Style)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedBlockId) {
        e.preventDefault();
        handleDuplicateBlock(selectedBlockId);
      } else if (e.key === 'Delete' && selectedBlockId) {
        e.preventDefault();
        handleDeleteBlock(selectedBlockId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history, selectedBlockId]);

  // Cálculo do Total da Proposta
  const calculateTotalValue = () => {
    return blocks.reduce((acc, b) => {
      if (b.type === 'pricing' && b.data?.items) {
        const blockSum = b.data.items.reduce((sum, item) => sum + ((parseFloat(item.qty) || 0) * (parseFloat(item.val) || 0)), 0);
        return acc + blockSum;
      }
      return acc;
    }, 0);
  };

  // Adicionar Bloco ao Canvas
  const handleAddBlock = (type, customData = null) => {
    const newId = `b-${Date.now()}`;
    let defaultData = customData || {};

    if (!customData) {
      switch (type) {
        case 'cover':
          defaultData = { title: 'PROPOSTA COMERCIAL SAAS', subtitle: `Preparado para ${clientName}`, companyName: 'PropostaFácil Tech', clientName, logoUrl: '', logoAlign: 'left', logoSize: 140, coverTheme: 'blue' };
          break;
        case 'summary':
          defaultData = { heading: 'Resumo Executivo', content: 'Apresentamos o plano estratégico para automação comercial da empresa.' };
          break;
        case 'scope':
          defaultData = { heading: 'Escopo & Entregáveis', items: ['Diagnóstico e Mapeamento Comercial', 'Implantação do Editor Canvas Visual', 'Treinamento e Suporte 24/7'] };
          break;
        case 'pricing':
          defaultData = { heading: 'Investimento Comercial', items: [{ desc: 'Licenciamento Anual da Plataforma SaaS', qty: 1, val: 18500 }] };
          break;
        case 'terms':
          defaultData = { heading: 'Termos & Validade', content: 'Proposta válida por 30 dias. Pagamento 50% no aceite e 50% na conclusão.' };
          break;
        case 'signature':
          defaultData = { heading: 'Aceite Digital da Proposta', terms: 'Ao assinar digitalmente abaixo, o contratante aceita os termos e condições descritos.' };
          break;
        default:
          break;
      }
    }

    const newBlock = { id: newId, type, data: defaultData };
    const updated = [...blocks, newBlock];
    updateBlocksWithHistory(updated);
    setSelectedBlockId(newId);
    toast.success('Bloco inserido no Canvas!');
  };

  // Atualizar Dados de um Bloco
  const handleUpdateBlockData = (blockId, field, value) => {
    const updated = blocks.map(b => {
      if (b.id === blockId) {
        return { ...b, data: { ...b.data, [field]: value } };
      }
      return b;
    });
    updateBlocksWithHistory(updated);
  };

  // Duplicar Bloco
  const handleDuplicateBlock = (blockId) => {
    const index = blocks.findIndex(b => b.id === blockId);
    if (index !== -1) {
      const target = blocks[index];
      const cloned = { ...target, id: `b-${Date.now()}` };
      const updated = [...blocks];
      updated.splice(index + 1, 0, cloned);
      updateBlocksWithHistory(updated);
      setSelectedBlockId(cloned.id);
      toast.success('Bloco duplicado!');
    }
  };

  // Excluir Bloco
  const handleDeleteBlock = (blockId) => {
    const updated = blocks.filter(b => b.id !== blockId);
    updateBlocksWithHistory(updated);
    if (selectedBlockId === blockId) setSelectedBlockId(null);
    toast.success('Bloco removido!');
  };

  // Drag and Drop de Reordenação
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...blocks];
    const itemToMove = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, itemToMove);

    setDraggedIndex(index);
    setBlocks(updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    updateBlocksWithHistory(blocks);
  };

  // Gerador IA Copilot de Estrutura Completa
  const handleGenerateAiProposal = () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);

    setTimeout(() => {
      const generatedBlocks = [
        {
          id: `b-ai-1`,
          type: 'cover',
          data: {
            title: `PROPOSTA COMERCIAL: ${aiPrompt.toUpperCase()}`,
            subtitle: `Desenvolvido sob medida para ${clientName}`,
            companyName: 'PropostaFácil Tech',
            clientName,
            logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
            logoAlign: 'left',
            logoSize: 140,
            coverTheme: 'purple'
          }
        },
        {
          id: `b-ai-2`,
          type: 'summary',
          data: {
            heading: '1. Resumo Executivo da Solução',
            content: `Com base no projeto de ${aiPrompt}, elaboramos uma arquitetura completa de serviços direcionada para alavancar a conversão comercial e os resultados estratégicos da ${clientName}.`
          }
        },
        {
          id: `b-ai-3`,
          type: 'scope',
          data: {
            heading: '2. Escopo de Entregáveis & Soluções',
            items: [
              `Fase 1: Diagnóstico e Mapeamento de Processos para ${aiPrompt}`,
              'Fase 2: Implantação do Sistema e Integração de Ferramentas',
              'Fase 3: Capacitação da Equipe e Testes de Homologação',
              'Fase 4: Lançamento Oficial e Garantia incondicional de 90 dias'
            ]
          }
        },
        {
          id: `b-ai-4`,
          type: 'pricing',
          data: {
            heading: '3. Investimento & Condições Comerciais',
            items: [
              { desc: `Implantação Completa: ${aiPrompt}`, qty: 1, val: 24000 },
              { desc: 'Treinamento Comercial & Suporte Prioritário', qty: 1, val: 5000 }
            ]
          }
        },
        {
          id: `b-ai-5`,
          type: 'signature',
          data: {
            heading: '4. Aceite Digital & Início Imediato',
            terms: 'Ao efetuar a assinatura digital abaixo, as partes concordam com o início imediato das etapas do projeto.'
          }
        }
      ];

      updateBlocksWithHistory(generatedBlocks);
      setIsAiGenerating(false);
      setShowAiModal(false);
      setAiPrompt('');
      toast.success('Proposta completa gerada com sucesso pela IA!');
    }, 1200);
  };

  // Salvar Proposta Comercial no Backend MariaDB
  const handleSaveProposal = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Gravando proposta no banco de dados MariaDB...');

    try {
      const total = calculateTotalValue();
      const canvasPayload = {
        theme: activeTheme,
        blocks,
        updatedAt: new Date().toISOString()
      };

      const payload = {
        numero_proposta: editId ? proposalTitle.replace('Proposta ', '') : `PROP-${Math.floor(100000 + Math.random() * 900000)}`,
        nome_cliente: clientName,
        email_cliente: clientEmail,
        servico_prestado: blocks.find(b => b.type === 'summary' || b.type === 'scope')?.data?.content || 'Serviços Comerciais Especiais',
        valor_total: total,
        status: 'rascunho',
        canvas_data: canvasPayload
      };

      let res;
      if (editId) {
        res = await fetchApi(`/api/propostas/${editId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetchApi('/api/propostas', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }

      toast.success('Proposta salva e emitida com sucesso no MariaDB!', { id: toastId });
      navigate('/propostas');
    } catch (err) {
      toast.error(err.message || 'Erro ao gravar proposta.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);
  const currentTheme = getTheme(activeTheme);

  // Variáveis para interpolação dinâmica
  const varDict = {
    ...DEFAULT_VARIABLES,
    'cliente.nome': clientName,
    'cliente.email': clientEmail,
    'proposta.numero': proposalTitle,
    'valor_total': formatCurrency(calculateTotalValue())
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0a0a0f] overflow-hidden text-white font-sans selection:bg-blue-600 selection:text-white">
      
      {/* ── 1. Header do Canvas ── */}
      <CanvasHeader
        proposalTitle={proposalTitle}
        setProposalTitle={setProposalTitle}
        clientName={clientName}
        setClientName={setClientName}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        viewportMode={viewportMode}
        setViewportMode={setViewportMode}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        isPreview={isPreview}
        setIsPreview={setIsPreview}
        onSave={handleSaveProposal}
        isSaving={isSaving}
        totalValue={calculateTotalValue()}
        onOpenAiModal={() => setShowAiModal(true)}
      />

      {/* ── 2. Área de Trabalho Tripla (Workspace) ── */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Painel Lateral Esquerdo (Navegador, Presets, Brand Kit, Variáveis) */}
        {!isPreview && (
          <LeftSidebar
            blocks={blocks}
            setBlocks={updateBlocksWithHistory}
            activeTheme={activeTheme}
            setActiveTheme={setActiveTheme}
            onAddBlock={handleAddBlock}
            onSelectBlock={setSelectedBlockId}
            selectedBlockId={selectedBlockId}
          />
        )}

        {/* ── 3. Canvas Central Interativo ── */}
        <main
          className="flex-1 bg-[#0a0a0f] overflow-y-auto p-6 md:p-10 flex flex-col items-center relative transition-all duration-300"
          onClick={() => setSelectedBlockId(null)}
        >

          {/* Paper Viewport Container (Desktop / Tablet / Mobile) */}
          <div
            style={{
              width: viewportMode === 'mobile' ? '375px' : viewportMode === 'tablet' ? '768px' : '100%',
              maxWidth: viewportMode === 'desktop' ? '920px' : undefined,
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center'
            }}
            className="bg-[#111118] border border-[#1e1e2e] rounded-lg shadow-2xl min-h-[960px] p-6 md:p-12 space-y-8 transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
          >

            {blocks.map((block, index) => {
              const isSelected = selectedBlockId === block.id;

              return (
                <div
                  key={block.id}
                  draggable={!isPreview}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBlockId(block.id);
                  }}
                  className={`relative group rounded-lg p-6 transition-all duration-200 border cursor-pointer ${
                    !isPreview
                      ? isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500/20 bg-[#0a0a0f]'
                        : 'border-[#1e1e2e] hover:border-blue-500/40 bg-[#0a0a0f]'
                      : 'border-transparent bg-transparent'
                  }`}
                >
                  {/* Controls & Drag Handle */}
                  {!isPreview && (
                    <div className="absolute left-3 top-3 opacity-0 group-hover:opacity-100 transition flex items-center gap-2 z-10">
                      <span className="p-1 rounded bg-[#1a1a24] border border-[#1e1e2e] text-[#8888a0] cursor-grab active:cursor-grabbing" title="Arrastar para reordenar">
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateBlock(block.id);
                        }}
                        className="p-1.5 rounded bg-[#1a1a24] text-[#8888a0] hover:text-white border border-[#1e1e2e] transition"
                        title="Duplicar Bloco"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBlock(block.id);
                        }}
                        className="p-1.5 rounded bg-[#1a1a24] text-rose-400 hover:bg-rose-500/10 border border-[#1e1e2e] transition"
                        title="Excluir Bloco"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* ── BLOCO 1: COVER ── */}
                  {block.type === 'cover' && (
                    <div className={`p-10 md:p-16 rounded-xl border text-white space-y-8 shadow-2xl transition duration-300 ${
                      block.data.coverTheme === 'purple'
                        ? 'bg-gradient-to-br from-[#2e1065] via-[#111118] to-[#0a0a0f] border-purple-900/50'
                        : block.data.coverTheme === 'emerald'
                        ? 'bg-gradient-to-br from-[#064e3b] via-[#111118] to-[#0a0a0f] border-emerald-900/50'
                        : block.data.coverTheme === 'slate'
                        ? 'bg-gradient-to-br from-[#1e293b] via-[#111118] to-[#0a0a0f] border-slate-700/50'
                        : 'bg-gradient-to-br from-[#1b2a4a] via-[#111118] to-[#0a0a0f] border-blue-900/50'
                    }`}>
                      {/* Logo Display */}
                      <div className="border-b border-white/10 pb-8">
                        <div className={`flex flex-col items-${
                          block.data.logoAlign === 'center' ? 'center' : block.data.logoAlign === 'right' ? 'end' : 'start'
                        } space-y-3`}>
                          {block.data.logoUrl ? (
                            <img
                              src={block.data.logoUrl}
                              alt="Logo da Marca"
                              style={{ width: `${block.data.logoSize || 160}px` }}
                              className="object-contain max-h-32 rounded p-1.5 bg-white/5 border border-white/10 shadow-lg"
                            />
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-[#8888a0]">
                              <ImageIcon className="w-6 h-6 text-blue-400" />
                              <span>Logotipo da Marca</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4 pt-4">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                          {interpolateVariables(block.data.title || 'PROPOSTA COMERCIAL', varDict)}
                        </h1>
                        <p className="text-base md:text-xl font-bold text-emerald-400">
                          {interpolateVariables(block.data.subtitle || `Preparado para ${clientName}`, varDict)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ── BLOCO 2: SUMMARY ── */}
                  {block.type === 'summary' && (
                    <div className="space-y-4 p-6 md:p-8 rounded-xl bg-[#111118] border border-[#2a2a3e] shadow-md">
                      <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight border-b border-[#2a2a3e] pb-3">
                        {interpolateVariables(block.data.heading || 'Resumo Executivo', varDict)}
                      </h3>
                      <p className="text-sm md:text-base text-slate-200 leading-relaxed font-normal whitespace-pre-wrap">
                        {interpolateVariables(block.data.content || '', varDict)}
                      </p>
                    </div>
                  )}

                  {/* ── BLOCO 3: SCOPE ── */}
                  {block.type === 'scope' && (
                    <div className="space-y-5 p-6 md:p-8 rounded-xl bg-[#111118] border border-[#2a2a3e] shadow-md">
                      <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight border-b border-[#2a2a3e] pb-3">
                        {interpolateVariables(block.data.heading || 'Escopo & Entregáveis', varDict)}
                      </h3>
                      <ul className="space-y-3.5">
                        {(block.data.items || []).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3.5 text-sm md:text-base text-slate-200 font-medium">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{interpolateVariables(item, varDict)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* ── BLOCO 4: PRICING ── */}
                  {block.type === 'pricing' && (
                    <div className="space-y-6 p-6 md:p-8 rounded-xl bg-[#111118] border border-[#2a2a3e] shadow-md">
                      <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight border-b border-[#2a2a3e] pb-3">
                        {interpolateVariables(block.data.heading || 'Tabela de Investimento', varDict)}
                      </h3>
                      <div className="overflow-x-auto rounded-xl border border-[#2a2a3e]">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-[#1a1a24] text-[#8888a0] uppercase text-xs font-bold tracking-wider">
                            <tr>
                              <th className="p-4">Descrição do Serviço</th>
                              <th className="p-4 text-center w-24">Qtd</th>
                              <th className="p-4 text-right w-36">Valor Unit.</th>
                              <th className="p-4 text-right w-40">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#2a2a3e]">
                            {(block.data.items || []).map((item, i) => (
                              <tr key={i} className="hover:bg-[#1a1a24]/50 transition">
                                <td className="p-4 text-white font-semibold text-sm md:text-base">{item.desc}</td>
                                <td className="p-4 text-center text-slate-300 font-medium">{item.qty}</td>
                                <td className="p-4 text-right text-slate-300 font-medium">{formatCurrency(item.val)}</td>
                                <td className="p-4 text-right text-emerald-400 font-bold text-base md:text-lg">{formatCurrency((item.qty || 0) * (item.val || 0))}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="p-5 rounded-xl bg-[#1a1a24] border border-[#2a2a3e] flex items-center justify-between shadow-sm">
                        <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-[#8888a0]">Total Calculado da Proposta</span>
                        <span className="text-2xl md:text-3xl font-extrabold text-emerald-400 tabular-nums">
                          {formatCurrency((block.data.items || []).reduce((acc, it) => acc + ((it.qty || 0) * (it.val || 0)), 0))}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* ── BLOCO 5: TERMS ── */}
                  {block.type === 'terms' && (
                    <div className="space-y-4 p-6 md:p-8 rounded-xl bg-[#111118] border border-[#2a2a3e] shadow-md">
                      <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight border-b border-[#2a2a3e] pb-3">
                        {interpolateVariables(block.data.heading || 'Termos & Condições', varDict)}
                      </h3>
                      <p className="text-sm md:text-base text-slate-200 leading-relaxed font-normal whitespace-pre-wrap">
                        {interpolateVariables(block.data.content || '', varDict)}
                      </p>
                    </div>
                  )}

                  {/* ── BLOCO 6: SIGNATURE ── */}
                  {block.type === 'signature' && (
                    <div className="space-y-5 p-6 md:p-8 rounded-xl bg-[#111118] border border-[#2a2a3e] shadow-md">
                      <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight border-b border-[#2a2a3e] pb-3">
                        {interpolateVariables(block.data.heading || 'Aceite Digital', varDict)}
                      </h3>
                      <p className="text-sm md:text-base text-slate-300 leading-relaxed">{interpolateVariables(block.data.terms || '', varDict)}</p>
                      <div className="pt-5 border-t border-dashed border-[#2a2a3e] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <span className="text-[#8888a0] font-medium">Validação Jurídica Digital Verificada</span>
                        <span className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs md:text-sm font-bold border border-emerald-500/30 uppercase tracking-wider">
                          Carimbo de Aceite Digital Ativo
                        </span>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}

          </div>
        </main>

        {/* Painel Lateral Direito (Inspetor de Propriedades) */}
        {!isPreview && (
          <RightInspector
            selectedBlock={selectedBlock}
            onUpdateBlockData={handleUpdateBlockData}
            onDeleteBlock={handleDeleteBlock}
            onDuplicateBlock={handleDuplicateBlock}
          />
        )}

      </div>

      {/* ── MODAL IA COPILOT ESTRUTURAL ── */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowAiModal(false)}
              className="absolute top-4 right-4 text-[#8888a0] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white tracking-tight">IA Copilot para Propostas</h3>
                <p className="text-xs text-[#8888a0]">Descreva o objetivo da proposta para gerar a árvore completa de blocos.</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-[#555568] uppercase tracking-wider">Prompt de Geração:</label>
              <textarea
                rows={4}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Exemplo: Quero uma proposta para projeto de software SaaS com escopo, tabela de investimento e termos de pagamento."
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 rounded-lg bg-[#1a1a24] text-[#8888a0] hover:text-white text-xs font-medium transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleGenerateAiProposal}
                disabled={isAiGenerating || !aiPrompt.trim()}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isAiGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Gerando Blocos...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Gerar Proposta Completa</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
