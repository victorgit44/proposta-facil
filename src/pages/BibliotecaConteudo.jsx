import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/api/apiClient';
import { 
  BookOpen, Plus, Search, Trash2, Layers, Copy, CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

export default function BibliotecaConteudo() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [novoBloco, setNovoBloco] = useState({
    titulo: '',
    categoria: 'servicos',
    conteudo: ''
  });

  const categories = [
    { id: 'todos', label: 'Todos os Blocos' },
    { id: 'servicos', label: 'Serviços' },
    { id: 'escopos', label: 'Escopos Técnicos' },
    { id: 'clausulas', label: 'Cláusulas LGPD/Jurídico' },
    { id: 'cases', label: 'Cases & Depoimentos' },
    { id: 'garantias', label: 'Garantias & SLA' },
  ];

  const { data: blocos = [], isLoading } = useQuery({
    queryKey: ['bibliotecaBlocos'],
    queryFn: () => fetchApi('/api/biblioteca'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => fetchApi('/api/biblioteca', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries(['bibliotecaBlocos']);
      toast.success('Bloco de conteúdo salvo na Biblioteca!');
      setShowModal(false);
      setNovoBloco({ titulo: '', categoria: 'servicos', conteudo: '' });
    },
    onError: () => toast.error('Erro ao salvar bloco.')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => fetchApi(`/api/biblioteca/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries(['bibliotecaBlocos']);
      toast.success('Bloco removido da Biblioteca!');
    }
  });

  const filtered = blocos.filter(b => {
    const matchCategory = selectedCategory === 'todos' || b.categoria === selectedCategory;
    const matchSearch = b.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        b.conteudo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleCopyContent = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Texto do bloco copiado para a área de transferência!');
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Biblioteca de Conteúdo Comercial</h1>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-md">
              Proposify Content Library
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Gerencie blocos reutilizáveis de escopos, cláusulas e textos padrão para rápida composição.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar bloco de texto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 w-64"
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Bloco</span>
          </button>
        </div>
      </div>

      {/* Categorias Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid de Blocos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-xs">Nenhum bloco encontrado nesta categoria.</p>
          </div>
        ) : (
          filtered.map((bloco) => (
            <div key={bloco.id} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 transition flex flex-col justify-between space-y-4 shadow-lg group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase bg-slate-800 text-slate-300 rounded-lg">
                    {bloco.categoria}
                  </span>
                  <button
                    onClick={() => deleteMutation.mutate(bloco.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition">{bloco.titulo}</h3>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/60 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {bloco.conteudo}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleCopyContent(bloco.conteudo)}
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-300 bg-slate-950 hover:bg-slate-800 border border-slate-800 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Texto do Bloco</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Cadastro de Bloco */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Novo Bloco de Conteúdo</h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Título do Bloco</label>
                <input
                  type="text"
                  placeholder="Ex: Cláusula LGPD, Escopo de Tráfego Pago"
                  value={novoBloco.titulo}
                  onChange={(e) => setNovoBloco({ ...novoBloco, titulo: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Categoria</label>
                <select
                  value={novoBloco.categoria}
                  onChange={(e) => setNovoBloco({ ...novoBloco, categoria: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="servicos">Serviços</option>
                  <option value="escopos">Escopos Técnicos</option>
                  <option value="clausulas">Cláusulas LGPD/Jurídico</option>
                  <option value="cases">Cases & Depoimentos</option>
                  <option value="garantias">Garantias & SLA</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Conteúdo do Bloco</label>
                <textarea
                  rows="5"
                  placeholder="Texto reutilizável com escopo, cláusulas ou depoimentos..."
                  value={novoBloco.conteudo}
                  onChange={(e) => setNovoBloco({ ...novoBloco, conteudo: e.target.value })}
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
                onClick={() => createMutation.mutate(novoBloco)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/20"
              >
                Salvar Bloco
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
