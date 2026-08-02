import React from 'react';
import {
  Sliders, Palette, Type, AlignLeft, AlignCenter, AlignRight, Upload,
  Trash2, Plus, Copy, ArrowUp, ArrowDown, Layers, Move, RotateCw, Eye
} from 'lucide-react';
import { fetchApi } from '@/api/supabaseClient';
import { toast } from 'sonner';

export function RightInspector({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack
}) {
  if (!selectedElement) {
    return (
      <aside className="w-80 bg-[#111118] border-l border-[#1e1e2e] flex flex-col items-center justify-center p-6 text-center shrink-0 select-none">
        <Sliders className="w-8 h-8 text-[#555568] mb-3 animate-pulse" />
        <h4 className="text-xs font-semibold text-white tracking-tight">Inspetor de Elementos</h4>
        <p className="text-[11px] text-[#8888a0] mt-1 max-w-[210px] leading-relaxed">
          Clique em qualquer texto, imagem ou forma no Canvas livre para alterar coordenadas (x,y), cores, tamanhos e camadas.
        </p>
      </aside>
    );
  }

  const { id, type, x, y, width, height, rotation, zIndex = 0, content, imageUrl, style = {} } = selectedElement;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const res = await fetchApi('/api/uploads', {
            method: 'POST',
            body: JSON.stringify({ dataUrl: reader.result })
          });
          if (res.url) {
            onUpdateElement({ ...selectedElement, imageUrl: res.url });
            toast.success('Imagem alterada!');
          }
        } catch (err) {
          onUpdateElement({ ...selectedElement, imageUrl: reader.result });
          toast.success('Imagem carregada!');
        }
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
            Elemento: {type === 'text' ? 'Texto' : type === 'image' ? 'Imagem' : type === 'rect' ? 'Container' : type}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDuplicateElement(id)}
            className="p-1.5 rounded bg-[#1a1a24] text-[#8888a0] hover:text-white border border-[#1e1e2e] transition"
            title="Duplicar Elemento"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteElement(id)}
            className="p-1.5 rounded bg-[#1a1a24] text-rose-400 hover:bg-rose-500/10 border border-[#1e1e2e] transition"
            title="Excluir Elemento"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">

        {/* ── 1. POSICIONAMENTO E DIMENSÕES (X, Y, W, H, ROT) ── */}
        <div className="space-y-3">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#555568] flex items-center gap-1.5">
            <Move className="w-3 h-3 text-blue-400" />
            <span>Posição & Dimensões (x, y)</span>
          </span>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-[#8888a0]">Posição X (px):</label>
              <input
                type="number"
                value={x}
                onChange={(e) => onUpdateElement({ ...selectedElement, x: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-2.5 py-1 text-xs text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[#8888a0]">Posição Y (px):</label>
              <input
                type="number"
                value={y}
                onChange={(e) => onUpdateElement({ ...selectedElement, y: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-2.5 py-1 text-xs text-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-[#8888a0]">Largura (W):</label>
              <input
                type="number"
                value={width || 100}
                onChange={(e) => onUpdateElement({ ...selectedElement, width: Math.max(10, parseInt(e.target.value) || 10) })}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-2.5 py-1 text-xs text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[#8888a0]">Altura (H):</label>
              <input
                type="number"
                value={height || 50}
                onChange={(e) => onUpdateElement({ ...selectedElement, height: Math.max(10, parseInt(e.target.value) || 10) })}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-2.5 py-1 text-xs text-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-[#8888a0] flex items-center gap-1">
              <RotateCw className="w-3 h-3 text-blue-400" />
              <span>Rotação (°):</span>
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={rotation || 0}
              onChange={(e) => onUpdateElement({ ...selectedElement, rotation: parseInt(e.target.value) || 0 })}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Botões de Alinhamento Automático Estilo Canva */}
          <div className="space-y-1 pt-2">
            <label className="text-[10px] text-[#8888a0]">Alinhamento Automático na Folha A4:</label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => onUpdateElement({ ...selectedElement, x: Math.round((800 - (width || 100)) / 2) })}
                className="px-2 py-1 rounded bg-[#0a0a0f] border border-[#1e1e2e] text-[10px] font-medium text-white hover:bg-blue-600/20 hover:border-blue-500/50 transition cursor-pointer"
                title="Centralizar no centro horizontal da folha"
              >
                ↔ Centralizar X
              </button>
              <button
                onClick={() => onUpdateElement({ ...selectedElement, y: Math.round((1130 - (height || 50)) / 2) })}
                className="px-2 py-1 rounded bg-[#0a0a0f] border border-[#1e1e2e] text-[10px] font-medium text-white hover:bg-blue-600/20 hover:border-blue-500/50 transition cursor-pointer"
                title="Centralizar no centro vertical da folha"
              >
                ↕ Centralizar Y
              </button>
              <button
                onClick={() => onUpdateElement({ ...selectedElement, x: 40 })}
                className="px-2 py-1 rounded bg-[#0a0a0f] border border-[#1e1e2e] text-[10px] text-[#8888a0] hover:text-white transition cursor-pointer"
              >
                ← Margem Esquerda
              </button>
              <button
                onClick={() => onUpdateElement({ ...selectedElement, x: 760 - (width || 100) })}
                className="px-2 py-1 rounded bg-[#0a0a0f] border border-[#1e1e2e] text-[10px] text-[#8888a0] hover:text-white transition cursor-pointer"
              >
                Margem Direita →
              </button>
            </div>
          </div>
        </div>

        {/* ── 2. CONTROLE DE CAMADAS (Z-INDEX / SOBREPOSIÇÃO) ── */}
        <div className="space-y-3 pt-3 border-t border-[#1e1e2e]">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#555568] flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-blue-400" />
            <span>Camadas & Sobreposição (z: {zIndex})</span>
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onBringForward(id)}
              className="px-2.5 py-1.5 rounded bg-[#1a1a24] hover:bg-blue-600/20 hover:border-blue-500/50 border border-[#1e1e2e] text-xs font-medium text-white transition flex items-center justify-center gap-1.5"
            >
              <ArrowUp className="w-3.5 h-3.5 text-blue-400" />
              <span>Avançar Camada</span>
            </button>
            <button
              onClick={() => onSendBackward(id)}
              className="px-2.5 py-1.5 rounded bg-[#1a1a24] hover:bg-blue-600/20 hover:border-blue-500/50 border border-[#1e1e2e] text-xs font-medium text-white transition flex items-center justify-center gap-1.5"
            >
              <ArrowDown className="w-3.5 h-3.5 text-[#8888a0]" />
              <span>Recuar Camada</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onBringToFront(id)}
              className="px-2 py-1 rounded bg-[#0a0a0f] border border-[#1e1e2e] text-[11px] text-[#8888a0] hover:text-white transition"
            >
              Trazer ao Topo
            </button>
            <button
              onClick={() => onSendToBack(id)}
              className="px-2 py-1 rounded bg-[#0a0a0f] border border-[#1e1e2e] text-[11px] text-[#8888a0] hover:text-white transition"
            >
              Enviar ao Fundo
            </button>
          </div>
        </div>

        {/* ── 3. EDICAO ESPECÍFICA: TEXTO ── */}
        {type === 'text' && (
          <div className="space-y-4 pt-3 border-t border-[#1e1e2e]">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#555568] flex items-center gap-1.5">
              <Type className="w-3 h-3 text-blue-400" />
              <span>Conteúdo & Tipografia</span>
            </span>

            {/* Conteúdo do Texto */}
            <div className="space-y-1">
              <label className="text-[10px] text-[#8888a0]">Texto do Elemento:</label>
              <textarea
                rows={3}
                value={content || ''}
                onChange={(e) => onUpdateElement({ ...selectedElement, content: e.target.value })}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded p-2 text-xs text-white focus:border-blue-500 outline-none resize-y"
              />
            </div>

            {/* Cor do Texto & Tamanho da Fonte */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-[#8888a0]">Cor do Texto:</label>
                <div className="flex items-center gap-2 bg-[#0a0a0f] border border-[#1e1e2e] rounded p-1">
                  <input
                    type="color"
                    value={style.fill || '#ffffff'}
                    onChange={(e) => onUpdateElement({ ...selectedElement, style: { ...style, fill: e.target.value } })}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-[10px] text-[#8888a0] uppercase font-mono">{style.fill || '#ffffff'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#8888a0]">Tamanho da Fonte:</label>
                <input
                  type="number"
                  value={style.fontSize || 18}
                  onChange={(e) => onUpdateElement({ ...selectedElement, style: { ...style, fontSize: parseInt(e.target.value) || 12 } })}
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-2.5 py-1 text-xs text-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Alinhamento de Texto */}
            <div className="space-y-1">
              <label className="text-[10px] text-[#8888a0]">Alinhamento:</label>
              <div className="flex items-center gap-1 bg-[#0a0a0f] p-1 border border-[#1e1e2e] rounded">
                {[
                  { id: 'left', icon: AlignLeft },
                  { id: 'center', icon: AlignCenter },
                  { id: 'right', icon: AlignRight }
                ].map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onUpdateElement({ ...selectedElement, style: { ...style, align: item.id } })}
                      className={`flex-1 py-1 rounded flex justify-center ${
                        style.align === item.id ? 'bg-blue-600 text-white' : 'text-[#8888a0] hover:text-white'
                      }`}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── 4. EDICAO ESPECÍFICA: IMAGEM ── */}
        {type === 'image' && (
          <div className="space-y-4 pt-3 border-t border-[#1e1e2e]">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#555568]">Configurações da Imagem</span>

            <div className="space-y-1">
              <label className="text-[10px] text-[#8888a0]">Substituir Arquivo de Imagem:</label>
              <label className="w-full py-2 border border-dashed border-[#1e1e2e] hover:border-blue-500 rounded bg-[#0a0a0f] flex items-center justify-center gap-2 cursor-pointer text-xs text-blue-400">
                <Upload className="w-4 h-4" />
                <span>Upload de Imagem</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>
        )}

        {/* ── 5. EDICAO ESPECÍFICA: FORMAS (RECT / CONTAINER) ── */}
        {type === 'rect' && (
          <div className="space-y-4 pt-3 border-t border-[#1e1e2e]">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#555568]">Estilo da Forma / Container</span>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-[#8888a0]">Preenchimento:</label>
                <input
                  type="color"
                  value={style.fill || '#111118'}
                  onChange={(e) => onUpdateElement({ ...selectedElement, style: { ...style, fill: e.target.value } })}
                  className="w-full h-8 rounded border border-[#1e1e2e] bg-[#0a0a0f] cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#8888a0]">Borda:</label>
                <input
                  type="color"
                  value={style.stroke || '#1e1e2e'}
                  onChange={(e) => onUpdateElement({ ...selectedElement, style: { ...style, stroke: e.target.value } })}
                  className="w-full h-8 rounded border border-[#1e1e2e] bg-[#0a0a0f] cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#8888a0]">Arredondamento dos Cantos (px):</label>
              <input
                type="number"
                value={style.cornerRadius || 8}
                onChange={(e) => onUpdateElement({ ...selectedElement, style: { ...style, cornerRadius: parseInt(e.target.value) || 0 } })}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-2.5 py-1 text-xs text-white outline-none"
              />
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}
