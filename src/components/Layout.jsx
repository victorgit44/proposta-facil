import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, FileText, FileSignature, MessageSquare,
  Settings, Sparkles, Menu, X, LogOut, User, Zap, ChevronRight, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const menuItems = [
    { path: '/', icon: Home, label: 'Início', badge: null },
    { path: '/propostas', icon: FileText, label: 'Propostas', badge: null },
    { path: '/contratos', icon: FileSignature, label: 'Contratos', badge: null },
    { path: '/chat-ia', icon: MessageSquare, label: 'Assistente IA', badge: 'PRO' },
    { path: '/planos', icon: Sparkles, label: 'Planos & Preços', badge: 'Desconto' },
    { path: '/configuracoes', icon: Settings, label: 'Configurações', badge: null },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const SidebarContent = ({ isMobile = false }) => (
    <aside className={`fixed top-0 h-full ${isMobile ? 'left-0 w-72 z-50' : 'left-0 w-72 hidden md:flex'} bg-slate-900/90 backdrop-blur-2xl border-r border-slate-800/80 flex-col justify-between shadow-2xl transition-all duration-300`}>
      {/* Top Section */}
      <div>
        {/* Brand Logo Header */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">PropostaFácil</h2>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded uppercase">B2B</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Gestão Comercial & IA</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Navegação Principal</p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={isMobile ? () => setSidebarOpen(false) : undefined}
                className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  active
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-md shadow-blue-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    item.badge === 'PRO' 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {active && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-l-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 space-y-4 border-t border-slate-800/80 bg-slate-950/40">
        {/* Upgrade Plan Widget (Conversion CTA) */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-blue-900/20 via-slate-900 to-indigo-950/30 border border-blue-500/20 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all" />
          
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Plano Atual: Demo</span>
            </span>
            <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
              2/3 usados
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[66%]" />
          </div>

          <Link
            to="/planos"
            onClick={isMobile ? () => setSidebarOpen(false) : undefined}
            className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition duration-200 flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 group cursor-pointer"
          >
            <span>Fazer Upgrade para PRO</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* User Account Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-blue-400 font-bold shrink-0 shadow-sm">
              {user?.email?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.email?.split('@')[0] || 'Usuário'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'carregando...'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sair da Conta"
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white font-sans">
      {/* Desktop Sidebar */}
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