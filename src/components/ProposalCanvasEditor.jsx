import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Trash2, Layers, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { fetchApi } from '@/api/supabaseClient';
import { CanvasHeader } from './canvas/CanvasHeader';
import { LeftSidebar } from './canvas/LeftSidebar';
import { RightInspector } from './canvas/RightInspector';
import { FreeCanvasStage } from './canvas/FreeCanvasStage';
import { getTheme } from './canvas/ThemeEngine';

// Estrutura Padrão Inicial em Folhas A4 Perfeitas (Dimensão 800x1130px por folha)
const INITIAL_PAGES = [
  {
    id: 'page-1',
    title: 'Folha A4 #1 — Capa & Resumo',
    elements: [
      {
        id: 'el-cover-card',
        type: 'rect',
        x: 40,
        y: 40,
        width: 720,
        height: 320,
        rotation: 0,
        zIndex: 1,
        style: { fill: '#1b2a4a', stroke: '#1e3a8a', strokeWidth: 1, cornerRadius: 16, opacity: 1 }
      },
      {
        id: 'el-cover-title',
        type: 'text',
        x: 80,
        y: 100,
        width: 640,
        rotation: 0,
        zIndex: 10,
        content: 'PROPOSTA COMERCIAL SAAS',
        style: { fontSize: 34, fontFamily: 'Inter', fontStyle: 'bold', fill: '#ffffff', align: 'left', opacity: 1 }
      },
      {
        id: 'el-cover-subtitle',
        type: 'text',
        x: 80,
        y: 175,
        width: 640,
        rotation: 0,
        zIndex: 10,
        content: 'Preparado para ACME Corporation',
        style: { fontSize: 20, fontFamily: 'Inter', fontStyle: 'bold', fill: '#34d399', align: 'left', opacity: 1 }
      },
      {
        id: 'el-cover-footer',
        type: 'text',
        x: 80,
        y: 250,
        width: 640,
        rotation: 0,
        zIndex: 10,
        content: 'PropostaFácil Tech • Validade de 30 dias',
        style: { fontSize: 14, fontFamily: 'Inter', fontStyle: 'normal', fill: '#94a3b8', align: 'left', opacity: 1 }
      },
      {
        id: 'el-summary-card',
        type: 'rect',
        x: 40,
        y: 400,
        width: 720,
        height: 320,
        rotation: 0,
        zIndex: 1,
        style: { fill: '#111118', stroke: '#1e1e2e', strokeWidth: 1, cornerRadius: 12, opacity: 1 }
      },
      {
        id: 'el-summary-title',
        type: 'text',
        x: 70,
        y: 430,
        width: 660,
        rotation: 0,
        zIndex: 10,
        content: '1. Resumo Executivo dos Serviços',
        style: { fontSize: 22, fontFamily: 'Inter', fontStyle: 'bold', fill: '#ffffff', align: 'left', opacity: 1 }
      },
      {
        id: 'el-summary-body',
        type: 'text',
        x: 70,
        y: 490,
        width: 660,
        rotation: 0,
        zIndex: 10,
        content: 'Apresentamos a solução completa de automação comercial e gestão de propostas digitais B2B. Nossa plataforma disponibiliza o editor visual livre estilo Canva para personalização ilimitada em folhas A4 padronizadas.',
        style: { fontSize: 16, fontFamily: 'Inter', fontStyle: 'normal', fill: '#cbd5e1', align: 'left', opacity: 1 }
      }
    ]
  },
  {
    id: 'page-2',
    title: 'Folha A4 #2 — Investimento & Escopo',
    elements: [
      {
        id: 'el-price-card',
        type: 'rect',
        x: 40,
        y: 40,
        width: 720,
        height: 360,
        rotation: 0,
        zIndex: 1,
        style: { fill: '#111118', stroke: '#1e1e2e', strokeWidth: 1, cornerRadius: 12, opacity: 1 }
      },
      {
        id: 'el-price-title',
        type: 'text',
        x: 70,
        y: 70,
        width: 660,
        rotation: 0,
        zIndex: 10,
        content: '2. Tabela de Investimento Comercial',
        style: { fontSize: 22, fontFamily: 'Inter', fontStyle: 'bold', fill: '#ffffff', align: 'left', opacity: 1 }
      },
      {
        id: 'el-price-body',
        type: 'text',
        x: 70,
        y: 130,
        width: 660,
        rotation: 0,
        zIndex: 10,
        content: 'Licenciamento Anual da Plataforma SaaS: R$ 18.500,00\nSetup Inicial & Implantação: R$ 4.500,00\nTreinamento de Equipe & Onboarding: R$ 3.300,00\n----------------------------------------------------\nValor Total Investimento: R$ 26.300,00',
        style: { fontSize: 17, fontFamily: 'Inter', fontStyle: 'bold', fill: '#34d399', align: 'left', opacity: 1 }
      },
      {
        id: 'el-scope-card',
        type: 'rect',
        x: 40,
        y: 440,
        width: 720,
        height: 360,
        rotation: 0,
        zIndex: 1,
        style: { fill: '#111118', stroke: '#1e1e2e', strokeWidth: 1, cornerRadius: 12, opacity: 1 }
      },
      {
        id: 'el-scope-title',
        type: 'text',
        x: 70,
        y: 470,
        width: 660,
        rotation: 0,
        zIndex: 10,
        content: '3. Escopo de Entregáveis & Aceite',
        style: { fontSize: 22, fontFamily: 'Inter', fontStyle: 'bold', fill: '#ffffff', align: 'left', opacity: 1 }
      },
      {
        id: 'el-scope-body',
        type: 'text',
        x: 70,
        y: 530,
        width: 660,
        rotation: 0,
        zIndex: 10,
        content: '✓ Mapeamento Comercial & Configuração de Templates A4\n✓ Treinamento e Onboarding do Time de Vendas\n✓ Suporte Técnico Dedicado 24/7 com SLA de 2h\n✓ Aceite Digital com Registro Jurídico de IP e Data',
        style: { fontSize: 16, fontFamily: 'Inter', fontStyle: 'normal', fill: '#cbd5e1', align: 'left', opacity: 1 }
      }
    ]
  }
];

export function ProposalCanvasEditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: editId } = useParams();

  // Estados Principais das Folhas A4 Soltas
  const [proposalTitle, setProposalTitle] = useState('Projeto de Proposta Comercial');
  const [clientName, setClientName] = useState('ACME Corporation');
  const [clientEmail, setClientEmail] = useState('roberto@acme.com');
  const [activeTheme, setActiveTheme] = useState('dark-executive');
  
  const [pages, setPages] = useState(INITIAL_PAGES);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState(null);

  // Histórico Undo / Redo
  const [history, setHistory] = useState([INITIAL_PAGES]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Configurações de Palco & Zoom
  const [viewportMode, setViewportMode] = useState('desktop');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const currentTheme = getTheme(activeTheme);
  const activePage = pages[activePageIndex] || pages[0];
  const selectedElement = activePage?.elements?.find(el => el.id === selectedElementId);

  // Atualizar histórico de páginas
  const updatePagesWithHistory = useCallback((newPages) => {
    setPages(newPages);
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, newPages]);
    setHistoryIndex(newHistory.length);
  }, [history, historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setPages(history[prevIndex]);
      toast.info('Ação desfeita (Undo)');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setPages(history[nextIndex]);
      toast.info('Ação refeita (Redo)');
    }
  };

  // Carregar dados de proposta existente no MariaDB
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
      if (propostaExistente.canvas_data?.pages) {
        setPages(propostaExistente.canvas_data.pages);
        setHistory([propostaExistente.canvas_data.pages]);
        setHistoryIndex(0);
        if (propostaExistente.canvas_data.theme) setActiveTheme(propostaExistente.canvas_data.theme);
      }
    }
  }, [propostaExistente]);

  // Carregar template vindo da rota /templates
  useEffect(() => {
    if (location.state?.template) {
      const template = location.state.template;
      setProposalTitle(template.titulo || 'Proposta de Modelo');
      if (template.canvas_data?.pages && template.canvas_data.pages.length > 0) {
        setPages(template.canvas_data.pages);
        setHistory([template.canvas_data.pages]);
        setHistoryIndex(0);
      }
      toast.success(`Modelo "${template.titulo}" carregado!`);
    }
  }, [location.state]);

  // Adicionar Novo Elemento em Posição Livre (x, y) na Folha A4 Atual
  const handleAddElement = (type, customData = {}) => {
    let targetPageIndex = activePageIndex;
    let targetPage = pages[targetPageIndex] || pages[0];
    
    // Verificar se a folha A4 atual já possui elementos na parte inferior (y > 900px)
    const currentElements = targetPage.elements || [];
    const maxElementY = currentElements.length > 0 ? Math.max(...currentElements.map(e => (e.y || 0) + (e.height || 50))) : 0;

    // Se o elemento exceder a altura padrão da folha A4 (1130px), criar uma nova folha A4 automaticamente
    if (maxElementY > 950 && !customData.y) {
      const newPageNum = pages.length + 1;
      const newPage = {
        id: `page-${Date.now()}`,
        title: `Folha A4 #${newPageNum}`,
        elements: []
      };
      const newPages = [...pages, newPage];
      targetPageIndex = newPages.length - 1;
      setPages(newPages);
      setActivePageIndex(targetPageIndex);
      toast.info(`Folha A4 #${newPageNum} criada automaticamente para manter a proporção da proposta!`);
      targetPage = newPage;
    }

    const newId = `el-${Date.now()}`;
    const pageEls = targetPage.elements || [];
    const maxZ = pageEls.length > 0 ? Math.max(...pageEls.map(e => e.zIndex || 0)) : 0;

    const newElement = {
      id: newId,
      type,
      x: customData.x || 60,
      y: customData.y || 60,
      width: customData.width || (type === 'text' ? 400 : type === 'image' ? 300 : 200),
      height: customData.height || (type === 'rect' ? 150 : 150),
      rotation: 0,
      zIndex: maxZ + 1,
      content: customData.content || (type === 'text' ? 'Novo Texto Solto' : ''),
      imageUrl: customData.imageUrl || '',
      style: {
        fontSize: customData.style?.fontSize || 18,
        fontFamily: 'Inter, sans-serif',
        fill: customData.style?.fill || (type === 'rect' ? '#111118' : '#ffffff'),
        stroke: customData.style?.stroke || (type === 'rect' ? '#1e1e2e' : 'transparent'),
        strokeWidth: 1,
        cornerRadius: customData.style?.cornerRadius || 8,
        fontStyle: customData.style?.fontStyle || 'normal',
        align: 'left',
        opacity: 1
      }
    };

    const updatedPages = pages.map((page, idx) => {
      if (idx === targetPageIndex) {
        return { ...page, elements: [...page.elements, newElement] };
      }
      return page;
    });

    updatePagesWithHistory(updatedPages);
    setSelectedElementId(newId);
    toast.success('Elemento adicionado na Folha A4!');
  };

  // Atualizar Propriedades de um Elemento Solto
  const handleUpdateElement = (updatedElement) => {
    const updatedPages = pages.map((page, idx) => {
      if (idx === activePageIndex) {
        return {
          ...page,
          elements: page.elements.map(el => el.id === updatedElement.id ? updatedElement : el)
        };
      }
      return page;
    });
    setPages(updatedPages);
  };

  // Excluir Elemento Selecionado
  const handleDeleteElement = (elementId) => {
    const updatedPages = pages.map((page, idx) => {
      if (idx === activePageIndex) {
        return {
          ...page,
          elements: page.elements.filter(el => el.id !== elementId)
        };
      }
      return page;
    });
    updatePagesWithHistory(updatedPages);
    setSelectedElementId(null);
    toast.success('Elemento removido!');
  };

  // Duplicar Elemento Selecionado
  const handleDuplicateElement = (elementId) => {
    const el = activePage.elements.find(e => e.id === elementId);
    if (!el) return;
    const duplicated = {
      ...el,
      id: `el-${Date.now()}`,
      x: el.x + 20,
      y: el.y + 20,
      zIndex: (el.zIndex || 0) + 1
    };
    const updatedPages = pages.map((page, idx) => {
      if (idx === activePageIndex) {
        return { ...page, elements: [...page.elements, duplicated] };
      }
      return page;
    });
    updatePagesWithHistory(updatedPages);
    setSelectedElementId(duplicated.id);
    toast.success('Elemento duplicado!');
  };

  // Gerenciamento de Camadas (z-index)
  const handleBringForward = (elementId) => {
    const updatedPages = pages.map((page, idx) => {
      if (idx === activePageIndex) {
        return {
          ...page,
          elements: page.elements.map(el => el.id === elementId ? { ...el, zIndex: (el.zIndex || 0) + 1 } : el)
        };
      }
      return page;
    });
    setPages(updatedPages);
  };

  const handleSendBackward = (elementId) => {
    const updatedPages = pages.map((page, idx) => {
      if (idx === activePageIndex) {
        return {
          ...page,
          elements: page.elements.map(el => el.id === elementId ? { ...el, zIndex: Math.max(0, (el.zIndex || 0) - 1) } : el)
        };
      }
      return page;
    });
    setPages(updatedPages);
  };

  const handleBringToFront = (elementId) => {
    const maxZ = Math.max(...activePage.elements.map(e => e.zIndex || 0), 0);
    const updatedPages = pages.map((page, idx) => {
      if (idx === activePageIndex) {
        return {
          ...page,
          elements: page.elements.map(el => el.id === elementId ? { ...el, zIndex: maxZ + 5 } : el)
        };
      }
      return page;
    });
    setPages(updatedPages);
  };

  const handleSendToBack = (elementId) => {
    const updatedPages = pages.map((page, idx) => {
      if (idx === activePageIndex) {
        return {
          ...page,
          elements: page.elements.map(el => el.id === elementId ? { ...el, zIndex: 0 } : el)
        };
      }
      return page;
    });
    setPages(updatedPages);
  };

  // Adicionar / Excluir Páginas A4
  const handleAddPage = () => {
    const newPageNum = pages.length + 1;
    const newPage = {
      id: `page-${Date.now()}`,
      title: `Folha A4 #${newPageNum}`,
      elements: []
    };
    const updated = [...pages, newPage];
    updatePagesWithHistory(updated);
    setActivePageIndex(updated.length - 1);
    toast.success(`Folha A4 #${newPageNum} adicionada ao documento!`);
  };

  const handleDeletePage = (pageIdx) => {
    if (pages.length <= 1) return;
    const updated = pages.filter((_, idx) => idx !== pageIdx);
    updatePagesWithHistory(updated);
    setActivePageIndex(Math.max(0, pageIdx - 1));
    toast.success('Folha A4 removida!');
  };

  // Salvar Proposta no MariaDB
  const handleSaveProposal = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Gravando proposta no banco de dados MariaDB...');

    try {
      const canvasPayload = {
        theme: activeTheme,
        pages,
        updatedAt: new Date().toISOString()
      };

      const payload = {
        numero_proposta: editId ? proposalTitle.replace('Proposta ', '') : `PROP-${Math.floor(100000 + Math.random() * 900000)}`,
        nome_cliente: clientName,
        email_cliente: clientEmail,
        servico_prestado: 'Serviços Comerciais Especiais',
        valor_total: 26300,
        status: 'rascunho',
        canvas_data: canvasPayload
      };

      if (editId) {
        await fetchApi(`/api/propostas/${editId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await fetchApi('/api/propostas', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }

      toast.success('Proposta salva em folhas A4 no MariaDB!', { id: toastId });
      navigate('/propostas');
    } catch (err) {
      toast.error(err.message || 'Erro ao gravar proposta.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
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
        calculateTotalValue={() => 26300}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* ── 2. Sidebar Esquerda ── */}
        {!isPreview && (
          <LeftSidebar
            pages={pages}
            activePageIndex={activePageIndex}
            setActivePageIndex={setActivePageIndex}
            onAddPage={handleAddPage}
            onDeletePage={handleDeletePage}
            onAddElement={handleAddElement}
            activeTheme={activeTheme}
            setActiveTheme={setActiveTheme}
          />
        )}

        {/* ── 3. Palco Gráfico em Folhas A4 Completas ── */}
        <main className="flex-1 bg-[#050508] overflow-y-auto p-6 md:p-10 flex flex-col items-center justify-start relative space-y-12 transition-all duration-300">
          
          {/* Seletor Rápido de Folhas A4 */}
          <div className="sticky top-0 z-30 bg-[#0a0a0f]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#1e1e2e] shadow-xl flex items-center gap-2">
            <span className="text-xs text-[#8888a0] font-medium mr-1">Folhas A4:</span>
            {pages.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  setActivePageIndex(idx);
                  const el = document.getElementById(`a4-sheet-${idx}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                  activePageIndex === idx
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-[#111118] text-[#8888a0] hover:text-white border border-[#1e1e2e]'
                }`}
              >
                {p.title || `Folha #${idx + 1}`}
              </button>
            ))}
            <button
              onClick={handleAddPage}
              className="p-1 rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition flex items-center gap-1 text-xs px-2.5 ml-2"
              title="Adicionar Nova Folha A4"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Folha A4</span>
            </button>
          </div>

          {/* Renderização Sequencial de Cada Folha A4 Completa */}
          {pages.map((page, idx) => (
            <div
              key={page.id}
              id={`a4-sheet-${idx}`}
              onClick={() => setActivePageIndex(idx)}
              className={`flex flex-col items-center transition-all duration-300 ${
                activePageIndex === idx ? 'ring-2 ring-blue-500/50 rounded-xl p-2 bg-blue-500/5' : 'opacity-90 hover:opacity-100'
              }`}
            >
              {/* Header da Folha A4 */}
              <div className="w-[800px] flex items-center justify-between px-2 mb-2">
                <span className="text-xs font-bold text-[#8888a0] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>{page.title || `Folha A4 #${idx + 1}`}</span>
                  <span className="text-[10px] text-[#555568] font-normal">(800 x 1130px)</span>
                </span>
                {pages.length > 1 && (
                  <button
                    onClick={() => handleDeletePage(idx)}
                    className="text-[11px] text-rose-400 hover:text-rose-300 transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Excluir Folha</span>
                  </button>
                )}
              </div>

              {/* Folha A4 Gráfica (Stage Konva 800x1130px) */}
              <FreeCanvasStage
                width={800}
                height={1130}
                elements={page.elements || []}
                selectedId={activePageIndex === idx ? selectedElementId : null}
                onSelectElement={(elId) => {
                  setActivePageIndex(idx);
                  setSelectedElementId(elId);
                }}
                onChangeElement={handleUpdateElement}
                backgroundColor={currentTheme.bg}
                zoomLevel={zoomLevel}
              />
            </div>
          ))}

          {/* Botão de Rodapé para Adicionar Mais Folhas A4 */}
          <div className="pt-6 pb-12 flex flex-col items-center space-y-2">
            <button
              onClick={handleAddPage}
              className="px-6 py-3 rounded-xl border border-dashed border-[#1e1e2e] hover:border-blue-500 bg-[#111118] hover:bg-[#1a1a24] text-sm font-semibold text-white transition flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4 text-blue-400" />
              <span>+ Adicionar Nova Folha A4 ao Documento</span>
            </button>
            <span className="text-xs text-[#8888a0]">Cada folha A4 mantém o padrão de proporção gráfica corporativa.</span>
          </div>
        </main>

        {/* ── 4. Inspetor de Elementos Direita ── */}
        {!isPreview && (
          <RightInspector
            selectedElement={selectedElement}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
            onDuplicateElement={handleDuplicateElement}
            onBringForward={handleBringForward}
            onSendBackward={handleSendBackward}
            onBringToFront={handleBringToFront}
            onSendToBack={handleSendToBack}
          />
        )}
      </div>
    </div>
  );
}
