import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

// Páginas Simples
function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">🏠 Página Inicial</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/propostas">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition cursor-pointer">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-bold text-white mb-2">Propostas</h3>
              <p className="text-slate-400">Criar e gerenciar propostas comerciais</p>
            </div>
          </Link>

          <Link to="/contratos">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-purple-500 transition cursor-pointer">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-white mb-2">Contratos</h3>
              <p className="text-slate-400">Gerar contratos personalizados</p>
            </div>
          </Link>

          <Link to="/chat-ia">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-pink-500 transition cursor-pointer">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-white mb-2">Chat IA</h3>
              <p className="text-slate-400">Assistente inteligente</p>
            </div>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link to="/planos">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition">
              Ver Planos e Preços
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function PropostasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">📄 Minhas Propostas</h1>
            <p className="text-slate-400">Gerencie suas propostas comerciais</p>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition">
            + Nova Proposta
          </button>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-2xl font-bold text-white mb-2">Nenhuma proposta ainda</h3>
          <p className="text-slate-400 mb-6">Comece criando sua primeira proposta comercial</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            Criar Primeira Proposta
          </button>
        </div>

        <div className="mt-6">
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            ← Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  )
}

function ContratosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">📝 Meus Contratos</h1>
            <p className="text-slate-400">Gerencie seus contratos</p>
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition">
            + Novo Contrato
          </button>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-2xl font-bold text-white mb-2">Nenhum contrato ainda</h3>
          <p className="text-slate-400 mb-6">Comece criando seu primeiro contrato</p>
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition">
            Criar Primeiro Contrato
          </button>
        </div>

        <div className="mt-6">
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            ← Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  )
}

function ChatIAPage() {
  const [messages, setMessages] = React.useState([
    { id: 1, type: 'ia', text: 'Olá! 👋 Como posso ajudá-lo hoje?' }
  ])
  const [input, setInput] = React.useState('')

  const sendMessage = () => {
    if (!input.trim()) return
    
    setMessages([
      ...messages,
      { id: Date.now(), type: 'user', text: input },
      { id: Date.now() + 1, type: 'ia', text: 'Recebi sua mensagem! Esta é uma resposta simulada.' }
    ])
    setInput('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      <div className="bg-slate-800/50 border-b border-slate-700 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">💬 Chat com IA</h1>
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            Voltar
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-4 rounded-lg ${
                msg.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 text-slate-100 border border-slate-700'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/50 border-t border-slate-700 p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}

function PlanosPage() {
  const planos = [
    {
      nome: 'Gratuito',
      preco: 'R$ 0',
      features: ['3 propostas/mês', '1 contrato/mês', '10 mensagens IA/mês'],
      color: 'from-slate-600 to-slate-700'
    },
    {
      nome: 'Profissional',
      preco: 'R$ 49,90',
      features: ['100 propostas/mês', '50 contratos/mês', '500 mensagens IA/mês', 'Sem marca d\'água'],
      color: 'from-blue-600 to-blue-700',
      popular: true
    },
    {
      nome: 'Business',
      preco: 'R$ 149,90',
      features: ['Propostas ilimitadas', 'Contratos ilimitados', 'IA ilimitada', 'Multi-usuários'],
      color: 'from-purple-600 to-purple-700'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">💎 Escolha seu plano ideal</h1>
          <p className="text-xl text-slate-400">Comece grátis e faça upgrade quando precisar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {planos.map((plano, index) => (
            <div
              key={index}
              className={`bg-slate-800/50 border-2 ${
                plano.popular ? 'border-blue-500 scale-105' : 'border-slate-700'
              } rounded-xl p-8 relative hover:border-blue-400 transition`}
            >
              {plano.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  ⭐ Mais Popular
                </div>
              )}
              
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${plano.color} flex items-center justify-center text-3xl mb-4`}>
                {index === 0 ? '✨' : index === 1 ? '⚡' : '👑'}
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">{plano.nome}</h3>
              <div className="text-4xl font-bold text-white mb-6">{plano.preco}<span className="text-lg text-slate-400">/mês</span></div>
              
              <ul className="space-y-3 mb-8">
                {plano.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full bg-gradient-to-r ${plano.color} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition`}>
                {index === 0 ? 'Começar Grátis' : 'Assinar Agora'}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/" className="text-blue-400 hover:text-blue-300 text-lg">
            ← Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/propostas" element={<PropostasPage />} />
          <Route path="/contratos" element={<ContratosPage />} />
          <Route path="/chat-ia" element={<ChatIAPage />} />
          <Route path="/planos" element={<PlanosPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App