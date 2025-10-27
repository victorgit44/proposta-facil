import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'
import { base44 } from '@/api/mockBase44Client'

export default function CriarContrato() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    numero_contrato: `CONT-${Date.now().toString().slice(-6)}`,
    tipo_contrato: 'prestacao_servicos',
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
    status: 'rascunho',
    testemunhas: []
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addTestemunha = () => {
    setFormData(prev => ({
      ...prev,
      testemunhas: [...prev.testemunhas, { nome: '', cpf: '', endereco: '' }]
    }))
  }

  const removeTestemunha = (index) => {
    setFormData(prev => ({
      ...prev,
      testemunhas: prev.testemunhas.filter((_, i) => i !== index)
    }))
  }

  const handleTestemunhaChange = (index, field, value) => {
    const newTestemunhas = [...formData.testemunhas]
    newTestemunhas[index][field] = value
    setFormData(prev => ({ ...prev, testemunhas: newTestemunhas }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      await base44.entities.Contrato.create(formData)
      alert('Contrato criado com sucesso!')
      navigate('/contratos')
    } catch (error) {
      alert('Erro ao criar contrato: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/contratos')}
            className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Novo Contrato</h1>
            <p className="text-slate-400">Preencha os dados do contrato</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Gerais */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">📋 Informações Gerais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Número do Contrato *
                </label>
                <input
                  type="text"
                  required
                  value={formData.numero_contrato}
                  onChange={(e) => handleChange('numero_contrato', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tipo de Contrato
                </label>
                <select
                  value={formData.tipo_contrato}
                  onChange={(e) => handleChange('tipo_contrato', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="prestacao_servicos">Prestação de Serviços</option>
                  <option value="fornecimento">Fornecimento</option>
                  <option value="consultoria">Consultoria</option>
                  <option value="manutencao">Manutenção</option>
                  <option value="locacao">Locação</option>
                  <option value="parceria">Parceria</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="rascunho">Rascunho</option>
                  <option value="aguardando_assinatura">Aguardando Assinatura</option>
                  <option value="assinado">Assinado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dados do Contratante */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">👤 Dados do Contratante</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nome / Razão Social *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contratante_nome}
                  onChange={(e) => handleChange('contratante_nome', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  CPF / CNPJ
                </label>
                <input
                  type="text"
                  value={formData.contratante_cpf_cnpj}
                  onChange={(e) => handleChange('contratante_cpf_cnpj', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Endereço Completo
                </label>
                <input
                  type="text"
                  value={formData.contratante_endereco}
                  onChange={(e) => handleChange('contratante_endereco', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.contratante_email}
                  onChange={(e) => handleChange('contratante_email', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.contratante_telefone}
                  onChange={(e) => handleChange('contratante_telefone', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Dados do Contratado */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">🏢 Dados do Contratado</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nome / Razão Social *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contratado_nome}
                  onChange={(e) => handleChange('contratado_nome', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  CPF / CNPJ
                </label>
                <input
                  type="text"
                  value={formData.contratado_cpf_cnpj}
                  onChange={(e) => handleChange('contratado_cpf_cnpj', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Endereço Completo
                </label>
                <input
                  type="text"
                  value={formData.contratado_endereco}
                  onChange={(e) => handleChange('contratado_endereco', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.contratado_email}
                  onChange={(e) => handleChange('contratado_email', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.contratado_telefone}
                  onChange={(e) => handleChange('contratado_telefone', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Objeto e Condições */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">📝 Objeto e Condições</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Objeto do Contrato *
                </label>
                <textarea
                  required
                  value={formData.objeto_contrato}
                  onChange={(e) => handleChange('objeto_contrato', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white h-32 focus:outline-none focus:border-purple-500"
                  placeholder="Descreva detalhadamente o objeto do contrato..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Valor do Contrato *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.valor_contrato}
                    onChange={(e) => handleChange('valor_contrato', parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Prazo de Vigência
                  </label>
                  <input
                    type="text"
                    value={formData.prazo_vigencia}
                    onChange={(e) => handleChange('prazo_vigencia', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    placeholder="Ex: 12 meses"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Forma de Pagamento
                </label>
                <textarea
                  value={formData.forma_pagamento}
                  onChange={(e) => handleChange('forma_pagamento', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white h-24 focus:outline-none focus:border-purple-500"
                  placeholder="Descreva as condições de pagamento..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    value={formData.data_inicio}
                    onChange={(e) => handleChange('data_inicio', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Data de Término
                  </label>
                  <input
                    type="date"
                    value={formData.data_termino}
                    onChange={(e) => handleChange('data_termino', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Cláusulas Adicionais
                </label>
                <textarea
                  value={formData.clausulas_adicionais}
                  onChange={(e) => handleChange('clausulas_adicionais', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white h-32 focus:outline-none focus:border-purple-500"
                  placeholder="Cláusulas específicas deste contrato..."
                />
              </div>
            </div>
          </div>

          {/* Testemunhas */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">👥 Testemunhas (Opcional)</h2>
              <button
                type="button"
                onClick={addTestemunha}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
              >
                <Plus className="w-4 h-4" />
                Adicionar Testemunha
              </button>
            </div>

            {formData.testemunhas.length === 0 ? (
              <p className="text-slate-400 text-center py-4">Nenhuma testemunha adicionada</p>
            ) : (
              <div className="space-y-4">
                {formData.testemunhas.map((testemunha, index) => (
                  <div key={index} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-white font-medium">Testemunha {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeTestemunha(index)}
                        className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm text-slate-300 mb-1">Nome Completo</label>
                        <input
                          type="text"
                          value={testemunha.nome}
                          onChange={(e) => handleTestemunhaChange(index, 'nome', e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-300 mb-1">CPF</label>
                        <input
                          type="text"
                          value={testemunha.cpf}
                          onChange={(e) => handleTestemunhaChange(index, 'cpf', e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                          placeholder="000.000.000-00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-300 mb-1">Endereço</label>
                        <input
                          type="text"
                          value={testemunha.endereco}
                          onChange={(e) => handleTestemunhaChange(index, 'endereco', e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/contratos')}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Salvando...' : 'Salvar Contrato'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}