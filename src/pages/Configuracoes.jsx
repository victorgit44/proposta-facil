import React, { useState, useEffect } from 'react'
import { Save, Upload, Loader2 } from 'lucide-react'
import { base44, supabase } from '../api/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { toast } from 'sonner' // <--- IMPORTANTE

export default function Configuracoes() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [logoFile, setLogoFile] = useState(null)
  
  const [formData, setFormData] = useState({
    nome_empresa: '',
    cnpj: '',
    email_empresa: '',
    telefone_empresa: '',
    endereco: '',
    website: '',
    logo_url: '',
    cor_primaria: '#2563eb',
    mensagem_rodape: '',
    termos_condicoes: ''
  })

  // Carrega configurações
  useEffect(() => {
    async function loadConfig() {
      if (!user) return
      try {
        const configs = await base44.entities.ConfiguracaoEmpresa.list()
        if (configs && configs.length > 0) {
          setFormData(configs[0])
        }
      } catch (error) {
        console.error('Erro ao carregar configs:', error)
        toast.error('Erro ao carregar configurações.')
      } finally {
        setLoading(false)
      }
    }
    loadConfig()
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0])
    }
  }

  // Função para converter arquivo em Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    // Inicia toast de carregamento
    const toastId = toast.loading('Salvando configurações...')

    try {
      let finalLogoUrl = formData.logo_url

      // 1. Upload do Logo (se houver novo arquivo)
      if (logoFile) {
        toast.loading('Enviando logo...', { id: toastId }) // Atualiza mensagem
        
        const base64File = await fileToBase64(logoFile)
        
        // Chama a Edge Function 'upload-logo'
        const { data, error } = await supabase.functions.invoke('upload-logo', {
          body: {
            image: base64File,
            filename: logoFile.name
          }
        })

        if (error) throw error
        if (data?.url) {
          finalLogoUrl = data.url
        }
      }

      // 2. Salvar no Banco
      const dadosParaSalvar = { ...formData, logo_url: finalLogoUrl }
      
      // Verifica se já existe config para atualizar ou criar
      const configs = await base44.entities.ConfiguracaoEmpresa.list()
      
      if (configs.length > 0) {
        await base44.entities.ConfiguracaoEmpresa.update(configs[0].id, dadosParaSalvar)
      } else {
        await base44.entities.ConfiguracaoEmpresa.create(dadosParaSalvar)
      }

      // Atualiza estado local
      setFormData(dadosParaSalvar)
      setLogoFile(null)
      
      // Sucesso!
      toast.success('Configurações salvas com sucesso!', { id: toastId })

    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast.error('Erro ao salvar: ' + (error.message || 'Erro desconhecido'), { id: toastId })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-blue-500" size={48} /></div>
  }

  return (
    <div className="p-4 md:p-8 text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">⚙️ Configurações da Empresa</h1>
        
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Logo e Identidade */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Identidade Visual</h2>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1 w-full">
                <label className="block text-sm text-slate-400 mb-2">Logo da Empresa</label>
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div className="w-24 h-24 bg-slate-900 border border-slate-600 rounded-lg flex items-center justify-center overflow-hidden">
                    {logoFile ? (
                      <img src={URL.createObjectURL(logoFile)} alt="Preview" className="w-full h-full object-contain" />
                    ) : formData.logo_url ? (
                      <img src={formData.logo_url} alt="Logo Atual" className="w-full h-full object-contain" />
                    ) : (
                      <Upload className="text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                    />
                    <p className="text-xs text-slate-500 mt-2">Recomendado: PNG ou JPG transparente.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Dados da Empresa */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Dados da Empresa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Nome da Empresa</label>
                <input type="text" name="nome_empresa" value={formData.nome_empresa} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">CNPJ</label>
                <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email de Contato</label>
                <input type="email" name="email_empresa" value={formData.email_empresa} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Telefone</label>
                <input type="text" name="telefone_empresa" value={formData.telefone_empresa} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-400 mb-1">Endereço Completo</label>
                <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-400 mb-1">Website</label>
                <input type="text" name="website" value={formData.website} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" />
              </div>
            </div>
          </section>

          {/* Textos Padrão */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Textos Padrão</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Termos e Condições (Padrão para Propostas)</label>
                <textarea name="termos_condicoes" rows="4" value={formData.termos_condicoes} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" placeholder="Ex: Validade da proposta de 15 dias..." />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Mensagem de Rodapé</label>
                <input type="text" name="mensagem_rodape" value={formData.mensagem_rodape} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" placeholder="Ex: Obrigado pela preferência!" />
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50">
              <Save size={20} />
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}