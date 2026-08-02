import React, { useState, useEffect } from 'react';
import { Save, Upload, Loader2, Building, Image, FileText, CheckCircle2, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { base44, supabase } from '../api/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function Configuracoes() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [activeTab, setActiveTab] = useState('empresa');

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
  });

  useEffect(() => {
    async function loadConfig() {
      if (!user) return;
      try {
        const configs = await base44.entities.ConfiguracaoEmpresa.list();
        if (configs && configs.length > 0) {
          setFormData(configs[0]);
        }
      } catch (error) {
        console.error('Erro ao carregar configs:', error);
        toast.error('Erro ao carregar configurações.');
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading('Salvando configurações corporativas...');

    try {
      let finalLogoUrl = formData.logo_url;

      if (logoFile) {
        toast.loading('Enviando marca/logo...', { id: toastId });
        const base64File = await fileToBase64(logoFile);
        
        const { data, error } = await supabase.functions.invoke('upload-logo', {
          body: {
            image: base64File,
            filename: logoFile.name
          }
        });

        if (error) throw error;
        if (data?.url) {
          finalLogoUrl = data.url;
        }
      }

      const dadosParaSalvar = { ...formData, logo_url: finalLogoUrl };
      const configs = await base44.entities.ConfiguracaoEmpresa.list();

      if (configs.length > 0) {
        await base44.entities.ConfiguracaoEmpresa.update(configs[0].id, dadosParaSalvar);
      } else {
        await base44.entities.ConfiguracaoEmpresa.create(dadosParaSalvar);
      }

      setFormData(dadosParaSalvar);
      setLogoFile(null);
      toast.success('Configurações salvas com sucesso!', { id: toastId });

    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar: ' + (error.message || 'Erro desconhecido'), { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-6 border-b border-[#1e1e2e]">
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Configurações da Empresa
        </h1>
        <p className="text-sm text-[#8888a0] mt-1">
          Personalize a marca, logotipo e termos contratuais exibidos em suas propostas.
        </p>
      </div>

      {/* Form Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1e1e2e] pb-3">
        {[
          { id: 'empresa', label: 'Dados da Empresa', icon: Building },
          { id: 'identidade', label: 'Logo & Marca', icon: Image },
          { id: 'termos', label: 'Textos & Termos Padrão', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-[#8888a0] hover:text-white hover:bg-[#1a1a24]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Tab 1: Dados da Empresa */}
        {activeTab === 'empresa' && (
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-400" />
              <span>Informações Cadastrais da Empresa</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Nome Fantasia / Razão Social
                </label>
                <input
                  type="text"
                  name="nome_empresa"
                  value={formData.nome_empresa}
                  onChange={handleChange}
                  placeholder="Ex: ACME Soluções Digitais Ltda"
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  CNPJ / Identificação Fiscal
                </label>
                <input
                  type="text"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleChange}
                  placeholder="00.000.000/0001-00"
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  E-mail Comercial
                </label>
                <input
                  type="email"
                  name="email_empresa"
                  value={formData.email_empresa}
                  onChange={handleChange}
                  placeholder="contato@empresa.com"
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  name="telefone_empresa"
                  value={formData.telefone_empresa}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Endereço Comercial Completo
                </label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  placeholder="Av. Paulista, 1000 - Cj 50 - São Paulo/SP"
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Website da Empresa
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://www.suaempresa.com.br"
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Logo & Marca */}
        {activeTab === 'identidade' && (
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Image className="w-4 h-4 text-blue-400" />
              <span>Marca e Logotipo nas Propostas</span>
            </h2>

            <div className="flex flex-col md:flex-row gap-6 items-center bg-slate-950/60 p-6 rounded-2xl border border-slate-800/80">
              <div className="w-32 h-32 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                {logoFile ? (
                  <img src={URL.createObjectURL(logoFile)} alt="Preview Logo" className="w-full h-full object-contain p-2" />
                ) : formData.logo_url ? (
                  <img src={formData.logo_url} alt="Logo Atual" className="w-full h-full object-contain p-2" />
                ) : (
                  <Upload className="w-8 h-8 text-slate-600" />
                )}
              </div>

              <div className="space-y-3 flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                />
                <p className="text-xs text-slate-500">
                  Recomendado: Formato PNG transparente com dimensões mínimas de 300x100px. O logotipo será incluído no cabeçalho das propostas geradas em PDF.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Textos & Termos */}
        {activeTab === 'termos' && (
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Cláusulas e Rodapé Padrão</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Termos e Condições Padrão (Propostas)
                </label>
                <textarea
                  name="termos_condicoes"
                  rows={5}
                  value={formData.termos_condicoes}
                  onChange={handleChange}
                  placeholder="Ex: Esta proposta tem validade de 15 dias corridos a contar da data de emissão. O pagamento será efetuado em 50% no aceite e 50% na entrega."
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Mensagem de Rodapé Agradecimento
                </label>
                <input
                  type="text"
                  name="mensagem_rodape"
                  value={formData.mensagem_rodape}
                  onChange={handleChange}
                  placeholder="Ex: Agradecemos a oportunidade de apresentar esta proposta comercial."
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Bar */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 transition duration-200 shadow-lg shadow-blue-600/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}