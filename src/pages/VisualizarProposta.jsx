import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../api/supabaseClient';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Loader2, AlertCircle, Printer, Download, ArrowLeft, Share2, Check, ShieldCheck, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function VisualizarProposta() {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);

  const {
    data: proposta,
    isLoading: isLoadingProposta,
    error: errorProposta,
  } = useQuery({
    queryKey: ['proposta', id],
    queryFn: () => base44.entities.Proposta.get(id),
    enabled: !!id,
  });

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
  });
  const config = configData || {};

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link da proposta copiado para a área de transferência!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoadingProposta || isLoadingConfig) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (errorProposta || errorConfig || !proposta) {
    const message = errorProposta?.message || errorConfig?.message || 'Proposta não encontrada.';
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-950 text-red-400 p-6 text-center">
        <AlertCircle className="w-12 h-12 mb-3" />
        <p className="text-lg font-bold mb-4">{message}</p>
        <Link to="/propostas" className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition">
          Voltar para a lista de propostas
        </Link>
      </div>
    );
  }

  const valorTotalItens = (proposta.itens || []).reduce((sum, item) => {
    return sum + (item.quantidade || 0) * (item.valor_unitario || 0);
  }, 0);

  return (
    <div className="p-4 md:p-8 bg-slate-950 min-h-screen">
      {/* Top Action Toolbar (Hidden when printing) */}
      <div className="max-w-5xl mx-auto mb-6 no-print">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl">
          <Link
            to="/propostas"
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Propostas</span>
          </Link>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-800/90 hover:bg-slate-800 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copiado!' : 'Compartilhar Link'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-800/90 hover:bg-slate-800 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Printable Executive Document Area */}
      <div id="printable-area" className="max-w-5xl mx-auto bg-white p-8 md:p-14 rounded-3xl shadow-2xl text-slate-900 border border-slate-200 space-y-8">
        {/* Document Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-slate-100">
          <div className="flex items-start gap-4">
            {config.logo_url && (
              <img
                src={config.logo_url}
                alt="Logo da Empresa"
                className="h-14 max-w-[160px] object-contain"
              />
            )}
            <div>
              <h1 className="text-2xl font-black text-slate-900">{config.nome_empresa || 'Empresa Emissora'}</h1>
              {config.email_empresa && <p className="text-xs text-slate-500 mt-0.5">{config.email_empresa}</p>}
              {config.telefone_empresa && <p className="text-xs text-slate-500">{config.telefone_empresa}</p>}
              {config.website && <p className="text-xs text-blue-600 font-semibold">{config.website}</p>}
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 font-black text-xs uppercase tracking-wider rounded-md mb-1">
              Proposta Comercial
            </span>
            <h2 className="text-xl font-bold text-slate-800">{proposta.numero_proposta}</h2>
            <p className="text-xs text-slate-500 mt-1">Data: {formatDate(proposta.created_date)}</p>
            {proposta.validade && <p className="text-xs text-slate-500">Validade: {formatDate(proposta.validade)}</p>}
          </div>
        </header>

        {/* Client & Scope Overview */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-100">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Cliente Solicitante</span>
            <h3 className="text-base font-bold text-slate-900">{proposta.nome_cliente || 'Cliente'}</h3>
            {proposta.empresa_cliente && <p className="text-xs font-semibold text-slate-600">{proposta.empresa_cliente}</p>}
          </div>
          <div className="sm:text-right text-xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Contato</span>
            {proposta.email_cliente && <p className="text-slate-700"><strong>E-mail:</strong> {proposta.email_cliente}</p>}
            {proposta.telefone_cliente && <p className="text-slate-700"><strong>Tel:</strong> {proposta.telefone_cliente}</p>}
          </div>
        </section>

        {/* Service Details */}
        <section className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Escopo dos Serviços Prestados</h3>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {proposta.servico_prestado}
          </div>

          {proposta.prazo_entrega && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900">Prazo Estipulado para Entrega:</span>
              <span className="text-sm font-black text-blue-600">{proposta.prazo_entrega}</span>
            </div>
          )}
        </section>

        {/* Items Table */}
        <section className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Detalhamento Financeiro</h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-xs">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5 text-left">Descrição do Item</th>
                  <th className="p-3.5 text-center w-20">Qtd</th>
                  <th className="p-3.5 text-right w-28">Valor Unit.</th>
                  <th className="p-3.5 text-right w-32">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {(proposta.itens || []).map((item, index) => (
                  <tr key={index}>
                    <td className="p-3.5 font-semibold text-slate-900">{item.descricao}</td>
                    <td className="p-3.5 text-center">{item.quantidade}</td>
                    <td className="p-3.5 text-right">{formatCurrency(item.valor_unitario)}</td>
                    <td className="p-3.5 text-right font-bold text-slate-900">{formatCurrency((item.quantidade || 0) * (item.valor_unitario || 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-2xl bg-blue-600 text-white flex items-center justify-between shadow-lg">
            <span className="text-xs font-extrabold uppercase tracking-wider">Valor Total da Proposta</span>
            <span className="text-2xl font-black">{formatCurrency(valorTotalItens)}</span>
          </div>
        </section>

        {/* Observations */}
        {proposta.observacoes && (
          <section className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Observações Gerais</h3>
            <p className="text-xs text-slate-600 italic whitespace-pre-wrap p-4 bg-slate-50 rounded-xl border border-slate-100">
              {proposta.observacoes}
            </p>
          </section>
        )}

        {/* Terms */}
        {config.termos_condicoes && (
          <section className="pt-6 border-t border-slate-100 space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Termos e Condições Comercias</h3>
            <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap p-4 bg-slate-50 rounded-xl border border-slate-100">
              {config.termos_condicoes}
            </div>
          </section>
        )}

        {/* Document Footer */}
        <footer className="pt-8 border-t border-slate-100 text-center text-xs text-slate-500 space-y-1">
          {config.mensagem_rodape && <p className="font-bold text-slate-800 mb-1">{config.mensagem_rodape}</p>}
          <p>{config.nome_empresa || 'PropostaFácil'} {config.cnpj && `• CNPJ: ${config.cnpj}`}</p>
          {config.endereco && <p>{config.endereco}</p>}
        </footer>
      </div>
    </div>
  );
}