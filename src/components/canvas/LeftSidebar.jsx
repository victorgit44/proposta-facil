import React, { useState } from 'react';
import {
  Layers, Palette, Sparkles, Plus, Trash2, ArrowUp, ArrowDown, Check,
  Copy, Image as ImageIcon, Layout, Type, FileText, DollarSign, ShieldCheck,
  CheckCircle2, Clock, Users, Star, Sliders, Hash
} from 'lucide-react';
import { PRESET_CATEGORIES, PRESET_BLOCKS } from './PresetBlocks';
import { THEMES } from './ThemeEngine';
import { DEFAULT_VARIABLES } from './VariableEngine';
import { toast } from 'sonner';

export function LeftSidebar({
  blocks,
  setBlocks,
  activeTheme,
  setActiveTheme,
  onAddBlock,
  onSelectBlock,
  selectedBlockId
}) {
  const [activeTab, setActiveTab] = useState('sections'); // 'sections' | 'library' | 'brand' | 'variables'
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCopyVariable = (varKey) => {
    const varTag = `{{${varKey}}}`;
    navigator.clipboard.writeText(varTag);
    toast.success(`Variável ${varTag} copiada para a área de transferência!`);
  };

  return (
    <aside className="w-72 bg-[#111118] border-r border-[#1e1e2e] flex flex-col shrink-0 select-none z-20">
      {/* Tab Selector Header */}
      <div className="flex items-center border-b border-[#1e1e2e] bg-[#0a0a0f] p-1 gap-1">
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex-1 py-2 text-[11px] font-medium rounded transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'sections' ? 'bg-[#111118] text-white border border-[#1e1e2e]' : 'text-[#8888a0] hover:text-white'
          }`}
          title="Navegador de Seções"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Seções</span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 py-2 text-[11px] font-medium rounded transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'library' ? 'bg-[#111118] text-white border border-[#1e1e2e]' : 'text-[#8888a0] hover:text-white'
          }`}
          title="Biblioteca de Blocos"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Biblioteca</span>
        </button>

        <button
          onClick={() => setActiveTab('brand')}
          className={`flex-1 py-2 text-[11px] font-medium rounded transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'brand' ? 'bg-[#111118] text-white border border-[#1e1e2e]' : 'text-[#8888a0] hover:text-white'
          }`}
          title="Brand Kit & Temas"
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Temas</span>
        </button>

        <button
          onClick={() => setActiveTab('variables')}
          className={`flex-1 py-2 text-[11px] font-medium rounded transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'variables' ? 'bg-[#111118] text-white border border-[#1e1e2e]' : 'text-[#8888a0] hover:text-white'
          }`}
          title="Variáveis Dinâmicas"
        >
          <Hash className="w-3.5 h-3.5" />
          <span>Variáveis</span>
        </button>
      </div>

      {/* ── ABA 1: PÁGINAS & SEÇÕES ── */}
      {activeTab === 'sections' && (
        <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[#555568]">Estrutura do Documento</span>
            <span className="text-[10px] font-semibold text-[#8888a0] bg-[#1a1a24] px-2 py-0.5 rounded border border-[#1e1e2e]">
              {blocks.length} blocos
            </span>
          </div>

          <div className="space-y-2">
            {blocks.map((block, idx) => {
              const isSelected = selectedBlockId === block.id;
              return (
                <div
                  key={block.id}
                  onClick={() => onSelectBlock(block.id)}
                  className={`p-3 rounded-lg border transition cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? 'bg-blue-600/10 border-blue-600 text-white'
                      : 'bg-[#0a0a0f] border-[#1e1e2e] hover:border-[#2a2a3e] text-[#8888a0] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[10px] font-mono text-[#555568] w-4">{idx + 1}.</span>
                    <span className="text-xs font-medium truncate capitalize">
                      {block.type === 'cover' ? 'Capa Executiva' :
                       block.type === 'summary' ? 'Resumo Executivo' :
                       block.type === 'scope' ? 'Escopo & Entregáveis' :
                       block.type === 'pricing' ? 'Tabela de Investimento' :
                       block.type === 'terms' ? 'Termos & Validade' :
                       block.type === 'signature' ? 'Assinatura Digital' : block.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (idx > 0) {
                          const updated = [...blocks];
                          const temp = updated[idx - 1];
                          updated[idx - 1] = updated[idx];
                          updated[idx] = temp;
                          setBlocks(updated);
                        }
                      }}
                      disabled={idx === 0}
                      className="p-1 text-[#8888a0] hover:text-white disabled:opacity-20"
                      title="Mover para cima"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (idx < blocks.length - 1) {
                          const updated = [...blocks];
                          const temp = updated[idx + 1];
                          updated[idx + 1] = updated[idx];
                          updated[idx] = temp;
                          setBlocks(updated);
                        }
                      }}
                      disabled={idx === blocks.length - 1}
                      className="p-1 text-[#8888a0] hover:text-white disabled:opacity-20"
                      title="Mover para baixo"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setBlocks(blocks.filter(b => b.id !== block.id));
                        toast.success('Bloco removido!');
                      }}
                      className="p-1 text-rose-400 hover:text-rose-300"
                      title="Excluir bloco"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveTab('library')}
              className="w-full py-2.5 rounded-lg border border-dashed border-[#1e1e2e] hover:border-blue-500/60 bg-[#0a0a0f] text-xs font-medium text-[#8888a0] hover:text-blue-400 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Novo Bloco</span>
            </button>
          </div>
        </div>
      )}

      {/* ── ABA 2: BIBLIOTECA DE BLOCOS (PRESETS) ── */}
      {activeTab === 'library' && (
        <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-medium uppercase tracking-wider text-[#555568]">Biblioteca de Componentes</span>
            <p className="text-[11px] text-[#8888a0]">Clique em qualquer bloco para inseri-lo no documento.</p>
          </div>

          {/* Categorias Filter */}
          <div className="flex flex-wrap gap-1.5 pb-2 border-b border-[#1e1e2e]">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded text-[10px] font-medium transition cursor-pointer ${
                selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-[#1a1a24] text-[#8888a0] hover:text-white'
              }`}
            >
              Todos
            </button>
            {PRESET_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2 py-1 rounded text-[10px] font-medium transition cursor-pointer ${
                  selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-[#1a1a24] text-[#8888a0] hover:text-white'
                }`}
              >
                {cat.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Preset Cards Catalog */}
          <div className="space-y-3">
            {PRESET_BLOCKS.filter(b => selectedCategory === 'all' || b.category === selectedCategory).map((preset) => (
              <div
                key={preset.id}
                onClick={() => onAddBlock(preset.type, preset.data)}
                className="p-3 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] hover:border-blue-500/60 transition cursor-pointer group space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white tracking-tight group-hover:text-blue-400 transition">
                    {preset.name}
                  </span>
                  <Plus className="w-3.5 h-3.5 text-[#555568] group-hover:text-blue-400 transition" />
                </div>
                <p className="text-[11px] text-[#8888a0] leading-relaxed">
                  {preset.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ABA 3: BRAND KIT & TEMAS ── */}
      {activeTab === 'brand' && (
        <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-5">
          <div className="space-y-1">
            <span className="text-xs font-medium uppercase tracking-wider text-[#555568]">Brand Kit & Temas Visuais</span>
            <p className="text-[11px] text-[#8888a0]">Aplique estilos globais para transformar instantaneamente a proposta.</p>
          </div>

          <div className="space-y-3">
            {Object.values(THEMES).map((theme) => {
              const isActive = activeTheme === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => {
                    setActiveTheme(theme.id);
                    toast.success(`Tema ${theme.name} aplicado ao documento!`);
                  }}
                  className={`p-3 rounded-lg border transition cursor-pointer space-y-2 ${
                    isActive ? 'bg-blue-600/10 border-blue-600' : 'bg-[#0a0a0f] border-[#1e1e2e] hover:border-[#2a2a3e]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">{theme.name}</span>
                    {isActive && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </div>

                  {/* Palette Preview Bar */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.bg }} title="Fundo Principal" />
                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.cardBg }} title="Superfície Card" />
                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.accent }} title="Cor de Destaque" />
                    <span className="text-[10px] text-[#8888a0] font-mono ml-auto">{theme.fontFamily.split(',')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── ABA 4: VARIÁVEIS NOTION-STYLE ── */}
      {activeTab === 'variables' && (
        <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-medium uppercase tracking-wider text-[#555568]">Variáveis Dinâmicas</span>
            <p className="text-[11px] text-[#8888a0]">Clique no ícone de cópia para colar a variável em qualquer texto do documento.</p>
          </div>

          <div className="space-y-2">
            {Object.entries(DEFAULT_VARIABLES).map(([key, val]) => (
              <div
                key={key}
                className="p-2.5 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] flex items-center justify-between group hover:border-[#2a2a3e] transition"
              >
                <div className="space-y-0.5">
                  <code className="text-xs font-mono text-emerald-400 font-semibold">{`{{${key}}}`}</code>
                  <p className="text-[10px] text-[#8888a0] truncate max-w-[170px]">{val}</p>
                </div>
                <button
                  onClick={() => handleCopyVariable(key)}
                  className="p-1.5 rounded bg-[#1a1a24] text-[#8888a0] group-hover:text-white hover:bg-white/10 transition cursor-pointer"
                  title="Copiar Variável"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
