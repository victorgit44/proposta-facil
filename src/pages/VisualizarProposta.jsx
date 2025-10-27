import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { base44 } from '../api/supabaseClient'
import { formatCurrency, formatDate } from '../utils/formatters' // Usando o helper que criamos
import { Loader2, AlertCircle, Printer, Download, ArrowLeft } from 'lucide-react'

// Componente para a tabela de itens
function ItensTable({ itens, valorTotal }) {
  // O seu schema define 'itens' como JSONB.
  // Vamos garantir que é um array antes de tentar usar o .map()
  const itensProposta = Array.isArray(itens) ? itens : []
  
  return (
    <div className="mt-8">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Itens e Valores
      </h3>
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-slate-700">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">Descrição</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Qtd.</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Valor Unit.</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-white sm:pr-0">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {/* Presumindo que seu JSONB 'itens' tem esta estrutura:
                  [ { "descricao": "...", "quantidade": 1, "valor_unitario": 100 } ]
                  Se for diferente, ajuste os nomes 'item.descricao', 'item.quantidade', etc.
                */}
                {itensProposta.map((item, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">{item.descricao}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">{item.quantidade}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">{formatCurrency(item.valor_unitario)}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium text-white sm:pr-0">
                      {formatCurrency(item.quantidade * (item.valor_unitario || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="3" scope="row" className="pt-4 pl-4 pr-3 text-right text-base font-semibold text-white sm:pl-0">VALOR TOTAL</th>
                  <td className="pt-4 pl-3 pr-4 text-right text-2xl font-bold text-blue-400 sm:pr-0">
                    {formatCurrency(valorTotal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente principal da página
function VisualizarProposta() {
  const { id } = useParams()

  // === INÍCIO DAS MUDANÇAS ===

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
    data: config,
    isLoading: isLoadingConfig,
    error: errorConfig,
  } = useQuery({
    queryKey: ['configuracao'],
    queryFn: async () => {
      // Busca a lista de configurações
      const data = await base44.entities.ConfiguracaoEmpresa.list();
      // Retorna a primeira configuração encontrada (ou um objeto vazio)
      return data[0] || {};
    }
  })

  // Funções de ação (simuladas por enquanto)
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    alert('Função "Baixar PDF" ainda não implementada.')
  }

  // Novo estado de Loading (espera as DUAS buscas terminarem)
  if (isLoadingProposta || isLoadingConfig) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 size={48} className="text-blue-500 animate-spin" />
      </div>
    )
  }

  // Novo estado de Erro (verifica as DUAS buscas)
  if (errorProposta || errorConfig || !proposta) {
    const message = errorProposta?.message || errorConfig?.message || 'Proposta não encontrada.'
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-400">
        <AlertCircle size={48} className="mb-4" />
        <p className="text-xl mb-4">Erro ao carregar proposta: {message}</p>
        <Link to="/propostas" className="text-blue-400 hover:text-blue-300">
          Voltar para a lista
        </Link>
      </div>
    )
  }

  // === FIM DAS MUDANÇAS ===


  // Se os dados carregaram, exibe a proposta
  return (
    <div className="p-4 md:p-8 bg-slate-900 min-h-screen">
      {/* Cabeçalho da Ação */}
      <div className="max-w-5xl mx-auto mb-6">
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
              onClick={handleDownload}
              className="flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
            >
              <Download size={16} /> Baixar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Container da Proposta (folha A4 simulada) */}
      <div className="max-w-5xl mx-auto bg-white p-12 md:p-16 rounded-lg shadow-2xl text-slate-900">
        {/* Cabeçalho da Empresa (AGORA VEM DO 'config') */}
        <header className="flex justify-between items-start pb-8 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">{config.nome_empresa || 'Sua Empresa'}</h1>
            <p className="text-sm text-slate-600">{config.email_empresa || 'seu@email.com'}</p>
            <p className="text-sm text-slate-600">{config.telefone_empresa || '(00) 0000-0000'}</p>
            <p className="text-sm text-slate-600">{config.website || 'www.seusite.com.br'}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-blue-600 uppercase tracking-wide">Proposta Comercial</h2>
            <p className="text-lg font-semibold text-slate-700">{proposta.numero_proposta}</p>
            <p className="text-sm text-slate-600 mt-2">Data: {formatDate(proposta.created_date)}</p>
            <p className="text-sm text-slate-600">Válida até: {formatDate(proposta.validade)}</p>
          </div>
        </header>

        {/* Dados do Cliente (VEM DO 'proposta') */}
        <section className="grid grid-cols-2 gap-8 mt-8">
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

        {/* Descrição do Serviço (VEM DO 'proposta') */}
        <section className="mt-8">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Descrição do Serviço</h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {proposta.servico_prestado} {/* Nome do campo corrigido */}
          </p>
          
          <div className="bg-slate-100 p-4 rounded-lg mt-4">
            <h4 className="text-sm font-semibold text-slate-800">Prazo de Entrega</h4>
            <p className="text-lg font-bold text-blue-600">{proposta.prazo_entrega} dias</p>
          </div>
        </section>

        {/* Itens e Valores (VEM DO 'proposta') */}
        <section>
          <ItensTable itens={proposta.itens} valorTotal={proposta.valor_total} />
        </section>

        {/* Observações (VEM DO 'proposta') */}
        <section className="mt-8 pt-8 border-t border-slate-200">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Observações</h3>
          <p className="text-sm text-slate-700 italic">
            {proposta.observacoes}
          </p>
        </section>
      </div>
    </div>
  )
}

export default VisualizarProposta