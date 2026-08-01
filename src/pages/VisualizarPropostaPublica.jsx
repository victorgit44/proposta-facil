import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/api/apiClient';
import { 
  FileText, CheckCircle2, XCircle, Clock, ShieldCheck, 
  Send, Sparkles, Building2, User, Calendar, Loader2, AlertCircle, Check, MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

export default function VisualizarPropostaPublica() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [signerName, setSignerName] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [novoComentario, setNovoComentario] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    data: proposta,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['propostaPublica', id],
    queryFn: () => fetchApi(`/api/propostas/public/${id}`),
    enabled: !!id,
  });

  const { data: comentarios = [] } = useQuery({
    queryKey: ['propostaComentarios', id],
    queryFn: () => fetchApi(`/api/propostas/public/${id}/comentarios`),
    enabled: !!id,
  });

  const commentMutation = useMutation({
    mutationFn: (msg) => fetchApi(`/api/propostas/public/${id}/comentarios`, {
      method: 'POST',
      body: JSON.stringify({ autor: proposta?.nome_cliente || 'Cliente', mensagem: msg, is_cliente: true })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['propostaComentarios', id]);
      setNovoComentario('');
      toast.success('Comentário enviado ao vendedor com sucesso!');
    }
  });

  const handleAccept = async (e) => {
    e.preventDefault();
    if (!signerName.trim()) {
      toast.error('Informe o seu nome completo para assinar e aceitar a proposta.');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading('Processando aceite digital...');

    try {
      await fetchApi(`/api/propostas/public/${id}/accept`, {
        method: 'POST',
        body: JSON.stringify({ nome_assinante: signerName.trim() }),
      });

      toast.success('Proposta aceita e assinada digitalmente com sucesso!', { id: toastId });
      setShowAcceptModal(false);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Erro ao registrar aceite.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const toastId = toast.loading('Enviando solicitação...');

    try {
      await fetchApi(`/api/propostas/public/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ motivo: rejectReason }),
      });

      toast.success('Sua solicitação de ajuste foi enviada ao responsável.', { id: toastId });
      setShowRejectModal(false);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Erro ao enviar solicitação.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-slate-300">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide">Carregando proposta comercial...</p>
      </div>
    );
  }

  if (error || !proposta) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-slate-300 text-center">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h1 className="text-xl font-bold text-white mb-2">Proposta não encontrada</h1>
        <p className="text-xs text-slate-400 max-w-md mb-6">
          O link acessado é inválido ou a proposta foi removida pelo emissor.
        </p>
      </div>
    );
  }

  const isApproved = proposta.status === 'aprovada';
  const isRejected = proposta.status === 'recusada';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white p-4 sm:p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Superior da Marca */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {proposta.empresa?.logo_url ? (
              <img src={proposta.empresa.logo_url} alt="Logo" className="w-14 h-14 rounded-2xl object-contain bg-slate-950 p-2 border border-slate-800" />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-xl">
                {proposta.empresa?.nome?.charAt(0) || 'P'}
              </div>
            )}
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">{proposta.empresa?.nome || 'Proposta Comercial'}</h1>
              {proposta.empresa?.cnpj && <p className="text-xs text-slate-400 font-mono">CNPJ: {proposta.empresa.cnpj}</p>}
              {proposta.empresa?.email && <p className="text-xs text-slate-400">{proposta.empresa.email}</p>}
            </div>
          </div>

          <div className="text-center sm:text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileText className="w-3.5 h-3.5" />
              <span>Proposta Nº {proposta.numero_proposta}</span>
            </span>
            <p className="text-xs text-slate-400 mt-2">
              Emitida em: {new Date(proposta.created_date).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Banner de Status / Aceite */}
        {isApproved && (
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-3 shadow-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h3 className="text-base font-extrabold text-white">Proposta Aprovada & Assinada Digitalmente</h3>
                <p className="text-xs text-emerald-400/90 mt-0.5">
                  Confirmada por <strong className="text-white">{proposta.aceite_nome}</strong>
                  {proposta.aceite_data && ` em ${new Date(proposta.aceite_data).toLocaleString('pt-BR')}`}
                  {proposta.aceite_ip && ` (IP: ${proposta.aceite_ip})`}
                </p>
              </div>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3">
            <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
            <div>
              <h3 className="text-base font-extrabold text-white">Ajustes Solicitados</h3>
              <p className="text-xs text-rose-400/90">Esta proposta foi marcada para análise de ajustes pelo cliente.</p>
            </div>
          </div>
        )}

        {/* Detalhes do Cliente */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Dados do Destinatário</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block uppercase font-bold tracking-wider text-[10px]">Cliente / Razão Social</span>
              <span className="text-slate-200 font-bold text-sm">{proposta.nome_cliente}</span>
            </div>
            {proposta.empresa_cliente && (
              <div>
                <span className="text-slate-500 block uppercase font-bold tracking-wider text-[10px]">Empresa</span>
                <span className="text-slate-200 font-semibold">{proposta.empresa_cliente}</span>
              </div>
            )}
            {proposta.email_cliente && (
              <div>
                <span className="text-slate-500 block uppercase font-bold tracking-wider text-[10px]">E-mail de Contato</span>
                <span className="text-slate-200">{proposta.email_cliente}</span>
              </div>
            )}
            {proposta.validade && (
              <div>
                <span className="text-slate-500 block uppercase font-bold tracking-wider text-[10px]">Validade da Proposta</span>
                <span className="text-slate-200 font-semibold">{new Date(proposta.validade).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Escopo do Serviço */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">Escopo & Descrição dos Serviços</h2>
          <p className="text-xs sm:text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
            {proposta.servico_prestado}
          </p>
        </div>

        {/* Tabela de Itens */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Itens e Valores da Proposta</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-2 font-bold">Descrição do Item</th>
                  <th className="py-3 px-2 font-bold text-center">Qtd.</th>
                  <th className="py-3 px-2 font-bold text-right">Valor Unit.</th>
                  <th className="py-3 px-2 font-bold text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(proposta.itens || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-2 text-slate-200 font-semibold">{item.descricao || 'Item de serviço'}</td>
                    <td className="py-3.5 px-2 text-slate-400 text-center">{item.quantidade || 1}</td>
                    <td className="py-3.5 px-2 text-slate-400 text-right">R$ {(item.valor_unitario || 0).toFixed(2)}</td>
                    <td className="py-3.5 px-2 text-emerald-400 font-bold text-right">
                      R$ {((item.valor_total ?? ((item.quantidade || 1) * (item.valor_unitario || 0))) || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Valor Total do Investimento</span>
            <span className="text-3xl font-black text-emerald-400 tracking-tight">
              R$ {(parseFloat(proposta.valor_total) || 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Canal de Comentários / Dúvidas sobre a Negociação Proposify Style */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Comentários & Negociação da Proposta</h2>
          </div>

          <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
            {comentarios.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Nenhum comentário enviado. Utilize o campo abaixo para tirar dúvidas ou negociar prazos com o vendedor.</p>
            ) : (
              comentarios.map((c) => (
                <div key={c.id} className={`p-4 rounded-2xl border text-xs space-y-1 ${c.is_cliente ? 'bg-slate-950 border-slate-800' : 'bg-blue-500/10 border-blue-500/20 text-blue-200'}`}>
                  <div className="flex items-center justify-between font-bold text-[10px] text-slate-400">
                    <span>{c.autor}</span>
                    <span>{new Date(c.created_at).toLocaleString('pt-BR')}</span>
                  </div>
                  <p className="text-slate-200">{c.mensagem}</p>
                </div>
              ))
            )}
          </div>

          {!isApproved && (
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Escreva um comentário ou proposta de alteração..."
                value={novoComentario}
                onChange={(e) => setNovoComentario(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => commentMutation.mutate(novoComentario)}
                disabled={!novoComentario.trim()}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </div>
          )}
        </div>

        {/* Observações */}
        {proposta.observacoes && (
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 space-y-2">
            <span className="font-bold text-slate-300 block uppercase tracking-wider text-[10px]">Observações Adicionais</span>
            <p className="whitespace-pre-wrap">{proposta.observacoes}</p>
          </div>
        )}

        {/* Barra de Ações (Apenas se não aprovada) */}
        {!isApproved && (
          <div className="sticky bottom-6 z-40 p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30 backdrop-blur-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold text-white block">Deseja dar andamento nesta proposta?</span>
              <span className="text-[11px] text-slate-400">Confirme o aceite digitalmente para iniciar o projeto.</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowRejectModal(true)}
                className="flex-1 sm:flex-none px-5 py-3 rounded-xl font-bold text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
              >
                Solicitar Ajustes
              </button>
              <button
                onClick={() => setShowAcceptModal(true)}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Aceitar Proposta</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal de Aceite Digital */}
        {showAcceptModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Aceite Digital da Proposta</span>
                </div>
                <button onClick={() => setShowAcceptModal(false)} className="text-slate-500 hover:text-white text-xs">✕</button>
              </div>

              <form onSubmit={handleAccept} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Nome Completo do Responsável *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Digite seu nome completo"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                  <span className="font-bold text-slate-300 block">Registro de Segurança Jurídica:</span>
                  <p>Ao clicar em "Confirmar Aceite", seu nome, horário e IP de acesso serão anexados a esta proposta comercial com carimbo de autenticidade.</p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAcceptModal(false)}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-400 hover:text-white transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? 'Confirmando...' : 'Confirmar Aceite'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Solicitacao de Ajuste */}
        {showRejectModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="font-bold text-sm text-white">Solicitar Ajustes na Proposta</span>
                <button onClick={() => setShowRejectModal(false)} className="text-slate-500 hover:text-white text-xs">✕</button>
              </div>

              <form onSubmit={handleReject} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Descreva os ajustes necessários
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ex: Gostaria de alterar o prazo de entrega para 15 dias..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRejectModal(false)}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-400 hover:text-white transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 shadow-lg transition disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? 'Enviando...' : 'Enviar Solicitação'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
