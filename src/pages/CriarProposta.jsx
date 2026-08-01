import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Sparkles, FileText, DollarSign, Calendar, User, ShieldCheck } from 'lucide-react';
import { base44, supabase } from '@/api/supabaseClient';
import { queryClient } from '@/queryClient';
import { toast } from 'sonner';
import { AIChatModal } from '@/components/AIChatModal';

export default function CriarProposta() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

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
      <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/propostas')}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Nova Proposta Comercial</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Preencha os dados abaixo para emitir a proposta</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAIModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition shadow-lg shadow-indigo-600/20 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Preencher com IA</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Cliente */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm">1</div>
            <h2 className="text-base font-bold text-white tracking-tight">Informações do Cliente & Proposta</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Número da Proposta *</label>
              <input
                type="text"
                required
                value={formData.numero_proposta}
                onChange={(e) => handleChange('numero_proposta', e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Status Inicial</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="rascunho">Rascunho</option>
                <option value="enviada">Enviada</option>
                <option value="aprovada">Aprovada</option>
                <option value="recusada">Recusada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Nome do Cliente *</label>
              <input
                type="text"
                required
                value={formData.nome_cliente}
                onChange={(e) => handleChange('nome_cliente', e.target.value)}
                placeholder="Ex: João Silva"
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">E-mail do Cliente</label>
              <input
                type="email"
                value={formData.email_cliente}
                onChange={(e) => handleChange('email_cliente', e.target.value)}
                placeholder="cliente@empresa.com"
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Telefone / WhatsApp</label>
              <input
                type="tel"
                value={formData.telefone_cliente}
                onChange={(e) => handleChange('telefone_cliente', e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Empresa do Cliente</label>
              <input
                type="text"
                value={formData.empresa_cliente}
                onChange={(e) => handleChange('empresa_cliente', e.target.value)}
                placeholder="Ex: Tech Corp Ltda"
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Escopo */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm">2</div>
            <h2 className="text-base font-bold text-white tracking-tight">Escopo do Serviço & Prazos</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Serviço Prestado / Descrição *</label>
              <textarea
                required
                value={formData.servico_prestado}
                onChange={(e) => handleChange('servico_prestado', e.target.value)}
                rows={4}
                placeholder="Descreva em detalhes a solução comercial oferecida..."
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Prazo de Entrega</label>
                <input
                  type="text"
                  value={formData.prazo_entrega}
                  onChange={(e) => handleChange('prazo_entrega', e.target.value)}
                  placeholder="Ex: 30 dias úteis"
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Validade da Proposta</label>
                <input
                  type="date"
                  value={formData.validade}
                  onChange={(e) => handleChange('validade', e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Observações / Condições Gerais</label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => handleChange('observacoes', e.target.value)}
                rows={3}
                placeholder="Informações sobre pagamento, garantias ou etapas..."
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Valoração & Itens */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">3</div>
              <h2 className="text-base font-bold text-white tracking-tight">Itens & Valores Comerciais</h2>
            </div>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Item</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.itens.map((item, index) => (
              <div key={index} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col md:flex-row items-center gap-4">
                <div className="w-full md:flex-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Descrição do Item</label>
                  <input
                    type="text"
                    value={item.descricao}
                    onChange={(e) => handleItemChange(index, 'descricao', e.target.value)}
                    placeholder="Ex: Desenvolvimento de Landing Page"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <div className="w-full md:w-28">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Qtd</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantidade}
                    onChange={(e) => handleItemChange(index, 'quantidade', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <div className="w-full md:w-36">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Valor Unit. (R$)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.valor_unitario}
                    onChange={(e) => handleItemChange(index, 'valor_unitario', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <div className="w-full md:w-36">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Total Item</label>
                  <div className="px-3 py-2 bg-slate-900 border border-slate-800/80 rounded-xl text-xs font-extrabold text-emerald-400">
                    R$ {(item.valor_total || 0).toFixed(2)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={formData.itens.length === 1}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition disabled:opacity-30 cursor-pointer self-end md:self-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Valor Total Calculado</span>
            <span className="text-2xl font-black text-emerald-400 tracking-tight">
              R$ {(formData.valor_total || 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/propostas')}
            className="px-6 py-3 rounded-xl font-bold text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 transition duration-200 shadow-lg shadow-blue-600/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Gerando Proposta...' : 'Salvar e Emitir Proposta'}</span>
          </button>
        </div>
      </form>

      <AIChatModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onFill={handleAIFill}
        type="proposta"
      />
    </div>
  );
}