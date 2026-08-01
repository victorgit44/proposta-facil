import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Bot, User, Loader2, AlertCircle, Sparkles, Copy, Check, Zap, FileText, ShieldCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44, fetchApi } from '@/api/apiClient';
import { queryClient } from '@/queryClient';
import { useAuth } from '../context/AuthContext';
import { PLAN_LIMITS } from '@/config';

const initialMessage = {
  id: Date.now(),
  type: 'ia',
  text: 'Olá! Sou o Assistente Inteligente do PropostaFácil. 🚀 Como posso te ajudar hoje com a criação de propostas, contratos ou estratégias de vendas?'
};

const suggestionPrompts = [
  'Criar proposta para desenvolvimento de Software SaaS',
  'Redigir cláusula de garantia de 90 dias para contrato',
  'Escrever e-mail de acompanhamento comercial (follow-up)',
  'Calcular prazo e escopo para consultoria B2B'
];

const defaultSubscription = {
  plano: 'Gratuito',
  mensagens_ia_mes: 0,
};

export default function ChatIA() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const {
    data: assinaturaData,
    isLoading: loadingAssinatura,
    error: errorAssinatura,
  } = useQuery({
    queryKey: ['assinatura'],
    queryFn: async () => {
      const data = await base44.entities.Assinatura.list();
      return data[0] || defaultSubscription;
    },
    enabled: !!user,
  });
  const assinatura = assinaturaData || defaultSubscription;

  const limits = PLAN_LIMITS[assinatura.plano] || PLAN_LIMITS['Gratuito'];
  const isLimitReached = (assinatura.mensagens_ia_mes ?? 0) >= (limits.ia ?? 0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoadingResponse]);

  const handleSendMessage = async (textToSend = null) => {
    const userMessageText = (textToSend || input).trim();

    if (isLimitReached) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'ia',
        text: `Desculpe, você atingiu seu limite de ${limits.ia} mensagens de IA para este mês no plano ${assinatura.plano}. Faça um upgrade para continuar!`
      }]);
      setInput('');
      return;
    }

    if (!userMessageText || isLoadingResponse) return;

    const newUserMessage = { id: Date.now(), type: 'user', text: userMessageText };
    const updatedMessages = [...messages, newUserMessage];

    setMessages(updatedMessages);
    setInput('');
    setIsLoadingResponse(true);

    try {
      const historyForAI = formatHistoryForAI(updatedMessages);

      const data = await fetchApi('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: userMessageText, history: historyForAI }),
      });

      queryClient.invalidateQueries({ queryKey: ['assinatura'] });

      const aiReply = data.reply || "O assistente de IA não retornou uma resposta válida.";
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ia', text: aiReply.trim() }]);

    } catch (error) {
      console.error("Erro no Chat IA:", error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'ia',
        text: `Erro ao processar resposta: ${error.message || 'Verifique sua conexão'}`
      }]);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const formatHistoryForAI = (msgs) => {
    return msgs.map(msg => ({
      role: msg.type === 'ia' ? 'assistant' : 'user',
      content: msg.text
    }));
  };

  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen bg-slate-950 text-slate-100">
      {/* Header Bar */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">Assistente Inteligente PropostaFácil</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                AI Copilot
              </span>
            </div>
            <p className="text-xs text-slate-400">Geração de cláusulas, propostas e argumentos comerciais</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{assinatura.mensagens_ia_mes ?? 0} / {limits.ia} mensagens</span>
          </span>
          <Link
            to="/planos"
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition text-xs shadow-md shadow-blue-600/20"
          >
            Upgrade
          </Link>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map(msg => (
            <div key={msg.id} className={`flex items-start gap-3.5 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.type === 'ia' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-600/20 mt-1">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div className={`relative group max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg ${
                msg.type === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none font-medium'
                  : 'bg-slate-900/90 text-slate-200 border border-slate-800/90 rounded-tl-none backdrop-blur-xl'
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {msg.type === 'ia' && (
                  <button
                    onClick={() => handleCopyText(msg.id, msg.text)}
                    className="absolute top-2 right-2 p-1.5 text-slate-500 hover:text-white bg-slate-800/80 rounded-lg opacity-0 group-hover:opacity-100 transition"
                    title="Copiar texto"
                  >
                    {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {msg.type === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1 font-bold">
                  {user?.email?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
                </div>
              )}
            </div>
          ))}

          {isLoadingResponse && (
            <div className="flex items-start gap-3.5 justify-start">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 rounded-tl-none flex items-center gap-2 text-xs text-slate-400 font-semibold">
                <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                <span>Pensando na melhor resposta...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggestion Chips */}
      {messages.length < 3 && (
        <div className="max-w-4xl mx-auto px-4 pb-2 w-full">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Sugestões Rápidas:</p>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {suggestionPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium whitespace-nowrap transition cursor-pointer shrink-0"
              >
                ⚡ {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Input Area */}
      <div className="bg-slate-900/90 border-t border-slate-800/80 p-4 sticky bottom-0">
        {isLimitReached && (
          <div className="max-w-4xl mx-auto mb-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
            <span>Você atingiu seu limite de {limits.ia} mensagens do plano {assinatura.plano}.</span>
            <Link to="/planos" className="font-bold underline text-amber-400 hover:text-white">Fazer Upgrade ⚡</Link>
          </div>
        )}

        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={isLimitReached ? "Limite mensal de IA atingido" : "Pergunte algo ao Assistente Inteligente..."}
            disabled={isLoadingResponse || isLimitReached}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none max-h-32 disabled:opacity-50"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoadingResponse || isLimitReached}
            className="p-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition duration-200 shadow-lg shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}