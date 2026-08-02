import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Save, Plus, Trash2, Sparkles, Package, BookOpen, FileText, CheckCircle2, Search, X } from 'lucide-react';
import { base44, fetchApi, supabase } from '@/api/supabaseClient';
import { queryClient } from '@/queryClient';
import { toast } from 'sonner';
import { AIChatModal } from '@/components/AIChatModal';
import { formatCurrency } from '@/utils/formatters';

export default function CriarProposta() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Modais de busca rápida
  const [showProductModal, setShowProductModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [libraryTargetField, setLibraryTargetField] = useState('servico_prestado'); // 'servico_prestado' ou 'observacoes'

  const [formData, setFormData] = useState({
    numero_proposta: `PROP-${Date.now().toString().slice(-6)}`,
    nome_cliente: '',
    email_cliente: '',
    telefone_cliente: '',
    empresa_cliente: '',
    servico_prestado: '',
    prazo_entrega: '',
    observacoes: '',
    status: 'rascunho',
    validade: '',
    itens: [{ descricao: '', quantidade: 1, valor_unitario: 0, valor_total: 0 }],
    valor_total: 0
  });

  // Query do Catálogo de Produtos para Importação Rápida
  const { data: produtos = [] } = useQuery({
    queryKey: ['produtos'],
    queryFn: () => fetchApi('/api/produtos'),
  });

  // Query da Biblioteca de Conteúdo para Inserção de Blocos
  const { data: blocos = [] } = useQuery({
    queryKey: ['bibliotecaBlocos'],
    queryFn: () => fetchApi('/api/biblioteca'),
  });

  const handleAIFill = (aiData) => {
    setFormData(prev => ({
      ...prev,
      ...aiData,
      valor_total: aiData.itens 
        ? aiData.itens.reduce((sum, i) => sum + (i.quantidade * i.valor_unitario), 0)
        : prev.valor_total
    }));
    toast.success("Dados preenchidos com IA com sucesso!");
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItens = [...formData.itens];
    newItens[index][field] = field === 'descricao' ? value : parseFloat(value) || 0;
    
    if (field === 'quantidade' || field === 'valor_unitario') {
      newItens[index].valor_total = (newItens[index].quantidade || 0) * (newItens[index].valor_unitario || 0);
    }
    
    const valorTotalGlobal = newItens.reduce((sum, item) => sum + (item.valor_total || 0), 0);
    setFormData(prev => ({ ...prev, itens: newItens, valor_total: valorTotalGlobal }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      itens: [...prev.itens, { descricao: '', quantidade: 1, valor_unitario: 0, valor_total: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.itens.length === 1) return;
    const newItens = formData.itens.filter((_, i) => i !== index);
    const valorTotalGlobal = newItens.reduce((sum, item) => sum + (item.valor_total || 0), 0);
    setFormData(prev => ({ ...prev, itens: newItens, valor_total: valorTotalGlobal }));
  };

  // Importação de Produto do Catálogo
  const handleImportProduct = (prod) => {
    const newItem = {
      descricao: `${prod.nome} - ${prod.descricao || ''}`,
      quantidade: 1,
      valor_unitario: parseFloat(prod.preco_unitario) || 0,
      valor_total: parseFloat(prod.preco_unitario) || 0
    };

    const updatedItens = [...formData.itens, newItem].filter(item => item.descricao.trim() !== '' || item.valor_unitario > 0);
    const valorTotalGlobal = updatedItens.reduce((sum, item) => sum + (item.valor_total || 0), 0);

    setFormData(prev => ({
      ...prev,
      itens: updatedItens.length > 0 ? updatedItens : [newItem],
      valor_total: valorTotalGlobal
    }));

    toast.success(`"${prod.nome}" adicionado ao orçamento da proposta!`);
    setShowProductModal(false);
  };

  // Inserção de Bloco da Biblioteca
  const handleInsertLibraryBlock = (bloco) => {
    setFormData(prev => ({
      ...prev,
      [libraryTargetField]: prev[libraryTargetField]
        ? `${prev[libraryTargetField]}\n\n--- ${bloco.titulo} ---\n${bloco.conteudo}`
        : bloco.conteudo
    }));

    toast.success(`Bloco "${bloco.titulo}" inserido com sucesso!`);
    setShowLibraryModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading('Gerando proposta comercial...');

    try {
      const valorTotal = formData.valor_total || 0;
      
      await base44.entities.Proposta.create({
        ...formData,
        valor_total: valorTotal
      });
      
      const { error: rpcError } = await supabase.rpc('increment_usage', { item_type: 'proposta' });
      if (rpcError) {
        console.error('Erro ao incrementar contador:', rpcError);
      }

      queryClient.invalidateQueries({ queryKey: ['assinatura'] });
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
      
      toast.success('Proposta criada com sucesso!', { id: toastId });
      navigate('/propostas');

    } catch (error) {
      console.error("Erro:", error);
      toast.error('Erro ao criar proposta: ' + (error.message || 'Erro desconhecido'), { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-[#1e1e2e]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/propostas')}
            className="p-2 rounded-lg bg-[#111118] border border-[#1e1e2e] hover:bg-[#1a1a24] text-[#8888a0] hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Nova Proposta Comercial</h1>
            <p className="text-xs text-[#8888a0] mt-0.5">Preencha os dados abaixo para emitir a proposta</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAIModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-xs text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Preencher com IA</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Cliente */}
        <div className="p-6 rounded-lg bg-[#111118] border border-[#1e1e2e] space-y-6">
          <div className="flex items-center gap-3 border-b border-[#1e1e2e] pb-4">
            <div className="w-7 h-7 rounded bg-blue-600/10 text-blue-400 flex items-center justify-center font-semibold text-xs">1</div>
            <h2 className="text-base font-semibold text-white tracking-tight">Informações do Cliente & Proposta</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#555568] mb-1.5">Número da Proposta *</label>
              <input
                type="text"
                required
                value={formData.numero_proposta}
                onChange={(e) => handleChange('numero_proposta', e.target.value)}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3.5 py-2 text-xs text-white placeholder-[#555568] focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#555568] mb-1.5">Status Inicial</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="rascunho">Rascunho</option>
                <option value="enviada">Enviada</option>
                <option value="negociacao">Em Negociação</option>
                <option value="aprovada">Aprovada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#555568] mb-1.5">Nome do Cliente *</label>
              <input
                type="text"
                required
                value={formData.nome_cliente}
                onChange={(e) => handleChange('nome_cliente', e.target.value)}
                placeholder="Ex: Roberto Silva"
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3.5 py-2 text-xs text-white placeholder-[#555568] focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#555568] mb-1.5">E-mail do Cliente</label>
              <input
                type="email"
                value={formData.email_cliente}
                onChange={(e) => handleChange('email_cliente', e.target.value)}
                placeholder="roberto@empresa.com"
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3.5 py-2 text-xs text-white placeholder-[#555568] focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#555568] mb-1.5">Telefone / WhatsApp</label>
              <input
                type="text"
                value={formData.telefone_cliente}
                onChange={(e) => handleChange('telefone_cliente', e.target.value)}
                placeholder="(11) 99999-8888"
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3.5 py-2 text-xs text-white placeholder-[#555568] focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#555568] mb-1.5">Empresa do Cliente</label>
              <input
                type="text"
                value={formData.empresa_cliente}
                onChange={(e) => handleChange('empresa_cliente', e.target.value)}
                placeholder="Ex: Tech Corp Ltda"
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3.5 py-2 text-xs text-white placeholder-[#555568] focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Escopo & Biblioteca Integrada */}
        <div className="p-6 rounded-lg bg-[#111118] border border-[#1e1e2e] space-y-6">
          <div className="flex items-center justify-between border-b border-[#1e1e2e] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded bg-blue-600/10 text-blue-400 flex items-center justify-center font-semibold text-xs">2</div>
              <h2 className="text-base font-semibold text-white tracking-tight">Escopo do Serviço & Prazos</h2>
            </div>

            <button
              type="button"
              onClick={() => { setLibraryTargetField('servico_prestado'); setShowLibraryModal(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a24] hover:bg-white/10 text-[#8888a0] hover:text-white border border-[#1e1e2e] rounded-lg text-xs font-medium transition cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Inserir da Biblioteca</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#555568] mb-1.5">Serviço Prestado / Descrição *</label>
              <textarea
                required
                value={formData.servico_prestado}
                onChange={(e) => handleChange('servico_prestado', e.target.value)}
                rows={4}
                placeholder="Descreva em detalhes a solução comercial oferecida..."
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-3 text-xs text-white placeholder-[#555568] focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#555568] mb-1.5">Prazo de Entrega</label>
                <input
                  type="text"
                  value={formData.prazo_entrega}
                  onChange={(e) => handleChange('prazo_entrega', e.target.value)}
                  placeholder="Ex: 30 dias úteis"
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3.5 py-2 text-xs text-white placeholder-[#555568] focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#555568] mb-1.5">Validade da Proposta</label>
                <input
                  type="date"
                  value={formData.validade}
                  onChange={(e) => handleChange('validade', e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium uppercase tracking-wider text-[#555568]">Observações / Cláusulas Gerais</label>
                <button
                  type="button"
                  onClick={() => { setLibraryTargetField('observacoes'); setShowLibraryModal(true); }}
                  className="text-[11px] font-medium text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Inserir Cláusulas/Garantia</span>
                </button>
              </div>
              <textarea
                value={formData.observacoes}
                onChange={(e) => handleChange('observacoes', e.target.value)}
                rows={3}
                placeholder="Informações sobre pagamento, garantias ou etapas..."
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-3 text-xs text-white placeholder-[#555568] focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Valoração & Catálogo Integrado */}
        <div className="p-6 rounded-lg bg-[#111118] border border-[#1e1e2e] space-y-6">
          <div className="flex items-center justify-between border-b border-[#1e1e2e] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-semibold text-xs">3</div>
              <h2 className="text-base font-semibold text-white tracking-tight">Itens & Orçamento Comercial</h2>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowProductModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a24] hover:bg-white/10 text-[#8888a0] hover:text-white border border-[#1e1e2e] text-xs font-medium rounded-lg transition cursor-pointer"
              >
                <Package className="w-3.5 h-3.5 text-emerald-400" />
                <span>Importar do Catálogo</span>
              </button>

              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Item</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {formData.itens.map((item, index) => (
              <div key={index} className="p-4 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] flex flex-col md:flex-row items-center gap-4">
                <div className="w-full md:flex-1">
                  <label className="block text-[10px] font-medium uppercase tracking-wider text-[#555568] mb-1">Descrição do Item</label>
                  <input
                    type="text"
                    value={item.descricao}
                    onChange={(e) => handleItemChange(index, 'descricao', e.target.value)}
                    placeholder="Ex: Desenvolvimento de Landing Page"
                    className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-3 py-2 text-xs text-white placeholder-[#555568] focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="w-full md:w-28">
                  <label className="block text-[10px] font-medium uppercase tracking-wider text-[#555568] mb-1">Qtd</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantidade}
                    onChange={(e) => handleItemChange(index, 'quantidade', e.target.value)}
                    className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="w-full md:w-36">
                  <label className="block text-[10px] font-medium uppercase tracking-wider text-[#555568] mb-1">Valor Unit. (R$)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.valor_unitario}
                    onChange={(e) => handleItemChange(index, 'valor_unitario', e.target.value)}
                    className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="w-full md:w-36">
                  <label className="block text-[10px] font-medium uppercase tracking-wider text-[#555568] mb-1">Total Item</label>
                  <div className="px-3 py-2 bg-[#111118] border border-[#1e1e2e] rounded-lg text-xs font-semibold text-emerald-400 tabular-nums">
                    R$ {(item.valor_total || 0).toFixed(2)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={formData.itens.length === 1}
                  className="p-2 text-[#555568] hover:text-rose-400 rounded transition disabled:opacity-30 cursor-pointer self-end md:self-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#1e1e2e] flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[#8888a0]">Valor Total Calculado</span>
            <span className="text-2xl font-semibold text-emerald-400 tabular-nums tracking-tight">
              R$ {(formData.valor_total || 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/propostas')}
            className="px-4 py-2 rounded-lg font-medium text-xs text-[#8888a0] hover:text-white bg-[#1a1a24] border border-[#1e1e2e] transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 rounded-lg font-medium text-xs text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Gerando Proposta...' : 'Salvar e Emitir Proposta'}</span>
          </button>
        </div>
      </form>

      {/* Modal Seleção de Produtos do Catálogo */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-lg p-6 max-w-xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1e1e2e] pb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-semibold text-white">Importar do Catálogo de Produtos</h3>
              </div>
              <button onClick={() => setShowProductModal(false)} className="text-[#555568] hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {produtos.length === 0 ? (
                <div className="p-8 text-center text-[#555568] text-xs">
                  Nenhum produto cadastrado no seu catálogo ainda.
                </div>
              ) : (
                produtos.map((p) => (
                  <div key={p.id} className="p-3.5 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] flex items-center justify-between gap-4 hover:border-blue-600 transition">
                    <div>
                      <h4 className="text-xs font-semibold text-white">{p.nome}</h4>
                      <p className="text-[11px] text-[#8888a0] line-clamp-1">{p.descricao || 'Sem descrição'}</p>
                      <span className="text-[10px] text-[#555568] font-medium uppercase">{p.categoria}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-emerald-400 tabular-nums">{formatCurrency(p.preco_unitario)}</span>
                      <button
                        onClick={() => handleImportProduct(p)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium cursor-pointer"
                      >
                        Selecionar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Seleção da Biblioteca de Conteúdo */}
      {showLibraryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-lg p-6 max-w-xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1e1e2e] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-semibold text-white">Inserir Bloco da Biblioteca</h3>
              </div>
              <button onClick={() => setShowLibraryModal(false)} className="text-[#555568] hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {blocos.length === 0 ? (
                <div className="p-8 text-center text-[#555568] text-xs">
                  Nenhum bloco de texto cadastrado na sua biblioteca ainda.
                </div>
              ) : (
                blocos.map((b) => (
                  <div key={b.id} className="p-3.5 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] flex items-center justify-between gap-4 hover:border-amber-500/40 transition">
                    <div className="flex-1 pr-2">
                      <h4 className="text-xs font-semibold text-white">{b.titulo}</h4>
                      <p className="text-[11px] text-[#8888a0] line-clamp-2 mt-0.5">{b.conteudo}</p>
                    </div>
                    <button
                      onClick={() => handleInsertLibraryBlock(b)}
                      className="px-3 py-1 bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 rounded text-xs font-medium cursor-pointer shrink-0"
                    >
                      Inserir
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <AIChatModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onFill={handleAIFill}
        type="proposta"
      />
    </div>
  );
}