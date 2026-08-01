import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/supabaseClient';
import { 
  Users, Building2, Search, Plus, Mail, Phone, FileText, 
  DollarSign, ArrowUpRight, ChevronRight, UserCheck
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export default function Clientes() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: propostas = [] } = useQuery({
    queryKey: ['propostas'],
    queryFn: () => base44.entities.Proposta.list(),
  });

  // Agrupamento de propostas por cliente para formar o diretório de clientes
  const clientesMap = new Map();
  propostas.forEach(p => {
    const key = p.nome_cliente?.toLowerCase().trim() || 'cliente-sem-nome';
    if (!clientesMap.has(key)) {
      clientesMap.set(key, {
        nome: p.nome_cliente || 'Cliente Sem Nome',
        empresa: p.empresa_cliente || 'Empresa Particular',
        email: p.email_cliente || '-',
        telefone: p.telefone_cliente || '-',
        totalComprado: 0,
        propostasCount: 0,
        ultimaProposta: p.created_date
      });
    }
    const cliente = clientesMap.get(key);
    cliente.propostasCount += 1;
    if (p.status === 'aprovada') {
      cliente.totalComprado += (parseFloat(p.valor_total) || 0);
    }
  });

  const clientesList = Array.from(clientesMap.values()).filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.empresa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Diretório de Clientes & Empresas</h1>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
              CRM Data
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Gestão centralizada dos contatos comerciais e histórico de faturamento por cliente.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar cliente ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 w-64"
            />
          </div>

          <button
            onClick={() => navigate('/propostas/criar')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Cliente</span>
          </button>
        </div>
      </div>

      {/* Grid de Cards de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientesList.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 rounded-3xl bg-slate-900/60 border border-slate-800">
            Nenhum cliente cadastrado até o momento.
          </div>
        ) : (
          clientesList.map((cliente, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 transition space-y-4 shadow-lg group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-md">
                    {cliente.nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition">{cliente.nome}</h3>
                    <p className="text-xs text-slate-400">{cliente.empresa}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 rounded-md">
                  {cliente.propostasCount} propostas
                </span>
              </div>

              <div className="space-y-2 pt-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{cliente.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{cliente.telefone}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Aprovado</span>
                  <span className="text-base font-black text-emerald-400">{formatCurrency(cliente.totalComprado)}</span>
                </div>
                <button
                  onClick={() => navigate('/propostas/criar')}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
