import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../api/supabaseClient';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Loader2, AlertCircle, Printer, Download, ArrowLeft, Share2, Check, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

function ParteInfoParagraph({ titulo, dados }) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 mb-3">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">{titulo}</h3>
      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
        <strong>{dados.nome || 'Nome não informado'}</strong>
        {dados.cpf_cnpj && `, inscrito(a) no CPF/CNPJ sob nº ${dados.cpf_cnpj},`}
        {dados.endereco && ` com endereço em ${dados.endereco},`}
        {dados.email && ` e-mail ${dados.email},`}
        {dados.telefone && ` telefone ${dados.telefone}.`}
      </p>
    </div>
  );
}

export default function VisualizarContrato() {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);

  const {
    data: contrato,
    isLoading: isLoadingContrato,
    error: errorContrato,
  } = useQuery({
    queryKey: ['contrato', id],
    queryFn: () => base44.entities.Contrato.get(id),
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
    toast.success('Link do contrato copiado para a área de transferência!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoadingContrato || isLoadingConfig) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (errorContrato || errorConfig || !contrato) {
    const message = errorContrato?.message || errorConfig?.message || 'Contrato não encontrado.';
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-950 text-red-400 p-6 text-center">
        <AlertCircle className="w-12 h-12 mb-3" />
        <p className="text-lg font-bold mb-4">{message}</p>
        <Link to="/contratos" className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition">
          Voltar para a lista de contratos
        </Link>
      </div>
    );
  }

  const contratante = {
    nome: contrato.contratante_nome,
    cpf_cnpj: contrato.contratante_cpf_cnpj,
    endereco: contrato.contratante_endereco,
    email: contrato.contratante_email,
    telefone: contrato.contratante_telefone,
  };

  const contratado = {
    nome: contrato.contratado_nome || config.nome_empresa,
    cpf_cnpj: contrato.contratado_cpf_cnpj || config.cnpj,
    endereco: contrato.contratado_endereco || config.endereco,
    email: contrato.contratado_email || config.email_empresa,
    telefone: contrato.contratado_telefone || config.telefone_empresa,
  };

  const testemunhas = Array.isArray(contrato.testemunhas) ? contrato.testemunhas : [];
  const localAssinatura = contratado.endereco?.split(' - ')[1]?.split('/')[0] || 'Sua Cidade';

  return (
    <div className="p-4 md:p-8 bg-slate-950 min-h-screen">
      {/* Top Action Toolbar */}
      <div className="max-w-5xl mx-auto mb-6 no-print">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl">
          <Link
            to="/contratos"
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Contratos</span>
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition shadow-md shadow-purple-600/20 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Printable Executive Legal Document Area */}
      <div id="printable-area" className="max-w-5xl mx-auto bg-white p-8 md:p-14 rounded-3xl shadow-2xl text-slate-900 border border-slate-200 space-y-8">
        <header className="text-center pb-6 border-b-2 border-slate-100 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-[10px] font-extrabold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Documento Jurídico Vinculante</span>
          </div>
          <h1 className="text-2xl font-black uppercase text-slate-900">Contrato de Prestação de Serviços</h1>
          <p className="text-xs font-bold text-slate-500">Instrumento Registrado sob o Nº {contrato.numero_contrato}</p>
        </header>

        <section className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Por este instrumento particular de contrato de prestação de serviços, as partes qualificadas a seguir:
          </p>

          <ParteInfoParagraph titulo="CONTRATANTE" dados={contratante} />
          <ParteInfoParagraph titulo="CONTRATADO" dados={contratado} />

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Têm entre si justo e avençado as seguintes cláusulas e condições contratuais:
          </p>
        </section>

        {/* Clauses */}
        <section className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Cláusula Primeira - Do Objeto</h2>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{contrato.objeto_contrato}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Cláusula Segunda - Do Valor e Pagamento</h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              O valor ajustado para a prestação dos serviços é de <strong>{formatCurrency(contrato.valor_contrato)}</strong>.
            </p>
            {contrato.forma_pagamento && (
              <p className="text-xs text-slate-700 leading-relaxed mt-1">
                <strong>Condições:</strong> {contrato.forma_pagamento}
              </p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Cláusula Terceira - Do Prazo e Vigência</h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              Vigência estipulada de <strong>{contrato.prazo_vigencia || 'período indeterminado'}</strong>
              {contrato.data_inicio && `, com início em ${formatDate(contrato.data_inicio)}`}
              {contrato.data_termino && ` e término em ${formatDate(contrato.data_termino)}`}.
            </p>
          </div>

          {contrato.clausulas_adicionais && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Cláusulas Especiais</h2>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{contrato.clausulas_adicionais}</p>
            </div>
          )}

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Cláusula Quarta - Do Foro</h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              Fica eleito o Foro da Comarca de {localAssinatura} para dirimir quaisquer controvérsias oriundas deste instrumento.
            </p>
          </div>
        </section>

        {/* Signatures */}
        <footer className="pt-10 border-t border-slate-200 space-y-8">
          <p className="text-center text-xs text-slate-500">
            {localAssinatura}, {formatDate(contrato.created_date || new Date())}.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-6">
            <div className="text-center space-y-1">
              <div className="border-b border-slate-800 w-4/5 mx-auto mb-2" />
              <p className="text-xs font-extrabold text-slate-900">{contratante.nome}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contratante</p>
            </div>

            <div className="text-center space-y-1">
              <div className="border-b border-slate-800 w-4/5 mx-auto mb-2" />
              <p className="text-xs font-extrabold text-slate-900">{contratado.nome}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contratado</p>
            </div>
          </div>

          {testemunhas.length > 0 && testemunhas.some(t => t.nome) && (
            <div className="pt-6 border-t border-slate-100 space-y-6">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-center text-slate-400">Testemunhas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                {testemunhas.map((t, idx) => (
                  t.nome ? (
                    <div key={idx} className="text-center space-y-1">
                      <div className="border-b border-slate-400 w-3/4 mx-auto mb-1" />
                      <p className="text-xs font-bold text-slate-800">{t.nome}</p>
                      {t.cpf && <p className="text-[10px] text-slate-500">CPF: {t.cpf}</p>}
                    </div>
                  ) : null
                ))}
              </div>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}