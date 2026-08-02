import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Undo, Redo, Monitor, Tablet, Smartphone, ZoomIn, ZoomOut,
  Sparkles, Eye, Edit3, Save, HelpCircle, ShieldCheck
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export function CanvasHeader({
  proposalTitle,
  setProposalTitle,
  clientName,
  setClientName,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  viewportMode,
  setViewportMode,
  zoomLevel,
  setZoomLevel,
  isPreview,
  setIsPreview,
  onSave,
  isSaving,
  totalValue,
  onOpenAiModal,
  onToggleHelp
}) {
  return (
    <header className="h-16 bg-[#111118] border-b border-[#1e1e2e] px-4 md:px-6 flex items-center justify-between shrink-0 z-30 select-none">
      {/* ── LADO ESQUERDO: Voltar + Título do Documento ── */}
      <div className="flex items-center gap-3">
        <Link
          to="/propostas"
          className="p-2 rounded-lg bg-[#1a1a24] text-[#8888a0] hover:text-white hover:bg-white/10 border border-[#1e1e2e] transition"
          title="Voltar para Propostas"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="flex flex-col">
          <input
            type="text"
            value={proposalTitle}
            onChange={(e) => setProposalTitle(e.target.value)}
            className="bg-transparent text-sm md:text-base font-semibold text-white tracking-tight focus:outline-none border-b border-transparent focus:border-blue-500 transition"
            placeholder="Nome do Projeto / Proposta"
          />
          <div className="flex items-center gap-2 text-[11px] text-[#8888a0]">
            <span>Cliente:</span>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="bg-transparent text-emerald-400 font-medium focus:outline-none border-b border-transparent focus:border-emerald-500"
              placeholder="Nome do Cliente"
            />
          </div>
        </div>
      </div>

      {/* ── CENTRO: Controles de Histórico, Viewport e Zoom ── */}
      <div className="hidden lg:flex items-center gap-4 bg-[#0a0a0f] p-1.5 rounded-lg border border-[#1e1e2e]">
        {/* Undo / Redo */}
        <div className="flex items-center gap-1 pr-2 border-r border-[#1e1e2e]">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded text-[#8888a0] hover:text-white hover:bg-[#1a1a24] disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
            title="Desfazer (Ctrl+Z)"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded text-[#8888a0] hover:text-white hover:bg-[#1a1a24] disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
            title="Refazer (Ctrl+Y)"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center gap-1 px-2 border-r border-[#1e1e2e]">
          <button
            onClick={() => setViewportMode('desktop')}
            className={`p-1.5 rounded transition ${
              viewportMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-[#8888a0] hover:text-white'
            }`}
            title="Visualização Desktop (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewportMode('tablet')}
            className={`p-1.5 rounded transition ${
              viewportMode === 'tablet' ? 'bg-blue-600 text-white' : 'text-[#8888a0] hover:text-white'
            }`}
            title="Visualização Tablet (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewportMode('mobile')}
            className={`p-1.5 rounded transition ${
              viewportMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-[#8888a0] hover:text-white'
            }`}
            title="Visualização Smartphone (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom Level */}
        <div className="flex items-center gap-2 pl-1">
          <button
            onClick={() => setZoomLevel((prev) => Math.max(50, prev - 10))}
            className="p-1 rounded text-[#8888a0] hover:text-white hover:bg-[#1a1a24]"
            title="Diminuir Zoom"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono text-white w-10 text-center">{zoomLevel}%</span>
          <button
            onClick={() => setZoomLevel((prev) => Math.min(150, prev + 10))}
            className="p-1 rounded text-[#8888a0] hover:text-white hover:bg-[#1a1a24]"
            title="Aumentar Zoom"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── LADO DIREITO: Total + IA + Preview + Salvar ── */}
      <div className="flex items-center gap-3">
        {/* Total Badge */}
        <div className="hidden sm:flex flex-col text-right pr-2 border-r border-[#1e1e2e]">
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#555568]">Total Calculado</span>
          <span className="text-sm font-semibold text-emerald-400 tracking-tight tabular-nums">
            {formatCurrency(totalValue)}
          </span>
        </div>

        {/* Gerador IA */}
        <button
          onClick={onOpenAiModal}
          className="px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-medium transition flex items-center gap-1.5 shadow-md shadow-purple-900/30 cursor-pointer"
          title="Gerar Proposta Completa com IA Copilot"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden md:inline">IA Copilot</span>
        </button>

        {/* Toggle Modo Pré-visualização */}
        <button
          onClick={() => setIsPreview(!isPreview)}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer border ${
            isPreview
              ? 'bg-blue-600 text-white border-blue-500'
              : 'bg-[#1a1a24] text-[#8888a0] hover:text-white border-[#1e1e2e]'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">{isPreview ? 'Modo Edição' : 'Pré-visualizar'}</span>
        </button>

        {/* Salvar e Emitir */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-4 py-2 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Salvando...' : 'Salvar Proposta'}</span>
        </button>
      </div>
    </header>
  );
}
