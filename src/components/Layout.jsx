import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, FileText, FileSignature, MessageSquare,
  Settings, Menu, X, LogOut, User, ChevronLeft, ChevronRight,
  Kanban, Users, BookOpen, Workflow, Package, Layers, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Se a rota for o Canvas Visual, colapsa a sidebar global automaticamente para dar 100% de tela ao Canvas
  const isCanvasPage = location.pathname.startsWith('/propostas/criar') ||
                       location.pathname.startsWith('/propostas/canvas') ||
                       location.pathname.startsWith('/propostas/editar');

  useEffect(() => {
    if (isCanvasPage) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [location.pathname]);

  const mainSection = [
    { path: '/', icon: Home, label: 'Painel' },
    { path: '/crm', icon: Kanban, label: 'CRM' },
    { path: '/propostas', icon: FileText, label: 'Propostas' },
    { path: '/contratos', icon: FileSignature, label: 'Contratos' },
  ];

  const toolsSection = [
    { path: '/produtos', icon: Package, label: 'Produtos' },
    { path: '/biblioteca', icon: Layers, label: 'Biblioteca' },
    { path: '/clientes', icon: Users, label: 'Clientes' },
    { path: '/templates', icon: BookOpen, label: 'Modelos' },
    { path: '/automacoes', icon: Workflow, label: 'Automações' },
    { path: '/chat-ia', icon: MessageSquare, label: 'Assistente IA' },
  ];

  const systemSection = [
    { path: '/planos', icon: Sparkles, label: 'Planos' },
    { path: '/configuracoes', icon: Settings, label: 'Configurações' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const renderNavGroup = (title, items, isMobile) => (
    <div className="space-y-0.5">
      {!isCollapsed && (
        <p className="px-3 pt-4 pb-1 text-[11px] font-medium uppercase tracking-wider text-[#555568]">{title}</p>
      )}
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            title={isCollapsed ? item.label : undefined}
            onClick={isMobile ? () => setSidebarOpen(false) : undefined}
            className={`group relative flex items-center gap-2.5 px-3 py-[7px] rounded-md text-[13px] font-medium transition-colors ${
              active
                ? 'text-white bg-white/[0.06]'
                : 'text-[#8888a0] hover:text-[#c0c0d0] hover:bg-white/[0.03]'
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-[#555568] group-hover:text-[#8888a0]'}`} />
            {!isCollapsed && <span>{item.label}</span>}
            {active && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-blue-500 rounded-r" />
            )}
          </Link>
        );
      })}
    </div>
  );

  const SidebarContent = ({ isMobile = false }) => (
    <aside className={`fixed top-0 h-full ${
      isMobile
        ? 'left-0 w-60 z-50'
        : isCollapsed
        ? 'left-0 w-16 hidden md:flex'
        : 'left-0 w-60 hidden md:flex'
    } bg-[#111118] border-r border-[#1e1e2e] flex-col justify-between transition-all duration-200 z-40 select-none`}>
      <div className="flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="px-3 py-3 border-b border-[#1e1e2e] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <h2 className="text-[13px] font-semibold text-white tracking-tight truncate">PropostaFácil</h2>
                <p className="text-[10px] text-[#555568] font-medium truncate">Plataforma Comercial</p>
              </div>
            )}
          </div>

          {/* Toggle Expand/Collapse Sidebar */}
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded bg-[#1a1a24] text-[#8888a0] hover:text-white border border-[#1e1e2e] transition cursor-pointer"
              title={isCollapsed ? 'Expandir Menu Lateral' : 'Recolher Menu Lateral'}
            >
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="px-2 pb-4">
          {renderNavGroup('Comercial', mainSection, isMobile)}
          {renderNavGroup('Ferramentas', toolsSection, isMobile)}
          {renderNavGroup('Sistema', systemSection, isMobile)}
        </nav>
      </div>

      {/* User Footer */}
      <div className="px-2 py-3 border-t border-[#1e1e2e] shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-md bg-[#1a1a24] border border-[#1e1e2e] flex items-center justify-center text-[#8888a0] text-[11px] font-semibold shrink-0">
              {user?.email?.charAt(0).toUpperCase() || <User className="w-3 h-3" />}
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-[#c0c0d0] truncate">{user?.email?.split('@')[0] || 'Usuário'}</p>
                <p className="text-[10px] text-[#555568] truncate">{user?.email || 'carregando...'}</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              title="Sair da Conta"
              className="p-1.5 text-[#555568] hover:text-red-400 rounded-md transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5] font-sans">
      <SidebarContent />

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#111118]/95 backdrop-blur-sm border-b border-[#1e1e2e] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm text-white tracking-tight">PropostaFácil</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 text-[#8888a0] hover:text-white rounded-md transition"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-[#0a0a0f]/80 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <SidebarContent isMobile={true} />
        </>
      )}

      {/* Main Container */}
      <main className={`${isCollapsed ? 'md:ml-16' : 'md:ml-60'} pt-14 md:pt-0 min-h-screen transition-all duration-200`}>
        {children}
      </main>
    </div>
  );
}