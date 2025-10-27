import React, { useState, useEffect, useRef } from 'react' // Adicione useRef
import { useNavigate } from 'react-router-dom'
import { Settings, Save, Loader2, AlertCircle, UploadCloud } from 'lucide-react' // Adicione UploadCloud
import { useQuery } from '@tanstack/react-query'
// IMPORTANTE: Precisamos do 'supabase' diretamente para o Storage
import { base44, supabase } from '@/api/supabaseClient' // Ajuste o caminho se necessário e importe 'supabase'
import { queryClient } from '@/queryClient' // Ajuste o caminho se necessário

// Estado inicial do formulário
const initialState = {
  id: null,
  nome_empresa: '',
  email_empresa: '',
  telefone_empresa: '',
  endereco: '',
  cnpj: '',
  website: '',
  logo_url: '', // Mantém a URL atual
  cor_primaria: '#2563eb',
  cor_secundaria: '#1e293b',
  termos_condicoes: '',
  mensagem_rodape: '',
}

export default function Configuracoes() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState(initialState)
  const [selectedFile, setSelectedFile] = useState(null) // Para guardar o arquivo selecionado
  const [previewUrl, setPreviewUrl] = useState(null) // Para mostrar a prévia do logo
  const fileInputRef = useRef(null); // Para acionar o input de arquivo

  // 1. BUSCAR A CONFIGURAÇÃO EXISTENTE
  const {
    data: config,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['configuracao'],
    queryFn: async () => {
      const data = await base44.entities.ConfiguracaoEmpresa.list();
      return data[0] || initialState;
    },
    staleTime: Infinity,
  })

  // 2. PREENCHER O FORMULÁRIO QUANDO OS DADOS CHEGAREM
  useEffect(() => {
    if (config) {
      setFormData({
        ...initialState,
        ...config,
      });
      // Define a URL de prévia inicial se já existir um logo
      if (config.logo_url) {
        setPreviewUrl(config.logo_url);
      }
    }
  }, [config])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // --- Funções para Upload de Logo ---
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && ['image/png', 'image/jpeg'].includes(file.type) && file.size <= 5 * 1024 * 1024) {
      setSelectedFile(file);
      // Cria uma URL temporária para a prévia
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl(formData.logo_url); // Volta para a URL salva se o arquivo for inválido
      alert('Por favor, selecione um arquivo PNG ou JPG com no máximo 5MB.');
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  }

  // Função para fazer upload do arquivo para o Supabase Storage
  const uploadLogo = async (file) => {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    // Gera um nome único para evitar conflitos
    const fileName = `logo-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`; // Salva direto na raiz do bucket 'logo'

    setSaving(true); // Indica que o upload está acontecendo
    console.log(`Fazendo upload para: logo/${filePath}`);

    // Usa o 'supabase' importado diretamente
    const { data, error } = await supabase.storage
      .from('logo') // Nome do bucket que criamos
      .upload(filePath, file, {
        cacheControl: '3600', // Cache de 1 hora
        upsert: true // Sobrescreve se já existir (útil para re-upload)
      });

    setSaving(false);

    if (error) {
      console.error('Erro no upload:', error);
      throw new Error(`Erro ao fazer upload do logo: ${error.message}`);
    }

    // Pega a URL pública do arquivo que acabamos de subir
    const { data: publicURLData } = supabase.storage
      .from('logo')
      .getPublicUrl(filePath);
      
    console.log('URL Pública:', publicURLData.publicUrl);
    return publicURLData.publicUrl;
  }
  // --- Fim das Funções de Upload ---

  // 3. FUNÇÃO PARA SALVAR (COM LÓGICA DE UPLOAD)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      let newLogoUrl = formData.logo_url; // Assume a URL atual

      // Se um novo arquivo foi selecionado, faz o upload
      if (selectedFile) {
        console.log("Novo arquivo selecionado, iniciando upload...");
        newLogoUrl = await uploadLogo(selectedFile);
        if (!newLogoUrl) {
           // Se o upload falhar, não continua
           throw new Error("Falha ao obter URL pública do logo após upload.");
        }
         console.log("Upload concluído, nova URL:", newLogoUrl);
      } else {
         console.log("Nenhum arquivo novo selecionado, mantendo logo_url atual.");
      }

      // Prepara os dados para salvar na tabela 'configuracoes_empresa'
      const dataToSave = {
        ...formData,
        logo_url: newLogoUrl, // Usa a nova URL (se houver) ou a antiga
      };
      
      // Remove o ID nulo se for uma criação
      if (!dataToSave.id) {
        delete dataToSave.id;
      }
      
      let savedConfig;
      if (formData.id) {
        console.log("Atualizando configuração ID:", formData.id);
        savedConfig = await base44.entities.ConfiguracaoEmpresa.update(formData.id, dataToSave);
      } else {
         console.log("Criando nova configuração...");
        savedConfig = await base44.entities.ConfiguracaoEmpresa.create(dataToSave);
        // Atualiza o estado com o ID retornado
        setFormData(prev => ({ ...prev, id: savedConfig.id }));
         console.log("Configuração criada, ID:", savedConfig.id);
      }

      queryClient.invalidateQueries({ queryKey: ['configuracao'] })
      // Limpa o arquivo selecionado após salvar
      setSelectedFile(null);
      // A prévia agora mostrará a URL salva
      setPreviewUrl(newLogoUrl);

      alert('Configurações salvas com sucesso!')

    } catch (error) {
      console.error("Erro completo ao salvar:", error);
      alert('Erro ao salvar configurações: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  // 4. ESTADOS DE LOADING E ERRO (iguais)
  if (isLoading) { /* ... código de loading ... */ 
     return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 size={48} className="text-blue-500 animate-spin" />
      </div>
    )
  }
  if (error) { /* ... código de erro ... */ 
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-400">
        <AlertCircle size={48} className="mb-4" />
        <p>Erro ao carregar configurações: {error.message}</p>
      </div>
    )
  }

  // 5. RENDERIZAÇÃO DO FORMULÁRIO (com input de arquivo)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header (igual) */}
        {/* ... */}
         <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-600 rounded-lg">
             <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Configurações</h1>
            <p className="text-slate-400">Configure os dados da sua empresa</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Informações da Empresa (com input de arquivo funcional) */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">🏢 Informações da Empresa</h2>
            
            {/* Logo - Agora funcional */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Logotipo da Empresa</label>
              <div className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-700 rounded-lg">
                {/* Prévia do Logo */}
                <div className="w-16 h-16 bg-slate-700 rounded-md flex items-center justify-center text-slate-500 overflow-hidden">
                  {previewUrl ? (
                     <img src={previewUrl} alt="Logo Preview" className="w-full h-full object-contain" />
                  ) : (
                    <UploadCloud size={24} />
                  )}
                </div>
                {/* Botão que aciona o input escondido */}
                <button 
                  type="button" 
                  onClick={triggerFileInput}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
                >
                  Escolher arquivo
                </button>
                {/* Mostra o nome do arquivo selecionado */}
                <span className="text-sm text-slate-500 flex-1 truncate">
                   {selectedFile ? selectedFile.name : 'Nenhum arquivo escolhido'} (PNG, JPG até 5MB)
                </span>
                 {/* Input de arquivo escondido */}
                 <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                 />
              </div>
            </div>

            {/* Restante dos campos (iguais) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ... Nome, CNPJ, Email, Telefone, Website, Endereço ... */}
               <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nome da Empresa</label>
                <input type="text" value={formData.nome_empresa} onChange={(e) => handleChange('nome_empresa', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">CNPJ</label>
                <input type="text" value={formData.cnpj} onChange={(e) => handleChange('cnpj', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input type="email" value={formData.email_empresa} onChange={(e) => handleChange('email_empresa', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Telefone</label>
                <input type="tel" value={formData.telefone_empresa} onChange={(e) => handleChange('telefone_empresa', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Website</label>
                <input type="url" value={formData.website} onChange={(e) => handleChange('website', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Endereço</label>
                <input type="text" value={formData.endereco} onChange={(e) => handleChange('endereco', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>

          {/* Cores da Marca (igual) */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">🎨 Cores da Marca</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ... Cor Primária e Secundária ... */}
               <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Cor Primária</label>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2">
                  <input type="color" value={formData.cor_primaria} onChange={(e) => handleChange('cor_primaria', e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer p-0" style={{backgroundColor: formData.cor_primaria}} />
                  <input type="text" value={formData.cor_primaria} onChange={(e) => handleChange('cor_primaria', e.target.value)} className="flex-1 bg-transparent text-white focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Cor Secundária</label>
                 <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2">
                   <input type="color" value={formData.cor_secundaria} onChange={(e) => handleChange('cor_secundaria', e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer p-0" style={{backgroundColor: formData.cor_secundaria}}/>
                   <input type="text" value={formData.cor_secundaria} onChange={(e) => handleChange('cor_secundaria', e.target.value)} className="flex-1 bg-transparent text-white focus:outline-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Textos Padrão (igual) */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">✍️ Textos Padrão</h2>
            <div className="space-y-4">
              {/* ... Termos e Rodapé ... */}
               <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Termos e Condições</label>
                <textarea value={formData.termos_condicoes} onChange={(e) => handleChange('termos_condicoes', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white h-32 focus:outline-none focus:border-blue-500" placeholder="Digite os termos e condições padrão que aparecerão nas propostas" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Mensagem do Rodapé</label>
                <textarea value={formData.mensagem_rodape} onChange={(e) => handleChange('mensagem_rodape', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white h-24 focus:outline-none focus:border-blue-500" placeholder="Mensagem que aparece no rodapé das propostas" />
              </div>
            </div>
          </div>

          {/* Botão Salvar (igual) */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}