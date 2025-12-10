import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'
import { base44, supabase } from '@/api/supabaseClient' 
import { queryClient } from '@/queryClient'
import { toast } from 'sonner' // <--- 1. Importar toast

export default function CriarProposta() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)

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
  })

  // (Funções handleChange, handleItemChange, addItem, removeItem continuam IGUAIS - omitindo para economizar espaço)
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  const handleItemChange = (index, field, value) => {
    const newItens = [...formData.itens]
    newItens[index][field] = field === 'descricao' ? value : parseFloat(value) || 0
    if (field === 'quantidade' || field === 'valor_unitario') {
      newItens[index].valor_total = (newItens[index].quantidade || 0) * (newItens[index].valor_unitario || 0)
    }
    const valorTotalGlobal = newItens.reduce((sum, item) => sum + (item.valor_total || 0), 0)
    setFormData(prev => ({ ...prev, itens: newItens, valor_total: valorTotalGlobal }))
  }
  const addItem = () => {
    setFormData(prev => ({ ...prev, itens: [...prev.itens, { descricao: '', quantidade: 1, valor_unitario: 0, valor_total: 0 }] }))
  }
  const removeItem = (index) => {
    if (formData.itens.length === 1) return
    const newItens = formData.itens.filter((_, i) => i !== index)
    const valorTotalGlobal = newItens.reduce((sum, item) => sum + (item.valor_total || 0), 0)
    setFormData(prev => ({ ...prev, itens: newItens, valor_total: valorTotalGlobal }))
  }


  // --- handleSubmit ATUALIZADO COM TOAST ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    // Notificação de carregamento (opcional, mas legal)
    const toastId = toast.loading('Criando proposta...')

    try {
      const valorTotal = formData.valor_total || 0;
      
      // 1. Cria a proposta
      await base44.entities.Proposta.create({
        ...formData,
        valor_total: valorTotal
      })
      
      // 2. Incrementa o contador
      const { error: rpcError } = await supabase.rpc('increment_usage', { item_type: 'proposta' });
      
      if (rpcError) {
          console.error('Erro CRÍTICO ao incrementar uso:', rpcError);
          throw new Error(`Falha ao registrar uso: ${rpcError.message}`);
      }

      // 3. Invalida os caches
      queryClient.invalidateQueries({ queryKey: ['assinatura'] });
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
      
      // SUCESSO! Substitui o loading por sucesso
      toast.success('Proposta criada com sucesso!', { id: toastId })
      
      navigate('/propostas')

    } catch (error) {
      console.error("Erro:", error)
      // ERRO! Substitui o loading por erro
      toast.error('Erro ao criar proposta: ' + (error.message || 'Erro desconhecido'), { id: toastId })
    } finally {
      setSaving(false)
    }
  }

  // O Return (JSX) continua IGUAL, pode manter o que você já tem.
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/propostas')} className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Nova Proposta</h1>
            <p className="text-slate-400">Preencha os dados da proposta comercial</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           {/* ... Mantenha todo o seu formulário aqui ... */}
           {/* (Como não mexemos no visual, vou omitir para economizar sua leitura, 
               mas o formulário é o mesmo do passo anterior) */}
           
           {/* Apenas para garantir que você tenha o código completo para copiar e colar se preferir: */}
           {/* Informações do Cliente */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">📋 Informações do Cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Número da Proposta *</label>
                <input type="text" required value={formData.numero_proposta} onChange={(e) => handleChange('numero_proposta', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                <select value={formData.status} onChange={(e) => handleChange('status', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                  <option value="rascunho">Rascunho</option>
                  <option value="enviada">Enviada</option>
                  <option value="aprovada">Aprovada</option>
                  <option value="recusada">Recusada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nome do Cliente *</label>
                <input type="text" required value={formData.nome_cliente} onChange={(e) => handleChange('nome_cliente', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input type="email" value={formData.email_cliente} onChange={(e) => handleChange('email_cliente', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Telefone</label>
                <input type="tel" value={formData.telefone_cliente} onChange={(e) => handleChange('telefone_cliente', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Empresa</label>
                <input type="text" value={formData.empresa_cliente} onChange={(e) => handleChange('empresa_cliente', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>

          {/* Detalhes do Serviço */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">📝 Detalhes do Serviço</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Serviço Prestado *</label>
                <textarea required value={formData.servico_prestado} onChange={(e) => handleChange('servico_prestado', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white h-32 focus:outline-none focus:border-blue-500" placeholder="Descreva o serviço a ser prestado..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Prazo de Entrega</label>
                  <input type="text" value={formData.prazo_entrega} onChange={(e) => handleChange('prazo_entrega', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="Ex: 30 dias" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Validade da Proposta</label>
                  <input type="date" value={formData.validade} onChange={(e) => handleChange('validade', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Observações</label>
                <textarea value={formData.observacoes} onChange={(e) => handleChange('observacoes', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white h-24 focus:outline-none focus:border-blue-500" placeholder="Informações adicionais..." />
              </div>
            </div>
          </div>

          {/* Itens da Proposta */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">💰 Itens da Proposta</h2>
              <button type="button" onClick={addItem} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                <Plus className="w-4 h-4" />
                Adicionar Item
              </button>
            </div>
            <div className="space-y-4">
              {formData.itens.map((item, index) => (
                <div key={index} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-5">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
                      <input type="text" value={item.descricao} onChange={(e) => handleItemChange(index, 'descricao', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="Descrição do item" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Quantidade</label>
                      <input type="number" min="1" value={item.quantidade} onChange={(e) => handleItemChange(index, 'quantidade', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Valor Unit.</label>
                      <input type="number" min="0" step="0.01" value={item.valor_unitario} onChange={(e) => handleItemChange(index, 'valor_unitario', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Total</label>
                      <div className="px-3 py-2 bg-slate-700 rounded-lg text-blue-400 font-bold">
                        R$ {(item.valor_total || 0).toFixed(2)}
                      </div>
                    </div>
                    <div className="md:col-span-1">
                      <button type="button" onClick={() => removeItem(index)} disabled={formData.itens.length === 1} className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 pt-6 border-t border-slate-700 flex justify-between items-center">
              <span className="text-xl font-semibold text-slate-300">Valor Total</span>
              <span className="text-3xl font-bold text-blue-400">
                R$ {(formData.valor_total || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => navigate('/propostas')} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition">Cancelar</button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition disabled:opacity-50">
              <Save className="w-5 h-5" />
              {saving ? 'Salvando...' : 'Salvar Proposta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}