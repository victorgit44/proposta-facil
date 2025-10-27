import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User } from 'lucide-react'

// Mensagem inicial da IA
const initialMessage = {
  id: Date.now(),
  type: 'ia', // 'ia' ou 'user'
  text: 'Olá! 👋 Como posso te ajudar hoje com suas propostas ou contratos?'
}

// Função para formatar o histórico para o formato que o AI Agent provavelmente espera
// (Ajuste 'ia' -> 'assistant' se necessário pelo seu modelo/nó n8n)
const formatHistoryForAI = (messages) => {
  return messages.map(msg => ({
    role: msg.type === 'ia' ? 'assistant' : 'user',
    content: msg.text
  }));
}

export default function ChatIA() {
  const [messages, setMessages] = useState([initialMessage])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    const userMessageText = input.trim();
    if (!userMessageText || isLoading) return;

    // Cria a nova mensagem do usuário
    const newUserMessage = { id: Date.now(), type: 'user', text: userMessageText };
    
    // Atualiza o estado das mensagens VISÍVEIS no chat
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInput('')
    setIsLoading(true)

    // --- CHAMADA AO WEBHOOK COM HISTÓRICO ---
    try {
      const webhookUrl = 'https://vm-n8n.xyrugy.easypanel.host/webhook/03a174c4-2ad0-426a-8c98-22685b7e85d1';

      // Formata o histórico ANTES da última mensagem do usuário para enviar ao n8n
      // (O modelo da IA geralmente funciona melhor recebendo a última mensagem separadamente)
      // Ou envie updatedMessages completo se seu nó n8n preferir
      const historyForAI = formatHistoryForAI(messages); // Histórico *antes* da mensagem atual

      console.log("Enviando para n8n:", JSON.stringify({ message: userMessageText, history: historyForAI }, null, 2));


      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Envia a última mensagem E o histórico anterior
        body: JSON.stringify({ 
            message: userMessageText, // Última mensagem do usuário
            history: historyForAI      // Array de mensagens anteriores
        }), 
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Webhook error response body:", errorBody);
        throw new Error(`Erro do webhook: ${response.status} ${response.statusText}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
          console.error("Erro ao fazer parse do JSON da resposta:", jsonError);
          const rawResponse = await response.text();
          console.error("Resposta bruta do webhook:", rawResponse);
          throw new Error("O webhook não retornou um JSON válido.");
      }

      console.log('Resposta completa do n8n:', JSON.stringify(data, null, 2));

      // Prioriza 'output', depois outros campos comuns
      const aiReply = data.output || data.reply || data.message || data.text || "Webhook respondeu, mas o campo esperado não foi encontrado.";

      if (!aiReply || typeof aiReply !== 'string' || aiReply.trim() === '') {
         console.warn("Resposta do webhook recebida, mas campo esperado está vazio ou inválido:", data);
         throw new Error("Webhook respondeu sem um texto válido no campo esperado.");
      }

      // Adiciona a resposta da IA ao chat
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ia', text: aiReply.trim() }])

    } catch (error) {
      console.error("Erro ao chamar ou processar o webhook:", error);
      // Adiciona mensagem de erro no estado VISÍVEL
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'ia',
        text: `Desculpe, ocorreu um erro: ${error.message}`
      }])
    } finally {
      setIsLoading(false);
    }
    // --- FIM DA CHAMADA AO WEBHOOK ---
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  }

  // O JSX (parte visual) continua o mesmo...
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
          {isLoading && (
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
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 resize-none max-h-32 overflow-y-auto disabled:opacity-50"
            style={{scrollbarWidth: 'thin'}}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-pink-600 to-pink-700 text-white p-3 rounded-lg font-semibold hover:from-pink-700 hover:to-pink-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}