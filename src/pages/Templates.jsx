import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, FileText, Sparkles, Plus, 
  ArrowRight, ShieldCheck, Zap, Layers, Check, Copy,
  Search, Eye, X, Building, Laptop, Megaphone, Briefcase, HardHat,
  Utensils, Home, Lock, GraduationCap, Wrench, Palette, FileSignature
} from 'lucide-react';
import { toast } from 'sonner';

export default function Templates() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [templatesList, setTemplatesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'todos', label: 'Todos os Modelos', icon: BookOpen },
    { id: 'ti', label: 'TI & Software B2B', icon: Laptop },
    { id: 'marketing', label: 'Marketing & Mídia', icon: Megaphone },
    { id: 'consultoria', label: 'Consultoria B2B', icon: Briefcase },
    { id: 'engenharia', label: 'Engenharia & Obras', icon: HardHat },
    { id: 'gastronomia', label: 'Gastronomia & Catering', icon: Utensils },
    { id: 'imobiliario', label: 'Imobiliário & Espaços', icon: Home },
    { id: 'ciberseguranca', label: 'Cibersegurança & LGPD', icon: Lock },
    { id: 'educacao', label: 'Treinamentos', icon: GraduationCap },
    { id: 'facilities', label: 'Facilities & Serviços', icon: Wrench },
    { id: 'design', label: 'Design & Branding', icon: Palette },
    { id: 'contratos', label: 'Contratos & NDAs', icon: FileSignature },
  ];

  // Carregar templates do banco de dados Mariadb com fallback para presets locais
  useEffect(() => {
    fetchTemplates();
  }, [selectedCategory, searchQuery]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'todos') params.append('categoria', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(`/api/templates?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTemplatesList(data);
      } else {
        throw new Error('Falha ao buscar backend');
      }
    } catch (err) {
      // Fallback local se a API indisponível
      const fallbackList = [
        {
          id: 1,
          slug: 'b2b-saas-dev',
          categoria: 'ti',
          titulo: 'Desenvolvimento de Software & SaaS B2B',
          descricao: 'Proposta comercial completa para projetos de desenvolvimento web, aplicações SaaS sob medida e APIs.',
          badge: 'TI & Tech',
          valor_sugerido: 18500,
          itens_count: 4,
          servico: 'Desenvolvimento de plataforma web responsiva com autenticação JWT, dashboard de gestão e suporte por 90 dias.'
        },
        {
          id: 2,
          slug: 'marketing-performance',
          categoria: 'marketing',
          titulo: 'Gestão de Tráfego Pago & Performance',
          descricao: 'Modelo estratégico de assessoria mensal em Meta Ads, Google Ads e criação de landing pages.',
          badge: 'Marketing',
          valor_sugerido: 4500,
          itens_count: 3,
          servico: 'Planejamento de campanhas de tráfego, otimização semanal de anúncios e criação de 2 Landing Pages.'
        },
        {
          id: 3,
          slug: 'consultoria-vendas',
          categoria: 'consultoria',
          titulo: 'Consultoria em Processos Comerciais & CRM',
          descricao: 'Diagnóstico estratégico, estruturação de funil de vendas e treinamento da equipe comercial.',
          badge: 'Consultoria',
          valor_sugerido: 9800,
          itens_count: 3,
          servico: 'Mapeamento de cadência comercial B2B, definição de SLA de vendas e treinamento prático.'
        },
        {
          id: 4,
          slug: 'engenharia-obras',
          categoria: 'engenharia',
          titulo: 'Proposta de Engenharia Civil & Reforma Corporativa',
          descricao: 'Memorial descritivo de obra, mão de obra qualificada, materiais e cronograma físico-financeiro.',
          badge: 'Engenharia',
          valor_sugerido: 45000,
          itens_count: 5,
          servico: 'Execução de reforma comercial com adequação elétrica, drywall, piso elevado, pintura e emissão de ART.'
        },
        {
          id: 5,
          slug: 'gastronomia-catering',
          categoria: 'gastronomia',
          titulo: 'Catering & Eventos Corporativos Premium',
          descricao: 'Apresentação de menus, lista de insumos, equipe de garçons e orçamento por convidado.',
          badge: 'Eventos',
          valor_sugerido: 12500,
          itens_count: 4,
          servico: 'Serviço de buffet completo para até 150 convidados com finger foods e coquetel de recepção.'
        },
        {
          id: 6,
          slug: 'imobiliario-locacao',
          categoria: 'imobiliario',
          titulo: 'Proposta de Locação & Gestão Imobiliária',
          descricao: 'Proposta de locação de espaço comercial com tabela de aluguéis, carência e garantias.',
          badge: 'Imobiliário',
          valor_sugerido: 8500,
          itens_count: 3,
          servico: 'Locação de laje corporativa de 250m² com 4 vagas de garagem e vistoria de entrada.'
        },
        {
          id: 7,
          slug: 'ciberseguranca-pentest',
          categoria: 'ciberseguranca',
          titulo: 'Auditoria de Cibersegurança & PenTest LGPD',
          descricao: 'Relatório de vulnerabilidades de TI, testes de invasão (PenTest) e conformidade LGPD.',
          badge: 'Cibersegurança',
          valor_sugerido: 16000,
          itens_count: 4,
          servico: 'Análise de superfície de ataque, PenTest externo e interno e relatório executivo.'
        },
        {
          id: 8,
          slug: 'contrato-prestacao-servico',
          categoria: 'contratos',
          titulo: 'Contrato Padrão de Prestação de Serviços',
          descricao: 'Minuta jurídica completa para prestação de serviços com cláusulas de rescisão e sigilo.',
          badge: 'Jurídico',
          valor_sugerido: 0,
          itens_count: 1,
          servico: 'Contrato comercial padrão pronto para preenchimento com validade jurídica digital.'
        }
      ];

      // Filtragem local
      let filtered = fallbackList;
      if (selectedCategory !== 'todos') {
        filtered = filtered.filter(t => t.categoria === selectedCategory);
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(t => t.titulo.toLowerCase().includes(q) || t.descricao.toLowerCase().includes(q));
      }
      setTemplatesList(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = (template, mode = 'form') => {
    toast.success(`Modelo "${template.titulo}" selecionado! Redirecionando...`);
    if (mode === 'canvas') {
      navigate('/propostas/canvas', { state: { template } });
    } else {
      navigate('/propostas/criar', { state: { template } });
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1e1e2e]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-semibold text-white tracking-tight">Galeria de Templates & Modelos Prontos</h1>
            <span className="px-2.5 py-0.5 text-[11px] font-semibold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
              {templatesList.length} Modelos Disponíveis
            </span>
          </div>
          <p className="text-sm text-[#8888a0] mt-1">Selecione um modelo pré-formatado por nicho comercial para personalizar, editar valores e gerar sua proposta em 1 clique.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/propostas/canvas')}
            className="px-4 py-2 rounded-lg text-sm font-medium text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 hover:bg-cyan-900/60 transition flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Criar no Canvas Visual</span>
          </button>
        </div>
      </div>

      {/* Barra de Busca & Filtros */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Campo de Busca */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#555568] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar modelo por nicho ou palavra-chave..."
            className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-[#555568] focus:outline-none focus:border-blue-600 transition"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555568] hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Pílulas de Categorias Scrolláveis */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-[#111118] border border-[#1e1e2e] text-[#8888a0] hover:text-white hover:bg-[#1a1a24]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#555568]'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de Modelos */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#8888a0]">Carregando catálogo de modelos de propostas...</p>
        </div>
      ) : templatesList.length === 0 ? (
        <div className="py-16 text-center space-y-3 border border-dashed border-[#1e1e2e] rounded-xl bg-[#111118]/50">
          <BookOpen className="w-8 h-8 text-[#555568] mx-auto" />
          <h3 className="text-sm font-semibold text-white">Nenhum modelo encontrado</h3>
          <p className="text-xs text-[#8888a0]">Tente buscar por outro termo ou limpar os filtros de categoria.</p>
          <button
            onClick={() => { setSelectedCategory('todos'); setSearchQuery(''); }}
            className="px-3.5 py-1.5 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-md hover:bg-blue-500/20 transition cursor-pointer"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templatesList.map((template) => (
            <div
              key={template.id || template.slug}
              className="p-6 rounded-xl bg-[#111118] border border-[#1e1e2e] hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between space-y-5 group hover:-translate-y-1 shadow-lg"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase bg-[#1a1a24] text-[#8888a0] rounded-md border border-[#1e1e2e]">
                    {template.badge || template.categoria}
                  </span>
                  <button
                    onClick={() => setPreviewTemplate(template)}
                    className="p-1.5 text-[#555568] hover:text-white hover:bg-[#1a1a24] rounded-md transition cursor-pointer"
                    title="Pré-visualizar Modelo"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-blue-400 transition leading-snug">
                  {template.titulo}
                </h3>
                <p className="text-xs text-[#8888a0] leading-relaxed line-clamp-2">
                  {template.descricao}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#1e1e2e]">
                <div className="flex items-center justify-between text-xs text-[#8888a0]">
                  <span>Entregáveis: <strong className="text-white">{template.itens_count || template.itensCount || 3} blocos</strong></span>
                  {Number(template.valor_sugerido || template.valorSugerido) > 0 && (
                    <span className="text-emerald-400 font-semibold tabular-nums">
                      ~R$ {Number(template.valor_sugerido || template.valorSugerido).toLocaleString('pt-BR')}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUseTemplate(template, 'form')}
                    className="py-2.5 px-3 rounded-lg font-medium text-xs text-white bg-blue-600 hover:bg-blue-500 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Usar Modelo</span>
                  </button>
                  <button
                    onClick={() => handleUseTemplate(template, 'canvas')}
                    className="py-2.5 px-3 rounded-lg font-medium text-xs text-[#8888a0] hover:text-white bg-[#1a1a24] hover:bg-[#252536] border border-[#1e1e2e] transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Abrir no Canvas</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Pré-visualização do Template */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#111118] border border-[#1e1e2e] rounded-xl p-6 space-y-6 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-[#1e1e2e]">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                  {previewTemplate.badge || previewTemplate.categoria}
                </span>
                <h2 className="text-lg font-semibold text-white tracking-tight">{previewTemplate.titulo}</h2>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-1 text-[#8888a0] hover:text-white rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-[#8888a0] leading-relaxed">{previewTemplate.descricao}</p>

              <div className="p-4 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] space-y-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#555568]">Exemplo de Escopo dos Serviços</span>
                <p className="text-xs text-[#c0c0d0] leading-relaxed font-sans">{previewTemplate.servico}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-[#161622] border border-[#1e1e2e]">
                  <span className="text-[#555568] block">Estimativa de Investimento</span>
                  <span className="text-base font-semibold text-emerald-400 tabular-nums">
                    {Number(previewTemplate.valor_sugerido || previewTemplate.valorSugerido) > 0
                      ? `R$ ${Number(previewTemplate.valor_sugerido || previewTemplate.valorSugerido).toLocaleString('pt-BR')}`
                      : 'Sob Consulta / Minuta Gratuita'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#161622] border border-[#1e1e2e]">
                  <span className="text-[#555568] block">Quantidade de Blocos</span>
                  <span className="text-base font-semibold text-white">
                    {previewTemplate.itens_count || previewTemplate.itensCount || 3} entregáveis inclusos
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e1e2e]">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 text-xs font-medium text-[#8888a0] hover:text-white transition cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  const tmpl = previewTemplate;
                  setPreviewTemplate(null);
                  handleUseTemplate(tmpl, 'form');
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition cursor-pointer shadow-md"
              >
                Usar Este Modelo Agora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

