import React, { useState } from 'react'
import { X, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { fetchApi } from '@/api/apiClient'

export function AIChatModal({ isOpen, onClose, onFill, type = 'proposta' }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleGenerate = async () => {
    if (!input.trim()) return
    setLoading(true)
    const toastId = toast.loading('A IA está lendo seu pedido...')

    try {
      // ------------------------------------------------------------------
      // REQUISIÇÃO SEGURA VIA PROXY DA API BACKEND (SEM CHAVE EXPOSTA)
      // ------------------------------------------------------------------
      const jsonData = await fetchApi('/api/ai/fill-proposal', {
        method: 'POST',
        body: JSON.stringify({ input, type })
      });

      toast.success('Preenchido com sucesso!', { id: toastId })
      onFill(jsonData) // Manda os dados para o formulário
      onClose()        // Fecha o modal
      setInput('')     // Limpa o campo

    } catch (err) {
      console.error("Erro no Chat Modal:", err)
      toast.error(err.message || 'Erro ao comunicar com a IA.', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <h3 className="font-bold text-lg">Preenchimento Mágico</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white transition rounded-full p-1 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          <p className="text-slate-300 text-sm">
            Descreva o que você precisa (cliente, serviço, valor) e a IA vai preencher o formulário para você.
          </p>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder='Ex: "Crie uma proposta para a Ana Cleide. Desenvolvimento de site institucional com design e hospedagem. Valor total de 5000 reais, entrega em 2 meses."'
            className="w-full h-40 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none placeholder:text-slate-500 text-sm leading-relaxed"
          />

          <div className="flex justify-end pt-2">
            <button
              onClick={handleGenerate}
              disabled={loading || !input.trim()}
              className="flex items-center gap-2 bg-white text-slate-900 px-6 py-2.5 rounded-lg font-bold hover:bg-slate-200 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-purple-600" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Gerar Agora
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}