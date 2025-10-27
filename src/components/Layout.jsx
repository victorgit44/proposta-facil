import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, FileText, FileSignature, MessageSquare, 
  Settings, Sparkles, Menu, X, LogOut, User 
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'; // <-- 1. IMPORTE useAuth

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user, signOut } = useAuth(); // <-- 2. CHAME useAuth

  const menuItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/propostas', icon: FileText, label: 'Propostas' },
    { path: '/contratos', icon: FileSignature, label: 'Contratos' },
    { path: '/chat-ia', icon: MessageSquare, label: 'Chat IA' },
    { path: '/planos', icon: Sparkles, label: 'Planos' },
    { path: '/configuracoes', icon: Settings, label: 'Configurações' },
  ]

  const isActive = (path) => location.pathname === path

  // --- 4. FUNÇÃO DE LOGOUT ---
  const handleLogout = async () => {
    try {
      await signOut();
      // O ProtectedRoute cuidará do redirecionamento
      console.log('Logout realizado.');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      alert('Erro ao sair: ' + error.message); // Informa o usuário
    }
  };
  // --- FIM FUNÇÃO LOGOUT ---

  // Componente interno para a Sidebar (para evitar repetição)
  const SidebarContent = ({ isMobile = false }) => (
     <aside className={`fixed top-0 h-full ${isMobile ? 'left-0 w-64 z-50' : 'left-0 w-64 hidden md:flex'} bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">PropostaFácil</h2>
              <p className="text-xs text-slate-400">Gerador de Propostas</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                // Fecha sidebar mobile ao clicar no link
                onClick={isMobile ? () => setSidebarOpen(false) : undefined} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            {/* --- 3. ATUALIZA AVATAR E EMAIL --- */}
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-300 font-semibold">
              {/* Usa a primeira letra do email ou 'U' */}
              {user?.email?.charAt(0).toUpperCase() || <User size={20} />} 
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.email?.split('@')[0] || 'Usuário'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || 'Carregando...'}</p> 
            </div>
            {/* --- FIM ATUALIZAÇÃO --- */}
          </div>
          {/* --- 4. ADICIONA onClick AO BOTÃO --- */}
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-900/30 hover:text-red-400 text-slate-300 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sair</span>
          </button>
          {/* --- FIM onClick --- */}
        </div>
      </aside>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-300"> {/* Adicionado text-slate-300 */}
      
      {/* Sidebar Desktop */}
      <SidebarContent />

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 p-4">
        <div className="flex items-center justify-between">
          {/* Logo Mobile (opcional, pode mostrar o nome como antes) */}
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                 <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-white">PropostaFácil</h1>
           </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-300 hover:bg-slate-800 rounded-lg transition" // Ajustado cor
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar (com overlay) */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="md:hidden fixed inset-0 bg-black/60 z-40" // Aumentado opacidade
            onClick={() => setSidebarOpen(false)}
          />
          {/* Conteúdo da Sidebar Mobile */}
          <SidebarContent isMobile={true} />
        </>
      )}

      {/* Main Content */}
      {/* Ajusta margin-left no desktop e padding-top no mobile */}
      <main className="md:ml-64 pt-20 md:pt-0"> 
        {children}
      </main>
    </div>
  )
}