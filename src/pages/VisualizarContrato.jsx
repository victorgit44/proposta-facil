import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { base44 } from '../api/supabaseClient' // Ajuste o caminho se necessário
import { formatCurrency, formatDate } from '../utils/formatters' // Ajuste o caminho se necessário
import { Loader2, AlertCircle, Printer, Download, ArrowLeft } from 'lucide-react'

// Componente helper para formatar os parágrafos "CONTRATANTE" e "CONTRATADO"
//
function ParteInfoParagraph({ titulo, dados }) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold text-slate-900 uppercase mb-2">{titulo}:</h3>
      {/* Renderiza como um parágrafo único, adicionando vírgulas e texto
        exatamente como no design de referência.
      */}
      <p className="text-sm text-slate-700 leading-relaxed">
        <strong>{dados.nome || 'Nome não informado'}</strong>
        {dados.cpf_cnpj && `, inscrito(a) no CPF/CNPJ sob nº ${dados.cpf_cnpj},`}
        {dados.endereco && ` com endereço à ${dados.endereco},`}
        {dados.email && ` e-mail ${dados.email},`}
        {dados.telefone && ` telefone ${dados.telefone}.`}
      </p>
    </div>
  )
}

// Componente principal da página
function VisualizarContrato() {
  const { id } = useParams()

  // 1. Busca os dados do CONTRATO
  const {
    data: contrato,
    isLoading: isLoadingContrato,
    error: errorContrato,
  } = useQuery({
    queryKey: ['contrato', id],
    queryFn: () => base44.entities.Contrato.get(id),
    enabled: !!id,
  })

  // 2. Busca os dados de CONFIGURAÇÃO da empresa
  const {
    data: configData,
    isLoading: isLoadingConfig,
    error: errorConfig,
  } = useQuery({
    queryKey: ['configuracao'],
    queryFn: async () => {
      const data = await base44.entities.ConfiguracaoEmpresa.list();
      return data[0] || {};
    }
  })
  const config = configData || {}; // Garante que 'config' seja um objeto

  // 3. Funções de Impressão
  const handlePrint = () => {
    window.print();
  }

  // 4. Estados de Loading e Erro
  if (isLoadingContrato || isLoadingConfig) {
    return <div className="flex justify-center items-center h-screen"><Loader2 size={48} className="text-purple-500 animate-spin" /></div>
  }
  if (errorContrato || errorConfig || !contrato) {
    const message = errorContrato?.message || errorConfig?.message || 'Contrato não encontrado.'
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-400 p-4 text-center">
        <AlertCircle size={48} className="mb-4" />
        <p className="text-xl mb-4">Erro ao carregar contrato: {message}</p>
        <Link to="/contratos" className="text-blue-400 hover:text-blue-300">
          Voltar para a lista
        </Link>
      </div>
    )
  }
  
  // 5. Mapeia os dados para os helpers
  const contratante = {
    nome: contrato.contratante_nome,
    cpf_cnpj: contrato.contratante_cpf_cnpj,
    endereco: contrato.contratante_endereco,
    email: contrato.contratante_email,
    telefone: contrato.contratante_telefone,
  }
  
  const contratado = {
    nome: contrato.contratado_nome || config.nome_empresa,
    cpf_cnpj: contrato.contratado_cpf_cnpj || config.cnpj,
    endereco: contrato.contratado_endereco || config.endereco,
    email: contrato.contratado_email || config.email_empresa,
    telefone: contrato.contratado_telefone || config.telefone_empresa,
  }
  
  const testemunhas = Array.isArray(contrato.testemunhas) ? contrato.testemunhas : [];
  // Tenta extrair a cidade do endereço do contratado para o local de assinatura
  const localAssinatura = contratado.endereco?.split(' - ')[1]?.split('/')[0] || 'Sua Cidade';

  // 6. Renderização do Componente
  return (
    // Fundo escuro
    <div className="p-4 md:p-8 bg-slate-900 min-h-screen text-slate-900">
      
      {/* Cabeçalho da Ação (NÃO SERÁ IMPRESSO) */}
      <div className="max-w-5xl mx-auto mb-6 no-print"> 
        <div className="flex justify-between items-center">
          <Link
            to="/contratos"
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition"
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 text-sm text-slate-300 bg-slate-700/50 hover:bg-slate-700 px-4 py-2 rounded-lg transition"
            >
              <Printer size={16} /> Imprimir PDF
            </button>
            <button
              onClick={handlePrint} 
              className="flex items-center gap-2 text-sm text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
            >
              <Download size={16} /> Baixar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Container do Contrato (SERÁ IMPRESSO) */}
      <div id="printable-area" className="max-w-5xl mx-auto bg-white p-12 md:p-16 rounded-lg shadow-2xl">
        
        {/* Cabeçalho do Documento */}
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold uppercase mb-2">Contrato de Prestação de Serviços</h1>
          <p className="text-lg font-semibold text-slate-700">Nº {contrato.numero_contrato}</p>
        </header>

        {/* Introdução e Partes */}
        <p className="text-sm text-slate-700 leading-relaxed mb-6">
          Por este instrumento particular de contrato de prestação de serviços, de um lado:
        </p>

        <ParteInfoParagraph titulo="CONTRATANTE" dados={contratante} />
        
        <p className="text-sm text-slate-700 leading-relaxed my-6">
          E de outro lado:
        </p>

        <ParteInfoParagraph titulo="CONTRATADO" dados={contratado} />

        <p className="text-sm text-slate-700 leading-relaxed my-6">
          Têm entre si justo e contratado o seguinte:
        </p>

        {/* Cláusulas */}
        <section className="space-y-6">
          {/* Objeto */}
          <div>
            <h2 className="text-lg font-bold uppercase mb-2">Cláusula Primeira - Do Objeto</h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{contrato.objeto_contrato}</p>
          </div>
          
          {/* Valor e Pagamento */}
          <div>
            <h2 className="text-lg font-bold uppercase mb-2">Cláusula Segunda - Do Valor e Forma de Pagamento</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              O valor total do presente contrato é de <strong>{formatCurrency(contrato.valor_contrato)}</strong>.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed mt-2 whitespace-pre-wrap">
              {contrato.forma_pagamento}
            </p>
          </div>
          
          {/* Prazo */}
          <div>
            <h2 className="text-lg font-bold uppercase mb-2">Cláusula Terceira - Do Prazo</h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              O presente contrato terá vigência de {contrato.prazo_vigencia || 'prazo não definido'}
              {contrato.data_inicio && `, iniciando em ${formatDate(contrato.data_inicio)}`}
              {contrato.data_termino && ` e encerrando em ${formatDate(contrato.data_termino)}`}.
            </p>
          </div>
          
          {/* Cláusulas Adicionais */}
          {contrato.clausulas_adicionais && (
            <div>
              <h2 className="text-lg font-bold uppercase mb-2">Cláusulas Adicionais</h2>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{contrato.clausulas_adicionais}</p>
            </div>
          )}

          {/* Foro */}
          <div>
            <h2 className="text-lg font-bold uppercase mb-2">Cláusula Final - Do Foro</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              As partes elegem o foro da comarca de {localAssinatura || 'Sua Cidade'} para dirimir quaisquer dúvidas ou controvérsias oriundas deste contrato, renunciando a qualquer outro, por mais privilegiado que seja.
            </p>
          </div>
        </section>

        {/* Assinaturas */}
        <footer className="mt-16">
          <p className="text-sm text-slate-700 leading-relaxed text-center">
            E, por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor e forma, na presença das testemunhas abaixo.
          </p>
          
          <p className="text-center mt-8">
            {localAssinatura}, {formatDate(contrato.created_date || new Date())}.
          </p>

          <div className="grid grid-cols-2 gap-16 mt-20">
            <div className="text-center">
              <div className="border-b-2 border-slate-900 w-full mb-2"></div>
              <p className="text-sm font-bold">{contratante.nome}</p>
              <p className="text-xs uppercase text-slate-600 tracking-wider">CONTRATANTE</p>
            </div>
            <div className="text-center">
              <div className="border-b-2 border-slate-900 w-full mb-2"></div>
              <p className="text-sm font-bold">{contratado.nome}</p>
              <p className="text-xs uppercase text-slate-600 tracking-wider">CONTRATADO</p>
            </div>
          </div>
          
          {/* Testemunhas */}
          {testemunhas.length > 0 && (
            <div className="mt-16">
              <h3 className="text-md font-bold uppercase text-center mb-8">Testemunhas:</h3>
              <div className="grid grid-cols-2 gap-16">
                {testemunhas.map((t, index) => (
                  <div key={index} className="text-center">
                    <div className="border-b-2 border-slate-900 w-full mb-2"></div>
                    <p className="text-sm font-bold">{t.nome}</p>
                    <p className="text-xs text-slate-600">CPF: {t.cpf}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </footer>
        
      </div>
    </div>
  )
}

export default VisualizarContrato