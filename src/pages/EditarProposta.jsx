import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Loader2, AlertCircle, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/supabaseClient';
import { queryClient } from '@/queryClient';
import { toast } from 'sonner';

const initialState = {
  numero_proposta: '',
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
};

export default function EditarProposta() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const {
    data: proposta,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['proposta', id],
    queryFn: () => base44.entities.Proposta.get(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (proposta) {
      const validadeFormatada = proposta.validade 
        ? new Date(proposta.validade).toISOString().split('T')[0] 
        : '';
        
      const rawItens = Array.isArray(proposta.itens) && proposta.itens.length > 0
        ? proposta.itens
        : [{ descricao: '', quantidade: 1, valor_unitario: 0, valor_total: 0 }];

      const itensFormatados = rawItens.map(item => {
        const qty = parseFloat(item.quantidade) || 0;
        const unit = parseFloat(item.valor_unitario) || 0;
        const total = typeof item.valor_total === 'number' ? item.valor_total : (qty * unit);
        return {
          descricao: item.descricao || '',
          quantidade: qty,
          valor_unitario: unit,
          valor_total: total
        };
      });

      setFormData({
        ...proposta,
        validade: validadeFormatada,
        itens: itensFormatados,
        valor_total: parseFloat(proposta.valor_total) || 0
      });
    }
  }, [proposta]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItens = [...formData.itens];
    newItens[index][field] = field === 'descricao' ? value : parseFloat(value) || 0;
    
    if (field === 'quantidade' || field === 'valor_unitario') {
      newItens[index].valor_total = (newItens[index].quantidade || 0) * (newItens[index].valor_unitario || 0);
    }
    
    const valorTotal = newItens.reduce((sum, item) => sum + (item.valor_total || (item.quantidade * item.valor_unitario) || 0), 0);
    
    setFormData(prev => ({ 
      ...prev, 
      itens: newItens,
      valor_total: valorTotal
    }));
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
    const valorTotal = newItens.reduce((sum, item) => sum + (item.valor_total || (item.quantidade * item.valor_unitario) || 0), 0);
    setFormData(prev => ({ 
      ...prev, 
      itens: newItens,
      valor_total: valorTotal
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading('Atualizando proposta...');

    try {
      const valorTotal = formData.itens.reduce((sum, item) => sum + (item.valor_total || (item.quantidade * item.valor_unitario) || 0), 0);
      
      await base44.entities.Proposta.update(id, { 
        ...formData,
        valor_total: valorTotal
      });

      queryClient.invalidateQueries({ queryKey: ['propostas'] });
      queryClient.invalidateQueries({ queryKey: ['proposta', id] });

      toast.success('Proposta atualizada com sucesso!', { id: toastId });
      navigate('/propostas');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar proposta: ' + (error.message || 'Erro desconhecido'), { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] text-red-400 p-6 text-center">
        <AlertCircle className="w-12 h-12 mb-3 text-red-400" />
        <p className="text-base font-bold mb-4">Erro ao carregar proposta: {error.message}</p>
        <button
          onClick={() => navigate('/propostas')}
          className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition"
        >
          Voltar para a lista
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/propostas')}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Editar Proposta</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Nº {formData.numero_proposta}</p>
          </div>
        </div>
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
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Status</label>
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
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Email</label>
              <input
                type="email"
                value={formData.email_cliente}
                onChange={(e) => handleChange('email_cliente', e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Telefone</label>
              <input
                type="tel"
                value={formData.telefone_cliente}
                onChange={(e) => handleChange('telefone_cliente', e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Empresa</label>
              <input
                type="text"
                value={formData.empresa_cliente}
                onChange={(e) => handleChange('empresa_cliente', e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Servico */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm">2</div>
            <h2 className="text-base font-bold text-white tracking-tight">Detalhes do Serviço</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Serviço Prestado *</label>
              <textarea
                required
                value={formData.servico_prestado}
                onChange={(e) => handleChange('servico_prestado', e.target.value)}
                rows={4}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Prazo de Entrega</label>
                <input
                  type="text"
                  value={formData.prazo_entrega}
                  onChange={(e) => handleChange('prazo_entrega', e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Observações</label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => handleChange('observacoes', e.target.value)}
                rows={3}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Itens */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">3</div>
              <h2 className="text-base font-bold text-white tracking-tight">Itens & Valores da Proposta</h2>
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
            {(formData.itens || []).map((item, index) => (
              <div key={index} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col md:flex-row items-center gap-4">
                <div className="w-full md:flex-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Descrição</label>
                  <input
                    type="text"
                    value={item.descricao || ''}
                    onChange={(e) => handleItemChange(index, 'descricao', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <div className="w-full md:w-28">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantidade ?? 1}
                    onChange={(e) => handleItemChange(index, 'quantidade', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <div className="w-full md:w-36">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Valor Unit.</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.valor_unitario ?? 0}
                    onChange={(e) => handleItemChange(index, 'valor_unitario', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <div className="w-full md:w-36">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Total</label>
                  <div className="px-3 py-2 bg-slate-900 border border-slate-800/80 rounded-xl text-xs font-extrabold text-emerald-400">
                    R$ {((item.valor_total ?? ((item.quantidade || 0) * (item.valor_unitario || 0))) || 0).toFixed(2)}
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
              R$ {(formData.itens || []).reduce((sum, item) => sum + ((item.valor_total ?? ((item.quantidade || 0) * (item.valor_unitario || 0))) || 0), 0).toFixed(2)}
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
            <span>{saving ? 'Atualizando Proposta...' : 'Atualizar Proposta'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}