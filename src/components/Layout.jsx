import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, FileText, FileSignature, MessageSquare,
  Settings, Sparkles, Menu, X, LogOut, User, Zap, ChevronRight,
  Kanban, Users, BookOpen, Workflow, Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const mainSection = [
    { path: '/', icon: Home, label: 'Centro de Comando' },
    { path: '/crm', icon: Kanban, label: 'CRM Kanban', badge: 'Novo' },
    { path: '/propostas', icon: FileText, label: 'Propostas' },
    { path: '/contratos', icon: FileSignature, label: 'Contratos' },
  ];

  const toolsSection = [
    { path: '/clientes', icon: Users, label: 'Clientes & Empresas' },
    { path: '/templates', icon: BookOpen, label: 'Biblioteca & Templates', badge: 'Business' },
    { path: '/automacoes', icon: Workflow, label: 'Automações & Réguas' },
    { path: '/chat-ia', icon: MessageSquare, label: 'Assistente de Vendas IA', badge: 'IA' },
  ];

  const systemSection = [
    { path: '/planos', icon: Sparkles, label: 'Planos & Assinatura' },
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
    <div className="space-y-1">
      <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">{title}</p>
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={isMobile ? () => setSidebarOpen(false) : undefined}
            className={`group relative flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-xs transition-all duration-150 ${
              active
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-105 ${active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span>{item.label}</span>
            </div>

            {item.badge && (
              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                item.badge === 'IA' 
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : item.badge === 'Business'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
              }`}>
                {item.badge}
              </span>
            )}

            {active && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-500 rounded-l-full" />
            )}
          </Link>
        );
      })}
    </div>
  );

  const SidebarContent = ({ isMobile = false }) => (
    <aside className={`fixed top-0 h-full ${isMobile ? 'left-0 w-72 z-50' : 'left-0 w-72 hidden md:flex'} bg-slate-900/95 backdrop-blur-2xl border-r border-slate-800/80 flex-col justify-between shadow-2xl transition-all duration-300`}>
      {/* Top Section */}
      <div className="flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md shadow-blue-600/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-extrabold text-white tracking-tight">PropostaFácil</h2>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Plataforma Comercial</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="p-3 space-y-5">
          {renderNavGroup('Comercial & Vendas', mainSection, isMobile)}
          {renderNavGroup('Ferramentas & Templates', toolsSection, isMobile)}
          {renderNavGroup('Sistema & Conta', systemSection, isMobile)}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 space-y-3 border-t border-slate-800/80 bg-slate-950/60 shrink-0">
        {/* Upgrade Bar */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <div className="text-[11px]">
              <p className="font-bold text-white leading-none">Plano Pro</p>
              <p className="text-[10px] text-slate-400">Recursos Ilimitados</p>
            </div>
          </div>
          <Link
            to="/planos"
            onClick={isMobile ? () => setSidebarOpen(false) : undefined}
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold transition"
          >
            Upgrade
          </Link>
        </div>

        {/* User Account Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0">
              {user?.email?.charAt(0).toUpperCase() || <User className="w-3.5 h-3.5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.email?.split('@')[0] || 'Usuário'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email || 'carregando...'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sair da Conta"
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white font-sans">
      <SidebarContent />

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <span className="font-bold text-base text-white tracking-tight">PropostaFácil</span>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <SidebarContent isMobile={true} />
        </>
      )}

      {/* Main Workspace Area */}
      <main className="md:ml-72 pt-16 md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}