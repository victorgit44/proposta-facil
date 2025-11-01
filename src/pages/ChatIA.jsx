import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react' // Importe Loader2 e AlertCircle
import { useQuery } from '@tanstack/react-query'; // Importe useQuery
import { base44, supabase } from '@/api/supabaseClient'; // Importe supabase (para o RPC)
import { queryClient } from '@/queryClient'; // Importe queryClient
import { useAuth } from '../context/AuthContext'; // Importe useAuth
import { PLAN_LIMITS } from '@/config'; // Importe PLAN_LIMITS

// Mensagem inicial da IA
const initialMessage = { 
  id: Date.now(), 
  type: 'ia', 
  text: 'Olá! 👋 Como posso te ajudar hoje com suas propostas ou contratos?' 
}

// Definição do plano padrão/fallback
const defaultSubscription = {
  plano: 'Gratuito',
  mensagens_ia_mes: 0,
};
const defaultLimits = PLAN_LIMITS['Gratuito'];


export default function ChatIA() {
  // --- 1. PEGAR O USUÁRIO DO CONTEXTO ---
  const { user } = useAuth(); // 'loading' do auth já foi tratado pelo AuthProvider

  const [messages, setMessages] = useState([initialMessage])
  const [input, setInput] = useState('')
  const [isLoadingResponse, setIsLoadingResponse] = useState(false) // Renomeado para clareza
  const messagesEndRef = useRef(null) 

  // --- 2. BUSCAR ASSINATURA (habilitado PÓS login) ---
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
    enabled: !!user, // Só busca se o usuário estiver logado
  });
  const assinatura = assinaturaData || defaultSubscription;
  
  // Combina estados de loading
  const isLoading = loadingAssinatura; // O loading principal é o da assinatura
  const error = errorAssinatura;

  // --- 3. VERIFIQUE O LIMITE ---
  const limits = PLAN_LIMITS[assinatura.plano] || defaultLimits;
  const isLimitReached = (assinatura.mensagens_ia_mes ?? 0) >= (limits.ia ?? 0);

  // Scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Função de enviar mensagem
  const handleSendMessage = async () => {
    // Verifica limite
    if (isLimitReached) {
        setMessages(prev => [...prev, {
            id: Date.now() + 1,
            type: 'ia',
            text: `Desculpe, você atingiu seu limite de ${limits.ia} mensagens de IA para este mês. Para continuar, por favor, considere fazer um upgrade do seu plano.`
        }]);
        setInput('');
        return;
    }

    const userMessageText = input.trim();
    if (!userMessageText || isLoadingResponse) return; // Usa isLoadingResponse

    const newUserMessage = { id: Date.now(), type: 'user', text: userMessageText };
    const updatedMessages = [...messages, newUserMessage];

    setMessages(updatedMessages);
    setInput('');
    setIsLoadingResponse(true); // Ativa o loading da *resposta*

    try {
      // --- INCREMENTA O USO (RPC) ---
      const { error: rpcError } = await supabase.rpc('increment_usage', { item_type: 'ia' });
      if (rpcError) {
          console.error('Erro ao incrementar uso da IA:', rpcError);
          throw new Error(`Falha ao registrar uso da IA: ${rpcError.message}`);
      }
      // Invalida o cache para atualizar a contagem na UI (no AuthContext)
      queryClient.invalidateQueries({ queryKey: ['assinatura'] });
      // --- FIM DO INCREMENTO ---

      // Prepara dados para o webhook
      const webhookUrl = 'https://vm-n8n.xyrugy.easypanel.host/webhook-test/03a174c4-2ad0-426a-8c98-22685b7e85d1';
      const historyForAI = formatHistoryForAI(updatedMessages); // Envia histórico atualizado

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ message: userMessageText, history: historyForAI }), 
      });

      if (!response.ok) {
        throw new Error(`Erro do webhook: ${response.status} ${response.statusText}`);
      }

      const data = await response.json(); // Adicionado try/catch em volta
      const aiReply = data.output || data.reply || data.message || data.text || "Webhook respondeu, mas o campo esperado não foi encontrado.";

      if (!aiReply || typeof aiReply !== 'string' || aiReply.trim() === '') {
         throw new Error("Webhook respondeu sem um texto válido no campo esperado.");
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ia', text: aiReply.trim() }])

    } catch (error) {
      console.error("Erro ao chamar ou processar o webhook:", error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'ia',
        text: `Desculpe, ocorreu um erro: ${error.message}`
      }])
    } finally {
      setIsLoadingResponse(false); // Desativa o loading da *resposta*
    }
  }

  // Função auxiliar de formatação
  const formatHistoryForAI = (msgs) => {
    return msgs.map(msg => ({
      role: msg.type === 'ia' ? 'assistant' : 'user',
      content: msg.text
    }));
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) { 
      event.preventDefault(); 
      handleSendMessage();
    }
  }

  // Renderiza Loading/Error
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-theme(space.16))]">
        <Loader2 size={48} className="text-pink-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-theme(space.16))] text-red-400 p-4 text-center">
        <AlertCircle size={48} className="mb-4" />
        <p>Erro ao carregar dados do Chat: {error.message}</p>
      </div>
    )
  }


  return (
    <div className="flex flex-col h-[calc(100vh-theme(space.16))]">
      {/* Cabeçalho */}
      <div className="bg-slate-800/50 border-b border-slate-700 p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
           <Bot className="text-pink-400" />
           <h1 className="text-2xl font-bold text-white">Chat com IA</h1>
        </div>
      </div>

      {/* Área das Mensagens */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Map de mensagens */}
          {messages.map(msg => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.type === 'ia' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
              )}
              <div className={`max-w-[75%] p-4 rounded-lg shadow ${
                msg.type === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
               {msg.type === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                  <User size={18} className="text-slate-300" />
                </div>
              )}
            </div>
          ))}
          {/* Indicador "pensando" */}
          {isLoadingResponse && ( // Usa o loading da *resposta*
             <div className="flex items-start gap-3 justify-start">
                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                 <div className="max-w-[75%] p-4 rounded-lg shadow bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none">
                    <div className="flex space-x-1 items-center">
                       <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-75"></span>
                       <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-150"></span>
                       <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-300"></span>
                    </div>
                 </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Área de Input */}
      <div className="bg-slate-800/50 border-t border-slate-700 p-4 sticky bottom-0">
        {/* Aviso de Limite */}
        {isLimitReached && (
            <div className="max-w-4xl mx-auto mb-3 p-3 bg-yellow-900/30 border border-yellow-500/50 text-yellow-300 rounded-lg text-xs text-center">
                Você atingiu o limite de {limits.ia} mensagens do seu plano.
                <Link to="/planos" className="font-bold underline hover:text-yellow-200 ml-1">Faça um upgrade</Link>.
            </div>
        )}
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isLimitReached ? "Limite de mensagens atingido" : "Digite sua mensagem..."}
            // Desabilita se limite atingido OU se espera resposta OU se auth/assinatura ainda carrega
            disabled={isLoadingResponse || isLimitReached || isLoading} 
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 resize-none max-h-32 overflow-y-auto disabled:opacity-50 disabled:cursor-not-allowed"
            style={{scrollbarWidth: 'thin'}}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoadingResponse || isLimitReached || isLoading}
            className="bg-gradient-to-r from-pink-600 to-pink-700 text-white p-3 rounded-lg font-semibold hover:from-pink-700 hover:to-pink-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}