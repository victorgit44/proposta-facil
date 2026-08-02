import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../api/supabaseClient';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Loader2, AlertCircle, Printer, Download, ArrowLeft, Share2, Check, ShieldCheck, FileText, CheckCircle2, Building2 } from 'lucide-react';
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
    const publicUrl = `${window.location.origin}/p/${id}`;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success('Link público de aceite copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoadingProposta || isLoadingConfig) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0a0a0f]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (errorProposta || !proposta) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#0a0a0f] text-rose-400 p-6 text-center">
        <AlertCircle className="w-12 h-12 mb-3" />
        <p className="text-base font-semibold mb-4">Proposta não encontrada.</p>
        <Link to="/propostas" className="px-4 py-2 rounded-lg bg-[#111118] border border-[#1e1e2e] text-[#8888a0] hover:text-white text-xs font-medium transition">
          Voltar para propostas
        </Link>
      </div>
    );
  }

  const canvasBlocks = proposta.canvas_data?.blocks;

  return (
    <div className="p-4 md:p-8 bg-[#0a0a0f] min-h-screen text-[#f0f0f5]">
      {/* Top Action Toolbar */}
      <div className="max-w-5xl mx-auto mb-6 no-print">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-[#111118] border border-[#1e1e2e]">
          <Link
            to="/propostas"
            className="flex items-center gap-2 text-xs font-medium text-[#8888a0] hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Propostas</span>
          </Link>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#8888a0] bg-[#1a1a24] hover:bg-white/10 hover:text-white border border-[#1e1e2e] transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copiado!' : 'Compartilhar Link'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#8888a0] bg-[#1a1a24] hover:bg-white/10 hover:text-white border border-[#1e1e2e] transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Se a proposta possui estrutura Canvas Visual */}
      {canvasBlocks && Array.isArray(canvasBlocks) && canvasBlocks.length > 0 ? (
        <div id="printable-area" className="max-w-4xl mx-auto bg-[#111118] p-8 md:p-12 rounded-lg border border-[#1e1e2e] space-y-8 shadow-2xl">
          {canvasBlocks.map((block) => (
            <div key={block.id} className="space-y-4">
              {block.type === 'cover' && (
                <div className="p-8 md:p-12 rounded-lg bg-gradient-to-br from-[#1b2a4a] to-[#0a0a0f] border border-blue-900/40 text-white space-y-6">
                  {block.data?.logoUrl && (
                    <img src={block.data.logoUrl} alt="Logo" className="max-h-20 object-contain" />
                  )}
                  <div className="space-y-2 pt-4">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{block.data?.title || 'PROPOSTA COMERCIAL'}</h1>
                    <p className="text-base text-emerald-400 font-medium">{block.data?.subtitle || `Para ${proposta.nome_cliente}`}</p>
                  </div>
                </div>
              )}

              {block.type === 'summary' && (
                <div className="p-6 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] space-y-2">
                  <h3 className="text-base font-semibold text-white tracking-tight">{block.data?.heading}</h3>
                  <p className="text-xs text-[#8888a0] leading-relaxed">{block.data?.content}</p>
                </div>
              )}

              {block.type === 'scope' && (
                <div className="p-6 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] space-y-3">
                  <h3 className="text-base font-semibold text-white tracking-tight">{block.data?.heading}</h3>
                  <ul className="space-y-2">
                    {block.data?.items?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#8888a0]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {block.type === 'pricing' && (
                <div className="p-6 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] space-y-4">
                  <h3 className="text-base font-semibold text-white tracking-tight">{block.data?.heading}</h3>
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[#1e1e2e] text-[#555568] uppercase text-[10px]">
                        <th className="pb-2">Descrição</th>
                        <th className="pb-2 text-center w-20">Qtd</th>
                        <th className="pb-2 text-right w-28">Valor Unit.</th>
                        <th className="pb-2 text-right w-32">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e1e2e]">
                      {block.data?.items?.map((item, i) => (
                        <tr key={i}>
                          <td className="py-2 text-white font-medium">{item.desc}</td>
                          <td className="py-2 text-center text-[#8888a0]">{item.qty}</td>
                          <td className="py-2 text-right text-[#8888a0]">{formatCurrency(item.val)}</td>
                          <td className="py-2 text-right text-emerald-400 font-semibold">{formatCurrency((item.qty || 0) * (item.val || 0))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="pt-3 border-t border-[#1e1e2e] flex items-center justify-between">
                    <span className="text-xs text-[#555568] uppercase">Total da Proposta</span>
                    <span className="text-xl font-semibold text-emerald-400">{formatCurrency(proposta.valor_total)}</span>
                  </div>
                </div>
              )}

              {block.type === 'terms' && (
                <div className="p-6 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] space-y-2">
                  <h3 className="text-base font-semibold text-white tracking-tight">{block.data?.heading}</h3>
                  <p className="text-xs text-[#8888a0] leading-relaxed">{block.data?.content}</p>
                </div>
              )}

              {block.type === 'signature' && (
                <div className="p-6 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] space-y-3">
                  <h3 className="text-base font-semibold text-white tracking-tight">{block.data?.heading}</h3>
                  <p className="text-xs text-[#8888a0]">{block.data?.terms}</p>
                  <div className="pt-3 border-t border-dashed border-[#1e1e2e] flex items-center justify-between text-xs">
                    <span className="text-[#555568]">Status do Aceite</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-medium">
                      Validade Digital Verificada
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Renderizador Executive Padrão */
        <div id="printable-area" className="max-w-4xl mx-auto bg-[#111118] p-8 md:p-12 rounded-lg border border-[#1e1e2e] space-y-8 shadow-2xl">
          <header className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-[#1e1e2e]">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-white tracking-tight">{config.nome_empresa || 'Empresa Emissora'}</h1>
              <p className="text-xs text-[#8888a0]">{config.email_empresa}</p>
            </div>
            <div className="sm:text-right">
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-medium uppercase">
                {proposta.numero_proposta}
              </span>
              <p className="text-xs text-[#8888a0] mt-1">Data: {formatDate(proposta.created_date)}</p>
            </div>
          </header>

          <section className="p-5 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] space-y-2">
            <span className="text-[10px] font-medium uppercase tracking-wider text-[#555568]">Cliente Solicitante</span>
            <h3 className="text-base font-semibold text-white">{proposta.nome_cliente || 'Cliente'}</h3>
            <p className="text-xs text-[#8888a0]">{proposta.email_cliente}</p>
          </section>

          <section className="p-5 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] space-y-2">
            <span className="text-[10px] font-medium uppercase tracking-wider text-[#555568]">Escopo dos Serviços</span>
            <p className="text-xs text-[#8888a0] leading-relaxed whitespace-pre-wrap">{proposta.servico_prestado}</p>
          </section>

          <section className="space-y-3">
            <span className="text-[10px] font-medium uppercase tracking-wider text-[#555568]">Investimento Comercial</span>
            <div className="overflow-x-auto rounded-lg border border-[#1e1e2e]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#1a1a24] text-[#8888a0] uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Descrição</th>
                    <th className="p-3 text-center w-20">Qtd</th>
                    <th className="p-3 text-right w-28">Valor Unit.</th>
                    <th className="p-3 text-right w-32">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e2e]">
                  {(proposta.itens || []).map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3 text-white">{item.descricao}</td>
                      <td className="p-3 text-center text-[#8888a0]">{item.quantidade}</td>
                      <td className="p-3 text-right text-[#8888a0]">{formatCurrency(item.valor_unitario)}</td>
                      <td className="p-3 text-right text-emerald-400 font-semibold">{formatCurrency((item.quantidade || 0) * (item.valor_unitario || 0))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 rounded-lg bg-[#1a1a24] border border-[#1e1e2e] flex items-center justify-between">
              <span className="text-xs font-medium uppercase text-[#555568]">Valor Total</span>
              <span className="text-2xl font-semibold text-emerald-400 tabular-nums">{formatCurrency(proposta.valor_total)}</span>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}