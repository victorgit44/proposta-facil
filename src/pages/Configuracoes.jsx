import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Save, Upload, Building2, Palette } from "lucide-react";
import { motion } from "framer-motion";
import { TelefoneInput, CNPJInput } from "../components/InputMask";

export default function Configuracoes() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: configuracoes = [] } = useQuery({
    queryKey: ['configuracoes'],
    queryFn: () => base44.entities.ConfiguracaoEmpresa.list(),
  });

  const configuracao = configuracoes[0];

  const [formData, setFormData] = useState({
    nome_empresa: "",
    email_empresa: "",
    telefone_empresa: "",
    endereco: "",
    cnpj: "",
    website: "",
    logo_url: "",
    cor_primaria: "#2563eb",
    cor_secundaria: "#1e293b",
    termos_condicoes: "",
    mensagem_rodape: ""
  });

  useEffect(() => {
    if (configuracao) {
      setFormData(configuracao);
    }
  }, [configuracao]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (configuracao?.id) {
        return base44.entities.ConfiguracaoEmpresa.update(configuracao.id, data);
      } else {
        return base44.entities.ConfiguracaoEmpresa.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes'] });
    },
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      handleChange('logo_url', file_url);
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
    }
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Configurações
              </h1>
              <p className="text-slate-400 mt-1">Configure os dados da sua empresa</p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800 shadow-xl hover:shadow-2xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  Informações da Empresa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-300 font-medium">Logotipo da Empresa</Label>
                  <div className="mt-2 flex items-center gap-4">
                    {formData.logo_url && (
                      <img 
                        src={formData.logo_url} 
                        alt="Logo" 
                        className="h-20 w-20 object-contain rounded-lg border-2 border-slate-700 bg-white p-2"
                      />
                    )}
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="bg-slate-800 border-slate-700 text-white file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-4 file:py-2 file:mr-4 hover:file:bg-blue-700 cursor-pointer transition-colors"
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        {uploading ? 'Enviando...' : 'PNG, JPG até 5MB'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300 font-medium">Nome da Empresa</Label>
                    <Input
                      value={formData.nome_empresa}
                      onChange={(e) => handleChange('nome_empresa', e.target.value)}
                      className="mt-1.5 bg-slate-800 border-slate-700 text-white focus:border-blue-500 transition-colors"
                      placeholder="Sua Empresa Ltda"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300 font-medium">CNPJ</Label>
                    <CNPJInput
                      value={formData.cnpj}
                      onChange={(e) => handleChange('cnpj', e.target.value)}
                      className="mt-1.5 bg-slate-800 border-slate-700 text-white focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300 font-medium">Email</Label>
                    <Input
                      type="email"
                      value={formData.email_empresa}
                      onChange={(e) => handleChange('email_empresa', e.target.value)}
                      className="mt-1.5 bg-slate-800 border-slate-700 text-white focus:border-blue-500 transition-colors"
                      placeholder="contato@empresa.com"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300 font-medium">Telefone</Label>
                    <TelefoneInput
                      value={formData.telefone_empresa}
                      onChange={(e) => handleChange('telefone_empresa', e.target.value)}
                      className="mt-1.5 bg-slate-800 border-slate-700 text-white focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300 font-medium">Website</Label>
                    <Input
                      value={formData.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      className="mt-1.5 bg-slate-800 border-slate-700 text-white focus:border-blue-500 transition-colors"
                      placeholder="www.empresa.com"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300 font-medium">Endereço</Label>
                    <Input
                      value={formData.endereco}
                      onChange={(e) => handleChange('endereco', e.target.value)}
                      className="mt-1.5 bg-slate-800 border-slate-700 text-white focus:border-blue-500 transition-colors"
                      placeholder="Rua, Número - Cidade/UF"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800 shadow-xl hover:shadow-2xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className="w-5 h-5 text-blue-400" />
                  Cores da Marca
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300 font-medium">Cor Primária</Label>
                    <div className="flex gap-3 items-center mt-2">
                      <Input
                        type="color"
                        value={formData.cor_primaria}
                        onChange={(e) => handleChange('cor_primaria', e.target.value)}
                        className="w-16 h-12 p-1 bg-slate-800 border-slate-700 cursor-pointer hover:border-blue-500 transition-colors"
                      />
                      <Input
                        value={formData.cor_primaria}
                        onChange={(e) => handleChange('cor_primaria', e.target.value)}
                        className="flex-1 bg-slate-800 border-slate-700 text-white focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-300 font-medium">Cor Secundária</Label>
                    <div className="flex gap-3 items-center mt-2">
                      <Input
                        type="color"
                        value={formData.cor_secundaria}
                        onChange={(e) => handleChange('cor_secundaria', e.target.value)}
                        className="w-16 h-12 p-1 bg-slate-800 border-slate-700 cursor-pointer hover:border-blue-500 transition-colors"
                      />
                      <Input
                        value={formData.cor_secundaria}
                        onChange={(e) => handleChange('cor_secundaria', e.target.value)}
                        className="flex-1 bg-slate-800 border-slate-700 text-white focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800 shadow-xl hover:shadow-2xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-white">Textos Padrão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-300 font-medium">Termos e Condições</Label>
                  <Textarea
                    value={formData.termos_condicoes}
                    onChange={(e) => handleChange('termos_condicoes', e.target.value)}
                    className="mt-1.5 bg-slate-800 border-slate-700 text-white h-32 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Digite os termos e condições padrão que aparecerão nas propostas"
                  />
                </div>
                <div>
                  <Label className="text-slate-300 font-medium">Mensagem do Rodapé</Label>
                  <Textarea
                    value={formData.mensagem_rodape}
                    onChange={(e) => handleChange('mensagem_rodape', e.target.value)}
                    className="mt-1.5 bg-slate-800 border-slate-700 text-white h-24 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Mensagem que aparece no rodapé das propostas"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end"
          >
            <Button
              type="submit"
              disabled={saveMutation.isPending}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveMutation.isPending ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}