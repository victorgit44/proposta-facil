// Catálogo Completo de Blocos Pré-Desenhados & Assets Visuais

export const PRESET_CATEGORIES = [
  { id: 'cover', name: 'Capas Executivas (Covers)', icon: 'Layout' },
  { id: 'hero', name: 'Hero & Apresentação', icon: 'Sparkles' },
  { id: 'summary', name: 'Resumo Executivo', icon: 'Type' },
  { id: 'scope', name: 'Escopo & Entregáveis', icon: 'FileText' },
  { id: 'timeline', name: 'Cronograma & Prazos', icon: 'Clock' },
  { id: 'team', name: 'Equipe & Especialistas', icon: 'Users' },
  { id: 'cases', name: 'Cases & Depoimentos', icon: 'Star' },
  { id: 'pricing', name: 'Tabelas de Investimento', icon: 'DollarSign' },
  { id: 'terms', name: 'Termos & Validade', icon: 'ShieldCheck' },
  { id: 'signature', name: 'Assinatura & Carimbo', icon: 'CheckCircle2' }
];

export const PRESET_BLOCKS = [
  // ── CAPAS (COVERS) ──
  {
    category: 'cover',
    id: 'cover-b2b-dark',
    name: 'Capa B2B Executive Dark',
    description: 'Capa em gradiente escuro corporativo com logo e título de alta legibilidade.',
    type: 'cover',
    data: {
      title: 'PROPOSTA DE ACELERAÇÃO COMERCIAL',
      subtitle: 'Preparado especialmente para {{cliente.nome}}',
      companyName: '{{empresa.nome}}',
      clientName: '{{cliente.nome}}',
      logoUrl: '/images/logo.webp',
      logoAlign: 'left',
      logoSize: 140,
      coverTheme: 'blue'
    }
  },
  {
    category: 'cover',
    id: 'cover-minimal-purple',
    name: 'Capa SaaS Minimal Purple',
    description: 'Design moderno minimalista em tons de roxo com foco em tecnologia.',
    type: 'cover',
    data: {
      title: 'SAAS PLATFORM BLUEPRINT',
      subtitle: 'Desenvolvimento & Escala para {{cliente.nome}}',
      companyName: '{{empresa.nome}}',
      clientName: '{{cliente.nome}}',
      logoUrl: '',
      logoAlign: 'center',
      logoSize: 160,
      coverTheme: 'purple'
    }
  },
  {
    category: 'cover',
    id: 'cover-luxury-gold',
    name: 'Capa Luxury Gold Premium',
    description: 'Capa elegante para contratos e propostas de alto ticket.',
    type: 'cover',
    data: {
      title: 'EXECUTIVE STRATEGY & CONSULTING',
      subtitle: 'Documento Confidencial destinado a {{cliente.nome}}',
      companyName: '{{empresa.nome}}',
      clientName: '{{cliente.nome}}',
      logoUrl: '',
      logoAlign: 'left',
      logoSize: 130,
      coverTheme: 'slate'
    }
  },

  // ── HERO & APRESENTAÇÃO ──
  {
    category: 'hero',
    id: 'hero-banner-tech',
    name: 'Banner Hero com Indicadores',
    description: 'Apresentação com métricas e destaque para a solução.',
    type: 'summary',
    data: {
      heading: 'Soluções de Alto Impacto para Vendas B2B',
      content: 'A {{empresa.nome}} é especialista em transformar processos manuais de vendas em fluxos automatizados de alta conversão. Esta proposta foi desenhada sob medida para elevar os resultados da {{cliente.nome}}.'
    }
  },

  // ── RESUMO EXECUTIVO ──
  {
    category: 'summary',
    id: 'summary-standard',
    name: 'Resumo Executivo Estruturado',
    description: 'Visão geral com metas claras e alinhamento estratégico.',
    type: 'summary',
    data: {
      heading: '1. Resumo Executivo & Objetivos',
      content: 'O objetivo principal deste projeto é implementar uma infraestrutura comercial robusta, reduzindo em até 60% o tempo médio de emissão de propostas e garantindo validade jurídica digital com suporte a IA.'
    }
  },

  // ── ESCOPO & ENTREGÁVEIS ──
  {
    category: 'scope',
    id: 'scope-list-checkmarks',
    name: 'Escopo com Checklist de Entregáveis',
    description: 'Lista de tópicos com checkmarks verdes de conclusão.',
    type: 'scope',
    data: {
      heading: '2. Escopo dos Serviços & Solução',
      items: [
        'Implantação de Editor de Propostas Interativo (Canvas Drag & Drop)',
        'Integração com Inteligência Artificial para Geração Automática de Conteúdo',
        'Treinamento da Equipe Comercial e Onboarding de Vendedores',
        'Configuração de Assinatura Digital e Rastreamento de Visualizações',
        'Suporte Técnico Dedicado e Garantia de 90 Dias'
      ]
    }
  },

  // ── CRONOGRAMA & TIMELINES ──
  {
    category: 'timeline',
    id: 'timeline-steps',
    name: 'Cronograma em 4 Etapas',
    description: 'Timeline passo a passo de desenvolvimento e implantação.',
    type: 'scope',
    data: {
      heading: '3. Cronograma de Execução (Prazos)',
      items: [
        'Semana 1: Alinhamento de Requisitos e Mapeamento do Processo',
        'Semana 2: Arquitetura de Software e Design do Sistema',
        'Semana 3: Homologação, Testes de Carga e Treinamento',
        'Semana 4: Lançamento Oficial e Início da Operação'
      ]
    }
  },

  // ── TABELA DE PREÇOS (PRICING) ──
  {
    category: 'pricing',
    id: 'pricing-table-b2b',
    name: 'Tabela de Investimento Comercial',
    description: 'Tabela com calculador automático de subtotal, desconto e total.',
    type: 'pricing',
    data: {
      heading: '4. Investimento & Detalhamento Financeiro',
      items: [
        { desc: 'Licenciamento Anual da Plataforma SaaS', qty: 1, val: 18500 },
        { desc: 'Setup Inicial & Personalização de Templates', qty: 1, val: 4500 },
        { desc: 'Treinamento de Equipe & Onboarding Comercial', qty: 1, val: 3300 }
      ]
    }
  },

  // ── TERMOS & CONDIÇÕES ──
  {
    category: 'terms',
    id: 'terms-legal-standard',
    name: 'Cláusulas & Condições Comerciais',
    description: 'Termos de pagamento, confidencialidade e validade.',
    type: 'terms',
    data: {
      heading: '5. Termos, Garantia & Validade',
      content: 'Esta proposta é válida por {{validade}} a contar da data de emissão ({{data}}). Condições de pagamento: 50% na aprovação digital e 50% na conclusão e entrega do projeto.'
    }
  },

  // ── ASSINATURA DIGITAL ──
  {
    category: 'signature',
    id: 'signature-digital-stamp',
    name: 'Carimbo de Aceite Digital',
    description: 'Módulo de assinatura com registro jurídico de IP, data e hora.',
    type: 'signature',
    data: {
      heading: '6. Aceite Digital & Registro Jurídico',
      terms: 'Ao assinar digitalmente abaixo, o contratante {{cliente.nome}} aprova integralmente os termos desta proposta para início imediato dos serviços.'
    }
  },

  // ── ESCOPOS POR NICHO (ENGENHARIA, GASTRO, FACILITIES) ──
  {
    category: 'scope',
    id: 'scope-engenharia-obras',
    name: 'Escopo Engenharia & Reforma Corporativa',
    description: 'Checklist de entregáveis de civil, elétrica e acabamento.',
    type: 'scope',
    data: {
      heading: 'Memorial Descritivo & Entregáveis de Obra',
      items: [
        'Demolição e remoção de entulho com destinação ecológica licenciada',
        'Construção de divisórias em Drywall com isolamento acústico em lã de rocha',
        'Adequação de instalações elétricas corporativas, quadros e cabeamento estruturado Cat6',
        'Instalação de piso elevado e acabamento em carpete modular de alta trafegabilidade',
        'Pintura acrílica lavável e emissão da ART (Anotação de Responsabilidade Técnica)'
      ]
    }
  },
  {
    category: 'scope',
    id: 'scope-gastronomia-catering',
    name: 'Escopo Catering & Buffet Executivo',
    description: 'Cardápio, insumos e atendimento por pessoa.',
    type: 'scope',
    data: {
      heading: 'Menu Executivo & Insumos do Evento',
      items: [
        'Coquetel volante de recepção com 8 variedades de finger foods quentes e frios',
        'Buffet quente com 2 opções de prato principal e acompanhamentos gourmet',
        'Mesa de sobremesas artesanais e estação de café expresso gourmet',
        'Equipe de garçons, maitre e chef executivo uniformizados',
        'Fornecimento de louças, talheres de inox e taças de cristal'
      ]
    }
  },
  {
    category: 'scope',
    id: 'scope-ciberseguranca-pentest',
    name: 'Escopo PenTest & Cibersegurança',
    description: 'Auditoria de segurança, teste de invasão e relatório LGPD.',
    type: 'scope',
    data: {
      heading: 'Metodologia de Teste de Invasão & Avaliação de Riscos',
      items: [
        'Reconhecimento e mapeamento de ativos externos e APIs públicas',
        'Execução de PenTest (Black-box & Grey-box) conforme metodologia OWASP Top 10',
        'Análise de vulnerabilidades internas em servidores e bancos de dados',
        'Emissão de Relatório Executivo e Técnico com matriz de severidade CVSS',
        'Sessão de alinhamento com equipe de TI e re-teste de validação em 30 dias'
      ]
    }
  }
];

