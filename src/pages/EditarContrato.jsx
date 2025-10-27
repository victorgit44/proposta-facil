import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { base44 } from '@/api/supabaseClient'
import { queryClient } from '@/queryClient'

// Estado inicial vazio
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
}

// Helper para formatar data para yyyy-MM-dd (input type="date")
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch (e) {
    return ''; // Retorna vazio se a data for inválida
  }
}

export default function EditarContrato() {
  const navigate = useNavigate()
  const { id } = useParams() // Pega o ID da URL
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState(initialState)

  // 1. BUSCAR OS DADOS DO CONTRATO
  const {
    data: contrato,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['contrato', id], // Usa o ID na chave
    queryFn: () => base44.entities.Contrato.get(id),
    enabled: !!id, // Só roda se tiver ID
  })

  // 2. PREENCHER O FORMULÁRIO QUANDO OS DADOS CHEGAREM
  useEffect(() => {
    if (contrato) {
      setFormData({
        ...contrato,
        // Garante que o valor é numérico ou 0
        valor_contrato: parseFloat(contrato.valor_contrato) || 0,
        // Formata as datas para o input type="date"
        data_inicio: formatDateForInput(contrato.data_inicio),
        data_termino: formatDateForInput(contrato.data_termino),
        // Garante que testemunhas é um array
        testemunhas: Array.isArray(contrato.testemunhas) ? contrato.testemunhas : [],
      })
    }
  }, [contrato])


  // ==========================================
  // Funções handleChange, testemunhas, etc.
  // SÃO IDÊNTICAS AO CriarContrato.jsx
  // ==========================================
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleTestemunhaChange = (index, field, value) => {
    const newTestemunhas = [...formData.testemunhas]
    newTestemunhas[index][field] = value
    setFormData(prev => ({ ...prev, testemunhas: newTestemunhas }))
  }

  const addTestemunha = () => {
    setFormData(prev => ({
      ...prev,
      testemunhas: [...prev.testemunhas, { nome: '', cpf: '', endereco: '' }]
    }))
  }

  const removeTestemunha = (index) => {
    const newTestemunhas = formData.testemunhas.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, testemunhas: newTestemunhas }))
  }
  // --- Fim Handlers Testemunhas ---


  // 3. ATUALIZAR A FUNÇÃO handleSubmit PARA USAR '.update()'
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      await base44.entities.Contrato.update(id, { // <-- MUDOU AQUI
        ...formData,
        valor_contrato: parseFloat(formData.valor_contrato) || 0
      })
      
      // Invalida a lista E o contrato específico
      queryClient.invalidateQueries({ queryKey: ['contratos'] }) 
      queryClient.invalidateQueries({ queryKey: ['contrato', id] }) 
      
      alert('Contrato atualizado com sucesso!')
      navigate('/contratos')
    } catch (error) {
      alert('Erro ao atualizar contrato: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  // ==========================================
  // Loading e Error States
  // ==========================================
  if (isLoading) {
     return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 size={48} className="text-purple-500 animate-spin" />
      </div>
    )
  }

   if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-400">
        <AlertCircle size={48} className="mb-4" />
        <p className="text-xl mb-4">Erro ao carregar contrato: {error.message}</p>
        <button onClick={() => navigate('/contratos')} className="text-blue-400">
          Voltar para a lista
        </button>
      </div>
    )
  }

  // ==========================================
  // O JSX É QUASE IDÊNTICO AO CriarContrato
  // Muda apenas o título e o texto do botão salvar
  // ==========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header (Título Atualizado) */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/contratos')}
            className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Editar Contrato</h1>
            <p className="text-slate-400">Nº {formData.numero_contrato}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Informações Gerais */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">📄 Informações Gerais</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Número do Contrato</label>
                <input type="text" value={formData.numero_contrato} onChange={(e) => handleChange('numero_contrato', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tipo de Contrato</label>
                <select value={formData.tipo_contrato} onChange={(e) => handleChange('tipo_contrato', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                  <option value="prestacao_servicos">Prestação de Serviços</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                <select value={formData.status} onChange={(e) => handleChange('status', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                  <option value="rascunho">Rascunho</option>
                  <option value="enviado">Enviado</option>
                  <option value="assinado">Assinado</option>
                  <option value="rejeitado">Rejeitado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dados do Contratante */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">👤 Dados do Contratante</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nome / Razão Social *</label>
                <input type="text" required value={formData.contratante_nome} onChange={(e) => handleChange('contratante_nome', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">CPF / CNPJ</label>
                <input type="text" value={formData.contratante_cpf_cnpj} onChange={(e) => handleChange('contratante_cpf_cnpj', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Endereço Completo</label>
                <input type="text" value={formData.contratante_endereco} onChange={(e) => handleChange('contratante_endereco', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input type="email" value={formData.contratante_email} onChange={(e) => handleChange('contratante_email', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Telefone</label>
                <input type="tel" value={formData.contratante_telefone} onChange={(e) => handleChange('contratante_telefone', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>

          {/* Dados do Contratado */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">🏢 Dados do Contratado (Sua Empresa)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nome / Razão Social *</label>
                <input type="text" required value={formData.contratado_nome} onChange={(e) => handleChange('contratado_nome', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">CPF / CNPJ</label>
                <input type="text" value={formData.contratado_cpf_cnpj} onChange={(e) => handleChange('contratado_cpf_cnpj', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Endereço Completo</label>
                <input type="text" value={formData.contratado_endereco} onChange={(e) => handleChange('contratado_endereco', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input type="email" value={formData.contratado_email} onChange={(e) => handleChange('contratado_email', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Telefone</label>
                <input type="tel" value={formData.contratado_telefone} onChange={(e) => handleChange('contratado_telefone', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>

          {/* Objeto e Condições do Contrato */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">📜 Objeto e Condições do Contrato</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Objeto do Contrato *</label>
                <textarea required value={formData.objeto_contrato} onChange={(e) => handleChange('objeto_contrato', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white h-32 focus:outline-none focus:border-blue-500" placeholder="Descreva o objeto do contrato..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Valor do Contrato *</label>
                  <input type="number" min="0" step="0.01" required value={formData.valor_contrato} onChange={(e) => handleChange('valor_contrato', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Prazo de Vigência</label>
                  <input type="text" value={formData.prazo_vigencia} onChange={(e) => handleChange('prazo_vigencia', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="Ex: 3 meses" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Forma de Pagamento</label>
                <textarea value={formData.forma_pagamento} onChange={(e) => handleChange('forma_pagamento', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white h-24 focus:outline-none focus:border-blue-500" placeholder="Ex: 3 parcelas mensais de R$ 5.000,00..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Data de Início</label>
                  <input type="date" value={formData.data_inicio} onChange={(e) => handleChange('data_inicio', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Data de Término</label>
                  <input type="date" value={formData.data_termino} onChange={(e) => handleChange('data_termino', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Cláusulas Adicionais</label>
                <textarea value={formData.clausulas_adicionais} onChange={(e) => handleChange('clausulas_adicionais', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white h-24 focus:outline-none focus:border-blue-500" placeholder="Cláusulas extras..." />
              </div>
            </div>
          </div>

          {/* Testemunhas (Opcional) */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">👥 Testemunhas (Opcional)</h2>
              <button type="button" onClick={addTestemunha} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition">
                <Plus className="w-4 h-4" /> Adicionar Testemunha
              </button>
            </div>
            <div className="space-y-4">
              {formData.testemunhas.map((testemunha, index) => (
                <div key={index} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 relative">
                  <h3 className="text-md font-semibold text-white mb-4">Testemunha {index + 1}</h3>
                  <button type="button" onClick={() => removeTestemunha(index)} className="absolute top-4 right-4 p-1 text-red-400 hover:bg-red-900/20 rounded-lg transition">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Nome Completo</label>
                      <input type="text" value={testemunha.nome} onChange={(e) => handleTestemunhaChange(index, 'nome', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">CPF</label>
                      <input type="text" value={testemunha.cpf} onChange={(e) => handleTestemunhaChange(index, 'cpf', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Endereço</label>
                      <input type="text" value={testemunha.endereco} onChange={(e) => handleTestemunhaChange(index, 'endereco', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botões (Texto Atualizado) */}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => navigate('/contratos')} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition disabled:opacity-50">
              <Save className="w-5 h-5" />
              {saving ? 'Atualizando...' : 'Atualizar Contrato'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}