import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { FileText, FileSignature, MessageSquare } from 'lucide-react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-600">v1.0 - Funcionando!</Badge>
          <h1 className="text-6xl font-bold text-white mb-4">
            🚀 PropostaFácil
          </h1>
          <p className="text-2xl text-slate-400">
            Gerador de Propostas e Contratos
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Propostas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 mb-4">
                Crie propostas comerciais profissionais em minutos
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Criar Proposta
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500 transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <FileSignature className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Contratos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 mb-4">
                Gere contratos personalizados com facilidade
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Criar Contrato
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-pink-500 transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Chat IA</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 mb-4">
                Assistente inteligente para te ajudar
              </p>
              <Button className="w-full bg-pink-600 hover:bg-pink-700">
                Abrir Chat
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            ✅ Componentes UI Funcionando!
          </Button>
          <p className="text-slate-500 mt-4 text-sm">
            Ambiente de desenvolvimento • React + Vite + Tailwind
          </p>
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App