import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/api/apiClient';
import { 
  Package, Plus, Search, Trash2, DollarSign, Tag, FileText, CheckCircle2
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

export default function Produtos() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    categoria: 'Serviços TI',
    descricao: '',
    preco_unitario: ''
  });

  const { data: produtos = [], isLoading } = useQuery({
    queryKey: ['produtos'],
    queryFn: () => fetchApi('/api/produtos'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => fetchApi('/api/produtos', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries(['produtos']);
      toast.success('Produto/Serviço cadastrado no catálogo!');
      setShowModal(false);
      setNovoProduto({ nome: '', categoria: 'Serviços TI', descricao: '', preco_unitario: '' });
    },
    onError: () => toast.error('Erro ao cadastrar produto.')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => fetchApi(`/api/produtos/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries(['produtos']);
      toast.success('Item removido do catálogo!');
    }
  });

  const filtered = produtos.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1e1e2e]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-white tracking-tight">Catálogo de Produtos & Serviços</h1>
            <span className="px-2 py-0.5 text-[10px] font-medium uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
              Catálogo Comercial
            </span>
          </div>
          <p className="text-sm text-[#8888a0] mt-1">Cadastre seus produtos e preços padronizados para inserção rápida em propostas.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#555568] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar item no catálogo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-[#555568] focus:outline-none focus:border-blue-600 w-64"
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Item</span>
          </button>
        </div>
      </div>

      {/* Grid do Catálogo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full p-12 text-center text-[#555568] rounded-lg bg-[#111118] border border-[#1e1e2e] space-y-3">
            <Package className="w-10 h-10 text-[#555568] mx-auto" />
            <p className="text-xs">Nenhum produto cadastrado no catálogo.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className="p-5 rounded-lg bg-[#111118] border border-[#1e1e2e] hover:border-[#2a2a3e] transition flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-[10px] font-medium uppercase bg-[#1a1a24] text-[#8888a0] rounded">
                    {item.categoria}
                  </span>
                  <button
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="p-1.5 text-[#555568] hover:text-rose-400 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-blue-400 transition">{item.nome}</h3>
                <p className="text-xs text-[#8888a0] leading-relaxed">{item.descricao || 'Sem descrição cadastrada.'}</p>
              </div>

              <div className="pt-3 border-t border-[#1e1e2e] flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase text-[#555568]">Preço Unitário</span>
                <span className="text-base font-semibold text-emerald-400 tabular-nums">{formatCurrency(item.preco_unitario)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Cadastro */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Cadastrar Produto / Serviço</h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Nome do Item</label>
                <input
                  type="text"
                  placeholder="Ex: Desenvolvimento Web, Consultoria Comercial"
                  value={novoProduto.nome}
                  onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Categoria</label>
                <input
                  type="text"
                  placeholder="Ex: TI, Marketing, Suporte"
                  value={novoProduto.categoria}
                  onChange={(e) => setNovoProduto({ ...novoProduto, categoria: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Preço Unitário (R$)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={novoProduto.preco_unitario}
                  onChange={(e) => setNovoProduto({ ...novoProduto, preco_unitario: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Descrição</label>
                <textarea
                  rows="3"
                  placeholder="Detalhes sobre a entrega do produto ou serviço..."
                  value={novoProduto.descricao}
                  onChange={(e) => setNovoProduto({ ...novoProduto, descricao: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => createMutation.mutate(novoProduto)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/20"
              >
                Salvar Produto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
