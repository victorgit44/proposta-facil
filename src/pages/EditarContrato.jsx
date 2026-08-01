import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Loader2, AlertCircle, FileSignature } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/supabaseClient';
import { queryClient } from '@/queryClient';
import { toast } from 'sonner';

const initialState = {
  numero_contrato: '',
  tipo_contrato: 'prestacao_servicos',
  status: 'rascunho',
  contratante_nome: '',
  contratante_cpf_cnpj: '',
  contratante_endereco: '',
  contratante_email: '',
  contratante_telefone: '',
  contratado_nome: '',
  contratado_cpf_cnpj: '',
  contratado_endereco: '',
  contratado_email: '',
  contratado_telefone: '',
  objeto_contrato: '',
  valor_contrato: 0,
  forma_pagamento: '',
  prazo_vigencia: '',
  data_inicio: '',
  data_termino: '',
  clausulas_adicionais: '',
  testemunhas: [],
};

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch (e) {
    return '';
  }
};

export default function EditarContrato() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const {
    data: contrato,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['contrato', id],
    queryFn: () => base44.entities.Contrato.get(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (contrato) {
      setFormData({
        ...contrato,
        valor_contrato: parseFloat(contrato.valor_contrato) || 0,
        data_inicio: formatDateForInput(contrato.data_inicio),
        data_termino: formatDateForInput(contrato.data_termino),
        testemunhas: Array.isArray(contrato.testemunhas) ? contrato.testemunhas : [],
      });
    }
  }, [contrato]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTestemunhaChange = (index, field, value) => {
    const newTestemunhas = [...formData.testemunhas];
    newTestemunhas[index][field] = value;
    setFormData(prev => ({ ...prev, testemunhas: newTestemunhas }));
  };

  const addTestemunha = () => {
    setFormData(prev => ({
      ...prev,
      testemunhas: [...prev.testemunhas, { nome: '', cpf: '', endereco: '' }]
    }));
  };

  const removeTestemunha = (index) => {
    const newTestemunhas = formData.testemunhas.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, testemunhas: newTestemunhas }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading('Atualizando contrato...');

    try {
      await base44.entities.Contrato.update(id, {
        ...formData,
        valor_contrato: parseFloat(formData.valor_contrato) || 0
      });
      
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
      queryClient.invalidateQueries({ queryKey: ['contrato', id] });
      
      toast.success('Contrato atualizado com sucesso!', { id: toastId });
      navigate('/contratos');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar contrato: ' + (error.message || 'Erro desconhecido'), { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] text-red-400 p-6 text-center">
        <AlertCircle className="w-12 h-12 mb-3 text-red-400" />
        <p className="text-base font-bold mb-4">Erro ao carregar contrato: {error.message}</p>
        <button
          onClick={() => navigate('/contratos')}
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
            onClick={() => navigate('/contratos')}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Editar Contrato</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Nº {formData.numero_contrato}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Geral & Partes */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm">1</div>
            <h2 className="text-base font-bold text-white tracking-tight">Informações Gerais & Status</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Número do Contrato</label>
              <input
                type="text"
                value={formData.numero_contrato}
                onChange={(e) => handleChange('numero_contrato', e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Tipo de Contrato</label>
              <select
                value={formData.tipo_contrato}
                onChange={(e) => handleChange('tipo_contrato', e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              >
                <option value="prestacao_servicos">Prestação de Serviços</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              >
                <option value="rascunho">Rascunho</option>
                <option value="enviado">Em Assinatura</option>
                <option value="assinado">Assinado</option>
                <option value="rejeitado">Cancelado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contratante */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm">2</div>
            <h2 className="text-base font-bold text-white tracking-tight">Dados do Contratante & Contratado</h2>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">Contratante (Cliente)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Nome / Razão Social *"
                value={formData.contratante_nome}
                onChange={(e) => handleChange('contratante_nome', e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              />
              <input
                type="text"
                placeholder="CPF / CNPJ"
                value={formData.contratante_cpf_cnpj}
                onChange={(e) => handleChange('contratante_cpf_cnpj', e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              />
              <input
                type="text"
                placeholder="Endereço Completo"
                value={formData.contratante_endereco}
                onChange={(e) => handleChange('contratante_endereco', e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 md:col-span-2"
              />
              <input
                type="email"
                placeholder="E-mail"
                value={formData.contratante_email}
                onChange={(e) => handleChange('contratante_email', e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              />
              <input
                type="tel"
                placeholder="Telefone"
                value={formData.contratante_telefone}
                onChange={(e) => handleChange('contratante_telefone', e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              />
            </div>
          </div>
        </div>

        {/* Objeto & Valores */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">3</div>
            <h2 className="text-base font-bold text-white tracking-tight">Objeto & Valores do Contrato</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Objeto do Contrato *</label>
              <textarea
                required
                rows={4}
                value={formData.objeto_contrato}
                onChange={(e) => handleChange('objeto_contrato', e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Valor do Contrato (R$) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.valor_contrato}
                  onChange={(e) => handleChange('valor_contrato', e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Prazo de Vigência</label>
                <input
                  type="text"
                  value={formData.prazo_vigencia}
                  onChange={(e) => handleChange('prazo_vigencia', e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Forma de Pagamento</label>
              <textarea
                rows={3}
                value={formData.forma_pagamento}
                onChange={(e) => handleChange('forma_pagamento', e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/contratos')}
            className="px-6 py-3 rounded-xl font-bold text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-500 transition duration-200 shadow-lg shadow-purple-600/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Atualizando Contrato...' : 'Atualizar Contrato'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}