import React, { useState } from 'react';
import {
  Layers, Palette, Sparkles, Plus, Trash2, ArrowUp, ArrowDown, Check,
  Copy, Image as ImageIcon, Layout, Type, FileText, DollarSign, ShieldCheck,
  CheckCircle2, Clock, Users, Star, Sliders, Hash, Square, Circle as CircleIcon
} from 'lucide-react';
import { THEMES } from './ThemeEngine';
import { DEFAULT_VARIABLES } from './VariableEngine';
import { toast } from 'sonner';

export function LeftSidebar({
  pages = [],
  activePageIndex = 0,
  setActivePageIndex,
  onAddPage,
  onDeletePage,
  onAddElement,
  activeTheme,
  setActiveTheme
}) {
  const [activeTab, setActiveTab] = useState('elements'); // 'elements' | 'pages' | 'media' | 'brand' | 'variables'

  const handleCopyVariable = (varKey) => {
    const varTag = `{{${varKey}}}`;
    navigator.clipboard.writeText(varTag);
    toast.success(`Variável ${varTag} copiada para a área de transferência!`);
  };

  return (
    <aside className="w-72 bg-[#111118] border-r border-[#1e1e2e] flex flex-col shrink-0 select-none z-20">
      {/* Header das Abas */}
      <div className="grid grid-cols-5 border-b border-[#1e1e2e] bg-[#0a0a0f] p-1 gap-1">
        <button
          onClick={() => setActiveTab('elements')}
          className={`py-2 px-1 text-[10px] font-medium rounded transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'elements' ? 'bg-[#111118] text-blue-400 border border-blue-500/30' : 'text-[#8888a0] hover:text-white'
          }`}
          title="Adicionar Elementos Soltos"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="truncate">Elementos</span>
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`py-2 px-1 text-[10px] font-medium rounded transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'pages' ? 'bg-[#111118] text-blue-400 border border-blue-500/30' : 'text-[#8888a0] hover:text-white'
          }`}
          title="Páginas do Documento"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="truncate">Páginas</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`py-2 px-1 text-[10px] font-medium rounded transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'media' ? 'bg-[#111118] text-blue-400 border border-blue-500/30' : 'text-[#8888a0] hover:text-white'
          }`}
          title="Galeria de Fotos Corporativas"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span className="truncate">Fotos</span>
        </button>

        <button
          onClick={() => setActiveTab('brand')}
          className={`py-2 px-1 text-[10px] font-medium rounded transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'brand' ? 'bg-[#111118] text-blue-400 border border-blue-500/30' : 'text-[#8888a0] hover:text-white'
          }`}
          title="Temas & Cores"
        >
          <Palette className="w-3.5 h-3.5" />
          <span className="truncate">Temas</span>
        </button>

        <button
          onClick={() => setActiveTab('variables')}
          className={`py-2 px-1 text-[10px] font-medium rounded transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'variables' ? 'bg-[#111118] text-blue-400 border border-blue-500/30' : 'text-[#8888a0] hover:text-white'
          }`}
          title="Variáveis Dinâmicas"
        >
          <Hash className="w-3.5 h-3.5" />
          <span className="truncate">Variáveis</span>
        </button>
      </div>

      {/* ── ABA 1: ELEMENTOS SOLTOS ── */}
      {activeTab === 'elements' && (
        <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-medium uppercase tracking-wider text-[#555568]">Adicionar Elementos Soltos</span>
            <p className="text-[11px] text-[#8888a0]">Clique no elemento para inseri-lo em coordenadas livres no Canvas.</p>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] uppercase font-semibold text-[#555568]">Tipografia</span>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => onAddElement('text', { content: 'PROPOSTA COMERCIAL', width: 600, style: { fontSize: 32, fontStyle: 'bold', fill: '#ffffff' } })}
                className="p-3 rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] hover:border-blue-500/60 hover:bg-[#111118] transition flex items-center justify-between text-left group cursor-pointer"
              >
                <div>
                  <h5 className="text-xs font-bold text-white group-hover:text-blue-400">Título Principal</h5>
                  <p className="text-[10px] text-[#8888a0]">Fonte grande 32px</p>
                </div>
                <Type className="w-4 h-4 text-[#555568] group-hover:text-blue-400" />
              </button>

              <button
                onClick={() => onAddElement('text', { content: '1. Resumo Executivo & Objetivos', width: 500, style: { fontSize: 22, fontStyle: 'bold', fill: '#60a5fa' } })}
                className="p-3 rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] hover:border-blue-500/60 hover:bg-[#111118] transition flex items-center justify-between text-left group cursor-pointer"
              >
                <div>
                  <h5 className="text-xs font-bold text-white group-hover:text-blue-400">Subtítulo de Seção</h5>
                  <p className="text-[10px] text-[#8888a0]">Fonte média 22px</p>
                </div>
                <Type className="w-4 h-4 text-[#555568] group-hover:text-blue-400" />
              </button>

              <button
                onClick={() => onAddElement('text', { content: 'Inserir texto explicativo aqui...', width: 450, style: { fontSize: 15, fill: '#cbd5e1' } })}
                className="p-3 rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] hover:border-blue-500/60 hover:bg-[#111118] transition flex items-center justify-between text-left group cursor-pointer"
              >
                <div>
                  <h5 className="text-xs font-medium text-white group-hover:text-blue-400">Parágrafo / Corpo de Texto</h5>
                  <p className="text-[10px] text-[#8888a0]">Texto padrão 15px</p>
                </div>
                <FileText className="w-4 h-4 text-[#555568] group-hover:text-blue-400" />
              </button>
            </div>

            <span className="text-[10px] uppercase font-semibold text-[#555568] pt-2 block">Formas & Containers</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onAddElement('rect', { width: 400, height: 200, style: { fill: '#111118', stroke: '#1e1e2e', cornerRadius: 12 } })}
                className="p-3 rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] hover:border-blue-500/60 hover:bg-[#111118] transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
              >
                <Square className="w-5 h-5 text-blue-400" />
                <span className="text-xs text-white font-medium">Container Card</span>
              </button>

              <button
                onClick={() => onAddElement('circle', { width: 120, height: 120, style: { fill: '#2563eb' } })}
                className="p-3 rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] hover:border-blue-500/60 hover:bg-[#111118] transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
              >
                <CircleIcon className="w-5 h-5 text-blue-400" />
                <span className="text-xs text-white font-medium">Círculo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ABA 2: PÁGINAS DO DOCUMENTO ── */}
      {activeTab === 'pages' && (
        <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[#555568]">Páginas do Documento</span>
            <button
              onClick={onAddPage}
              className="p-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium flex items-center gap-1 cursor-pointer px-2"
            >
              <Plus className="w-3 h-3" />
              <span>Nova Página</span>
            </button>
          </div>

          <div className="space-y-2">
            {pages.map((p, idx) => (
              <div
                key={p.id}
                onClick={() => setActivePageIndex(idx)}
                className={`p-3 rounded-lg border transition flex items-center justify-between cursor-pointer ${
                  activePageIndex === idx
                    ? 'bg-blue-600/10 border-blue-500 text-white'
                    : 'bg-[#0a0a0f] border-[#1e1e2e] text-[#8888a0] hover:border-[#2a2a3e] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded bg-[#1a1a24] text-[10px] font-mono flex items-center justify-center text-white">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-medium">{p.title || `Página ${idx + 1}`}</span>
                </div>

                {pages.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePage(idx);
                    }}
                    className="p-1 text-[#555568] hover:text-rose-400 transition"
                    title="Excluir Página"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ABA 3: FOTOS HD ── */}
      {activeTab === 'media' && (
        <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-medium uppercase tracking-wider text-[#555568]">Galeria de Fotos HD</span>
            <p className="text-[11px] text-[#8888a0]">Clique em uma imagem para inseri-la solta no Canvas livre.</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              { titulo: 'Escritório Corporativo Moderno', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', tag: 'Executivo' },
              { titulo: 'Reunião de Diretoria B2B', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80', tag: 'Reunião' },
              { titulo: 'Desenvolvedor & SaaS', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80', tag: 'Tecnologia' },
              { titulo: 'Data Center & Servidores Cloud', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', tag: 'Cloud' }
            ].map((media, idx) => (
              <div
                key={idx}
                className="group relative rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] overflow-hidden hover:border-blue-500/60 transition cursor-pointer"
                onClick={() => {
                  onAddElement('image', { imageUrl: media.url, width: 320, height: 200 });
                  toast.success(`Foto inserida no Canvas!`);
                }}
              >
                <div className="h-28 w-full overflow-hidden bg-[#1a1a24]">
                  <img src={media.url} alt={media.titulo} className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
                <div className="p-2 flex items-center justify-between">
                  <span className="text-[10px] text-white font-medium truncate">{media.titulo}</span>
                  <Plus className="w-3.5 h-3.5 text-blue-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ABA 4: TEMAS ── */}
      {activeTab === 'brand' && (
        <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-medium uppercase tracking-wider text-[#555568]">Estilo & Cores do Documento</span>
            <p className="text-[11px] text-[#8888a0]">Selecione um tema corporativo para alterar as cores de fundo do palco.</p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {Object.values(THEMES).map((theme) => (
              <button
                key={theme.id}
                onClick={() => setActiveTheme(theme.id)}
                className={`p-3 rounded-lg border text-left transition cursor-pointer flex items-center justify-between ${
                  activeTheme === theme.id ? 'bg-blue-600/10 border-blue-500 text-white' : 'bg-[#0a0a0f] border-[#1e1e2e] text-[#8888a0] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: theme.bg }} />
                  <span className="text-xs font-medium">{theme.name}</span>
                </div>
                {activeTheme === theme.id && <Check className="w-4 h-4 text-blue-400" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── ABA 5: VARIÁVEIS ── */}
      {activeTab === 'variables' && (
        <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-medium uppercase tracking-wider text-[#555568]">Variáveis Dinâmicas</span>
            <p className="text-[11px] text-[#8888a0]">Clique para copiar a tag da variável e colar em qualquer texto do Canvas.</p>
          </div>

          <div className="space-y-2">
            {Object.keys(DEFAULT_VARIABLES).map((varKey) => (
              <div
                key={varKey}
                onClick={() => handleCopyVariable(varKey)}
                className="p-2.5 rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] hover:border-blue-500/50 hover:bg-[#111118] transition flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <code className="text-xs font-mono text-blue-400">{`{{${varKey}}}`}</code>
                  <span className="text-[10px] text-[#8888a0] block mt-0.5">{DEFAULT_VARIABLES[varKey]}</span>
                </div>
                <Copy className="w-3.5 h-3.5 text-[#555568] group-hover:text-white" />
              </div>
            ))}
          </div>
        </div>
      )}

    </aside>
  );
}
