import React from 'react';
import {
  Sliders, Palette, Type, AlignLeft, AlignCenter, AlignRight, Upload,
  Trash2, Plus, Copy, Lock, Unlock, Eye, Sparkles, Hash, DollarSign
} from 'lucide-react';
import { DEFAULT_VARIABLES } from './VariableEngine';
import { toast } from 'sonner';

export function RightInspector({
  selectedBlock,
  onUpdateBlockData,
  onDeleteBlock,
  onDuplicateBlock,
  onCloseInspector
}) {
  if (!selectedBlock) {
    return (
      <aside className="w-80 bg-[#111118] border-l border-[#1e1e2e] flex flex-col items-center justify-center p-6 text-center shrink-0 select-none">
        <Sliders className="w-8 h-8 text-[#555568] mb-3 animate-pulse" />
        <h4 className="text-xs font-semibold text-white tracking-tight">Inspetor de Propriedades</h4>
        <p className="text-[11px] text-[#8888a0] mt-1 max-w-[200px] leading-relaxed">
          Selecione qualquer bloco no Canvas para personalizar suas propriedades, cores e dados.
        </p>
      </aside>
    );
  }

  const { id, type, data = {} } = selectedBlock;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateBlockData(id, 'logoUrl', reader.result);
        toast.success('Imagem enviada com sucesso!');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside className="w-80 bg-[#111118] border-l border-[#1e1e2e] flex flex-col shrink-0 select-none z-20 overflow-y-auto">
      {/* Header do Inspetor */}
      <div className="p-4 border-b border-[#1e1e2e] flex items-center justify-between bg-[#0a0a0f]">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold text-white capitalize">
            Propriedades: {type}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDuplicateBlock(id)}
            className="p-1.5 rounded bg-[#1a1a24] text-[#8888a0] hover:text-white border border-[#1e1e2e] transition"
            title="Duplicar Bloco (Ctrl+D)"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteBlock(id)}
            className="p-1.5 rounded bg-[#1a1a24] text-rose-400 hover:bg-rose-500/10 border border-[#1e1e2e] transition"
            title="Excluir Bloco (Delete)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">

        {/* ── PROPRIEDADES DO BLOCO COVER ── */}
        {type === 'cover' && (
          <div className="space-y-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#555568]">Configuração da Capa</span>

            {/* Tema da Capa */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#8888a0]">Estilo do Fundo / Gradiente:</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'blue', color: 'bg-blue-600', name: 'Azul' },
                  { id: 'purple', color: 'bg-purple-600', name: 'Roxo' },
                  { id: 'emerald', color: 'bg-emerald-600', name: 'Verde' },
                  { id: 'slate', color: 'bg-slate-700', name: 'Cinza' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => onUpdateBlockData(id, 'coverTheme', t.id)}
                    className={`h-8 rounded ${t.color} border border-white/20 cursor-pointer ${
                      data.coverTheme === t.id ? 'ring-2 ring-white scale-105' : 'opacity-70 hover:opacity-100'
                    }`}
                    title={t.name}
                  />
                ))}
              </div>
            </div>

            {/* Título & Subtítulo */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#8888a0]">Título da Proposta:</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => onUpdateBlockData(id, 'title', e.target.value)}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[#8888a0]">Subtítulo:</label>
              <input
                type="text"
                value={data.subtitle || ''}
                onChange={(e) => onUpdateBlockData(id, 'subtitle', e.target.value)}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Logotipo */}
            <div className="space-y-2 pt-2 border-t border-[#1e1e2e]">
              <label className="text-xs text-[#8888a0] block">Logotipo da Marca:</label>
              <label className="w-full py-2 bg-[#1a1a24] hover:bg-white/10 border border-[#1e1e2e] rounded-lg text-xs font-medium text-[#8888a0] hover:text-white flex items-center justify-center gap-2 cursor-pointer transition">
                <Upload className="w-3.5 h-3.5 text-blue-400" />
                <span>{data.logoUrl ? 'Alterar Logo' : 'Enviar Logo'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              {/* Alinhamento da Logo */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#8888a0]">Alinhamento:</span>
                <div className="flex items-center gap-1 bg-[#0a0a0f] p-0.5 rounded border border-[#1e1e2e]">
                  <button
                    onClick={() => onUpdateBlockData(id, 'logoAlign', 'left')}
                    className={`p-1 rounded text-xs ${data.logoAlign === 'left' || !data.logoAlign ? 'bg-blue-600 text-white' : 'text-[#8888a0]'}`}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onUpdateBlockData(id, 'logoAlign', 'center')}
                    className={`p-1 rounded text-xs ${data.logoAlign === 'center' ? 'bg-blue-600 text-white' : 'text-[#8888a0]'}`}
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onUpdateBlockData(id, 'logoAlign', 'right')}
                    className={`p-1 rounded text-xs ${data.logoAlign === 'right' ? 'bg-blue-600 text-white' : 'text-[#8888a0]'}`}
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Tamanho da Logo */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] text-[#8888a0]">
                  <span>Tamanho da Logo:</span>
                  <span className="font-mono">{data.logoSize || 140}px</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="260"
                  value={data.logoSize || 140}
                  onChange={(e) => onUpdateBlockData(id, 'logoSize', e.target.value)}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── PROPRIEDADES DO BLOCO SUMMARY / TEXT ── */}
        {type === 'summary' && (
          <div className="space-y-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#555568]">Configuração do Texto</span>

            <div className="space-y-1.5">
              <label className="text-xs text-[#8888a0]">Título da Seção:</label>
              <input
                type="text"
                value={data.heading || ''}
                onChange={(e) => onUpdateBlockData(id, 'heading', e.target.value)}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[#8888a0]">Conteúdo:</label>
              <textarea
                rows={6}
                value={data.content || ''}
                onChange={(e) => onUpdateBlockData(id, 'content', e.target.value)}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* ── PROPRIEDADES DO BLOCO SCOPE / CHECKLIST ── */}
        {type === 'scope' && (
          <div className="space-y-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#555568]">Configuração do Escopo</span>

            <div className="space-y-1.5">
              <label className="text-xs text-[#8888a0]">Título da Seção:</label>
              <input
                type="text"
                value={data.heading || ''}
                onChange={(e) => onUpdateBlockData(id, 'heading', e.target.value)}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-[#8888a0]">Tópicos do Escopo:</label>
              {(data.items || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...data.items];
                      newItems[idx] = e.target.value;
                      onUpdateBlockData(id, 'items', newItems);
                    }}
                    className="flex-1 bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => {
                      const newItems = data.items.filter((_, i) => i !== idx);
                      onUpdateBlockData(id, 'items', newItems);
                    }}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <button
                onClick={() => {
                  const newItems = [...(data.items || []), 'Novo entregável do projeto'];
                  onUpdateBlockData(id, 'items', newItems);
                }}
                className="w-full py-2 bg-[#1a1a24] hover:bg-white/10 border border-[#1e1e2e] rounded-lg text-xs font-medium text-[#8888a0] hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Tópico</span>
              </button>
            </div>
          </div>
        )}

        {/* ── PROPRIEDADES DA TABELA DE PREÇOS ── */}
        {type === 'pricing' && (
          <div className="space-y-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#555568]">Configuração Financeira</span>

            <div className="space-y-1.5">
              <label className="text-xs text-[#8888a0]">Título da Seção:</label>
              <input
                type="text"
                value={data.heading || ''}
                onChange={(e) => onUpdateBlockData(id, 'heading', e.target.value)}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs text-[#8888a0]">Itens da Tabela:</label>
              {(data.items || []).map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#555568]">Item #{idx + 1}</span>
                    <button
                      onClick={() => {
                        const newItems = data.items.filter((_, i) => i !== idx);
                        onUpdateBlockData(id, 'items', newItems);
                      }}
                      className="text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Descrição do Serviço"
                    value={item.desc || ''}
                    onChange={(e) => {
                      const newItems = [...data.items];
                      newItems[idx].desc = e.target.value;
                      onUpdateBlockData(id, 'items', newItems);
                    }}
                    className="w-full bg-[#111118] border border-[#1e1e2e] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-[#8888a0]">Qtd:</span>
                      <input
                        type="number"
                        value={item.qty || 1}
                        onChange={(e) => {
                          const newItems = [...data.items];
                          newItems[idx].qty = parseFloat(e.target.value) || 0;
                          onUpdateBlockData(id, 'items', newItems);
                        }}
                        className="w-full bg-[#111118] border border-[#1e1e2e] rounded px-2 py-1 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8888a0]">Valor Unit. (R$):</span>
                      <input
                        type="number"
                        value={item.val || 0}
                        onChange={(e) => {
                          const newItems = [...data.items];
                          newItems[idx].val = parseFloat(e.target.value) || 0;
                          onUpdateBlockData(id, 'items', newItems);
                        }}
                        className="w-full bg-[#111118] border border-[#1e1e2e] rounded px-2 py-1 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  const newItems = [...(data.items || []), { desc: 'Novo Serviço Adicional', qty: 1, val: 1000 }];
                  onUpdateBlockData(id, 'items', newItems);
                }}
                className="w-full py-2 bg-[#1a1a24] hover:bg-white/10 border border-[#1e1e2e] rounded-lg text-xs font-medium text-[#8888a0] hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Item Financeiro</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}
