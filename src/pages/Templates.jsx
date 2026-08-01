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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Biblioteca & Templates de Documentos</h1>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-md">
              Business-in-a-Box
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Modelos pré-formatados de propostas comerciais e minutas contratuais prontas para uso.</p>
        </div>
      </div>

      {/* Category Pills */}
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

      {/* Grid de Modelos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 transition flex flex-col justify-between space-y-6 shadow-lg group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase bg-slate-800 text-slate-300 rounded-lg">
                  {template.badge}
                </span>
                <BookOpen className="w-4 h-4 text-slate-500" />
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition leading-snug">{template.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{template.description}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Itens inclusos: <strong className="text-slate-200">{template.itensCount}</strong></span>
                {template.valorSugerido > 0 && (
                  <span className="text-emerald-400 font-bold">~R$ {template.valorSugerido.toLocaleString('pt-BR')}</span>
                )}
              </div>

              <button
                onClick={() => handleUseTemplate(template)}
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
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
