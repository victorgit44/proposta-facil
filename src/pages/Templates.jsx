import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, FileText, FileSignature, Sparkles, Plus, 
  ArrowRight, ShieldCheck, Zap, Layers, Check, Copy
} from 'lucide-react';
import { toast } from 'sonner';

export default function Templates() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const categories = [
    { id: 'todos', label: 'Todos os Modelos' },
    { id: 'ti', label: 'TI & Software' },
    { id: 'marketing', label: 'Marketing & Mídia' },
    { id: 'consultoria', label: 'Consultoria B2B' },
    { id: 'contratos', label: 'Contratos & NDAs' },
  ];

  const templatesList = [
    {
      id: 1,
      category: 'ti',
      title: 'Desenvolvimento de Software & SaaS B2B',
      description: 'Proposta comercial completa para projetos de desenvolvimento web, sistemas sob medida e aplicativos.',
      badge: 'TI & Tech',
      valorSugerido: 15000,
      itensCount: 4,
      servico: 'Desenvolvimento de plataforma web responsiva com autenticação, dashboard de gestão e integração via API REST.'
    },
    {
      id: 2,
      category: 'marketing',
      title: 'Gestão de Tráfego Pago & Performance',
      description: 'Modelo estratégico de assessoria mensal em Meta Ads, Google Ads e criação de páginas de alta conversão.',
      badge: 'Marketing',
      valorSugerido: 4500,
      itensCount: 3,
      servico: 'Planejamento de campanhas de tráfego, otimização semanal de anúncios e relatórios mensais de ROI.'
    },
    {
      id: 3,
      category: 'consultoria',
      title: 'Consultoria em Processos Comerciais & Vendas',
      description: 'Diagnóstico estratégico, implementação de funil de vendas e treinamento da equipe comercial.',
      badge: 'Consultoria',
      valorSugerido: 9800,
      itensCount: 3,
      servico: 'Estruturação de processos comerciais B2B, definição de cadência de vendas e implementação de CRM.'
    },
    {
      id: 4,
      category: 'contratos',
      title: 'Contrato Padrão de Prestação de Serviços',
      description: 'Minuta jurídica completa para prestação de serviços com cláusulas de rescisão, sigilo e pagamentos.',
      badge: 'Jurídico',
      valorSugerido: 0,
      itensCount: 1,
      servico: 'Contrato comercial padrão pronto para preenchimento de contratante e contratado com validade jurídica.'
    },
    {
      id: 5,
      category: 'contratos',
      title: 'Acordo de Confidencialidade (NDA)',
      description: 'Termo de não-divulgação e proteção de propriedade intelectual para negociações confidenciais.',
      badge: 'Jurídico',
      valorSugerido: 0,
      itensCount: 1,
      servico: 'Termo de sigilo comercial e proteção de dados em conformidade com a LGPD.'
    }
  ];

  const filteredTemplates = selectedCategory === 'todos' 
    ? templatesList 
    : templatesList.filter(t => t.category === selectedCategory);

  const handleUseTemplate = (template) => {
    toast.success(`Modelo "${template.title}" selecionado! Redirecionando...`);
    navigate('/propostas/criar', { state: { template } });
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1e1e2e]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-white tracking-tight">Biblioteca & Templates de Documentos</h1>
            <span className="px-2 py-0.5 text-[10px] font-medium uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded">
              Modelos Prontos
            </span>
          </div>
          <p className="text-sm text-[#8888a0] mt-1">Modelos pré-formatados de propostas comerciais e minutas contratuais prontas para uso.</p>
        </div>

        <button
          onClick={() => navigate('/propostas/canvas')}
          className="px-4 py-2 rounded-lg text-sm font-medium text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 hover:bg-cyan-900/60 transition flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Montar no Canvas Visual</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-[#111118] border border-[#1e1e2e] text-[#8888a0] hover:text-white hover:bg-[#1a1a24]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid de Modelos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="p-5 rounded-lg bg-[#111118] border border-[#1e1e2e] hover:border-[#2a2a3e] transition flex flex-col justify-between space-y-5 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-medium uppercase bg-[#1a1a24] text-[#8888a0] rounded">
                  {template.badge}
                </span>
                <BookOpen className="w-4 h-4 text-[#555568]" />
              </div>

              <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-blue-400 transition leading-snug">{template.title}</h3>
              <p className="text-xs text-[#8888a0] leading-relaxed">{template.description}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-[#1e1e2e]">
              <div className="flex items-center justify-between text-xs text-[#8888a0]">
                <span>Itens inclusos: <strong className="text-white">{template.itensCount}</strong></span>
                {template.valorSugerido > 0 && (
                  <span className="text-emerald-400 font-semibold tabular-nums">~R$ {template.valorSugerido.toLocaleString('pt-BR')}</span>
                )}
              </div>

              <button
                onClick={() => handleUseTemplate(template)}
                className="w-full py-2 rounded-lg font-medium text-xs text-white bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>Usar Este Modelo</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
