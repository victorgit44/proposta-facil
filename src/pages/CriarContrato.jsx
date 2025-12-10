import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { base44, supabase } from '@/api/supabaseClient'
import { queryClient } from '@/queryClient'
import { toast } from 'sonner' // <--- IMPORTANTE

export default function CriarContrato() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)

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
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleTestemunhaChange = (index, field, value) => {
    const novasTestemunhas = [...formData.testemunhas]
    novasTestemunhas[index][field] = value
    setFormData(prev => ({ ...prev, testemunhas: novasTestemunhas }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    // Inicia o toast de carregamento
    const toastId = toast.loading('Criando contrato...')

    try {
      // 1. Cria o contrato
      await base44.entities.Contrato.create(formData)
      
      // 2. Incrementa o uso
      const { error: rpcError } = await supabase.rpc('increment_usage', { item_type: 'contrato' })
      
      if (rpcError) {
        console.error('Erro no RPC:', rpcError)
        // Não vamos travar o usuário aqui se o contrato foi criado, mas avisamos no console
        
      }

      // 3. Atualiza cache
      queryClient.invalidateQueries({ queryKey: ['assinatura'] })
      queryClient.invalidateQueries({ queryKey: ['contratos'] })

      // Sucesso!
      toast.success('Contrato criado com sucesso!', { id: toastId })
      navigate('/contratos')

    } catch (error) {
      console.error(error)
      // Erro!
      toast.error('Erro ao criar contrato: ' + error.message, { id: toastId })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/contratos')} className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Novo Contrato</h1>
            <p className="text-slate-400">Gere um contrato de prestação de serviços</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seção 1: Partes */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">🤝 Partes do Contrato</h2>
            
            {/* Contratante */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">Contratante (Cliente)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Nome Completo / Razão Social" required className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" value={formData.contratante_nome} onChange={e => handleChange('contratante_nome', e.target.value)} />
                <input type="text" placeholder="CPF / CNPJ" required className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" value={formData.contratante_cpf_cnpj} onChange={e => handleChange('contratante_cpf_cnpj', e.target.value)} />
                <input type="text" placeholder="Endereço Completo" className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white md:col-span-2" value={formData.contratante_endereco} onChange={e => handleChange('contratante_endereco', e.target.value)} />
                <input type="email" placeholder="Email" className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" value={formData.contratante_email} onChange={e => handleChange('contratante_email', e.target.value)} />
                <input type="tel" placeholder="Telefone" className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" value={formData.contratante_telefone} onChange={e => handleChange('contratante_telefone', e.target.value)} />
              </div>
            </div>

            {/* Contratado */}
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-4">Contratado (Você/Empresa)</h3>
              <p className="text-xs text-slate-500 mb-2">Deixe em branco para usar os dados das Configurações.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Nome Completo / Razão Social" className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" value={formData.contratado_nome} onChange={e => handleChange('contratado_nome', e.target.value)} />
                <input type="text" placeholder="CPF / CNPJ" className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" value={formData.contratado_cpf_cnpj} onChange={e => handleChange('contratado_cpf_cnpj', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Seção 2: Objeto e Valores */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">📝 Objeto e Valores</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Objeto do Contrato</label>
                <textarea required rows="4" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" placeholder="Descreva o serviço..." value={formData.objeto_contrato} onChange={e => handleChange('objeto_contrato', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm text-slate-400 mb-1">Valor Total (R$)</label>
                   <input type="number" required step="0.01" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" value={formData.valor_contrato} onChange={e => handleChange('valor_contrato', parseFloat(e.target.value))} />
                </div>
                <div>
                   <label className="block text-sm text-slate-400 mb-1">Forma de Pagamento</label>
                   <input type="text" placeholder="Ex: 50% entrada + 50% final" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" value={formData.forma_pagamento} onChange={e => handleChange('forma_pagamento', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* Seção 3: Prazos e Vigência */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
             <h2 className="text-xl font-bold text-white mb-6">📅 Prazos e Vigência</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                 <label className="block text-sm text-slate-400 mb-1">Data Início</label>
                 <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" value={formData.data_inicio} onChange={e => handleChange('data_inicio', e.target.value)} />
               </div>
               <div>
                 <label className="block text-sm text-slate-400 mb-1">Data Término</label>
                 <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" value={formData.data_termino} onChange={e => handleChange('data_termino', e.target.value)} />
               </div>
               <div>
                 <label className="block text-sm text-slate-400 mb-1">Prazo de Vigência</label>
                 <input type="text" placeholder="Ex: 12 meses" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" value={formData.prazo_vigencia} onChange={e => handleChange('prazo_vigencia', e.target.value)} />
               </div>
             </div>
          </div>

          {/* Seção 4: Testemunhas */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
             <h2 className="text-xl font-bold text-white mb-6">👥 Testemunhas (Opcional)</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[0, 1].map((index) => (
                 <div key={index} className="space-y-2">
                   <p className="text-sm font-semibold text-slate-400">Testemunha {index + 1}</p>
                   <input type="text" placeholder="Nome" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" value={formData.testemunhas[index].nome} onChange={e => handleTestemunhaChange(index, 'nome', e.target.value)} />
                   <input type="text" placeholder="CPF" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" value={formData.testemunhas[index].cpf} onChange={e => handleTestemunhaChange(index, 'cpf', e.target.value)} />
                 </div>
               ))}
             </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={() => navigate('/contratos')} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition">Cancelar</button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition disabled:opacity-50">
              <Save className="w-5 h-5" />
              {saving ? 'Salvando...' : 'Salvar Contrato'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}