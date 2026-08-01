import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileSignature, Users, ShieldCheck, Calendar, DollarSign } from 'lucide-react';
import { base44, supabase } from '@/api/supabaseClient';
import { queryClient } from '@/queryClient';
import { toast } from 'sonner';

export default function CriarContrato() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    numero_contrato: `CONT-${Date.now().toString().slice(-6)}`,
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
    data_inicio: '',
    data_termino: '',
    prazo_vigencia: '',
    clausulas_adicionais: '',
    testemunhas: [
      { nome: '', cpf: '' },
      { nome: '', cpf: '' }
    ]
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTestemunhaChange = (index, field, value) => {
    const novasTestemunhas = [...formData.testemunhas];
    novasTestemunhas[index][field] = value;
    setFormData(prev => ({ ...prev, testemunhas: novasTestemunhas }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading('Gerando minuta do contrato...');

    try {
      await base44.entities.Contrato.create(formData);
      
      const { error: rpcError } = await supabase.rpc('increment_usage', { item_type: 'contrato' });
      if (rpcError) {
        console.error('Erro no RPC ao incrementar uso:', rpcError);
      }

      queryClient.invalidateQueries({ queryKey: ['assinatura'] });
      queryClient.invalidateQueries({ queryKey: ['contratos'] });

      toast.success('Contrato criado com sucesso!', { id: toastId });
      navigate('/contratos');

    } catch (error) {
      console.error(error);
      toast.error('Erro ao criar contrato: ' + (error.message || 'Erro desconhecido'), { id: toastId });
    } finally {
      setSaving(false);
    }
  };

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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Novo Contrato Jurídico</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Preencha os termos para formalizar a prestação de serviços</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Partes */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm">1</div>
            <h2 className="text-base font-bold text-white tracking-tight">Partes Envolvidas no Contrato</h2>
          </div>

          {/* Contratante */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">Contratante (Cliente)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome Completo / Razão Social *"
                required
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                value={formData.contratante_nome}
                onChange={e => handleChange('contratante_nome', e.target.value)}
              />
              <input
                type="text"
                placeholder="CPF / CNPJ *"
                required
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                value={formData.contratante_cpf_cnpj}
                onChange={e => handleChange('contratante_cpf_cnpj', e.target.value)}
              />
              <input
                type="text"
                placeholder="Endereço Completo"
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 md:col-span-2"
                value={formData.contratante_endereco}
                onChange={e => handleChange('contratante_endereco', e.target.value)}
              />
              <input
                type="email"
                placeholder="E-mail de Contato"
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                value={formData.contratante_email}
                onChange={e => handleChange('contratante_email', e.target.value)}
              />
              <input
                type="tel"
                placeholder="Telefone / WhatsApp"
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                value={formData.contratante_telefone}
                onChange={e => handleChange('contratante_telefone', e.target.value)}
              />
            </div>
          </div>

          {/* Contratado */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400">Contratado (Prestador de Serviço)</h3>
              <span className="text-[11px] text-slate-500 font-medium">Deixe em branco se for usar dados das configurações</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Razão Social do Prestador"
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                value={formData.contratado_nome}
                onChange={e => handleChange('contratado_nome', e.target.value)}
              />
              <input
                type="text"
                placeholder="CNPJ do Prestador"
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                value={formData.contratado_cpf_cnpj}
                onChange={e => handleChange('contratado_cpf_cnpj', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Step 2: Objeto */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">2</div>
            <h2 className="text-base font-bold text-white tracking-tight">Objeto do Contrato & Forma de Pagamento</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Objeto / Cláusula do Serviço *</label>
              <textarea
                required
                rows={4}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                placeholder="Descreva em termos jurídicos os serviços a serem executados..."
                value={formData.objeto_contrato}
                onChange={e => handleChange('objeto_contrato', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Valor Total do Contrato (R$) *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 font-bold"
                  value={formData.valor_contrato}
                  onChange={e => handleChange('valor_contrato', parseFloat(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Condição de Pagamento</label>
                <input
                  type="text"
                  placeholder="Ex: 50% no aceite + 50% na conclusão"
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  value={formData.forma_pagamento}
                  onChange={e => handleChange('forma_pagamento', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Prazos e Testemunhas */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm">3</div>
            <h2 className="text-base font-bold text-white tracking-tight">Vigência & Testemunhas</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Data Início</label>
              <input
                type="date"
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                value={formData.data_inicio}
                onChange={e => handleChange('data_inicio', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Data Término</label>
              <input
                type="date"
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                value={formData.data_termino}
                onChange={e => handleChange('data_termino', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Vigência Total</label>
              <input
                type="text"
                placeholder="Ex: 12 meses"
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                value={formData.prazo_vigencia}
                onChange={e => handleChange('prazo_vigencia', e.target.value)}
              />
            </div>
          </div>

          {/* Testemunhas */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Assinatura de Testemunhas (Opcional)</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1].map((index) => (
                <div key={index} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 block">Testemunha {index + 1}</span>
                  <input
                    type="text"
                    placeholder="Nome Completo"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                    value={formData.testemunhas[index].nome}
                    onChange={e => handleTestemunhaChange(index, 'nome', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="CPF"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                    value={formData.testemunhas[index].cpf}
                    onChange={e => handleTestemunhaChange(index, 'cpf', e.target.value)}
                  />
                </div>
              ))}
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
            <span>{saving ? 'Gerando Contrato...' : 'Salvar e Gerar Contrato'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}