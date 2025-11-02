import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { base44 } from '../api/supabaseClient' // Ajuste o caminho se necessário
import { formatCurrency, formatDate } from '../utils/formatters' // Ajuste o caminho se necessário
import { Loader2, AlertCircle, Printer, Download, ArrowLeft } from 'lucide-react'

// Componente principal da página
function VisualizarProposta() {
  const { id } = useParams()

  // 1. Busca os dados da PROPOSTA específica
  const {
    data: proposta,
    isLoading: isLoadingProposta,
    error: errorProposta,
  } = useQuery({
    queryKey: ['proposta', id],
    queryFn: () => base44.entities.Proposta.get(id),
    enabled: !!id, // Só executa se o ID existir
  })

  // 2. Busca os dados de CONFIGURAÇÃO da empresa
  const {
    data: configData, // Renomeado para não conflitar com 'config'
    isLoading: isLoadingConfig,
    error: errorConfig,
  } = useQuery({
    queryKey: ['configuracao'], // Reutiliza a chave (já é filtrada por usuário)
    queryFn: async () => {
      const data = await base44.entities.ConfiguracaoEmpresa.list();
      return data[0] || {}; // Retorna a primeira config do usuário ou objeto vazio
    }
  })
  // Garante que config seja um objeto mesmo se estiver carregando
  const config = configData || {};


  // 3. Funções de Impressão (Baixar PDF e Imprimir)
  const handlePrint = () => {
    window.print();
  }

  // 4. Estados de Loading e Erro
  if (isLoadingProposta || isLoadingConfig) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 size={48} className="text-blue-500 animate-spin" />
      </div>
    )
  }

  if (errorProposta || errorConfig || !proposta) {
    const message = errorProposta?.message || errorConfig?.message || 'Proposta não encontrada.'
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-400 p-4 text-center">
        <AlertCircle size={48} className="mb-4" />
        <p className="text-xl mb-4">Erro ao carregar proposta: {message}</p>
        <Link to="/propostas" className="text-blue-400 hover:text-blue-300">
          Voltar para a lista
        </Link>
      </div>
    )
  }
  
  // 5. Calcula o Valor Total dos Itens
  const valorTotalItens = (proposta.itens || []).reduce((sum, item) => {
      return sum + (item.quantidade || 0) * (item.valor_unitario || 0);
  }, 0);

  // 6. Renderização do Componente
  return (
    <div className="p-4 md:p-8 bg-slate-900 min-h-screen text-slate-900"> {/* Cor base do texto para o PDF */}
      
      {/* Cabeçalho da Ação (NÃO SERÁ IMPRESSO) */}
      <div className="max-w-5xl mx-auto mb-6 no-print"> 
        <div className="flex justify-between items-center">
          <Link
            to="/propostas"
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
              onClick={handlePrint} // "Baixar" agora também chama a impressão
              className="flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
            >
              <Download size={16} /> Baixar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Container da Proposta (SERÁ IMPRESSO) */}
      <div id="printable-area" className="max-w-5xl mx-auto bg-white p-12 md:p-16 rounded-lg shadow-2xl">
        
        {/* === HEADER === */}
        <header className="flex justify-between items-start pb-8 border-b border-slate-200">
          {/* Lado Esquerdo: Logo e Infos da Empresa */}
          <div className="flex items-start gap-4">
            {/* Logo da Configuração */}
            {config.logo_url && (
              <img 
                src={config.logo_url} 
                alt="Logo da Empresa" 
                className="h-16 w-16 object-contain" // Ajuste o tamanho (h-16) conforme necessário
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">{config.nome_empresa || 'Sua Empresa'}</h1>
              <p className="text-sm text-slate-600">{config.email_empresa}</p>
              <p className="text-sm text-slate-600">{config.telefone_empresa}</p>
              <p className="text-sm text-slate-600">{config.website}</p>
            </div>
          </div>
          {/* Lado Direito: Infos da Proposta */}
          <div className="text-right">
            <h2 className="text-xl font-bold text-blue-600 uppercase tracking-wide">Proposta Comercial</h2>
            <p className="text-2xl font-semibold text-slate-700">{proposta.numero_proposta}</p>
            <p className="text-sm text-slate-600 mt-2">Data: {formatDate(proposta.created_date)}</p>
            <p className="text-sm text-slate-600">Válida até: {formatDate(proposta.validade)}</p>
          </div>
        </header>

        {/* === DADOS DO CLIENTE === */}
        <section className="grid grid-cols-2 gap-8 mt-8 pb-8 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Dados do Cliente</h3>
            <p className="text-lg font-semibold text-slate-800">{proposta.nome_cliente}</p>
            <p className="text-sm text-slate-600">{proposta.empresa_cliente}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">Email</p>
            <p className="text-sm font-medium text-slate-800">{proposta.email_cliente}</p>
            <p className="text-sm text-slate-600 mt-2">Telefone</p>
            <p className="text-sm font-medium text-slate-800">{proposta.telefone_cliente}</p>
          </div>
        </section>

        {/* === DESCRIÇÃO DO SERVIÇO === */}
        <section className="mt-8">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Descrição do Serviço</h3>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {proposta.servico_prestado}
          </p>
          
          <div className="bg-slate-100 p-4 rounded-lg mt-6">
            <h4 className="text-sm font-semibold text-slate-800 mb-1">Prazo de Entrega</h4>
            <p className="text-lg font-bold text-blue-600">{proposta.prazo_entrega || 'N/A'}</p>
          </div>
        </section>

        {/* === ITENS E VALORES === */}
        <section className="mt-8">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Itens e Valores</h3>
          {/* Tabela de Itens */}
          <table className="min-w-full mb-4">
            <thead className="border-b border-slate-300">
              <tr>
                <th scope="col" className="py-2 pr-3 text-left text-sm font-semibold text-slate-600">Descrição</th>
                <th scope="col" className="px-3 py-2 text-center text-sm font-semibold text-slate-600 w-24">Qtd.</th>
                <th scope="col" className="px-3 py-2 text-right text-sm font-semibold text-slate-600 w-32">Valor Unit.</th>
                <th scope="col" className="py-2 pl-3 text-right text-sm font-semibold text-slate-600 w-32">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(proposta.itens || []).map((item, index) => (
                <tr key={index}>
                  <td className="whitespace-pre-wrap py-3 pr-3 text-sm font-medium text-slate-800">{item.descricao}</td>
                  <td className="px-3 py-3 text-center text-sm text-slate-600">{item.quantidade}</td>
                  <td className="px-3 py-3 text-right text-sm text-slate-600">{formatCurrency(item.valor_unitario)}</td>
                  <td className="py-3 pl-3 text-right text-sm font-semibold text-slate-800">
                    {formatCurrency((item.quantidade || 0) * (item.valor_unitario || 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Barra de Valor Total */}
          <div className="flex justify-between items-center bg-blue-600 text-white p-4 rounded-md">
            <span className="text-lg font-bold uppercase">Valor Total</span>
            <span className="text-2xl font-bold">{formatCurrency(valorTotalItens)}</span>
          </div>
        </section>

        {/* === OBSERVAÇÕES === */}
        {proposta.observacoes && (
          <section className="mt-8">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Observações</h3>
            <p className="text-sm text-slate-700 italic whitespace-pre-wrap">
              {proposta.observacoes}
            </p>
          </section>
        )}

        {/* === TERMOS E CONDIÇÕES === */}
        {config.termos_condicoes && (
          <section className="mt-8 pt-8 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Termos e Condições</h3>
            <div className="text-sm text-slate-700 leading-relaxed space-y-2 whitespace-pre-wrap">
              {/* Divide os termos por linha e renderiza como lista (ou parágrafos) */}
              {config.termos_condicoes.split('\n').map((linha, i) => (
                <p key={i}>{linha}</p>
              ))}
            </div>
          </section>
        )}
        
        {/* === RODAPÉ === */}
        <footer className="mt-12 pt-8 border-t border-slate-200 text-center">
          {config.mensagem_rodape && (
            <p className="text-md font-semibold text-slate-800 mb-2">{config.mensagem_rodape}</p>
          )}
          <p className="text-sm text-slate-600">{config.nome_empresa}</p>
          <p className="text-sm text-slate-600">
            {config.endereco && <span>{config.endereco}</span>}
            {config.cnpj && <span> • CNPJ: {config.cnpj}</span>}
          </p>
        </footer>
        
      </div>
    </div>
  )
}

export default VisualizarProposta